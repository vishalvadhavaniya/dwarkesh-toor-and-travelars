// Admin Panel JavaScript - Real-time Management & Notification Engine

let adminPin = sessionStorage.getItem('admin_pin') || '';
let bookingsData = [];
let adminSettings = {};
let currentStatusFilter = 'all';
let searchQuery = '';
let soundEnabled = true;
let eventSource = null;

// Dual-Tone Pleasant Chime using Web Audio API
function playChime() {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // First tone (E5 ~ 659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Second tone (G5 ~ 784 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn("Audio playback not allowed until user interaction:", err);
  }
}

// Toggle Sound
function toggleSoundAlert() {
  soundEnabled = !soundEnabled;
  const icon = document.getElementById('soundIcon');
  const text = document.getElementById('soundText');
  if (soundEnabled) {
    icon.className = 'fa-solid fa-volume-high';
    text.innerText = 'Sound ON';
    playChime();
  } else {
    icon.className = 'fa-solid fa-volume-xmark';
    text.innerText = 'Sound OFF';
  }
}

// Handle Admin PIN Login
async function handleAdminLogin(e) {
  e.preventDefault();
  const pinInput = document.getElementById('adminPinInput');
  const pin = pinInput.value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      adminPin = pin;
      sessionStorage.setItem('admin_pin', pin);
      document.getElementById('loginOverlay').classList.add('hidden');
      document.getElementById('adminApp').classList.remove('hidden');
      loadAdminData();
      initRealtimeSSE();
    } else {
      alert("ખોટો PIN! કૃપા કરીને સાચો PIN દાખલ કરો.");
      pinInput.value = '';
      pinInput.focus();
    }
  } catch (err) {
    alert("કનેક્શન એરર. કૃપા કરીને તપાસો.");
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('admin_pin');
  window.location.reload();
}

// Load Data from Server
async function loadAdminData() {
  if (!adminPin) return;

  try {
    const res = await fetch('/api/admin/data', {
      headers: { 'x-admin-pin': adminPin }
    });

    if (res.status === 401) {
      sessionStorage.removeItem('admin_pin');
      document.getElementById('loginOverlay').classList.remove('hidden');
      document.getElementById('adminApp').classList.add('hidden');
      return;
    }

    const data = await res.json();
    bookingsData = data.bookings || [];
    adminSettings = data.settings || {};

    if (adminSettings.businessName) {
      document.getElementById('navBusinessName').innerText = adminSettings.businessName;
    }

    renderMetrics();
    renderBookings();
  } catch (err) {
    console.error("Error loading admin data:", err);
  }
}

// Initialize Realtime Server-Sent Events (SSE)
function initRealtimeSSE() {
  if (eventSource) eventSource.close();

  eventSource = new EventSource('/api/events');

  eventSource.onopen = () => {
    const badge = document.getElementById('liveBadge');
    badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span><span>Live</span>';
  };

  eventSource.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data);

      if (payload.type === 'new-booking') {
        const newBooking = payload.data;
        // Play Chime sound
        playChime();

        // Add to list if not already present
        if (!bookingsData.some(b => b.id === newBooking.id)) {
          bookingsData.unshift(newBooking);
        }

        // Show Banner Alert
        showNewBookingNotification(newBooking);

        // Re-render
        renderMetrics();
        renderBookings(newBooking.id); // Highlight this ID
      } else if (payload.type === 'update-booking') {
        const updated = payload.data;
        const index = bookingsData.findIndex(b => b.id === updated.id);
        if (index !== -1) {
          bookingsData[index] = updated;
          renderMetrics();
          renderBookings();
        }
      } else if (payload.type === 'delete-booking') {
        const { id } = payload.data;
        bookingsData = bookingsData.filter(b => b.id !== id);
        renderMetrics();
        renderBookings();
      }
    } catch (err) {
      console.error("SSE parse error:", err);
    }
  };

  eventSource.onerror = () => {
    const badge = document.getElementById('liveBadge');
    badge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30';
    badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span><span>Reconnecting</span>';
  };
}

// Show Alert Notification Banner
function showNewBookingNotification(booking) {
  const alertEl = document.getElementById('newBookingAlert');
  const alertText = document.getElementById('newBookingAlertText');
  alertText.innerText = `${booking.pickup} થી ${booking.drop} • ${booking.name} (${booking.phone}) • ${booking.vehicle}`;
  alertEl.classList.remove('hidden');
}

function dismissAlert() {
  document.getElementById('newBookingAlert').classList.add('hidden');
}

// Render Metrics
function renderMetrics() {
  const total = bookingsData.length;
  const todayStr = new Date().toISOString().split('T')[0];

  const todayCount = bookingsData.filter(b => (b.pickupDate === todayStr) || (b.createdAt && b.createdAt.startsWith(todayStr))).length;
  const newCount = bookingsData.filter(b => b.status === 'New').length;
  const confirmedCount = bookingsData.filter(b => b.status === 'Confirmed').length;

  document.getElementById('metricTotal').innerText = total;
  document.getElementById('metricToday').innerText = todayCount;
  document.getElementById('metricNew').innerText = newCount;
  document.getElementById('metricConfirmed').innerText = confirmedCount;
}

// Status Badges
function getStatusBadge(status) {
  switch (status) {
    case 'New':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> New</span>`;
    case 'Confirmed':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"><i class="fa-solid fa-check text-[10px]"></i> Confirmed</span>`;
    case 'Completed':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200"><i class="fa-solid fa-flag-checkered text-[10px]"></i> Completed</span>`;
    case 'Cancelled':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200"><i class="fa-solid fa-xmark text-[10px]"></i> Cancelled</span>`;
    default:
      return `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">${status}</span>`;
  }
}

// Format Date / Time
function formatTimeReceived(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render Bookings (Desktop Table + Mobile Cards)
function renderBookings(highlightId = null) {
  const tableBody = document.getElementById('bookingsTableBody');
  const cardsContainer = document.getElementById('bookingsMobileCards');
  const emptyState = document.getElementById('emptyState');

  // Filter Data
  let filtered = bookingsData;

  if (currentStatusFilter !== 'all') {
    filtered = filtered.filter(b => b.status === currentStatusFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(b => 
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.phone && b.phone.includes(q)) ||
      (b.pickup && b.pickup.toLowerCase().includes(q)) ||
      (b.drop && b.drop.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = '';
    cardsContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  // Build Desktop Rows
  let tableHtml = '';
  // Build Mobile Cards
  let cardsHtml = '';

  filtered.forEach(b => {
    const isHighlighted = b.id === highlightId ? 'bg-amber-50 animate-pulse' : 'hover:bg-slate-50/80';
    const cleanPhone = b.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
    
    // Pre-filled WhatsApp message for Admin to reply to customer
    const replyMsg = encodeURIComponent(
      `નમસ્તે ${b.name}! ${adminSettings.businessName || 'અમારી ટેક્સી સર્વિસ'} માં તમારું બુકિંગ (${b.id}) કન્ફર્મ કરવામાં આવ્યું છે.\n\n` +
      `📍 ક્યાંથી: ${b.pickup}\n🎯 ક્યાં: ${b.drop}\n📅 તારીખ: ${b.pickupDate} (${b.pickupTime})\n🚗 ગાડી: ${b.vehicle}\n\n` +
      `ડ્રાઈવર વિગત ટૂંક સમયમાં મોકલી આપવામાં આવશે. આભાર!`
    );
    const waUrl = `https://wa.me/${waPhone}?text=${replyMsg}`;

    // 1. Desktop Row
    tableHtml += `
      <tr class="transition ${isHighlighted}">
        <td class="py-3.5 px-4">
          <span class="font-mono font-bold text-slate-900 block">${b.id}</span>
          <span class="text-[10px] text-slate-400 block">${formatTimeReceived(b.createdAt)}</span>
        </td>
        <td class="py-3.5 px-4">
          <div class="font-bold text-slate-900 text-sm">${b.name}</div>
          <div class="text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
            <i class="fa-solid fa-phone text-[10px] text-slate-400"></i>
            <span>${b.phone}</span>
          </div>
        </td>
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-1.5 font-semibold text-slate-800">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>${b.pickup}</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            <span>${b.drop}</span>
          </div>
        </td>
        <td class="py-3.5 px-4">
          <div class="font-semibold text-slate-800">${b.pickupDate}</div>
          <div class="text-[11px] text-amber-700 font-bold">${b.pickupTime}</div>
          ${b.tripType === 'roundtrip' ? `<span class="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Return: ${b.returnDate}</span>` : ''}
        </td>
        <td class="py-3.5 px-4">
          <div class="font-semibold text-slate-800">${b.vehicle}</div>
          <div class="text-slate-400 text-[11px]">${b.passengers} મુસાફરો</div>
          ${b.notes ? `<div class="text-[11px] text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 mt-1">"${b.notes}"</div>` : ''}
        </td>
        <td class="py-3.5 px-4">
          <div class="space-y-1">
            ${getStatusBadge(b.status)}
            <select onchange="updateBookingStatus('${b.id}', this.value)" class="block text-[11px] py-1 px-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer">
              <option value="New" ${b.status === 'New' ? 'selected' : ''}>Set: New</option>
              <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Set: Confirmed</option>
              <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Set: Completed</option>
              <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Set: Cancelled</option>
            </select>
          </div>
        </td>
        <td class="py-3.5 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <!-- Direct WhatsApp Customer -->
            <a href="${waUrl}" target="_blank"
              class="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition shadow-sm" title="WhatsApp Customer">
              <i class="fa-brands fa-whatsapp text-sm"></i>
            </a>
            <!-- Call Customer -->
            <a href="tel:${b.phone}"
              class="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center transition shadow-sm" title="Call">
              <i class="fa-solid fa-phone text-xs"></i>
            </a>
            <!-- Delete -->
            <button type="button" onclick="deleteBooking('${b.id}')"
              class="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 flex items-center justify-center transition" title="Delete">
              <i class="fa-regular fa-trash-can text-xs"></i>
            </button>
          </div>
        </td>
      </tr>
    `;

    // 2. Mobile Touch Card
    cardsHtml += `
      <div class="p-4 space-y-3 ${isHighlighted}">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">${b.id}</span>
            <span class="text-[10px] text-slate-400">${formatTimeReceived(b.createdAt)}</span>
          </div>
          ${getStatusBadge(b.status)}
        </div>

        <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-bold text-sm text-slate-900">${b.name}</h4>
              <p class="font-mono text-xs text-slate-500">${b.phone}</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-slate-800 block">${b.pickupDate}</span>
              <span class="text-[11px] text-amber-700 font-bold block">${b.pickupTime}</span>
            </div>
          </div>

          <div class="text-xs space-y-1 pt-1 border-t border-slate-200/60">
            <div class="flex items-center gap-1.5 text-slate-800">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-medium">${b.pickup}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-600">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              <span>${b.drop}</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>🚗 ${b.vehicle} (${b.passengers} P)</span>
            <span class="capitalize font-semibold text-slate-700">${b.tripType}</span>
          </div>

          ${b.notes ? `<p class="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl">"${b.notes}"</p>` : ''}
        </div>

        <!-- Action Row on Mobile -->
        <div class="flex items-center justify-between gap-2 pt-1">
          <select onchange="updateBookingStatus('${b.id}', this.value)" class="text-xs py-2 px-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 flex-1 focus:ring-1 focus:ring-amber-500">
            <option value="New" ${b.status === 'New' ? 'selected' : ''}>Status: New</option>
            <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Status: Confirmed</option>
            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Status: Completed</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Status: Cancelled</option>
          </select>

          <a href="${waUrl}" target="_blank"
            class="py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i class="fa-brands fa-whatsapp text-sm"></i>
            <span>WhatsApp</span>
          </a>

          <a href="tel:${b.phone}"
            class="py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-phone text-xs"></i>
            <span>Call</span>
          </a>

          <button type="button" onclick="deleteBooking('${b.id}')"
            class="p-2 text-red-400 hover:text-red-600 rounded-xl">
            <i class="fa-regular fa-trash-can text-sm"></i>
          </button>
        </div>
      </div>
    `;
  });

  tableBody.innerHTML = tableHtml;
  cardsContainer.innerHTML = cardsHtml;
}

// Update Status API
async function updateBookingStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': adminPin
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      const data = await res.json();
      const item = bookingsData.find(b => b.id === id);
      if (item) item.status = newStatus;
      renderMetrics();
      renderBookings();
    } else {
      alert("Status update failed.");
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
}

// Delete Booking API
async function deleteBooking(id) {
  if (!confirm(`શું તમે આ બુકિંગ (${id}) ખરેખર ડિલીટ કરવા માંગો છો?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-pin': adminPin }
    });

    if (res.ok) {
      bookingsData = bookingsData.filter(b => b.id !== id);
      renderMetrics();
      renderBookings();
    } else {
      alert("Delete failed.");
    }
  } catch (err) {
    console.error("Error deleting:", err);
  }
}

// Filter Tabs
function filterByStatus(status) {
  currentStatusFilter = status;
  document.querySelectorAll('.status-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-status') === status) {
      btn.className = 'status-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white transition whitespace-nowrap active';
    } else {
      btn.className = 'status-tab-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition whitespace-nowrap';
    }
  });
  renderBookings();
}

// Search
function handleSearch(val) {
  searchQuery = val.trim();
  renderBookings();
}

// Export to CSV
function exportToCSV() {
  if (bookingsData.length === 0) {
    alert("કોઈ ડેટા નથી!");
    return;
  }

  const headers = ['Booking ID', 'Customer Name', 'Phone', 'Pickup', 'Drop', 'Trip Type', 'Date', 'Time', 'Return Date', 'Return Time', 'Vehicle', 'Passengers', 'Notes', 'Status', 'Received Time'];
  
  const csvRows = [headers.join(',')];

  bookingsData.forEach(b => {
    const row = [
      `"${b.id}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${b.phone || ''}"`,
      `"${(b.pickup || '').replace(/"/g, '""')}"`,
      `"${(b.drop || '').replace(/"/g, '""')}"`,
      `"${b.tripType || ''}"`,
      `"${b.pickupDate || ''}"`,
      `"${b.pickupTime || ''}"`,
      `"${b.returnDate || ''}"`,
      `"${b.returnTime || ''}"`,
      `"${(b.vehicle || '').replace(/"/g, '""')}"`,
      `"${b.passengers || ''}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${b.status || ''}"`,
      `"${b.createdAt || ''}"`
    ];
    csvRows.push(row.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Settings Modal
function openSettingsModal() {
  document.getElementById('settingBusinessName').value = adminSettings.businessName || '';
  document.getElementById('settingAdminPhone').value = adminSettings.adminPhone || '';
  document.getElementById('settingNewPin').value = '';
  document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettingsModal() {
  document.getElementById('settingsModal').classList.add('hidden');
}

async function handleSaveSettings(e) {
  e.preventDefault();
  const businessName = document.getElementById('settingBusinessName').value.trim();
  const adminPhone = document.getElementById('settingAdminPhone').value.trim();
  const newPin = document.getElementById('settingNewPin').value.trim();

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-pin': adminPin
      },
      body: JSON.stringify({
        businessName,
        adminPhone,
        newPin: newPin || undefined
      })
    });

    if (res.ok) {
      const data = await res.json();
      adminSettings = data.settings;
      if (newPin) {
        adminPin = newPin;
        sessionStorage.setItem('admin_pin', newPin);
      }
      document.getElementById('navBusinessName').innerText = businessName;
      closeSettingsModal();
      alert("સેટિંગ્સ સફળતાપૂર્વક અપડેટ થઈ ગયા!");
    } else {
      alert("Failed to save settings.");
    }
  } catch (err) {
    alert("Network error while saving settings.");
  }
}

// Copy Mobile URL to Clipboard
function copyMobileUrl() {
  const url = document.getElementById('txtMobileUrl').innerText;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('btnCopyText');
    btn.innerText = 'Copied!';
    setTimeout(() => { btn.innerText = 'Copy Link'; }, 2000);
  }).catch(() => {
    alert("Copied: " + url);
  });
}

// Fetch System Info (Local Wi-Fi IP)
async function fetchSystemInfo() {
  try {
    const res = await fetch('/api/system-info');
    if (res.ok) {
      const data = await res.json();
      const el = document.getElementById('txtMobileUrl');
      if (el) el.innerText = data.mobileUrl;
    }
  } catch (err) {
    console.warn("Could not fetch system info:", err);
  }
}

// Auto-check PIN on load
document.addEventListener('DOMContentLoaded', () => {
  fetchSystemInfo();
  if (adminPin) {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('adminApp').classList.remove('hidden');
    loadAdminData();
    initRealtimeSSE();
  }
});
