# 🚖 Online Cab & Travel Booking System (ઓનલાઇન ટ્રાવેલ બુકિંગ સિસ્ટમ)

A modern, responsive, full-stack travel & cab booking web application designed to run smoothly on both **Laptop/Desktop** and **Mobile smartphones**.

---

## 🌟 મુખ્ય સુવિધાઓ (Key Features)

### ૧. ક્લાયન્ટ માટે (Client Booking Experience):
- 📱 **Mobile & Laptop Optimized**: ફોન અને લેપટોપ બંનેમાં એપ જેવો સરળ અનુભવ.
- 🌐 **મલ્ટિ-લેંગ્વેજ (Multi-language)**: એક ક્લિકથી ગુજરાતી, हिंदी, અથવા English માં સ્વિચ કરો.
- 📍 **સફરની પસંદગી**: ક્યાંથી ઉપડવું (Pickup), ક્યાં જવું છે (Drop), ઝડપી સિટી શોર્ટકટ્સ.
- 🔄 **વન વે / રાઉન્ડ ટ્રીપ (One-way / Round-trip)** વિકલ્પ.
- 📅 **તારીખ અને સમય સિલેક્ટર**: આજના દિવસથી જ સહેલાઈથી તારીખ અને સમય પસંદ કરો.
- 🚗 **ગાડીની પસંદગી**: Sedan (Dzire), SUV (Ertiga), Innova Crysta, કે Hatchback.
- 💬 **ડાયરેક્ટ WhatsApp કન્ફર્મેશન**: ક્લાયન્ટ જેવું સબમિટ કરે કે તરત જ બધી વિગત સાથે એડમિનના WhatsApp પર સીધો મેસેજ મોકલવાનો વિકલ્પ.

### ૨. એડમિન માટે (Admin Management & Notifications):
- 🔐 **સુરક્ષિત એડમિન પેનલ (PIN Login)**: ડિફોલ્ટ પિન `1234`.
- 🔔 **રિયલ-ટાઇમ એલર્ટ (Live SSE & Audio Chime)**: કોઈ પણ ક્લાયન્ટ ફોર્મ ભરશે કે તરત જ પેજ રીફ્રેશ કર્યા વગર ઘંટડી (Ding-Dong chime sound) વાગશે અને નવી એન્ટ્રી સ્ક્રીન પર આવી જશે.
- 📊 **ડેશબોર્ડ સ્ટેટિસ્ટિક્સ**: આજના બુકિંગ, કુલ બુકિંગ, પેન્ડિંગ અને કન્ફર્મ થયેલા ઓર્ડર્સ.
- 📞 **૧-ક્લિક કોલ અને WhatsApp**: ગ્રાહકને સીધો ફોન અથવા WhatsApp પર કન્ફર્મેશન મેસેજ મોકલો.
- ⚙️ **સેટિંગ્સ**: તમારો પોતાનો WhatsApp નંબર, કંપનીનું નામ અને PIN સરળતાથી બદલો.
- 📑 **Export to CSV / Excel**: તમામ બુકિંગ ડેટા એક્સેલ ફાઈલ તરીકે ડાઉનલોડ કરો.
- 💾 **ઓટોમેટિક સેવ**: તમામ ડેટા `data/db.json` માં સુરક્ષિત રીતે સેવ રહે છે.

---

## 🚀 શરૂ કરવા માટેની લિંક્સ (Quick Access URLs)

સર્વર હાલમાં ચાલુ છે:

- **💻 લેપટોપ / કોમ્પ્યુટરમાં ખોલવા માટે:**
  - ક્લાયન્ટ બુકિંગ સાઇટ: [http://localhost:3000](http://localhost:3000)
  - એડમિન પેનલ: [http://localhost:3000/admin](http://localhost:3000/admin) *(PIN: `1234`)*

- **📱 તમારા મોબાઇલ ફોનમાં ખોલવા માટે (સેમ વાઇ-ફાઇ પર):**
  - બ્રાઉઝરમાં ખોલો: [http://192.168.1.7:3000](http://192.168.1.7:3000)
  - એડમિન પેનલ: [http://192.168.1.7:3000/admin](http://192.168.1.7:3000/admin)

## Deployment

For Node.js hosts, install dependencies with `npm install` and start the app with `npm start`. The server listens on the `PORT` environment variable provided by the host.

Vercel serves the pages from `public/` and runs the Express app as a function. Its JSON database is placed in `/tmp` because the deployed project directory is read-only. Vercel temporary storage is not persistent, so use a hosted database if bookings must survive function restarts.

---

## 🛠️ પ્રોજેક્ટ સ્ટ્રક્ચર (Project Structure)

```
travel-booking-app/
├── server.js            # Node.js Express બેકએન્ડ + SSE રિયલ-ટાઇમ સર્વર
├── package.json         # પ્રોજેક્ટ ડિપેન્ડન્સી
├── start-app.bat        # ડબલ ક્લિકથી સર્વર ચાલુ કરવાની સ્ક્રિપ્ટ
├── data/
│   └── db.json          # સેવ થયેલા તમામ બુકિંગ અને સેટિંગ્સ ડેટાબેઝ
└── public/
    ├── index.html       # ક્લાયન્ટ બુકિંગ પેજ (મોબાઇલ + લેપટોપ)
    ├── admin.html       # એડમિન ડેશબોર્ડ મેનેજમેન્ટ પેજ
    ├── manifest.json    # PWA મોબાઇલ એપ સપોર્ટ
    ├── css/
    │   └── style.css    # કસ્ટમ ડિઝાઇન અને એનિમેશન
    └── js/
        ├── app.js       # ક્લાયન્ટ વેલિડેશન અને WhatsApp કનેક્શન
        └── admin.js     # એડમિન રિયલ-ટાઇમ સાઉન્ડ અને ફિલ્ટરિંગ
```
