const config = {
    environment: process.env.WOMPI_ENVIRONMENT || 'sandbox',

    getKeys() {
        const isSandbox = this.environment === 'sandbox';
        return {
            publicKey: isSandbox
                ? process.env.WOMPI_PUBLIC_KEY_SANDBOX
                : process.env.WOMPI_PUBLIC_KEY_PRODUCTION,
            privateKey: isSandbox
                ? process.env.WOMPI_PRIVATE_KEY_SANDBOX
                : process.env.WOMPI_PRIVATE_KEY_PRODUCTION,
            integritySecret: isSandbox
                ? process.env.WOMPI_INTEGRITY_SECRET_SANDBOX
                : process.env.WOMPI_INTEGRITY_SECRET_PRODUCTION,
            eventsSecret: isSandbox
                ? process.env.WOMPI_EVENTS_SECRET_SANDBOX
                : process.env.WOMPI_EVENTS_SECRET_PRODUCTION
        };
    },

    getApiUrl() {
        return this.environment === 'sandbox'
            ? 'https://sandbox.wompi.co/v1'
            : 'https://production.wompi.co/v1';
    },

    // Catálogo de productos
    products: {
        'cordyceps': {
            id: 'cordyceps',
            name: 'Cordyceps',
            description: '30 Cápsulas | Extracto Puro',
            priceInCents: 9000000, // $90.000 COP en centavos
            currency: 'COP'
        },
        'melena-de-leon': {
            id: 'melena-de-leon',
            name: 'Melena de León',
            description: '30 Cápsulas | Nootrópico Natural',
            priceInCents: 9000000, // $90.000 COP en centavos
            currency: 'COP'
        }
    },

    // Validar producto y cantidad
    validateOrder(productId, quantity) {
        const product = this.products[productId];
        if (!product) {
            return { valid: false, error: 'Producto no encontrado' };
        }
        if (quantity < 1 || quantity > 10) {
            return { valid: false, error: 'Cantidad debe ser entre 1 y 10' };
        }
        return {
            valid: true,
            product,
            totalInCents: product.priceInCents * quantity
        };
    }
};

module.exports = config;
