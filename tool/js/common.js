// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
        
        // Save theme preference
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Tool Switching Functionality
function initToolSwitching() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const toolSections = document.querySelectorAll('.tool-section');

    // Show only the calculator section by default
    toolSections.forEach(section => {
        if (section.id !== 'calculator') {
            section.classList.add('hidden');
        }
    });

    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const toolId = button.getAttribute('data-tool');
            
            // Hide all sections
            toolSections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });
            
            // Show selected section
            const selectedSection = document.getElementById(toolId);
            if (selectedSection) {
                selectedSection.classList.remove('hidden');
                selectedSection.classList.add('active');
            }

            // Update button styles
            toolButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600');
                btn.classList.add('bg-blue-500');
            });
            button.classList.remove('bg-blue-500');
            button.classList.add('bg-blue-600');
        });
    });
}

// Initialize all common functionality
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initToolSwitching();
}); 