// Initialize dark mode on page load
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
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

    function updateToggleIcon() {
        const isLightMode = body.classList.contains('light-mode');
        darkModeToggle.innerHTML = isLightMode ? '🌙' : '☀️';
    }

    // AUTH BUTTON LOGIC (for index.html)
    const authButton = document.getElementById('authButton');
    if (authButton) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('username');
        updateAuthButton(isLoggedIn, username);

        // Handle CTA button (Get Started / View Stock)
        const ctaButton = document.getElementById('ctaButton');
        if (ctaButton) {
            updateCTAButton(isLoggedIn);
        }

        authButton.addEventListener('click', function() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (isLoggedIn) {
                // Logout
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                updateAuthButton(false, null);
                updateCTAButton(false);
                window.location.href = 'index.html';
            } else {
                // Go to login page
                window.location.href = 'login.html';
            }
        });

        function updateAuthButton(isLoggedIn, username) {
            if (isLoggedIn) {
                authButton.textContent = `Logout (${username})`;
                authButton.classList.add('logged-in');
            } else {
                authButton.textContent = 'Login';
                authButton.classList.remove('logged-in');
            }
        }

        function updateCTAButton(isLoggedIn) {
            const ctaButton = document.getElementById('ctaButton');
            if (ctaButton) {
                if (isLoggedIn) {
                    ctaButton.textContent = '📦 View Stock';
                } else {
                    ctaButton.textContent = 'Get Started';
                }
            }
        }

        // CTA Button click handler
        if (ctaButton) {
            ctaButton.addEventListener('click', function() {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                if (isLoggedIn) {
                    window.location.href = 'inventory.html';
                } else {
                    window.location.href = 'signup.html';
                }
            });
        }
    }

    // LOGIN FORM LOGIC (for login.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Simple validation
            if (!username || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Basic password validation (at least 6 characters)
            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }

            // Simulate login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Show success message and redirect
            alert(`Welcome back, ${username}!`);
            window.location.href = 'index.html';
        });
    }

    // SIGNUP FORM LOGIC (for signup.html)
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const passwordInput = document.getElementById('password');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        // Real-time password validation
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });

        // Add event listeners for animated inputs
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
            if (element) {
                if (isMet) {
                    element.classList.add('met');
                    element.innerHTML = element.innerHTML.replace('✗', '✓');
                } else {
                    element.classList.remove('met');
                    element.innerHTML = element.innerHTML.replace('✓', '✗');
                }
            }
        }
    }

    // INVENTORY MANAGEMENT LOGIC (for inventory.html)
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        const addProductModal = document.getElementById('addProductModal');
        const editQuantityModal = document.getElementById('editQuantityModal');
        const addProductForm = document.getElementById('addProductForm');
        const editQuantityForm = document.getElementById('editQuantityForm');
        const closeModal = document.querySelector('.close');
        const closeQtyModal = document.querySelector('.close-qty');
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const inventoryList = document.getElementById('inventoryList');

        let currentFilter = 'all';
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let editingProductId = null;

        // Modal functionality
        addProductBtn.addEventListener('click', function() {
            addProductModal.style.display = 'block';
        });

        closeModal.addEventListener('click', function() {
            addProductModal.style.display = 'none';
        });

        closeQtyModal.addEventListener('click', function() {
            editQuantityModal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === addProductModal) {
                addProductModal.style.display = 'none';
            }
            if (event.target === editQuantityModal) {
                editQuantityModal.style.display = 'none';
            }
        });

        // Add product form submit
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('productName').value.trim();
            const id = document.getElementById('productId').value.trim();
            const category = document.getElementById('productCategory').value;
            const quantity = parseInt(document.getElementById('productQuantity').value) || 0;

            // Validate product ID uniqueness
            if (products.some(p => p.id === id)) {
                alert('Product ID already exists!');
                return;
            }

            const newProduct = {
                id: id,
                name: name,
                category: category,
                quantity: quantity,
                createdAt: new Date().toISOString()
            };

            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            addProductForm.reset();
            addProductModal.style.display = 'none';
            renderProducts();
        });

        // Edit quantity form submit
        editQuantityForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newQuantity = parseInt(document.getElementById('newQuantity').value) || 0;
            
            if (newQuantity < 0) {
                alert('Quantity cannot be negative!');
                return;
            }

            const product = products.find(p => p.id === editingProductId);
            if (product) {
                product.quantity = newQuantity;
                localStorage.setItem('products', JSON.stringify(products));
                editQuantityModal.style.display = 'none';
                renderProducts();
            }
        });

        // Search functionality
        searchInput.addEventListener('input', function() {
            renderProducts();
        });

        // Category filter
        categoryFilter.addEventListener('change', function() {
            renderProducts();
        });

        // Stock status filter
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderProducts();
            });
        });

        function openEditQuantityModal(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                editingProductId = productId;
                document.getElementById('editProductName').textContent = product.name;
                document.getElementById('editProductCurrentQty').textContent = product.quantity;
                document.getElementById('newQuantity').value = product.quantity;
                editQuantityModal.style.display = 'block';
                document.getElementById('newQuantity').focus();
            }
        }

        function renderProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const categoryTerm = categoryFilter.value;

            let filtered = products.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm);
                const matchesCategory = !categoryTerm || product.category === categoryTerm;
                const matchesStock = 
                    currentFilter === 'all' ||
                    (currentFilter === 'in-stock' && product.quantity > 0) ||
                    (currentFilter === 'low-stock' && product.quantity > 0 && product.quantity <= 10);

                return matchesSearch && matchesCategory && matchesStock;
            });

            if (filtered.length === 0) {
                inventoryList.innerHTML = '<p class="empty-message">No products found. Try adjusting your filters! 🔍</p>';
                return;
            }

            inventoryList.innerHTML = filtered.map(product => `
                <div class="product-card">
                    <div class="product-header">
                        <div>
                            <p class="product-name">${product.name}</p>
                            <p class="product-id">${product.id}</p>
                        </div>
                        <span class="product-category">${product.category}</span>
                    </div>

                    <div class="product-details">
                        <div class="detail-row">
                            <span class="detail-label">Quantity in Stock:</span>
                            <span class="detail-value qty-clickable" data-id="${product.id}" style="cursor: pointer; text-decoration: underline;">${product.quantity}</span>
                        </div>
                        <div class="stock-status">
                            ${product.quantity === 0 ? 
                                '<span class="status-out-stock">● Out of Stock</span>' :
                                product.quantity <= 10 ?
                                '<span class="status-low-stock">● Low Stock</span>' :
                                '<span class="status-in-stock">● In Stock</span>'
                            }
                        </div>
                    </div>

                    <div class="product-actions">
                        <div class="qty-control">
                            <button class="qty-btn minus-btn" data-id="${product.id}">−</button>
                            <span class="qty-display">${product.quantity}</span>
                            <button class="qty-btn plus-btn" data-id="${product.id}">+</button>
                        </div>
                        <button class="delete-btn" data-id="${product.id}">Delete</button>
                    </div>
                </div>
            `).join('');

            // Attach event listeners for quantity controls
            document.querySelectorAll('.plus-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    const product = products.find(p => p.id === productId);
                    product.quantity += 1;
                    localStorage.setItem('products', JSON.stringify(products));
                    renderProducts();
                });
            });

            document.querySelectorAll('.minus-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    const product = products.find(p => p.id === productId);
                    if (product.quantity > 0) {
                        product.quantity -= 1;
                        localStorage.setItem('products', JSON.stringify(products));
                        renderProducts();
                    }
                });
            });

            document.querySelectorAll('.qty-clickable').forEach(element => {
                element.addEventListener('click', function() {
                    openEditQuantityModal(this.dataset.id);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    if (confirm('Are you sure you want to delete this product?')) {
                        products = products.filter(p => p.id !== productId);
                        localStorage.setItem('products', JSON.stringify(products));
                        renderProducts();
                    }
                });
            });
        }

        // Initial render
        renderProducts();
    }
});
