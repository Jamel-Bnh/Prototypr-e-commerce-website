// Authentication functionality
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize authentication state
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Check if user should be redirected to profile
    if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
        window.location.href = 'index.html';
    }
    
    // Protect profile page
    if (!currentUser && window.location.pathname.includes('profile.html')) {
        window.location.href = 'login.html';
    }
});

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData);
    
    // Clear previous errors
    clearAuthErrors();
    
    // Validate form
    if (!validateSignupForm(userData)) {
        return;
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUsers.find(user => user.email === userData.email)) {
        showAuthError('emailError', 'Un compte avec cette adresse email existe déjà');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password, // In real app, this should be hashed
        birthDate: userData.birthDate,
        gender: userData.gender,
        newsletter: userData.newsletter === 'on',
        createdAt: new Date().toISOString(),
        orders: [],
        addresses: [],
        wishlist: [],
        notifications: {
            emailOrders: true,
            emailPromotions: userData.newsletter === 'on',
            emailNewsletter: userData.newsletter === 'on',
            smsOrders: false,
            smsDelivery: false
        }
    };
    
    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // Log in user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showMessage('Compte créé avec succès ! Bienvenue chez TechTunisia !', 'success');
    
    // Redirect to homepage
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData);
    
    // Clear previous errors
    clearAuthErrors();
    
    // Validate form
    if (!validateLoginForm(loginData)) {
        return;
    }
    
    // Check credentials
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
    
    if (!user) {
        showAuthError('loginEmailError', 'Email ou mot de passe incorrect');
        showAuthError('loginPasswordError', 'Email ou mot de passe incorrect');
        return;
    }
    
    // Log in user
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Handle remember me
    if (loginData.rememberMe) {
        localStorage.setItem('rememberUser', 'true');
    }
    
    showMessage('Connexion réussie ! Bienvenue !', 'success');
    
    // Redirect to homepage or intended page
    const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
    localStorage.removeItem('redirectAfterLogin');
    
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1500);
}

// Validate signup form
function validateSignupForm(data) {
    let isValid = true;
    
    // First name validation
    if (!data.firstName || data.firstName.length < 2) {
        showAuthError('firstNameError', 'Le prénom doit contenir au moins 2 caractères');
        isValid = false;
    }
    
    // Last name validation
    if (!data.lastName || data.lastName.length < 2) {
        showAuthError('lastNameError', 'Le nom doit contenir au moins 2 caractères');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showAuthError('emailError', 'Veuillez entrer une adresse email valide');
        isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-()]{8,}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
        showAuthError('phoneError', 'Veuillez entrer un numéro de téléphone valide');
        isValid = false;
    }
    
    // Password validation
    if (!data.password || data.password.length < 6) {
        showAuthError('passwordError', 'Le mot de passe doit contenir au moins 6 caractères');
        isValid = false;
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        showAuthError('confirmPasswordError', 'Les mots de passe ne correspondent pas');
        isValid = false;
    }
    
    // Terms validation
    if (!data.terms) {
        showAuthError('termsError', 'Vous devez accepter les conditions d\'utilisation');
        isValid = false;
    }
    
    return isValid;
}

// Validate login form
function validateLoginForm(data) {
    let isValid = true;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showAuthError('loginEmailError', 'Veuillez entrer une adresse email valide');
        isValid = false;
    }
    
    // Password validation
    if (!data.password || data.password.length < 1) {
        showAuthError('loginPasswordError', 'Veuillez entrer votre mot de passe');
        isValid = false;
    }
    
    return isValid;
}

// Show authentication error
function showAuthError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear authentication errors
function clearAuthErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Check password strength
function checkPasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    if (!strengthElement) return;
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            feedback = '<span class="strength-weak">Faible</span>';
            break;
        case 2:
        case 3:
            feedback = '<span class="strength-medium">Moyen</span>';
            break;
        case 4:
        case 5:
            feedback = '<span class="strength-strong">Fort</span>';
            break;
    }
    
    strengthElement.innerHTML = feedback;
}

// Add password strength checker
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
});

// Social authentication (simulated)
function socialSignup(provider) {
    showMessage(`Connexion avec ${provider} non disponible dans cette démo`, 'error');
}

function socialLogin(provider) {
    showMessage(`Connexion avec ${provider} non disponible dans cette démo`, 'error');
}

// Forgot password functionality
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
        showMessage('Un lien de réinitialisation a été envoyé à votre adresse email', 'success');
    } else {
        showMessage('Aucun compte trouvé avec cette adresse email', 'error');
    }
    
    closeForgotPassword();
    event.target.reset();
}

// Update authentication UI
function updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    const userMenu = document.querySelector('.user-menu');
    const headerUserName = document.getElementById('headerUserName');
    
    if (currentUser) {
        // User is logged in
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            if (headerUserName) {
                headerUserName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            }
        }
    } else {
        // User is not logged in
        if (authLinks) authLinks.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Toggle user dropdown menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Logout functionality
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    
    showMessage('Vous avez été déconnecté avec succès', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Show order history (from user menu)
function showOrderHistory() {
    window.location.href = 'profile.html#orders';
}

// Show wishlist (from user menu)
function showWishlist() {
    window.location.href = 'profile.html#wishlist';
}

// Show settings (from user menu)
function showSettings() {
    window.location.href = 'profile.html#security';
}

// Require authentication for certain actions
function requireAuth(callback) {
    if (!currentUser) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        showMessage('Veuillez vous connecter pour continuer', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    if (callback) callback();
    return true;
}

// Enhanced add to cart with authentication
function addToCartAuth(productId) {
    if (requireAuth()) {
        // Assuming addToCart is defined elsewhere and handles the actual cart logic
        if (typeof addToCart === 'function') {
            addToCart(productId);
        } else {
            console.error("addToCart function is not defined.");
            showMessage("Erreur: Impossible d'ajouter au panier. Veuillez réessayer.", "error");
        }
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Update user data
function updateUserData(userData) {
    if (!currentUser) return false;
    
    // Update current user
    Object.assign(currentUser, userData);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    return true;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Get user's full name
function getUserFullName() {
    if (!currentUser) return '';
    return `${currentUser.firstName} ${currentUser.lastName}`;
}

// Auto-login if remember me was checked
document.addEventListener('DOMContentLoaded', function() {
    const rememberUser = localStorage.getItem('rememberUser');
    if (rememberUser && !currentUser) {
        // Try to restore session (in a real app, you'd validate with server)
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateAuthUI();
        }
    }
});

// Mock showMessage function (assuming it's defined elsewhere)
function showMessage(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In a real application, this would display a message to the user
}
