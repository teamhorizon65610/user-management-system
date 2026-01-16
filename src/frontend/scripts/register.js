/**
 * Registration JavaScript
 * Handles user registration functionality
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

function validateMobile(mobile) {
    // Remove all non-digit characters
    const digits = mobile.replace(/\D/g, '');
    // Must be exactly 10 digits
    return digits.length === 10;
}

// Registration Form Handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
    // Add real-time mobile number formatting and limiting
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', (e) => {
            // Remove all non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            // Limit to exactly 10 digits
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            e.target.value = value;

            // Show character count
            const errorEl = document.getElementById('mobile-error');
            const hintEl = e.target.nextElementSibling.nextElementSibling;
            if (value.length > 0 && value.length < 10) {
                if (hintEl && hintEl.classList.contains('form-hint')) {
                    hintEl.textContent = `${value.length}/10 digits entered`;
                    hintEl.style.color = '#f59e0b';
                }
            } else if (value.length === 10) {
                if (hintEl && hintEl.classList.contains('form-hint')) {
                    hintEl.textContent = '✓ 10 digits entered';
                    hintEl.style.color = '#10b981';
                }
            } else {
                if (hintEl && hintEl.classList.contains('form-hint')) {
                    hintEl.textContent = 'Enter exactly 10 digits';
                    hintEl.style.color = '';
                }
            }
        });
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const age = document.getElementById('age').value;
        const address = document.getElementById('address').value.trim();
        const registerBtn = document.getElementById('register-btn');

        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

        // Validation
        let hasError = false;

        if (!name || name.length < 2) {
            document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
            hasError = true;
        }

        if (!email) {
            document.getElementById('email-error').textContent = 'Email is required';
            hasError = true;
        } else if (!validateEmail(email)) {
            document.getElementById('email-error').textContent = 'Invalid email format';
            hasError = true;
        }

        if (!mobile) {
            document.getElementById('mobile-error').textContent = 'Mobile number is required';
            hasError = true;
        } else if (!validateMobile(mobile)) {
            const digits = mobile.replace(/\D/g, '');
            if (digits.length < 10) {
                document.getElementById('mobile-error').textContent = `Mobile number must be exactly 10 digits (you entered ${digits.length})`;
            } else {
                document.getElementById('mobile-error').textContent = 'Mobile number must be exactly 10 digits';
            }
            hasError = true;
        }

        if (!age || parseInt(age) < 1 || parseInt(age) > 150) {
            document.getElementById('age-error').textContent = 'Age must be between 1 and 150';
            hasError = true;
        }

        if (!address || address.length < 5) {
            document.getElementById('address-error').textContent = 'Address must be at least 5 characters';
            hasError = true;
        }

        if (hasError) return;

        // Submit registration request
        setLoading(registerBtn, true);

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, mobile, age: parseInt(age), address })
            });

            const data = await response.json();

            if (data.success) {
                showAlert('User registered successfully!', 'success');

                // Reset form
                registerForm.reset();

                // Reset mobile hint
                const mobileHint = document.querySelector('#mobile + .form-error + .form-hint');
                if (mobileHint) {
                    mobileHint.textContent = 'Enter exactly 10 digits';
                    mobileHint.style.color = '';
                }

                // Redirect to user management after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'manage.html';
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
const inputs = document.querySelectorAll('input[required], textarea[required]');
inputs.forEach(input => {
    if (input.id === 'mobile') return; // Skip mobile as it has custom handler

    input.addEventListener('blur', () => {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (!errorElement) return;

        if (!input.value.trim()) {
            errorElement.textContent = `${input.labels[0].textContent.replace(' *', '')} is required`;
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