// API Configuration
const API_URL = 'http://localhost:5000/api'; // Change to your backend URL when deployed

// Store API token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function clearAuthToken() {
    localStorage.removeItem('authToken');
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'API Error');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// SIGNUP
async function signup(fname, lname, email, phone, password) {
    const result = await apiCall('/auth/signup', 'POST', {
        fname, lname, email, phone, password
    });
    
    setAuthToken(result.token);
    localStorage.setItem('username', `${result.user.fname} ${result.user.lname}`);
    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('isLoggedIn', 'true');
    
    return result;
}

// LOGIN
async function login(email, password) {
    const result = await apiCall('/auth/login', 'POST', {
        email, password
    });
    
    setAuthToken(result.token);
    localStorage.setItem('username', `${result.user.fname} ${result.user.lname}`);
    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('isLoggedIn', 'true');
    
    return result;
}

// LOGOUT
function logout() {
    clearAuthToken();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
}

// PRODUCTS API
async function createProduct(product_name, product_id, category, quantity) {
    return await apiCall('/products', 'POST', {
        product_name, product_id, category, quantity
    });
}

async function getProducts() {
    return await apiCall('/products', 'GET');
}

async function updateProduct(id, quantity) {
    return await apiCall(`/products/${id}`, 'PUT', { quantity });
}

async function deleteProduct(id) {
    return await apiCall(`/products/${id}`, 'DELETE');
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        apiCall,
        signup,
        login,
        logout,
        createProduct,
        getProducts,
        updateProduct,
        deleteProduct,
        getAuthToken,
        setAuthToken,
        clearAuthToken
    };
}
