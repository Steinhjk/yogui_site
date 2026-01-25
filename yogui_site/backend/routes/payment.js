const express = require('express');
const router = express.Router();
const wompiConfig = require('../config/wompi');
const { generateIntegritySignature, generateReference } = require('../utils/crypto');

/**
 * GET /api/payment/config
 * Retorna la configuración pública para el frontend
 */
router.get('/config', (req, res) => {
    const keys = wompiConfig.getKeys();

    res.json({
        publicKey: keys.publicKey,
        environment: wompiConfig.environment,
        products: wompiConfig.products
    });
});

/**
 * POST /api/payment/create-session
 * Crea una sesión de pago con firma de integridad
 *
 * Body: {
 *   productId: string,
 *   quantity: number,
 *   customer: {
 *     name: string,
 *     email: string,
 *     phone: string,
 *     address: string
 *   }
 * }
 */
router.post('/create-session', (req, res) => {
    try {
        const { productId, quantity, customer } = req.body;

        // Validar datos requeridos
        if (!productId || !quantity || !customer) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'Se requiere productId, quantity y customer'
            });
        }

        // Validar campos del cliente
        const { name, email, phone, address } = customer;
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                error: 'Datos del cliente incompletos',
                details: 'Se requiere name, email, phone y address'
            });
        }

        // Validar producto y cantidad
        const validation = wompiConfig.validateOrder(productId, quantity);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Generar referencia única
        const reference = generateReference();

        // Obtener llaves
        const keys = wompiConfig.getKeys();

        // Generar firma de integridad
        const signature = generateIntegritySignature(
            reference,
            validation.totalInCents,
            validation.product.currency,
            keys.integritySecret
        );

        // Log para debugging (remover en producción)
        console.log('Nueva sesión de pago creada:', {
            reference,
            product: validation.product.name,
            quantity,
            totalInCents: validation.totalInCents,
            customer: { name, email, phone }
        });

        res.json({
            reference,
            amountInCents: validation.totalInCents,
            currency: validation.product.currency,
            publicKey: keys.publicKey,
            signature,
            product: {
                id: validation.product.id,
                name: validation.product.name,
                quantity
            },
            customer: {
                name,
                email,
                phoneNumber: phone,
                fullName: name
            }
        });

    } catch (error) {
        console.error('Error creando sesión de pago:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * GET /api/payment/transaction/:id
 * Consulta el estado de una transacción en Wompi
 */
router.get('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const apiUrl = wompiConfig.getApiUrl();

        const response = await fetch(`${apiUrl}/transactions/${id}`);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error('Error consultando transacción:', error);
        res.status(500).json({ error: 'Error consultando transacción' });
    }
});

module.exports = router;
