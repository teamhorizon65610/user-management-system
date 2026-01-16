/**
 * Authentication JavaScript
 * Handles login and registration functionality
 */

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Utility Functions
function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

function setLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        button.disabled = true;
    } else {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        button.disabled = false;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        
        // Validation
        let hasError = false;
        
        if (!email) {
            document.getElementById('email-error').textContent = 'Email is required';
            hasError = true;
        } else if (!validateEmail(email)) {
            document.getElementById('email-error').textContent = 'Invalid email format';
            hasError = true;
        }
        
        if (!password) {
            document.getElementById('password-error').textContent = 'Password is required';
            hasError = true;
        }
        
        if (hasError) return;
        
        // Submit login request
        setLoading(loginBtn, true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store user data
                localStorage.setItem('user', JSON.stringify(data.data));
                
                showAlert('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'manage.html';
                }, 1000);
            } else {
                showAlert(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('Unable to connect to server. Please try again.', 'error');
        } finally {
            setLoading(loginBtn, false);
        }
    });
}

// Registration Form Handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const registerBtn = document.getElementById('register-btn');
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        
        // Validation
        let hasError = false;
        
        if (!username || username.length < 3) {
            document.getElementById('username-error').textContent = 'Username must be at least 3 characters';
            hasError = true;
        }
        
        if (!email) {
            document.getElementById('email-error').textContent = 'Email is required';
            hasError = true;
        } else if (!validateEmail(email)) {
            document.getElementById('email-error').textContent = 'Invalid email format';
            hasError = true;
        }
        
        if (!password || password.length < 6) {
            document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
            hasError = true;
        }
        
        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            hasError = true;
        }
        
        if (hasError) return;
        
        // Submit registration request
        setLoading(registerBtn, true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('Registration successful! Redirecting to login...', 'success');
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 1500);
            } else {
                showAlert(data.error || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('Unable to connect to server. Please try again.', 'error');
        } finally {
            setLoading(registerBtn, false);
        }
    });
}

// Real-time validation
const inputs = document.querySelectorAll('input[required]');
inputs.forEach(input => {
    input.addEventListener('blur', () => {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (!errorElement) return;
        
        if (!input.value.trim()) {
            errorElement.textContent = `${input.labels[0].textContent} is required`;
        } else {
            errorElement.textContent = '';
        }
    });
    
    input.addEventListener('input', () => {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement && input.value.trim()) {
            errorElement.textContent = '';
        }
    });
});
