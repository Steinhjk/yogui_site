const fs = require('fs');

// --- 1. RECURSOS: Botones (Tabs) y Textos de Videos ---
let html = fs.readFileSync('recursos/index.html', 'utf8');

// A. Cambiar las Pestañas para que tengan más forma de "botón" en vez de solo línea de subrayado
// Remuevo el hover underline viejo y le doy estilo ovalado de botón
let cssToReplace1 = `.tab-link {
            background: transparent;
            color: var(--text-muted);
            border: none;
            border-bottom: 2px solid transparent;
            padding: 1rem 2rem;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        .tab-link:hover {
            color: var(--text-main);
            border-bottom: 2px solid var(--accent-color);
            background: transparent;
        }
        .tab-link.active {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
            background: transparent;
        }`;

let newTabsCss = `.tab-link {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 30px;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transition: all 0.3s ease;
            cursor: pointer;
            font-family: 'Montserrat', sans-serif;
        }
        .tab-link:hover {
            color: var(--bg-color);
            background: var(--accent-color);
            border-color: var(--accent-color);
        }
        .tab-link.active {
            background: var(--primary-color);
            color: var(--bg-color);
            border-color: var(--primary-color);
        }
        /* Make video titles larger */
        .video-card h3 {
            font-size: 1.6rem !important;
            margin-bottom: 0.5rem;
        }`;

html = html.replace(cssToReplace1, newTabsCss);

// B. Agregar descripciones a los videos
const videos = [
    { title: "Curandera - Espíritu de la Tierra", desc: "Un retrato audiovisual poético sobre la conexión profunda y sanadora con la Pacha Mama." },
    { title: "Kundalini yoga: Sana el cuerpo y aumenta el resplandor", desc: "Práctica guiada para activar tu energía vital y fortalecer tu sistema inmunológico." },
    { title: "Hongos Mágicos: Ciencia y Terapia", desc: "Análisis contemporáneo sobre el resurgimiento clínico y el potencial terapéutico de la psilocibina." },
    { title: "Kundalini Yoga: Sahiba Kriya", desc: "Clase para purgar el estrés acumulado subconsciente y regresar a tu naturaleza radiante." },
    { title: "Psilocybe: La Ciencia de la Mística", desc: "Exploración de la experiencia mística inducida y cómo transforma patrones psiquiátricos crónicos." },
    { title: "Kundalini Yoga en Español", desc: "Transmisión completa con asanas, mudras y meditación profunda para iniciar tu día con propósito." },
    { title: "Meditación Profunda", desc: "Espacio sonoro para sumergirte en el silencio interior y escuchar la guía de tu intuición." }
];

videos.forEach(v => {
    html = html.replace(
        `<h3>${v.title}</h3>`,
        `<h3>${v.title}</h3>\n                        <p class="book-desc">${v.desc}</p>`
    );
});

// Ademas al audio de mindfulness y otros audios también les pongo un poco
html = html.replace(
    '<h3>Meditación Mindfulness</h3>',
    '<h3>Meditación Mindfulness</h3>\n                        <p class="book-desc">Práctica de atención plena guiada para reducir la rumiación ansiosa y anclarse en el presente.</p>'
);
html = html.replace(
    '<h3>Día 1 de reto de 20 días para aprender a meditar</h3>',
    '<h3>Día 1 - Reto de Meditación</h3>\n                        <p class="book-desc">Introducción paso a paso a los elementos básicos: postura, respiración y observación mental.</p>'
);


fs.writeFileSync('recursos/index.html', html, 'utf8');
console.log('Recursos HTML updated con formato boton real y videos descritos.');

// --- 2. SERVICIOS: Modificar Disclaimer ---
let serviciosHtml = fs.readFileSync('servicios/index.html', 'utf8');

// Disclaimer solicitado por el usuario:
let oldDisclaimer = `<strong>Nota Importante:</strong> Nuestras prácticas están estructuradas desde un enfoque médico-científico, orientadas a mejorar la salud neuronal, reducir el estrés y fomentar el bienestar integral. Consulte con su médico antes de iniciar cualquier rutina o sesión de sanación intensiva.`;

let newDisclaimer = `<strong>Nota Importante:</strong> Nuestras sesiones y servicios están pensados para brindar herramientas complementarias en el logro del bienestar físico, mental y emocional. Consulte con un especialista médico ante diagnósticos particulares.`;

serviciosHtml = serviciosHtml.replace(oldDisclaimer, newDisclaimer);
fs.writeFileSync('servicios/index.html', serviciosHtml, 'utf8');
console.log('Servicios HTML updated.');

// --- 3. SERVICIOS EMPRESA: Replicar disclaimer ---
let empresaHtml = fs.readFileSync('servicios/empresa.html', 'utf8');

let oldEmpresaNota = `<p class="disclaimer"><em>* <strong>Nota Importante:</strong> Los programas corporativos no pretenden sustituir servicios de salud ocupacional o tratamiento médico de los empleados. Tienen un fin complementario de bienestar, integración y prevención del burnout (Agotamiento crónico).</em></p>`;

let repDisclaimerEmpresa = `<p class="disclaimer"><em>* ${newDisclaimer}</em></p>`;

// Si existe se reemplaza, si no, lo inyectamos al final del inner text del content principal.
if (empresaHtml.includes(oldEmpresaNota)) {
    empresaHtml = empresaHtml.replace(oldEmpresaNota, repDisclaimerEmpresa);
} else {
    // Buscar donde inyectarlo al fondo
    empresaHtml = empresaHtml.replace('</div>\n    </div>\n    <!-- Footer', repDisclaimerEmpresa + '\n</div>\n    </div>\n    <!-- Footer');
}
fs.writeFileSync('servicios/empresa.html', empresaHtml, 'utf8');
console.log('Empresa HTML updated.');

