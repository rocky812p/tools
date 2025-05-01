// Admin credentials
const ADMIN_CREDENTIALS = {
    id: 'ANKITSINGH848',
    password: 'SANISANI2'
};

// DOM Elements
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const uploadSection = document.getElementById('uploadSection');
const customerViewBtn = document.getElementById('customerViewBtn');
const adminViewBtn = document.getElementById('adminViewBtn');
const viewToggle = document.getElementById('viewToggle');

// State management
let isAdminLoggedIn = false;

// Initialize
function init() {
    checkAdminStatus();
    setupEventListeners();
}

// Check if admin is logged in
function checkAdminStatus() {
    const adminStatus = localStorage.getItem('adminLoggedIn');
    isAdminLoggedIn = adminStatus === 'true';
    updateUIBasedOnAuth();
}

// Setup event listeners
function setupEventListeners() {
    // Admin login button
    adminLoginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    // Close modal
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Admin logout
    adminLogoutBtn.addEventListener('click', handleLogout);

    // Login form submission
    adminLoginForm.addEventListener('submit', handleLogin);

    // View toggle buttons
    if (customerViewBtn) {
        customerViewBtn.addEventListener('click', () => toggleView('customer'));
    }
    if (adminViewBtn) {
        adminViewBtn.addEventListener('click', () => toggleView('admin'));
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const adminId = document.getElementById('adminId').value;
    const adminPassword = document.getElementById('adminPassword').value;

    if (adminId === ADMIN_CREDENTIALS.id && adminPassword === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        loginModal.style.display = 'none';
        updateUIBasedOnAuth();
        showNotification('Successfully logged in as admin', 'success');
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

// Handle logout
function handleLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    updateUIBasedOnAuth();
    showNotification('Successfully logged out', 'success');
}

// Update UI based on authentication
function updateUIBasedOnAuth() {
    if (isAdminLoggedIn) {
        adminLoginBtn.classList.add('hidden');
        adminLogoutBtn.classList.remove('hidden');
        uploadSection.classList.remove('hidden');
        if (adminViewBtn) adminViewBtn.classList.remove('hidden');
    } else {
        adminLoginBtn.classList.remove('hidden');
        adminLogoutBtn.classList.add('hidden');
        uploadSection.classList.add('hidden');
        if (adminViewBtn) adminViewBtn.classList.add('hidden');
    }
}

// Toggle between customer and admin views
function toggleView(view) {
    const customerView = document.getElementById('customerView');
    const adminView = document.getElementById('adminView');

    if (view === 'customer') {
        customerView.classList.remove('hidden');
        adminView.classList.add('hidden');
        customerViewBtn.classList.add('bg-blue-600', 'text-white');
        adminViewBtn.classList.remove('bg-blue-600', 'text-white');
    } else {
        customerView.classList.add('hidden');
        adminView.classList.remove('hidden');
        customerViewBtn.classList.remove('bg-blue-600', 'text-white');
        adminViewBtn.classList.add('bg-blue-600', 'text-white');
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 