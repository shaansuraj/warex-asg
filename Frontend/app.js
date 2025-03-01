// app.js

const BASE_URL = 'http://localhost:4000';

// ========== AUTH ==========

/**
 * Signup a new user.
 * @param {string} username
 * @param {string} password
 */
async function signupUser(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Signup failed');
  }
  return true;
}

/**
 * Login a user and store token/role in localStorage.
 * @param {string} username
 * @param {string} password
 */
async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Login failed');
  }
  const data = await response.json();
  // Save token and role in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.role);
  localStorage.setItem('username', username);
  return data; // { token, role }
}

// ========== CUSTOMERS ==========

/**
 * Create a new customer.
 */
async function createCustomer(name, address) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, address })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error creating customer');
  }
}

/**
 * Fetch all customers for the logged-in user.
 */
async function loadCustomers() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/customers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error fetching customers');
  }
  const customers = await response.json();
  const tbody = document.querySelector('#customers-table tbody');
  tbody.innerHTML = '';
  customers.forEach(cust => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cust.customer_id || 'N/A'}</td>
      <td>${cust.name}</td>
      <td>${cust.address}</td>
    `;
    tbody.appendChild(row);
  });
}

// ========== SKUs ==========

/**
 * Create a new SKU.
 */
async function createSKU(sku_name, unit_of_measurement, tax_rate) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/skus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ sku_name, unit_of_measurement, tax_rate })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error creating SKU');
  }
}

/**
 * Fetch all SKUs for the logged-in user.
 */
async function loadSKUs() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/skus`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error fetching SKUs');
  }
  const skus = await response.json();
  const tbody = document.querySelector('#skus-table tbody');
  tbody.innerHTML = '';
  skus.forEach(sku => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${sku.sku_id || 'N/A'}</td>
      <td>${sku.sku_name}</td>
      <td>${sku.unit_of_measurement}</td>
      <td>${sku.tax_rate}</td>
    `;
    tbody.appendChild(row);
  });
}

// ========== ORDERS ==========

/**
 * Create a new Order.
 */
async function createOrder(customer_id, sku_id, quantity, rate) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      customer_id,
      sku_id,
      quantity,
      rate
    })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error creating order');
  }
}

/**
 * Fetch orders for the logged-in user.
 */
async function loadOrders() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error fetching orders');
  }
  const orders = await response.json();
  const tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = '';
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.order_id}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.customer?.name || 'N/A'}</td>
      <td>${order.sku?.sku_name || 'N/A'}</td>
      <td>${order.quantity}</td>
      <td>${order.rate}</td>
      <td>${order.sku?.tax_rate || 'N/A'}%</td>
      <td>${order.total_amount}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Populate the dropdowns for creating an order (Customers & SKUs).
 */
async function populateOrderDropdowns() {
  const token = localStorage.getItem('token');

  // Load customers
  let response = await fetch(`${BASE_URL}/api/customers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  let customers = await response.json();
  const customerSelect = document.getElementById('order-customer');
  customerSelect.innerHTML = '<option value="">-- Select Customer --</option>';
  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.customer_id; // pass custom ID
    opt.textContent = `${c.customer_id} - ${c.name}`;
    customerSelect.appendChild(opt);
  });

  // Load SKUs
  response = await fetch(`${BASE_URL}/api/skus`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  let skus = await response.json();
  const skuSelect = document.getElementById('order-sku');
  skuSelect.innerHTML = '<option value="">-- Select SKU --</option>';
  skus.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.sku_id; // pass custom ID
    opt.textContent = `${s.sku_id} - ${s.sku_name}`;
    skuSelect.appendChild(opt);
  });
}

// ========== ADMIN ==========

/**
 * Fetch all orders (Admin only).
 */
async function loadAllOrders() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error fetching admin orders');
  }
  const orders = await response.json();
  const tbody = document.querySelector('#admin-orders-table tbody');
  tbody.innerHTML = '';
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.order_id}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.createdBy?.username || 'N/A'}</td>
      <td>${order.customer?.name || 'N/A'}</td>
      <td>${order.sku?.sku_name || 'N/A'}</td>
      <td>${order.quantity}</td>
      <td>${order.sku?.unit_of_measurement || ''}</td>
      <td>${order.rate}</td>
      <td>${order.sku?.tax_rate || 'N/A'}%</td>
      <td>${order.total_amount}</td>
    `;
    tbody.appendChild(row);
  });
}

/**
 * Fetch hourly updates (mock or real).
 * You can adapt this to call an endpoint that returns the cron job summary if you have one.
 */
async function loadHourlyUpdates() {
  // If you have an endpoint for hourly summaries, call it here.
  // For demonstration, we’ll just mock some data or rely on console logs.
  const body = document.getElementById('hourly-updates-body');
  body.innerHTML = '';

  // Example: If your backend stores hourly summaries in a separate collection:
  // const token = localStorage.getItem('token');
  // const response = await fetch(`${BASE_URL}/api/admin/hourly-summary`, {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // const summaries = await response.json();

  // Mock data for demonstration:
  const summaries = [
    { timestamp: '2025-02-28T15:00:00Z', total_orders: 10, total_amount: 500000 },
    { timestamp: '2025-02-28T16:00:00Z', total_orders: 7, total_amount: 350000 }
  ];

  summaries.forEach(s => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(s.timestamp).toLocaleString()}</td>
      <td>${s.total_orders}</td>
      <td>${s.total_amount}</td>
    `;
    body.appendChild(row);
  });
}

/**
 * Fetch actual hourly summaries from the backend (Admin only).
 */
async function loadHourlyUpdates() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/admin/hourly-summaries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error fetching hourly summaries');
    }
    const summaries = await response.json();
  
    const body = document.getElementById('hourly-updates-body');
    body.innerHTML = '';
  
    summaries.forEach(s => {
      const row = document.createElement('tr');
      // Convert timestamp to a readable string
      const dateStr = new Date(s.timestamp).toLocaleString();
      row.innerHTML = `
        <td>${dateStr}</td>
        <td>${s.total_orders}</td>
        <td>${s.total_amount}</td>
      `;
      body.appendChild(row);
    });
  }
