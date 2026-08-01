const API_BASE_URL = 'http://localhost:3000/api';

const state = {
  medicines: [],
  orderId: null,
  alerts: []
};

const els = {
  medicineForm: document.getElementById('medicine-form'),
  medicineName: document.getElementById('medicine-name'),
  medicineCategory: document.getElementById('medicine-category'),
  medicineManufacturer: document.getElementById('medicine-manufacturer'),
  medicinePrice: document.getElementById('medicine-price'),
  medicineExpiry: document.getElementById('medicine-expiry'),
  medicineQuantity: document.getElementById('medicine-quantity'),
  medicineReorder: document.getElementById('medicine-reorder'),
  medicineStatus: document.getElementById('medicine-status'),
  medicineList: document.getElementById('medicine-list'),
  stockForm: document.getElementById('stock-form'),
  stockMedicineId: document.getElementById('stock-medicine-id'),
  stockQuantity: document.getElementById('stock-quantity'),
  stockStatus: document.getElementById('stock-status'),
  orderForm: document.getElementById('order-form'),
  orderCustomerName: document.getElementById('order-customer-name'),
  orderCustomerPhone: document.getElementById('order-customer-phone'),
  orderMedicineSelect: document.getElementById('order-medicine-select'),
  orderMedicineQuantity: document.getElementById('order-medicine-quantity'),
  addOrderItemButton: document.getElementById('add-order-item'),
  orderItems: document.getElementById('order-items'),
  orderStatus: document.getElementById('order-status'),
  orderDetails: document.getElementById('order-details'),
  alertsList: document.getElementById('alerts-list'),
  alertsStatus: document.getElementById('alerts-status')
};

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? '#dc2626' : '#0f766e';
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function renderMedicines() {
  if (!state.medicines.length) {
    els.medicineList.innerHTML = '<li class="muted">No medicines yet.</li>';
    return;
  }

  els.medicineList.innerHTML = state.medicines.map((medicine) => `
    <li>
      <strong>${medicine.name}</strong>
      <span>Category: ${medicine.category}</span>
      <span>Stock: ${medicine.quantity} · Reorder: ${medicine.reorder_level}</span>
      <span>Price: $${Number(medicine.price).toFixed(2)}</span>
      <span>Expiry: ${medicine.expiry_date}</span>
    </li>
  `).join('');
}

function populateMedicineOptions() {
  els.stockMedicineId.innerHTML = state.medicines
    .map((medicine) => `<option value="${medicine.id}">${medicine.name}</option>`)
    .join('');

  els.orderMedicineSelect.innerHTML = state.medicines
    .map((medicine) => `<option value="${medicine.id}">${medicine.name}</option>`)
    .join('');
}

function buildOrderItems() {
  const rows = Array.from(els.orderItems.querySelectorAll('li'));
  return rows.map((row) => ({
    medicine_id: Number(row.dataset.medicineId),
    quantity: Number(row.querySelector('input').value)
  })).filter((item) => item.medicine_id && item.quantity > 0);
}

function addOrderItemRow(medicineId, quantity = 1) {
  const li = document.createElement('li');
  li.dataset.medicineId = medicineId;
  li.innerHTML = `
    <span>${state.medicines.find((item) => item.id === medicineId)?.name || 'Medicine'}</span>
    <input type="number" min="1" value="${quantity}" />
    <button type="button" class="danger" data-remove-item="${medicineId}">Remove</button>
  `;
  els.orderItems.appendChild(li);
}

async function loadMedicines() {
  try {
    const response = await apiRequest('/medicines');
    state.medicines = response.data || [];
    renderMedicines();
    populateMedicineOptions();
  } catch (error) {
    setStatus(els.medicineStatus, error.message, true);
  }
}

async function loadAlerts() {
  try {
    const response = await apiRequest('/alerts/low-stock');
    state.alerts = response.data || [];
    if (!state.alerts.length) {
      els.alertsList.innerHTML = '<li class="muted">No low-stock alerts.</li>';
      return;
    }

    els.alertsList.innerHTML = state.alerts.map((medicine) => `
      <li>
        <strong>${medicine.name}</strong>
        <span>Quantity: ${medicine.quantity} · Reorder: ${medicine.reorder_level}</span>
      </li>
    `).join('');
  } catch (error) {
    setStatus(els.alertsStatus, error.message, true);
  }
}

els.medicineForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    name: els.medicineName.value.trim(),
    category: els.medicineCategory.value.trim(),
    manufacturer: els.medicineManufacturer.value.trim(),
    price: Number(els.medicinePrice.value),
    expiry_date: els.medicineExpiry.value,
    quantity: Number(els.medicineQuantity.value),
    reorder_level: Number(els.medicineReorder.value)
  };

  try {
    setStatus(els.medicineStatus, 'Adding medicine...');
    await apiRequest('/medicines', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    els.medicineForm.reset();
    setStatus(els.medicineStatus, 'Medicine added successfully.');
    await loadMedicines();
    await loadAlerts();
  } catch (error) {
    setStatus(els.medicineStatus, error.message, true);
  }
});

els.stockForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const medicineId = els.stockMedicineId.value;
  const quantity = Number(els.stockQuantity.value);

  try {
    setStatus(els.stockStatus, 'Updating stock...');
    await apiRequest(`/medicines/${medicineId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    els.stockForm.reset();
    setStatus(els.stockStatus, 'Stock updated successfully.');
    await loadMedicines();
    await loadAlerts();
  } catch (error) {
    setStatus(els.stockStatus, error.message, true);
  }
});

els.orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    customer_name: els.orderCustomerName.value.trim(),
    customer_phone: els.orderCustomerPhone.value.trim(),
    items: buildOrderItems()
  };

  if (!payload.items.length) {
    setStatus(els.orderStatus, 'Please add at least one medicine.', true);
    return;
  }

  try {
    setStatus(els.orderStatus, 'Placing order...');
    const response = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    state.orderId = response.data?.id;
    els.orderForm.reset();
    els.orderItems.innerHTML = '';
    setStatus(els.orderStatus, `Order placed successfully. ID: ${state.orderId}`);
    await loadMedicines();
    await loadAlerts();
    await viewOrderDetails();
  } catch (error) {
    setStatus(els.orderStatus, error.message, true);
  }
});

els.orderItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-item]');
  if (!button) return;
  const medicineId = Number(button.dataset.removeItem);
  const currentItems = Array.from(els.orderItems.children);
  const index = currentItems.findIndex((item) => Number(item.dataset.medicineId) === medicineId);
  if (index !== -1) {
    currentItems[index].remove();
  }
});

async function viewOrderDetails() {
  if (!state.orderId) {
    els.orderDetails.textContent = 'No order selected.';
    return;
  }

  try {
    const response = await apiRequest(`/orders/${state.orderId}`);
    const order = response.data;
    els.orderDetails.textContent = JSON.stringify(order, null, 2);
  } catch (error) {
    setStatus(els.orderStatus, error.message, true);
  }
}

els.addOrderItemButton.addEventListener('click', () => {
  const medicineId = Number(els.orderMedicineSelect.value);
  const quantity = Number(els.orderMedicineQuantity.value);

  if (!medicineId || quantity <= 0) {
    setStatus(els.orderStatus, 'Select a valid medicine and quantity.', true);
    return;
  }

  addOrderItemRow(medicineId, quantity);
  setStatus(els.orderStatus, 'Item added to the order.');
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadMedicines();
  await loadAlerts();
});

window.addEventListener('load', async () => {
  await viewOrderDetails();
});
