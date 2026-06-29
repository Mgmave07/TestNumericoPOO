import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';

const router = Router();

// Esquema de validación con Zod
const accessSchema = z.object({ codigo: z.string().min(1).max(20) });

// 1. Validar código y obtener datos del evaluado + tests disponibles
router.post('/access', async (req, res, next) => {
  try {
    const { codigo } = accessSchema.parse(req.body);
    
    // Buscar evaluado
    const evalRes = await pool.query(
      'SELECT id, primernombre, primerapellido FROM evaluado WHERE codigoacceso = $1', 
      [codigo]
    );
    if (evalRes.rows.length === 0) return res.status(404).json({ error: 'Código no válido' });
    
    const evaluado = evalRes.rows[0];

    // Obtener TODOS los tests activos disponibles
    const testsRes = await pool.query(
      'SELECT id, codigo, nombre, descripcion, tiempominutos FROM testrazonamientonumerico WHERE activo = true ORDER BY nombre'
    );

    res.json({ 
      evaluadoId: evaluado.id,
      evaluado: `${evaluado.primernombre} ${evaluado.primerapellido}`,
      tests: testsRes.rows
    });
  } catch (err) { next(err); }
});

// 2. Iniciar un test específico (cuando el usuario lo selecciona)
router.post('/start-test', async (req, res, next) => {
  try {
    const startSchema = z.object({ 
      evaluadoId: z.number(),
      testId: z.number() 
    });
    const { evaluadoId, testId } = startSchema.parse(req.body);

    // Verificar que el test existe y está activo
    const testRes = await pool.query(
      'SELECT id, nombre, tiempominutos FROM testrazonamientonumerico WHERE id = $1 AND activo = true',
      [testId]
    );
    if (testRes.rows.length === 0) {
      return res.status(404).json({ error: 'Test no encontrado o no activo' });
    }

    const test = testRes.rows[0];

    // Verificar si ya tiene una aplicación en proceso para este test
    const appRes = await pool.query(
      'SELECT id, estado FROM aplicaciontest WHERE evaluado_id = $1 AND test_id = $2 AND estado = $3', 
      [evaluadoId, testId, 'EN_PROCESO']
    );

    let aplicacionId;
    if (appRes.rows.length > 0) {
      aplicacionId = appRes.rows[0].id;
    } else {
      // Crear nueva aplicación
      const newApp = await pool.query(
        'INSERT INTO aplicaciontest (estado, fechainicio, evaluado_id, test_id) VALUES ($1, $2, $3, $4) RETURNING id',
        ['EN_PROCESO', new Date(), evaluadoId, testId]
      );
      aplicacionId = newApp.rows[0].id;
    }

    res.json({ 
      aplicacionId, 
      testId,
      testName: test.nombre,
      tiempoMinutos: test.tiempominutos
    });
  } catch (err) { next(err); }
});

// 3. Obtener preguntas y opciones del test seleccionado
router.get('/test/:aplicacionId', async (req, res, next) => {
  try {
    const { aplicacionId } = req.params;
    
    // Validar que la aplicación existe y está en proceso
    const appCheck = await pool.query('SELECT test_id, estado FROM aplicaciontest WHERE id = $1', [aplicacionId]);
    if (appCheck.rows.length === 0 || appCheck.rows[0].estado !== 'EN_PROCESO') {
      return res.status(403).json({ error: 'Test no disponible o ya finalizado' });
    }

    const testId = appCheck.rows[0].test_id;

    const query = `
      SELECT p.id as pregunta_id, p.enunciado, p.numero,
             o.id as opcion_id, o.letra, o.texto
      FROM preguntanumerica p
      LEFT JOIN opcionnumerica o ON p.id = o.pregunta_id
      WHERE p.test_id = $1 AND p.activo = true
      ORDER BY p.numero, o.letra;
    `;
    const result = await pool.query(query, [testId]);

    // Agrupar preguntas y opciones
    const preguntasMap = new Map();
    result.rows.forEach(row => {
      if (!preguntasMap.has(row.pregunta_id)) {
        preguntasMap.set(row.pregunta_id, {
          id: row.pregunta_id,
          enunciado: row.enunciado,
          numero: row.numero,
          opciones: []
        });
      }
      if (row.opcion_id) {
        preguntasMap.get(row.pregunta_id).opciones.push({
          id: row.opcion_id,
          letra: row.letra,
          texto: row.texto
        });
      }
    });

    res.json(Array.from(preguntasMap.values()));
  } catch (err) { next(err); }
});

// 4. Enviar respuestas (Usando Transacciones para integridad)
router.post('/test/:aplicacionId/submit', async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { aplicacionId } = req.params;
    const { respuestas } = req.body;
    console.log('=== DEBUG INICIANDO ===');
    console.log('Respuestas recibidas del frontend:', respuestas);

    await client.query('BEGIN');

    // Obtener test_id y opciones correctas para calificar
    const appData = await client.query('SELECT test_id FROM aplicaciontest WHERE id = $1', [aplicacionId]);
    const testId = appData.rows[0].test_id;

    const correctasRes = await client.query(
      'SELECT p.id as pregunta_id, o.id as opcion_id FROM preguntanumerica p JOIN opcionnumerica o ON p.id = o.pregunta_id WHERE p.test_id = $1 AND o.correcta = true',
      [testId]
    );
    console.log('Respuestas correctas desde BD:', correctasRes.rows);
    
    // CORRECCIÓN: Convertir a números explícitamente
    const correctasMap = new Map(correctasRes.rows.map(r => [Number(r.pregunta_id), Number(r.opcion_id)]));

    let aciertos = 0, errores = 0, omitidas = 0;
    const totalPreguntas = correctasMap.size;

    // Insertar respuestas y calcular puntaje
    for (const r of respuestas) {
      // CORRECCIÓN: Convertir a números antes de usar
      const preguntaIdNum = Number(r.preguntaId);
      const opcionIdNum = Number(r.opcionId);
      
      await client.query(
        'INSERT INTO respuestanumerica (fecharespuesta, aplicacion_id, opcionseleccionada_id, pregunta_id) VALUES ($1, $2, $3, $4)',
        [new Date(), aplicacionId, opcionIdNum, preguntaIdNum]
      );

      // CORRECCIÓN: Comparar números con números
      if (correctasMap.get(preguntaIdNum) === opcionIdNum) {
        aciertos++;
        console.log(`✓ Pregunta ${preguntaIdNum}: ACIERTO (opcion ${opcionIdNum})`);
      } else {
        errores++;
        console.log(`✗ Pregunta ${preguntaIdNum}: ERROR (seleccionó ${opcionIdNum}, correcta es ${correctasMap.get(preguntaIdNum)})`);
      }
    }

    // Calcular omitidas
    // CORRECCIÓN: Convertir a números en el Set
    const respondidas = new Set(respuestas.map(r => Number(r.preguntaId)));
    omitidas = totalPreguntas - respondidas.size;

    // Guardar resultado
    await client.query(
      'INSERT INTO resultadotest (aciertos, errores, omitidas, puntajedirecto, aplicacion_id) VALUES ($1, $2, $3, $4, $5)',
      [aciertos, errores, omitidas, aciertos, aplicacionId]
    );

    // Cerrar aplicación
    await client.query(
      'UPDATE aplicaciontest SET estado = $1, fechafinal = $2 WHERE id = $3',
      ['FINALIZADO', new Date(), aplicacionId]
    );

    await client.query('COMMIT');
    console.log('Aciertos calculados:', aciertos);
    console.log('=== DEBUG TERMINANDO ===');
    res.json({ message: 'Test enviado correctamente', aciertos, errores, omitidas });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

export default router;