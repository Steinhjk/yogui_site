const crypto = require('crypto');

/**
 * Genera la firma de integridad para el Widget de Wompi
 * La firma se genera concatenando: referencia + monto + moneda + integritySecret
 * y aplicando SHA256
 *
 * @param {string} reference - Referencia única de la transacción
 * @param {number} amountInCents - Monto en centavos
 * @param {string} currency - Moneda (COP)
 * @param {string} integritySecret - Llave secreta de integridad
 * @returns {string} Firma SHA256 en hexadecimal
 */
function generateIntegritySignature(reference, amountInCents, currency, integritySecret) {
    const dataToSign = `${reference}${amountInCents}${currency}${integritySecret}`;
    return crypto.createHash('sha256').update(dataToSign).digest('hex');
}

/**
 * Verifica la firma de un evento webhook de Wompi
 *
 * @param {object} eventData - Datos del evento
 * @param {string} signature - Firma recibida en el header
 * @param {string} eventsSecret - Llave secreta de eventos
 * @returns {boolean} true si la firma es válida
 */
function verifyWebhookSignature(eventData, signature, eventsSecret) {
    const properties = eventData.signature?.properties || [];

    // Construir string con las propiedades en orden
    let dataToSign = '';
    for (const prop of properties) {
        const value = getNestedProperty(eventData.data, prop);
        if (value !== undefined) {
            dataToSign += value;
        }
    }

    // Agregar timestamp y secret
    dataToSign += eventData.timestamp + eventsSecret;

    const expectedSignature = crypto.createHash('sha256').update(dataToSign).digest('hex');
    return signature === expectedSignature;
}

/**
 * Obtiene una propiedad anidada de un objeto usando notación de punto
 * @param {object} obj - Objeto
 * @param {string} path - Ruta (ej: "transaction.id")
 * @returns {any} Valor de la propiedad
 */
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Genera una referencia única para la transacción
 * Formato: YOGUI-{timestamp}-{random}
 *
 * @returns {string} Referencia única
 */
function generateReference() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `YOGUI-${timestamp}-${random}`;
}

module.exports = {
    generateIntegritySignature,
    verifyWebhookSignature,
    generateReference
};
