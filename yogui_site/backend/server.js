require('dotenv').config();
const express = require('express');
const cors = require('cors');

const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080')
    .split(',')
    .map(origin => origin.trim());

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (como curl, Postman, o mismo servidor)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('CORS bloqueado para origen:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true
}));

// Parsear JSON
app.use(express.json());

// Logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.WOMPI_ENVIRONMENT || 'sandbox',
        timestamp: new Date().toISOString()
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        name: 'Yogui Wompi Backend',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            config: 'GET /api/payment/config',
            createSession: 'POST /api/payment/create-session',
            transaction: 'GET /api/payment/transaction/:id',
            webhook: 'POST /api/webhook/wompi'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('=================================');
    console.log('  Yogui Wompi Backend');
    console.log('=================================');
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Ambiente: ${process.env.WOMPI_ENVIRONMENT || 'sandbox'}`);
    console.log(`CORS permitido: ${allowedOrigins.join(', ')}`);
    console.log('=================================');
    console.log('Endpoints disponibles:');
    console.log(`  GET  http://localhost:${PORT}/health`);
    console.log(`  GET  http://localhost:${PORT}/api/payment/config`);
    console.log(`  POST http://localhost:${PORT}/api/payment/create-session`);
    console.log(`  GET  http://localhost:${PORT}/api/payment/transaction/:id`);
    console.log(`  POST http://localhost:${PORT}/api/webhook/wompi`);
    console.log('=================================');
});
