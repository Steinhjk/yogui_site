
// Accordion Toggle Function
function toggleAccordion(element) {
    // Toggle active class on header
    element.classList.toggle("active");
    
    // Toggle content visibility
    const content = element.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}
