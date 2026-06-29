import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import candidateRoutes from './routes/candidate.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares de Seguridad y Parseo (Best Practices 2026)
app.use(helmet({ contentSecurityPolicy: false })); // Desactivamos CSP estricto para facilitar el JS vanilla, en prod se configura bien
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(join(__dirname, '../public')));

// Rutas
app.use('/api/candidate', candidateRoutes);
app.use('/api/admin', adminRoutes);

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));