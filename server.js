const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : process.env.VERCEL
    ? path.join(os.tmpdir(), 'travel-booking-app')
    : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory and db file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultDB = {
  settings: {
    businessName: "Dwarkesh Tour & Travels",
    adminPhone: "919876543210", // Default phone for WhatsApp notifications (can be changed in admin settings)
    adminPin: "1234",
    allowInstantWhatsapp: true
  },
  bookings: [
    {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      name: "Ramesh Patel",
      phone: "9825012345",
      pickup: "Ahmedabad Airport (AMD)",
      drop: "Surat City Light",
      tripType: "oneway",
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: "14:30",
      returnDate: "",
      returnTime: "",
      passengers: 3,
      vehicle: "Sedan (Dzire / Etios)",
      notes: "Need luggage carrier on top if possible",
      status: "Confirmed",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      name: "Pooja Sharma",
      phone: "9988776655",
      pickup: "Vadodara Railway Station",
      drop: "Statue of Unity, Kevadia",
      tripType: "roundtrip",
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: "08:00",
      returnDate: new Date().toISOString().split('T')[0],
      returnTime: "19:00",
      passengers: 5,
      vehicle: "SUV (Ertiga / Carens)",
      notes: "Family trip, please provide experienced driver",
      status: "New",
      createdAt: new Date(Date.now() - 1800000).toISOString()
    }
  ]
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf8');
      return defaultDB;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database:", err);
    return defaultDB;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

// Ensure database is initialized
readDB();

// --- Server-Sent Events (SSE) for Realtime Admin Notifications ---
let sseClients = [];

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

function broadcastEvent(eventType, payload) {
  const message = `data: ${JSON.stringify({ type: eventType, data: payload })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(message);
    } catch (err) {
      // client disconnected
    }
  });
}

// --- API Endpoints ---

// Public: Get basic settings (business name, admin phone for WhatsApp link)
app.get('/api/public-settings', (req, res) => {
  const db = readDB();
  res.json({
    businessName: db.settings.businessName || "Dwarkesh Tour & Travels",
    adminPhone: db.settings.adminPhone || "919876543210",
    allowInstantWhatsapp: db.settings.allowInstantWhatsapp !== false
  });
});

// Public: Submit a new booking
app.post('/api/bookings', (req, res) => {
  const {
    name,
    phone,
    pickup,
    drop,
    tripType,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    passengers,
    vehicle,
    notes
  } = req.body;

  if (!name || !phone || !pickup || !drop || !pickupDate || !pickupTime) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }

  const db = readDB();
  const newBooking = {
    id: "BK-" + Math.floor(100000 + Math.random() * 900000),
    name: name.trim(),
    phone: phone.trim(),
    pickup: pickup.trim(),
    drop: drop.trim(),
    tripType: tripType || "oneway",
    pickupDate,
    pickupTime,
    returnDate: tripType === "roundtrip" ? returnDate : "",
    returnTime: tripType === "roundtrip" ? returnTime : "",
    passengers: Number(passengers) || 1,
    vehicle: vehicle || "Sedan",
    notes: (notes || "").trim(),
    status: "New",
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  writeDB(db);

  // Trigger real-time alert to any open Admin Panels
  broadcastEvent('new-booking', newBooking);

  res.status(201).json({
    success: true,
    message: "Booking submitted successfully!",
    booking: newBooking,
    adminPhone: db.settings.adminPhone
  });
});

// Admin Authentication check helper
function verifyAdminPin(req, res, next) {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  const db = readDB();
  if (pin && String(pin) === String(db.settings.adminPin)) {
    return next();
  }
  return res.status(401).json({ error: "Invalid Admin PIN. Please authenticate." });
}

// Admin: Verify PIN
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const db = readDB();
  if (String(pin) === String(db.settings.adminPin)) {
    return res.json({ success: true, message: "Login successful!" });
  }
  return res.status(401).json({ error: "Incorrect Admin PIN" });
});

// Admin: Get all bookings & settings
app.get('/api/admin/data', verifyAdminPin, (req, res) => {
  const db = readDB();
  res.json({
    bookings: db.bookings,
    settings: {
      businessName: db.settings.businessName,
      adminPhone: db.settings.adminPhone,
      allowInstantWhatsapp: db.settings.allowInstantWhatsapp
    }
  });
});

// Admin: Update booking status
app.patch('/api/admin/bookings/:id/status', verifyAdminPin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Confirmed', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const db = readDB();
  const booking = db.bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }

  booking.status = status;
  writeDB(db);
  broadcastEvent('update-booking', booking);

  res.json({ success: true, booking });
});

// Admin: Delete a booking
app.delete('/api/admin/bookings/:id', verifyAdminPin, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLen = db.bookings.length;
  db.bookings = db.bookings.filter(b => b.id !== id);

  if (db.bookings.length === initialLen) {
    return res.status(404).json({ error: "Booking not found." });
  }

  writeDB(db);
  broadcastEvent('delete-booking', { id });
  res.json({ success: true, message: "Booking deleted successfully." });
});

// Admin: Update settings
app.post('/api/admin/settings', verifyAdminPin, (req, res) => {
  const { businessName, adminPhone, newPin } = req.body;
  const db = readDB();

  if (businessName) db.settings.businessName = businessName.trim();
  if (adminPhone) {
    // Format to digits only (e.g., 919876543210)
    let cleanPhone = adminPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    db.settings.adminPhone = cleanPhone;
  }
  if (newPin && newPin.trim().length >= 4) {
    db.settings.adminPin = newPin.trim();
  }

  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// Helper to get local network IP address (prioritizing Wi-Fi/LAN over virtual adapters)
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(interfaces)) {
    // Skip virtual adapters
    if (/virtual|vbox|vmware|vethernet|loopback|docker/i.test(name)) continue;
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (!iface.address.startsWith('192.168.56.')) {
          candidates.push(iface.address);
        }
      }
    }
  }
  return candidates[0] || '192.168.1.7';
}

// System info for Admin display
app.get('/api/system-info', (req, res) => {
  const localIp = getLocalIp();
  res.json({
    localIp,
    port: PORT,
    mobileUrl: `http://${localIp}:${PORT}`,
    laptopUrl: `http://localhost:${PORT}`
  });
});

// Serve Admin Page directly
app.get('/admin', (req, res) => {
  res.sendFile('admin.html', { root: path.join(__dirname, 'public') });
});

// Fallback to index.html
app.use((req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`=======================================================`);
    console.log(`🚀 Travel Booking System is running!`);
    console.log(`💻 Laptop / Desktop URL : http://localhost:${PORT}`);
    console.log(`📱 Mobile (Same Wi-Fi)  : http://${localIp}:${PORT}`);
    console.log(`🔐 Admin Panel URL      : http://localhost:${PORT}/admin`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
