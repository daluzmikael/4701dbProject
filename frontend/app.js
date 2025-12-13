// Configuration
// ============================================
// BACKEND URL CONFIGURATION
// ============================================
// Default: Connect to backend running locally on same machine
// To connect to a remote backend, update this URL:
//   'http://localhost:8000'                    - Local (default, backend on same machine)
//   'http://192.168.1.100:8000'                - Remote backend on local network
//   'http://your-domain.com:8000'              - Remote backend online
// ============================================
const API_BASE = 'http://localhost:8000'; // Backend URL - change if backend is on different machine

// State Management
const state = {
    currentUser: null,
    currentEmployee: null,
    currentPage: 'home'
};

// API Service
const api = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                // If response is not JSON, get text
                const text = await response.text();
                throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: Request failed`);
            }
            return data;
        } catch (error) {
            // Log error but don't throw if it's a network error (backend not available)
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('CORS')) {
                console.log('Backend not available:', endpoint, '- Frontend will use demo mode');
                throw new Error('BACKEND_NOT_AVAILABLE');
            }
            console.error('API Error:', endpoint, error);
            throw error;
        }
    },

    // Customer endpoints
    async getCustomer(id) {
        return this.request(`/customer/${id}`);
    },

    async createCustomer(data) {
        return this.request('/customer/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getCustomerHistory(id) {
        return this.request(`/customer/${id}/history`);
    },

    // Vehicle endpoints (to be implemented in backend)
    async getVehicles(filters = {}) {
        // This will need backend implementation
        return this.request('/vehicles', {
            method: 'POST',
            body: JSON.stringify(filters)
        });
    },

    async getVehicle(vin) {
        return this.request(`/vehicle/${vin}`);
    },

    // Dealer endpoints
    async getDealers() {
        return this.request('/dealers');
    },

    async getDealer(id) {
        return this.request(`/dealer/${id}`);
    },

    async getDealerVehicles(id) {
        return this.request(`/dealer/${id}/vehicles`);
    },

    // Brand endpoints
    async getBrands() {
        return this.request('/brands');
    },

    async getBrand(id) {
        return this.request(`/brand/${id}`);
    },

    // Model endpoints
    async getModels() {
        return this.request('/models');
    },

    async getModel(id) {
        return this.request(`/model/${id}`);
    },

    // Employee endpoints
    async getEmployee(id) {
        return this.request(`/employee/${id}`);
    },

    async getEmployeeDealer(id) {
        return this.request(`/employee/${id}/dealer`);
    },

    async getEmployeeSales(employeeId) {
        return this.request(`/employee/${employeeId}/sales`);
    },

    async getSale(id) {
        return this.request(`/sale/${id}`);
    },

    async getPayments(saleId) {
        return this.request(`/sale/${saleId}/payments`);
    }
};

// Authentication
const auth = {
    login() {
        const userType = document.getElementById('userType').value;
        
        if (userType === 'customer') {
            const customerId = document.getElementById('customerId').value;
            if (!customerId) {
                this.showError('Please enter a customer ID');
                return;
            }
            
            // Demo mode: Use mock customer if backend fails
            api.getCustomer(customerId)
                .then(customer => {
                    state.currentUser = { ...customer, id: customerId };
                    updateNavigation();
                    updateHomePage();
                    state.currentPage = 'home';
                    router.navigate('home');
                })
                .catch(err => {
                    // Demo mode: Allow test login with any ID
                    console.log('Backend not available, using demo mode');
                    state.currentUser = {
                        id: customerId,
                        FIRST: 'Demo',
                        LAST: 'User',
                        first: 'Demo',
                        last: 'User',
                        LICENSE_NUM: 'DL123456',
                        license_num: 'DL123456',
                        CRED_SCORE: 750,
                        cred_score: 750,
                        STREET: '123 Demo St',
                        street: '123 Demo St',
                        CITY: 'Demo City',
                        city: 'Demo City',
                        STATE: 'CA',
                        state: 'CA',
                        ZIP_CODE: '12345',
                        zip_code: '12345',
                        PHONES: [{ PHONE_NUMBER: '555-1234', phone_number: '555-1234' }]
                    };
                    updateNavigation();
                    updateHomePage();
                    state.currentPage = 'home';
                    router.navigate('home');
                });
        } else {
            const employeeId = document.getElementById('employeeId').value;
            if (!employeeId) {
                this.showError('Please enter an employee ID');
                return;
            }
            
            // Demo mode: Use mock employee if backend fails
            api.getEmployee(employeeId)
                .then(employee => {
                    state.currentEmployee = { ...employee, id: employeeId };
                    updateNavigation();
                    updateHomePage();
                    state.currentPage = 'employee-dashboard';
                    router.navigate('employee-dashboard');
                })
                .catch(err => {
                    // Demo mode: Allow test login with any ID
                    console.log('Backend not available, using demo mode');
                    state.currentEmployee = {
                        id: employeeId,
                        FIRST_NAME: 'Demo',
                        first_name: 'Demo',
                        LAST_NAME: 'Employee',
                        last_name: 'Employee',
                        DEALER_ID: 1,
                        dealer_id: 1
                    };
                    updateNavigation();
                    updateHomePage();
                    state.currentPage = 'employee-dashboard';
                    router.navigate('employee-dashboard');
                });
        }
    },

    logout() {
        state.currentUser = null;
        state.currentEmployee = null;
        updateNavigation();
        updateHomePage();
        state.currentPage = 'home';
        router.navigate('home');
    },

    showError(message) {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => errorDiv.classList.add('hidden'), 5000);
    },

    isAuthenticated() {
        return state.currentUser || state.currentEmployee;
    }
};

// Router
const router = {
    navigate(page) {
        state.currentPage = page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.loadPage(page);
        }
    },

    loadPage(page) {
        switch(page) {
            case 'home':
                // Show home page - it will show login banner if not logged in
                updateHomePage();
                break;
            case 'vehicles':
                loadVehicles();
                break;
            case 'dealers':
                loadDealers();
                break;
            case 'brands':
                loadBrands();
                break;
            case 'models':
                loadModels();
                break;
            case 'account':
                loadAccount();
                break;
            case 'purchases':
                loadPurchases();
                break;
            case 'employee-dashboard':
                loadEmployeeDashboard();
                break;
            case 'employee-inventory':
                loadEmployeeInventory();
                break;
            case 'employee-customers':
                loadEmployeeCustomers();
                break;
            case 'employee-sales':
                loadEmployeeSales();
                break;
        }
    }
};

// Page Loaders
function updateHomePage() {
    const loginBanner = document.getElementById('homeLoginBanner');
    const heroLoginButton = document.getElementById('heroLoginButton');
    
    if (state.currentUser || state.currentEmployee) {
        // Hide login banner and button when logged in
        if (loginBanner) {
            loginBanner.style.display = 'none';
        }
        if (heroLoginButton) {
            heroLoginButton.style.display = 'none';
        }
    } else {
        // Show login banner and button when not logged in
        if (loginBanner) {
            loginBanner.style.display = 'block';
        }
        if (heroLoginButton) {
            heroLoginButton.style.display = 'inline-block';
        }
    }
}

function toggleLoginForm() {
    const userType = document.getElementById('userType').value;
    document.getElementById('customerLogin').classList.toggle('hidden', userType !== 'customer');
    document.getElementById('employeeLogin').classList.toggle('hidden', userType !== 'employee');
}

function loadVehicles() {
    const container = document.getElementById('vehiclesList');
    container.innerHTML = '<div class="loading">Loading vehicles...</div>';
    
    // Mock data for now - replace with actual API call
    const mockVehicles = [
        { vin: '1HGBH41JXMN109186', model_year: 2023, mileage: 5000, brand: 'Honda', model: 'Civic', body_style: 'Sedan', dealer: 'Downtown Auto' },
        { vin: '2HGBH41JXMN109187', model_year: 2022, mileage: 15000, brand: 'Toyota', model: 'Camry', body_style: 'Sedan', dealer: 'City Motors' }
    ];
    
    setTimeout(() => {
        container.innerHTML = mockVehicles.map(v => `
            <div class="vehicle-card" onclick="router.navigate('vehicle-detail'); loadVehicleDetail('${v.vin}')">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">🚗</div>
                <div class="vehicle-card-body">
                    <div class="vehicle-card-title">${v.brand} ${v.model}</div>
                    <div class="vehicle-card-info">Year: ${v.model_year}</div>
                    <div class="vehicle-card-info">Mileage: ${v.mileage.toLocaleString()} mi</div>
                    <div class="vehicle-card-info">${v.body_style}</div>
                    <div class="vehicle-card-info">Dealer: ${v.dealer}</div>
                </div>
            </div>
        `).join('');
    }, 500);
}

function loadVehicleDetail(vin) {
    const container = document.getElementById('vehicleDetail');
    container.innerHTML = '<div class="loading">Loading vehicle details...</div>';
    
    // Mock data
    setTimeout(() => {
        container.innerHTML = `
            <div class="detail-section">
                <h2>Vehicle Details</h2>
                <div class="detail-row">
                    <div class="detail-label">VIN:</div>
                    <div>${vin}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Brand:</div>
                    <div>Honda</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Model:</div>
                    <div>Civic</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Year:</div>
                    <div>2023</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Mileage:</div>
                    <div>5,000 miles</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Body Style:</div>
                    <div>Sedan</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Dealer:</div>
                    <div>Downtown Auto</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Factory:</div>
                    <div>Ohio Factory</div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Available Options</h3>
                <ul>
                    <li>Color: Blue</li>
                    <li>Transmission: Automatic</li>
                    <li>Engine: 2.0L I4</li>
                    <li>Trim: EX</li>
                </ul>
            </div>
        `;
    }, 500);
}

function loadDealers() {
    const container = document.getElementById('dealersList');
    container.innerHTML = '<div class="loading">Loading dealers...</div>';
    
    // Mock data
    setTimeout(() => {
        const mockDealers = [
            { id: 1, name: 'Downtown Auto', city: 'New York', state: 'NY', current_stock: 45, max_stock: 100 },
            { id: 2, name: 'City Motors', city: 'Los Angeles', state: 'CA', current_stock: 78, max_stock: 150 }
        ];
        
        container.innerHTML = mockDealers.map(d => `
            <div class="card" onclick="router.navigate('dealer-detail'); loadDealerDetail(${d.id})">
                <div class="card-header">${d.name}</div>
                <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div>${d.city}, ${d.state}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Stock:</div>
                    <div>${d.current_stock} / ${d.max_stock}</div>
                </div>
            </div>
        `).join('');
    }, 500);
}

function loadDealerDetail(id) {
    const container = document.getElementById('dealerDetail');
    container.innerHTML = '<div class="loading">Loading dealer details...</div>';
    
    setTimeout(() => {
        container.innerHTML = `
            <h2>Downtown Auto</h2>
            <div class="detail-section">
                <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div>New York, NY</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Stock:</div>
                    <div>45 / 100 vehicles</div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Available Vehicles</h3>
                <div id="dealerVehicles" class="grid"></div>
            </div>
        `;
        loadVehicles(); // Reuse vehicles loader
    }, 500);
}

function loadBrands() {
    const container = document.getElementById('brandsList');
    container.innerHTML = '<div class="loading">Loading brands...</div>';
    
    setTimeout(() => {
        const mockBrands = [
            { id: 1, name: 'Honda', company: 'Honda Motor Co.' },
            { id: 2, name: 'Toyota', company: 'Toyota Motor Corp.' },
            { id: 3, name: 'Ford', company: 'Ford Motor Company' }
        ];
        
        container.innerHTML = mockBrands.map(b => `
            <div class="card" onclick="router.navigate('brand-detail'); loadBrandDetail(${b.id})">
                <div class="card-header">${b.name}</div>
                <div class="detail-row">
                    <div class="detail-label">Company:</div>
                    <div>${b.company}</div>
                </div>
            </div>
        `).join('');
    }, 500);
}

function loadBrandDetail(id) {
    const container = document.getElementById('brandDetail');
    container.innerHTML = '<div class="loading">Loading brand details...</div>';
    
    setTimeout(() => {
        container.innerHTML = `
            <h2>Honda</h2>
            <div class="detail-section">
                <div class="detail-row">
                    <div class="detail-label">Company:</div>
                    <div>Honda Motor Co.</div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Models</h3>
                <ul>
                    <li>Civic</li>
                    <li>Accord</li>
                    <li>CR-V</li>
                </ul>
            </div>
            <div class="detail-section">
                <h3>Available Vehicles: 12</h3>
            </div>
        `;
    }, 500);
}

function loadModels() {
    const container = document.getElementById('modelsList');
    container.innerHTML = '<div class="loading">Loading models...</div>';
    
    setTimeout(() => {
        const mockModels = [
            { id: 1, name: 'Civic', body_style: 'Sedan' },
            { id: 2, name: 'Camry', body_style: 'Sedan' },
            { id: 3, name: 'F-150', body_style: 'Truck' }
        ];
        
        container.innerHTML = mockModels.map(m => `
            <div class="card" onclick="router.navigate('model-detail'); loadModelDetail(${m.id})">
                <div class="card-header">${m.name}</div>
                <div class="detail-row">
                    <div class="detail-label">Body Style:</div>
                    <div>${m.body_style}</div>
                </div>
            </div>
        `).join('');
    }, 500);
}

function loadModelDetail(id) {
    const container = document.getElementById('modelDetail');
    container.innerHTML = '<div class="loading">Loading model details...</div>';
    
    setTimeout(() => {
        container.innerHTML = `
            <h2>Civic</h2>
            <div class="detail-section">
                <div class="detail-row">
                    <div class="detail-label">Body Style:</div>
                    <div>Sedan</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Description:</div>
                    <div>Compact sedan with excellent fuel economy</div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Available Options</h3>
                <ul>
                    <li>Color: Blue, Red, Black, White</li>
                    <li>Transmission: Manual, Automatic</li>
                    <li>Engine: 1.5L Turbo, 2.0L I4</li>
                    <li>Trim: LX, EX, EX-L, Sport</li>
                </ul>
            </div>
            <div class="detail-section">
                <h3>Available Vehicles: 5</h3>
            </div>
        `;
    }, 500);
}

function loadAccount() {
    if (!state.currentUser) {
        router.navigate('login');
        return;
    }
    
    const container = document.getElementById('accountInfo');
    const user = state.currentUser;
    
    // Helper to get value from either uppercase or lowercase keys
    const get = (upper, lower, defaultVal = 'N/A') => {
        return user[upper] !== undefined ? user[upper] : (user[lower] !== undefined ? user[lower] : defaultVal);
    };
    
    const firstName = get('FIRST', 'first', '');
    const middleI = get('MIDDLE_I', 'middle_i', '') || '';
    const lastName = get('LAST', 'last', '');
    const fullName = `${firstName} ${middleI} ${lastName}`.trim();
    const phones = user.PHONES || user.phones || [];
    const phoneNumbers = phones.map(p => p.PHONE_NUMBER || p.phone_number || p).filter(Boolean);
    
    container.innerHTML = `
        <div class="card-header">My Account</div>
        <div class="detail-section">
            <div class="detail-row">
                <div class="detail-label">Name:</div>
                <div>${fullName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">License Number:</div>
                <div>${get('LICENSE_NUM', 'license_num')}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Credit Score:</div>
                <div>${get('CRED_SCORE', 'cred_score')}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Address:</div>
                <div>${get('STREET', 'street')}, ${get('CITY', 'city')}, ${get('STATE', 'state')} ${get('ZIP_CODE', 'zip_code')}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Phone Numbers:</div>
                <div>${phoneNumbers.length > 0 ? phoneNumbers.join(', ') : 'None'}</div>
            </div>
        </div>
    `;
}

function loadPurchases() {
    if (!state.currentUser) {
        router.navigate('login');
        return;
    }
    
    const container = document.getElementById('purchasesList');
    container.innerHTML = '<div class="loading">Loading purchase history...</div>';
    
    const customerId = state.currentUser.id || state.currentUser.CUSTOMER_ID || state.currentUser.customer_id;
    
    api.getCustomerHistory(customerId)
        .then(sales => {
            if (!sales || sales.length === 0) {
                container.innerHTML = '<div class="alert alert-info">No purchases found.</div>';
                return;
            }
            
            container.innerHTML = `
                <div class="card-header">My Purchases</div>
                <table>
                    <thead>
                        <tr>
                            <th>Sale ID</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>VIN</th>
                            <th>Year</th>
                            <th>Mileage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sales.map(sale => {
                            const saleId = sale.SALE_ID || sale.sale_id;
                            const saleDate = sale.SALE_DATE || sale.sale_date;
                            const salePrice = sale.SALE_PRICE || sale.sale_price || 0;
                            const vin = sale.VIN || sale.vin;
                            const modelYear = sale.MODEL_YEAR || sale.model_year;
                            const mileage = sale.MILEAGE || sale.mileage || 0;
                            const dateStr = saleDate ? (typeof saleDate === 'string' ? new Date(saleDate).toLocaleDateString() : new Date(saleDate).toLocaleDateString()) : 'N/A';
                            
                            return `
                                <tr>
                                    <td>${saleId}</td>
                                    <td>${dateStr}</td>
                                    <td>$${salePrice.toLocaleString()}</td>
                                    <td>${vin}</td>
                                    <td>${modelYear}</td>
                                    <td>${mileage.toLocaleString()} mi</td>
                                    <td>
                                        <button class="btn btn-primary" onclick="router.navigate('sale-detail'); loadSaleDetail(${saleId})">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        })
        .catch(err => {
            console.error('Error loading purchases:', err);
            if (err.message === 'BACKEND_NOT_AVAILABLE') {
                container.innerHTML = '<div class="alert alert-info">Backend not available. Purchase history will be available when connected to backend.</div>';
            } else {
                container.innerHTML = `<div class="alert alert-error">Error loading purchases: ${err.message}</div>`;
            }
        });
}

function loadSaleDetail(saleId) {
    const container = document.getElementById('saleDetail');
    container.innerHTML = '<div class="loading">Loading sale details...</div>';
    
    // This would need backend implementation
    setTimeout(() => {
        container.innerHTML = `
            <h2>Sale Details</h2>
            <div class="detail-section">
                <div class="detail-row">
                    <div class="detail-label">Sale ID:</div>
                    <div>${saleId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Sale Date:</div>
                    <div>2024-01-15</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Sale Price:</div>
                    <div>$25,000</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Vehicle VIN:</div>
                    <div>1HGBH41JXMN109186</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Employee:</div>
                    <div>John Smith</div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Payments</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Payment #</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>2024-01-15</td>
                            <td>$5,000</td>
                            <td>CARD</td>
                            <td>DEPOSIT</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>2024-01-20</td>
                            <td>$20,000</td>
                            <td>LOAN</td>
                            <td>FINAL</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }, 500);
}

// Employee functions
function loadEmployeeDashboard() {
    if (!state.currentEmployee) {
        router.navigate('login');
        return;
    }
    
    const container = document.getElementById('employeeStats');
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">12</div>
            <div class="stat-label">Today's Sales</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">$245,000</div>
            <div class="stat-label">Recent Payments</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">45</div>
            <div class="stat-label">Inventory Count</div>
        </div>
    `;
}

function loadEmployeeInventory() {
    if (!state.currentEmployee) {
        router.navigate('login');
        return;
    }
    
    const container = document.getElementById('employeeInventory');
    container.innerHTML = '<div class="loading">Loading inventory...</div>';
    
    setTimeout(() => {
        const mockInventory = [
            { vin: '1HGBH41JXMN109186', year: 2023, mileage: 5000, brand: 'Honda', model: 'Civic', sold: false },
            { vin: '2HGBH41JXMN109187', year: 2022, mileage: 15000, brand: 'Toyota', model: 'Camry', sold: true }
        ];
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">Unsold Vehicles</div>
                <div class="grid">
                    ${mockInventory.filter(v => !v.sold).map(v => `
                        <div class="vehicle-card" onclick="router.navigate('employee-vehicle-detail'); loadEmployeeVehicleDetail('${v.vin}')">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 200px; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">🚗</div>
                            <div class="vehicle-card-body">
                                <div class="vehicle-card-title">${v.brand} ${v.model}</div>
                                <div class="vehicle-card-info">Year: ${v.year}</div>
                                <div class="vehicle-card-info">Mileage: ${v.mileage.toLocaleString()} mi</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="card">
                <div class="card-header">Sold Vehicles</div>
                <div class="grid">
                    ${mockInventory.filter(v => v.sold).map(v => `
                        <div class="vehicle-card">
                            <div style="background: #ccc; height: 200px; display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">🚗</div>
                            <div class="vehicle-card-body">
                                <div class="vehicle-card-title">${v.brand} ${v.model}</div>
                                <div class="vehicle-card-info">Year: ${v.year}</div>
                                <div class="badge badge-warning">SOLD</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }, 500);
}

function loadEmployeeVehicleDetail(vin) {
    const container = document.getElementById('employeeVehicleDetail');
    container.innerHTML = '<div class="loading">Loading vehicle details...</div>';
    
    setTimeout(() => {
        container.innerHTML = `
            <h2>Vehicle Details (Admin View)</h2>
            <div class="detail-section">
                <div class="detail-row">
                    <div class="detail-label">VIN:</div>
                    <div>${vin}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Brand:</div>
                    <div>Honda</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Model:</div>
                    <div>Civic</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Year:</div>
                    <div>2023</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Mileage:</div>
                    <div>5,000 miles</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div><span class="badge badge-success">Available</span></div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Related Sale</h3>
                <p>No sale associated with this vehicle.</p>
            </div>
        `;
    }, 500);
}

function searchCustomers() {
    loadEmployeeCustomers();
}

function loadEmployeeCustomers() {
    if (!state.currentEmployee) {
        router.navigate('login');
        return;
    }
    
    const container = document.getElementById('employeeCustomersList');
    container.innerHTML = '<div class="loading">Loading customers...</div>';
    
    // Mock data
    setTimeout(() => {
        const mockCustomers = [
            { id: 1, name: 'John Doe', license: 'DL123456', city: 'New York', state: 'NY' },
            { id: 2, name: 'Jane Smith', license: 'DL789012', city: 'Los Angeles', state: 'CA' }
        ];
        
        container.innerHTML = `
            <div class="card-header">Customers</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>License</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockCustomers.map(c => `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.name}</td>
                            <td>${c.license}</td>
                            <td>${c.city}, ${c.state}</td>
                            <td>
                                <button class="btn btn-primary" onclick="viewCustomer(${c.id})">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }, 500);
}

function viewCustomer(id) {
    api.getCustomer(id)
        .then(customer => {
            alert(`Customer: ${customer.FIRST || customer.first} ${customer.LAST || customer.last}\nLicense: ${customer.LICENSE_NUM || customer.license_num}\nPhones: ${(customer.PHONES || []).map(p => p.PHONE_NUMBER || p.phone_number).join(', ')}`);
        })
        .catch(err => {
            alert('Error loading customer: ' + err.message);
        });
}

function loadEmployeeSales() {
    if (!state.currentEmployee) {
        router.navigate('login');
        return;
    }
    
    const container = document.getElementById('employeeSalesList');
    container.innerHTML = '<div class="loading">Loading sales...</div>';
    
    // Mock data
    setTimeout(() => {
        const mockSales = [
            { id: 1, customer: 'John Doe', vehicle: '1HGBH41JXMN109186', date: '2024-01-15', price: 25000 },
            { id: 2, customer: 'Jane Smith', vehicle: '2HGBH41JXMN109187', date: '2024-01-20', price: 30000 }
        ];
        
        container.innerHTML = `
            <div class="card-header">Sales (My Dealer)</div>
            <table>
                <thead>
                    <tr>
                        <th>Sale ID</th>
                        <th>Customer</th>
                        <th>Vehicle VIN</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockSales.map(s => `
                        <tr>
                            <td>${s.id}</td>
                            <td>${s.customer}</td>
                            <td>${s.vehicle}</td>
                            <td>${s.date}</td>
                            <td>$${s.price.toLocaleString()}</td>
                            <td>
                                <button class="btn btn-primary" onclick="router.navigate('employee-sale-detail'); loadEmployeeSaleDetail(${s.id})">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }, 500);
}

function loadEmployeeSaleDetail(saleId) {
    const container = document.getElementById('employeeSaleDetail');
    container.innerHTML = '<div class="loading">Loading sale details...</div>';
    
    setTimeout(() => {
        container.innerHTML = `
            <h2>Sale Details</h2>
            <div class="detail-section">
                <div class="detail-row">
                    <div class="detail-label">Sale ID:</div>
                    <div>${saleId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Customer:</div>
                    <div>John Doe</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Vehicle VIN:</div>
                    <div>1HGBH41JXMN109186</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Sale Date:</div>
                    <div>2024-01-15</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Sale Price:</div>
                    <div>$25,000</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Employee:</div>
                    <div>You</div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Payments</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Payment #</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>2024-01-15</td>
                            <td>$5,000</td>
                            <td>CARD</td>
                            <td>DEPOSIT</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>2024-01-20</td>
                            <td>$20,000</td>
                            <td>LOAN</td>
                            <td>FINAL</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }, 500);
}

// Registration form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        customer_id: parseInt(document.getElementById('reg_customer_id').value),
        first: document.getElementById('reg_first').value,
        middle_i: document.getElementById('reg_middle_i').value || null,
        last: document.getElementById('reg_last').value,
        street: document.getElementById('reg_street').value,
        city: document.getElementById('reg_city').value,
        state: document.getElementById('reg_state').value,
        zip_code: document.getElementById('reg_zip_code').value,
        date_of_birth: document.getElementById('reg_date_of_birth').value,
        license_num: document.getElementById('reg_license_num').value,
        phone_number: document.getElementById('reg_phone_number').value || null,
        gender: document.getElementById('reg_gender').value || null,
        income: document.getElementById('reg_income').value ? parseFloat(document.getElementById('reg_income').value) : null,
        marital_status: document.getElementById('reg_marital_status').value || null,
        dependents: document.getElementById('reg_dependents').value ? parseInt(document.getElementById('reg_dependents').value) : null,
        cred_score: document.getElementById('reg_cred_score').value ? parseInt(document.getElementById('reg_cred_score').value) : null,
        SSN: null
    };
    
    try {
        await api.createCustomer(data);
        alert('Account created successfully! Please login.');
        router.navigate('login');
    } catch (error) {
        const errorDiv = document.getElementById('registerError');
        errorDiv.textContent = error.message || 'Failed to create account';
        errorDiv.classList.remove('hidden');
    }
});

// Update navigation based on auth state
let accountLinkElement = null;
let purchasesLinkElement = null;
let loginLinkElement = null;

function updateNavigation() {
    const navLinks = document.getElementById('navLinks');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    // Remove existing customer links if they exist
    if (accountLinkElement && accountLinkElement.parentNode) {
        accountLinkElement.remove();
        accountLinkElement = null;
    }
    if (purchasesLinkElement && purchasesLinkElement.parentNode) {
        purchasesLinkElement.remove();
        purchasesLinkElement = null;
    }
    // Remove login link if it exists
    if (loginLinkElement && loginLinkElement.parentNode) {
        loginLinkElement.remove();
        loginLinkElement = null;
    }
    
    if (state.currentUser) {
        userName.textContent = `${state.currentUser.FIRST || state.currentUser.first} ${state.currentUser.LAST || state.currentUser.last}`;
        userInfo.style.display = 'flex';
        // Add customer-specific links
        accountLinkElement = document.createElement('a');
        accountLinkElement.href = '#';
        accountLinkElement.textContent = 'My Account';
        accountLinkElement.onclick = () => { router.navigate('account'); return false; };
        navLinks.insertBefore(accountLinkElement, userInfo);
        
        purchasesLinkElement = document.createElement('a');
        purchasesLinkElement.href = '#';
        purchasesLinkElement.textContent = 'My Purchases';
        purchasesLinkElement.onclick = () => { router.navigate('purchases'); return false; };
        navLinks.insertBefore(purchasesLinkElement, userInfo);
    } else if (state.currentEmployee) {
        userName.textContent = `Employee #${state.currentEmployee.id}`;
        userInfo.style.display = 'flex';
    } else {
        userInfo.style.display = 'none';
        // Add login link when not logged in
        loginLinkElement = document.createElement('a');
        loginLinkElement.href = '#';
        loginLinkElement.textContent = 'Login';
        loginLinkElement.onclick = () => { router.navigate('login'); return false; };
        navLinks.insertBefore(loginLinkElement, userInfo);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    updateHomePage();
    // Set initial page to home
    if (state.currentPage === 'login' && !state.currentUser && !state.currentEmployee) {
        state.currentPage = 'home';
        router.navigate('home');
    }
});

