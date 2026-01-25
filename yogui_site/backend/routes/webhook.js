const express = require('express');
const router = express.Router();
const wompiConfig = require('../config/wompi');
const { verifyWebhookSignature } = require('../utils/crypto');

/**
 * POST /api/webhook/wompi
 * Recibe eventos de Wompi (pagos aprobados, rechazados, etc.)
 *
 * Wompi envía eventos con la siguiente estructura:
 * {
 *   event: "transaction.updated",
 *   data: {
 *     transaction: {
 *       id: "...",
 *       status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR",
 *       reference: "...",
 *       amount_in_cents: 9000000,
 *       ...
 *     }
 *   },
 *   signature: {
 *     checksum: "...",
 *     properties: ["transaction.id", "transaction.status", ...]
 *   },
 *   timestamp: 1234567890
 * }
 */
router.post('/wompi', (req, res) => {
    try {
        const event = req.body;

        console.log('=== Webhook Wompi Recibido ===');
        console.log('Evento:', event.event);
        console.log('Timestamp:', new Date(event.timestamp * 1000).toISOString());

        // Verificar firma del webhook
        const keys = wompiConfig.getKeys();
        const receivedChecksum = event.signature?.checksum;

        if (receivedChecksum) {
            const isValid = verifyWebhookSignature(event, receivedChecksum, keys.eventsSecret);

            if (!isValid) {
                console.error('Firma del webhook inválida');
                return res.status(401).json({ error: 'Firma inválida' });
            }
            console.log('Firma verificada correctamente');
        } else {
            console.warn('Webhook sin firma - ambiente sandbox');
        }

        // Procesar según el tipo de evento
        if (event.event === 'transaction.updated') {
            const transaction = event.data?.transaction;

            if (!transaction) {
                console.error('Evento sin datos de transacción');
                return res.status(400).json({ error: 'Datos incompletos' });
            }

            console.log('Transacción:', {
                id: transaction.id,
                reference: transaction.reference,
                status: transaction.status,
                amount: transaction.amount_in_cents / 100,
                paymentMethod: transaction.payment_method_type
            });

            // Procesar según el estado
            switch (transaction.status) {
                case 'APPROVED':
                    handleApprovedPayment(transaction);
                    break;
                case 'DECLINED':
                    handleDeclinedPayment(transaction);
                    break;
                case 'VOIDED':
                    handleVoidedPayment(transaction);
                    break;
                case 'ERROR':
                    handleErrorPayment(transaction);
                    break;
                default:
                    console.log('Estado no manejado:', transaction.status);
            }
        }

        // Siempre responder 200 para que Wompi no reintente
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Error procesando webhook:', error);
        // Responder 200 para evitar reintentos infinitos
        res.status(200).json({ received: true, error: 'Error interno' });
    }
});

/**
 * Maneja pagos aprobados
 */
function handleApprovedPayment(transaction) {
    console.log('✅ PAGO APROBADO');
    console.log('Referencia:', transaction.reference);
    console.log('Monto:', `$${(transaction.amount_in_cents / 100).toLocaleString('es-CO')} COP`);

    // Aquí puedes:
    // - Guardar en base de datos
    // - Enviar email de confirmación
    // - Actualizar inventario
    // - Notificar al equipo

    // TODO: Implementar lógica de negocio
}

/**
 * Maneja pagos rechazados
 */
function handleDeclinedPayment(transaction) {
    console.log('❌ PAGO RECHAZADO');
    console.log('Referencia:', transaction.reference);
    console.log('Razón:', transaction.status_message || 'No especificada');

    // TODO: Implementar lógica (notificar cliente, etc.)
}

/**
 * Maneja pagos anulados
 */
function handleVoidedPayment(transaction) {
    console.log('🚫 PAGO ANULADO');
    console.log('Referencia:', transaction.reference);

    // TODO: Implementar lógica de reembolso
}

/**
 * Maneja errores de pago
 */
function handleErrorPayment(transaction) {
    console.log('⚠️ ERROR EN PAGO');
    console.log('Referencia:', transaction.reference);
    console.log('Error:', transaction.status_message || 'Error desconocido');

    // TODO: Implementar lógica de manejo de errores
}

module.exports = router;
