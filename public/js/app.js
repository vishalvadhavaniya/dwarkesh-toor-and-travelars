// Client App JavaScript - Responsive & Multi-language

let currentLang = 'gu';
let tripType = 'oneway';
let adminPhone = '919876543210';
let businessName = 'Dwarkesh Tour & Travels';

const translations = {
  gu: {
    tagline: 'ટેક્સી અને ટ્રાવેલ સર્વિસ',
    badgeText: 'ઇન્સ્ટન્ટ બુકિંગ • ૨૪x૭ ઉપલબ્ધ',
    heroTitle: 'તમારા સફરની <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">ઓનલાઇન ટેક્સી</span> બુક કરો',
    heroSubtitle: 'ક્યાંથી ક્યાં જવું છે, તારીખ અને સમય પસંદ કરો. ગણતરીની મિનિટોમાં કન્ફર્મેશન મેળવો.',
    oneWay: 'વન વે (One Way)',
    roundTrip: 'રાઉન્ડ ટ્રીપ (Round Trip)',
    lblPickup: 'ક્યાંથી ઉપડવું છે? (Pickup Location)',
    lblDrop: 'ક્યાં જવું છે? (Drop Location)',
    quickSelect: 'ઝડપી પસંદગી:',
    lblDateTimeHeader: 'સફરની તારીખ અને સમય',
    lblPickupDate: 'ઉપડવાની તારીખ (Date) *',
    lblPickupTime: 'સમય (Time) *',
    lblReturnHeader: 'પરત ફરવાની તારીખ અને સમય',
    lblReturnDate: 'પરત આવવાની તારીખ',
    lblReturnTime: 'પરત આવવાનો સમય',
    lblSelectCar: 'ગાડી પસંદ કરો (Select Vehicle)',
    lblContactDetails: 'મુસાફરની વિગત (Contact Details)',
    lblName: 'તમારું પૂરું નામ (Full Name)',
    lblPhone: 'મોબાઇલ / WhatsApp નંબર',
    lblPassengers: 'કુલ મુસાફરો (Passengers)',
    lblNotes: 'ખાસ નોંધ / સામાનની વિગત (વૈકલ્પિક)',
    btnSubmit: 'હમણાં બુક કરો (Book Now)',
    privacyNotice: 'તમારી વિગત સુરક્ષિત છે અને તરત એડમિન પાસે પહોંચી જશે.',
    feat1: 'ઝડપી કન્ફર્મેશન',
    feat2: 'અનુભવી ડ્રાઈવર',
    feat3: 'વાજબી ભાવ',
    feat4: '૨૪/૭ સપોર્ટ',
    successTitle: 'બુકિંગ સફળતાપૂર્વક મોકલાઈ ગયું!',
    successSubtitle: 'તમારો ડેટા એડમિન પાસે સેવ થઈ ગયો છે.',
    btnSendWhatsapp: 'WhatsApp પર સીધો મેસેજ મોકલો',
    btnClose: 'બંધ કરો (Close)'
  },
  hi: {
    tagline: 'टैक्सी और ट्रेवल सर्विस',
    badgeText: 'इंस्टेंट बुकिंग • २४x७ उपलब्ध',
    heroTitle: 'अपने सफर के लिए <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">ऑनलाइन टैक्सी</span> बुक करें',
    heroSubtitle: 'कहाँ से कहाँ जाना है, तारीख और समय चुनें। तुरंत कन्फर्मेशन पाएं।',
    oneWay: 'वन वे (One Way)',
    roundTrip: 'राउंड ट्रिप (Round Trip)',
    lblPickup: 'कहाँ से चलना है? (Pickup Location)',
    lblDrop: 'कहाँ जाना है? (Drop Location)',
    quickSelect: 'जल्दी चुनें:',
    lblDateTimeHeader: 'सफर की तारीख और समय',
    lblPickupDate: 'यात्रा की तारीख (Date) *',
    lblPickupTime: 'समय (Time) *',
    lblReturnHeader: 'वापसी की तारीख और समय',
    lblReturnDate: 'वापसी की तारीख',
    lblReturnTime: 'वापसी का समय',
    lblSelectCar: 'गाड़ी चुनें (Select Vehicle)',
    lblContactDetails: 'सवारी का विवरण (Contact Details)',
    lblName: 'आपका पूरा नाम (Full Name)',
    lblPhone: 'मोबाइल / WhatsApp नंबर',
    lblPassengers: 'कुल यात्री (Passengers)',
    lblNotes: 'विशेष निर्देश / सामान की जानकारी (वैकल्पिक)',
    btnSubmit: 'अभी बुक करें (Book Now)',
    privacyNotice: 'आपका डेटा सुरक्षित है और तुरंत एडमिन तक पहुंच जाएगा।',
    feat1: 'तुरंत पुष्टि',
    feat2: 'अनुभवी ड्राइवर',
    feat3: 'उचित किराया',
    feat4: '२४/७ सहायता',
    successTitle: 'बुकिंग सफलतापूर्वक दर्ज हो गई!',
    successSubtitle: 'आपका डेटा एडमिन के पास सुरक्षित पहुंच गया है।',
    btnSendWhatsapp: 'WhatsApp पर तुरंत मैसेज भेजें',
    btnClose: 'बंद करें (Close)'
  },
  en: {
    tagline: 'Cab & Taxi Service',
    badgeText: 'Instant Booking • 24x7 Available',
    heroTitle: 'Book Your Ride with <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Best Comfort</span>',
    heroSubtitle: 'Select pickup, destination, date & time. Get immediate confirmation.',
    oneWay: 'One Way Trip',
    roundTrip: 'Round Trip',
    lblPickup: 'Where from? (Pickup Location)',
    lblDrop: 'Where to? (Drop Location)',
    quickSelect: 'Quick Select:',
    lblDateTimeHeader: 'Journey Date & Time',
    lblPickupDate: 'Pickup Date *',
    lblPickupTime: 'Pickup Time *',
    lblReturnHeader: 'Return Date & Time',
    lblReturnDate: 'Return Date',
    lblReturnTime: 'Return Time',
    lblSelectCar: 'Select Vehicle',
    lblContactDetails: 'Passenger & Contact Details',
    lblName: 'Full Name',
    lblPhone: 'Mobile / WhatsApp Number',
    lblPassengers: 'Total Passengers',
    lblNotes: 'Special Instructions / Luggage (Optional)',
    btnSubmit: 'Confirm & Book Now',
    privacyNotice: 'Your request is secured and immediately sent to Admin.',
    feat1: 'Instant Confirmation',
    feat2: 'Verified Drivers',
    feat3: 'Transparent Rates',
    feat4: '24/7 Support',
    successTitle: 'Booking Request Submitted!',
    successSubtitle: 'Your request has been saved and forwarded to Admin.',
    btnSendWhatsapp: 'Send via WhatsApp to Confirm',
    btnClose: 'Close'
  }
};

// Set Language function
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('user_lang', lang);

  // Update Buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active', 'bg-amber-500', 'text-slate-950');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('active', 'bg-amber-500', 'text-slate-950');
      btn.classList.add('text-slate-400');
    }
  });

  // Update Text Elements
  const dict = translations[lang] || translations.gu;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });
}

// Select Trip Type
function selectTripType(type) {
  tripType = type;
  const btnOneWay = document.getElementById('btnOneWay');
  const btnRoundTrip = document.getElementById('btnRoundTrip');
  const roundTripFields = document.getElementById('roundTripFields');
  const returnDate = document.getElementById('returnDate');
  const returnTime = document.getElementById('returnTime');

  if (type === 'roundtrip') {
    btnRoundTrip.className = 'flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-white text-slate-900 shadow-sm';
    btnRoundTrip.querySelector('i').className = 'fa-solid fa-arrows-rotate text-amber-500';
    btnOneWay.className = 'flex-1 py-3 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all text-slate-600 hover:text-slate-900';
    btnOneWay.querySelector('i').className = 'fa-solid fa-arrow-right text-slate-400';

    roundTripFields.classList.remove('hidden');
    returnDate.required = true;
    returnTime.required = true;
  } else {
    btnOneWay.className = 'flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-white text-slate-900 shadow-sm';
    btnOneWay.querySelector('i').className = 'fa-solid fa-arrow-right text-amber-500';
    btnRoundTrip.className = 'flex-1 py-3 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all text-slate-600 hover:text-slate-900';
    btnRoundTrip.querySelector('i').className = 'fa-solid fa-arrows-rotate text-slate-400';

    roundTripFields.classList.add('hidden');
    returnDate.required = false;
    returnTime.required = false;
  }
}

// Quick Chip setters
function setPickup(val) {
  document.getElementById('pickupInput').value = val;
}
function setDrop(val) {
  document.getElementById('dropInput').value = val;
}

// Swap Pickup & Drop
function swapLocations() {
  const p = document.getElementById('pickupInput');
  const d = document.getElementById('dropInput');
  const temp = p.value;
  p.value = d.value;
  d.value = temp;
}

// Vehicle Selection card styling
document.querySelectorAll('.car-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.car-card').forEach(c => {
      c.classList.remove('border-amber-500', 'bg-amber-50/40', 'selected');
      c.classList.add('border-slate-200', 'bg-white');
    });
    card.classList.add('border-amber-500', 'bg-amber-50/40', 'selected');
    card.classList.remove('border-slate-200', 'bg-white');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

// Setup default date and time
function initDateTime() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  const pickupDateInput = document.getElementById('pickupDate');
  const returnDateInput = document.getElementById('returnDate');
  if (pickupDateInput) {
    pickupDateInput.min = minDate;
    pickupDateInput.value = minDate;
  }
  if (returnDateInput) {
    returnDateInput.min = minDate;
    returnDateInput.value = minDate;
  }

  // Next round hour for time
  const nextHour = (today.getHours() + 1) % 24;
  const timeStr = `${String(nextHour).padStart(2, '0')}:00`;
  const pickupTimeInput = document.getElementById('pickupTime');
  if (pickupTimeInput) {
    pickupTimeInput.value = timeStr;
  }
  const returnTimeInput = document.getElementById('returnTime');
  if (returnTimeInput) {
    returnTimeInput.value = timeStr;
  }
}

// Fetch public settings (Business Name, Admin Phone)
async function fetchPublicSettings() {
  try {
    const res = await fetch('/api/public-settings');
    if (res.ok) {
      const data = await res.json();
      if (data.adminPhone) adminPhone = data.adminPhone;
      if (data.businessName) {
        businessName = data.businessName;
        document.getElementById('headerBusinessName').innerText = businessName;
        document.getElementById('footerBusinessName').innerText = businessName;
        document.title = `${businessName} | Online Cab Booking`;
      }
    }
  } catch (err) {
    console.warn("Could not fetch public settings, using defaults.", err);
  }
}

// Handle Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const pickup = document.getElementById('pickupInput').value.trim();
  const drop = document.getElementById('dropInput').value.trim();
  const pickupDate = document.getElementById('pickupDate').value;
  const pickupTime = document.getElementById('pickupTime').value;
  const returnDate = document.getElementById('returnDate').value;
  const returnTime = document.getElementById('returnTime').value;
  const custName = document.getElementById('custName').value.trim();
  const custPhone = document.getElementById('custPhone').value.trim();
  const passengers = document.getElementById('passengerCount').value;
  const custNotes = document.getElementById('custNotes').value.trim();
  const vehicle = document.querySelector('input[name="vehicle"]:checked')?.value || 'Sedan (Dzire / Etios)';

  if (!pickup || !drop || !pickupDate || !pickupTime || !custName || !custPhone) {
    alert("કૃપા કરીને બધી વિગતો ભરો. (Please fill all required fields)");
    return;
  }

  const btn = document.getElementById('btnSubmitBooking');
  const btnText = document.getElementById('btnSubmitText');
  const originalHtml = btnText.innerHTML;

  btn.disabled = true;
  btnText.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> બુકિંગ મોકલાઈ રહ્યું છે...`;

  const payload = {
    pickup,
    drop,
    tripType,
    pickupDate,
    pickupTime,
    returnDate: tripType === 'roundtrip' ? returnDate : '',
    returnTime: tripType === 'roundtrip' ? returnTime : '',
    name: custName,
    phone: custPhone,
    passengers,
    vehicle,
    notes: custNotes
  };

  try {
    let response;
    try {
      response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (firstErr) {
      console.warn("First attempt failed, retrying after brief pause...", firstErr);
      await new Promise(r => setTimeout(r, 1000));
      response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();

    if (response.ok && result.success) {
      if (result.adminPhone) adminPhone = result.adminPhone;
      showSuccessModal(result.booking);
    } else {
      alert("Error: " + (result.error || "Could not save booking."));
    }
  } catch (err) {
    console.error("Booking submission error:", err);
    // Fallback: If network failed, provide direct WhatsApp booking option so data is never lost!
    const fallbackBooking = {
      id: "BK-" + Math.floor(100000 + Math.random() * 900000),
      ...payload
    };
    alert("સર્વર સાથે કનેક્ટ થવામાં ક્ષણિક તકલીફ આવી, પણ તમારું બુકિંગ સીધું WhatsApp પર મોકલી શકાય છે!");
    showSuccessModal(fallbackBooking);
  } finally {
    btn.disabled = false;
    btnText.innerHTML = originalHtml;
  }
}

// Show Success Modal & Prepare WhatsApp link
function showSuccessModal(booking) {
  document.getElementById('modalBookingId').innerText = booking.id;
  document.getElementById('modalPickup').innerText = booking.pickup;
  document.getElementById('modalDrop').innerText = booking.drop;
  document.getElementById('modalDate').innerText = booking.pickupDate;
  document.getElementById('modalTime').innerText = booking.pickupTime;
  document.getElementById('modalVehicle').innerText = booking.vehicle;

  // Format WhatsApp message to send directly to Admin
  const tripTypeText = booking.tripType === 'roundtrip' 
    ? `Round Trip (Return: ${booking.returnDate} at ${booking.returnTime})` 
    : 'One Way';

  let rawMessage = `*🚕 NEW CAB BOOKING REQUEST*
━━━━━━━━━━━━━━━━━━
🆔 *Booking ID:* ${booking.id}
👤 *Customer Name:* ${booking.name}
📱 *Phone:* ${booking.phone}
📍 *Pickup:* ${booking.pickup}
🎯 *Drop:* ${booking.drop}
📅 *Date:* ${booking.pickupDate}
⏰ *Time:* ${booking.pickupTime}
🔄 *Trip Type:* ${tripTypeText}
🚗 *Vehicle:* ${booking.vehicle}
👥 *Passengers:* ${booking.passengers}
📝 *Notes:* ${booking.notes || 'None'}
━━━━━━━━━━━━━━━━━━
_Please confirm my ride and share driver details._`;

  const encodedMsg = encodeURIComponent(rawMessage);
  // WhatsApp click link to Admin phone number
  const waUrl = `https://wa.me/${adminPhone}?text=${encodedMsg}`;

  const btnWa = document.getElementById('btnModalWhatsApp');
  btnWa.href = waUrl;

  // Show Modal
  const modal = document.getElementById('successModal');
  modal.classList.remove('hidden');
}

function closeModalAndReset() {
  document.getElementById('successModal').classList.add('hidden');
  document.getElementById('bookingForm').reset();
  initDateTime();
  selectTripType('oneway');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initDateTime();
  fetchPublicSettings();
  const savedLang = localStorage.getItem('user_lang') || 'gu';
  setLanguage(savedLang);
});
