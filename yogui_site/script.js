// Mobile Interaction
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Modal Logic
function openModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function openOrderModal(productName) {
    const modal = document.getElementById('modal-pedido');
    const select = document.getElementById('order-product');

    if (select && productName) {
        // Try to find the option with the matching value
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value.includes(productName)) {
                select.selectedIndex = i;
                break;
            }
        }
    }

    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Tab Logic
function openTab(evt, tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
        tabContents[i].classList.remove("active");
    }

    // Remove active class from all links
    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab and add active class to button
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.style.display = "block";
        if (evt) evt.currentTarget.className += " active";

        // Add text fade-in animation trigger if needed
        setTimeout(() => {
            targetTab.classList.add("active");
        }, 10);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
            }

            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission Handler
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        // e.preventDefault(); 
        // Default behavior allows FormSubmit.co to work
    });
}

// New Shop & Service Modal Logic
function openProductModal(productId) {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Dynamic content could be set here based on productId
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openServiceModal(serviceId) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');
    const desc = document.getElementById('service-modal-desc');

    if (modal) {
        // Set dynamic text based on ID (Simple version)
        if (serviceId === 'macro') {
            title.innerText = "Reserva: Sesión Macro";
            desc.innerText = "Estás a punto de reservar la Sesión Niños Santos ($800.000).";
        } else if (serviceId === 'micro-pack') {
            title.innerText = "Compra: Paquete Micro Dosis";
            desc.innerText = "Inicia tu viaje de 1 mes con el Kit completo ($1.500.000).";
        } else if (serviceId === 'terapia') {
            title.innerText = "Reserva: Terapia Holística";
            desc.innerText = "Sesión personalizada de 60-90 minutos ($200.000).";
        } else {
            title.innerText = "Pago de Servicio";
            desc.innerText = "Proceder al pago seguro con Wompi.";
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===========================================
// WOMPI PAYMENT INTEGRATION
// ===========================================

// Configuración del backend
const WOMPI_BACKEND_URL = 'http://localhost:3000';

// Catálogo de productos (espejo del backend)
const WOMPI_PRODUCTS = {
    'cordyceps': {
        id: 'cordyceps',
        name: 'Cordyceps',
        priceInCents: 9000000
    },
    'melena-de-leon': {
        id: 'melena-de-leon',
        name: 'Melena de León',
        priceInCents: 9000000
    }
};

/**
 * Inicializa el proceso de pago con Wompi
 * @param {string} productId - ID del producto
 */
function initializeWompiPayment(productId) {
    const product = WOMPI_PRODUCTS[productId];
    if (!product) {
        alert('Producto no encontrado');
        return;
    }

    // Configurar el modal con datos del producto
    document.getElementById('wompi-product-id').value = productId;
    document.getElementById('wompi-product-name').textContent = `${product.name} - $${(product.priceInCents / 100).toLocaleString('es-CO')} COP`;
    document.getElementById('wompi-quantity').value = 1;
    updateWompiTotal();

    // Mostrar modal de datos del cliente
    openModal('wompi-customer');
}

/**
 * Actualiza el total mostrado en el modal
 */
function updateWompiTotal() {
    const productId = document.getElementById('wompi-product-id').value;
    const quantity = parseInt(document.getElementById('wompi-quantity').value) || 1;
    const product = WOMPI_PRODUCTS[productId];

    if (product) {
        const total = (product.priceInCents * quantity) / 100;
        document.getElementById('wompi-total').textContent = `Total: $${total.toLocaleString('es-CO')} COP`;
    }
}

// Escuchar cambios en cantidad
document.addEventListener('DOMContentLoaded', function () {
    const quantityInput = document.getElementById('wompi-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', updateWompiTotal);
        quantityInput.addEventListener('input', updateWompiTotal);
    }

    // Manejar envío del formulario
    const customerForm = document.getElementById('wompi-customer-form');
    if (customerForm) {
        customerForm.addEventListener('submit', handleWompiFormSubmit);
    }
});

/**
 * Maneja el envío del formulario de datos del cliente
 * @param {Event} e - Evento del formulario
 */
async function handleWompiFormSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('wompi-product-id').value;
    const quantity = parseInt(document.getElementById('wompi-quantity').value) || 1;
    const name = document.getElementById('wompi-name').value.trim();
    const email = document.getElementById('wompi-email').value.trim();
    const phone = document.getElementById('wompi-phone').value.trim();
    const address = document.getElementById('wompi-address').value.trim();

    // Validar campos
    if (!name || !email || !phone || !address) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Mostrar indicador de carga
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Procesando...';
    submitBtn.disabled = true;

    try {
        // Crear sesión de pago en el backend
        const response = await fetch(`${WOMPI_BACKEND_URL}/api/payment/create-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                quantity,
                customer: { name, email, phone, address }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error creando sesión de pago');
        }

        const sessionData = await response.json();

        // Cerrar modal de datos
        closeModal('wompi-customer');

        // Abrir widget de Wompi
        openWompiWidget(sessionData);

    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar el pago: ' + error.message);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Abre el widget de checkout de Wompi
 * @param {object} sessionData - Datos de la sesión de pago
 */
function openWompiWidget(sessionData) {
    const checkout = new WidgetCheckout({
        currency: sessionData.currency,
        amountInCents: sessionData.amountInCents,
        reference: sessionData.reference,
        publicKey: sessionData.publicKey,
        signature: {
            integrity: sessionData.signature
        },
        customerData: {
            email: sessionData.customer.email,
            fullName: sessionData.customer.fullName,
            phoneNumber: sessionData.customer.phoneNumber,
            phoneNumberPrefix: '+57'
        },
        redirectUrl: window.location.href
    });

    checkout.open(function (result) {
        const transaction = result.transaction;

        if (transaction) {
            handlePaymentResult(transaction);
        } else {
            // Usuario cerró el widget sin completar
            console.log('Pago cancelado por el usuario');
        }
    });
}

/**
 * Maneja el resultado del pago
 * @param {object} transaction - Datos de la transacción
 */
function handlePaymentResult(transaction) {
    const resultContent = document.getElementById('payment-result-content');

    let html = '';

    switch (transaction.status) {
        case 'APPROVED':
            html = `
                <div style="color: #28a745; font-size: 4rem; margin-bottom: 1rem;">&#10004;</div>
                <h2 style="color: #28a745;">¡Pago Exitoso!</h2>
                <p style="margin: 1rem 0;">Tu pedido ha sido procesado correctamente.</p>
                <p><strong>Referencia:</strong> ${transaction.reference}</p>
                <p><strong>ID Transacción:</strong> ${transaction.id}</p>
                <p style="margin-top: 1.5rem; font-size: 0.9rem; color: #666;">
                    Recibirás un correo de confirmación con los detalles del envío.
                </p>
                <button class="btn-primary" style="margin-top: 1.5rem;" onclick="closeModal('payment-result')">Cerrar</button>
            `;
            break;

        case 'DECLINED':
            html = `
                <div style="color: #dc3545; font-size: 4rem; margin-bottom: 1rem;">&#10008;</div>
                <h2 style="color: #dc3545;">Pago Rechazado</h2>
                <p style="margin: 1rem 0;">Lo sentimos, tu pago no fue aprobado.</p>
                <p><strong>Referencia:</strong> ${transaction.reference}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    ${transaction.status_message || 'Por favor intenta con otro método de pago.'}
                </p>
                <button class="btn-primary" style="margin-top: 1.5rem;" onclick="closeModal('payment-result')">Cerrar</button>
            `;
            break;

        case 'PENDING':
            html = `
                <div style="color: #ffc107; font-size: 4rem; margin-bottom: 1rem;">&#9203;</div>
                <h2 style="color: #856404;">Pago Pendiente</h2>
                <p style="margin: 1rem 0;">Tu pago está siendo procesado.</p>
                <p><strong>Referencia:</strong> ${transaction.reference}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    Te notificaremos cuando se confirme el pago.
                </p>
                <button class="btn-primary" style="margin-top: 1.5rem;" onclick="closeModal('payment-result')">Cerrar</button>
            `;
            break;

        default:
            html = `
                <div style="color: #6c757d; font-size: 4rem; margin-bottom: 1rem;">&#63;</div>
                <h2>Estado del Pago</h2>
                <p style="margin: 1rem 0;">Estado: ${transaction.status}</p>
                <p><strong>Referencia:</strong> ${transaction.reference}</p>
                <button class="btn-primary" style="margin-top: 1.5rem;" onclick="closeModal('payment-result')">Cerrar</button>
            `;
    }

    resultContent.innerHTML = html;
    openModal('payment-result');
}
