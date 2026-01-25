// Mobile Interaction
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '60px';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'rgba(0,0,0,0.9)';
        navLinks.style.width = '100%';
        navLinks.style.textAlign = 'center';
        navLinks.style.padding = '2rem 0';
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
                navLinks.style.display = 'none';
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
