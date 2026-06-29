import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

// Middleware simple de autenticación para admin
const adminAuth = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

router.use(adminAuth);

// Obtener todos los resultados
router.get('/resultados', async (req, res, next) => {
  try {
    const query = `
      SELECT 
        e.primernombre, e.primerapellido, e.codigoacceso,
        t.nombre as test_nombre,
        a.fechainicio, a.fechafinal, a.estado,
        r.aciertos, r.errores, r.omitidas, r.puntajedirecto
      FROM aplicaciontest a
      JOIN evaluado e ON a.evaluado_id = e.id
      JOIN testrazonamientonumerico t ON a.test_id = t.id
      LEFT JOIN resultadotest r ON a.id = r.aplicacion_id
      ORDER BY a.fechainicio DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { next(err); }
});

export default router;