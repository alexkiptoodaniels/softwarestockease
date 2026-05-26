// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const body = document.body;

    // Check if user has a saved preference
    const savedMode = localStorage.getItem('darkMode');

    // Default to dark mode if no preference is saved
    if (savedMode === null) {
        body.classList.remove('light-mode');
        updateToggleIcon();
        localStorage.setItem('darkMode', 'true');
    } else if (savedMode === 'false') {
        body.classList.add('light-mode');
        updateToggleIcon();
    }

    // Toggle button click event
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');

        // Update localStorage
        const isLightMode = body.classList.contains('light-mode');
        localStorage.setItem('darkMode', !isLightMode);

        // Update icon
        updateToggleIcon();
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value);
    });

    // Add event listeners for animated inputs
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    emailInput.addEventListener('input', function() {
        this.parentElement.classList.toggle('has-value', this.value.length > 0);
    });

    phoneInput.addEventListener('input', function() {
        this.parentElement.classList.toggle('has-value', this.value.length > 0);
    });

    // Sign up form submit event
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fname = document.getElementById('fname').value.trim();
        const lname = document.getElementById('lname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // Validate all fields
        if (!fname || !lname || !email || !phone || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Validate first and last name
        if (fname.length < 2) {
            alert('First name must be at least 2 characters');
            return;
        }

        if (lname.length < 2) {
            alert('Last name must be at least 2 characters');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Validate phone number (basic check)
        const phoneRegex = /^[\d\s()+-]+$/;
        if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
            alert('Please enter a valid phone number (at least 10 digits)');
            return;
        }

        // Validate password strength
        if (!isPasswordStrong(password)) {
            alert('Password does not meet all requirements');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Check if terms are accepted
        if (!terms) {
            alert('Please accept the Terms and Conditions');
            return;
        }

        // All validations passed - simulate registration
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', fname + ' ' + lname);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);

        // Show success message and redirect
        alert(`Welcome to Stock Ease, ${fname}! Your account has been created successfully.`);
        window.location.href = 'index.html';
    });

    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        // Update UI for each requirement
        updateRequirement('req-length', requirements.length);
        updateRequirement('req-uppercase', requirements.uppercase);
        updateRequirement('req-lowercase', requirements.lowercase);
        updateRequirement('req-number', requirements.number);
        updateRequirement('req-special', requirements.special);

        return requirements;
    }

    function isPasswordStrong(password) {
        const req = validatePassword(password);
        return req.length && req.uppercase && req.lowercase && req.number && req.special;
    }

    function updateRequirement(id, isMet) {
        const element = document.getElementById(id);
        if (isMet) {
            element.classList.add('met');
            element.innerHTML = element.innerHTML.replace('✗', '✓');
        } else {
            element.classList.remove('met');
            element.innerHTML = element.innerHTML.replace('✓', '✗');
        }
    }

    function updateToggleIcon() {
        const isLightMode = body.classList.contains('light-mode');
        darkModeToggle.innerHTML = isLightMode ? '🌙' : '☀️';
    }
});
