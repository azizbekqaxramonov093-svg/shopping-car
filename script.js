/* ==========================================================================
   AUTO SHOPPING - ASOSIY JAVASCRIPT VA TELEGRAM BOT INTEGRATSIYASI
   ========================================================================== */

/* ==========================================================================
   1. TELEGRAM BOT SOZLAMALARI (TOKEN VA CHAT ID)
   --------------------------------------------------------------------------
   O'zingiz yaratgan Telegram botingizning Tokeni va Chat ID raqamini 
   quyidagi qo'shtirnoqlar ichiga yozing:

   MISOL:
   const TELEGRAM_BOT_TOKEN = "7123456789:AAFlmNpQrStUvWxYz...";
   const TELEGRAM_CHAT_ID = "123456789"; // yoki kanal/guruh ID: "-100123456789"
   ========================================================================== */

const TELEGRAM_BOT_TOKEN = "9180913549:AAHYCrGSrfzECiX6bAd7G4b-25yIyEU6m1A";
const TELEGRAM_CHAT_ID = "8792430004";

/* ==========================================================================
   2. GLOBAL O'ZGARUVCHILAR VA HOLAT (STATE)
   ========================================================================== */
let allCars = typeof CARS_DATABASE !== 'undefined' ? CARS_DATABASE : [];
let filteredCars = [...allCars];
let cartItems = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;
let currentDetailCar = null;
let currentDetailAngle = 'front';

// DOM ELEMENTLARI
const carsGrid = document.getElementById('carsGrid');
const catalogCountText = document.getElementById('catalogCountText');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreWrap = document.getElementById('loadMoreWrap');
const emptyState = document.getElementById('emptyState');
const resetFilterWrap = document.getElementById('resetFilterWrap');
const resetFilterBtn = document.getElementById('resetFilterBtn');
const emptyResetBtn = document.getElementById('emptyResetBtn');

// Qidiruv va Filtrlar
const heroSearchInput = document.getElementById('heroSearchInput');
const heroFuelFilter = document.getElementById('heroFuelFilter');
const heroSearchBtn = document.getElementById('heroSearchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const brandChipsContainer = document.getElementById('brandChipsContainer');

// Savat elementlari
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
const cartCount = document.getElementById('cartCount');
const cartDrawerCount = document.getElementById('cartDrawerCount');
const cartEmptyState = document.getElementById('cartEmptyState');
const cartItemsWrap = document.getElementById('cartItemsWrap');
const cartItemsList = document.getElementById('cartItemsList');
const summaryCarCount = document.getElementById('summaryCarCount');
const summaryTotalUSD = document.getElementById('summaryTotalUSD');
const summaryTotalUZS = document.getElementById('summaryTotalUZS');
const exploreCarsBtn = document.getElementById('exploreCarsBtn');

// Buyurtma formasi
const checkoutForm = document.getElementById('checkoutForm');
const clientFullName = document.getElementById('clientFullName');
const clientPhone = document.getElementById('clientPhone');
const clientAddress = document.getElementById('clientAddress');
const clientMessage = document.getElementById('clientMessage');
const submitOrderBtn = document.getElementById('submitOrderBtn');
const botConfigAlert = document.getElementById('botConfigAlert');
const botStatusPill = document.getElementById('botStatusPill');

// Detal Modal (3 burchakli rasm)
const carDetailModal = document.getElementById('carDetailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const detailMainImg = document.getElementById('detailMainImg');
const currentAngleBadge = document.getElementById('currentAngleBadge');
const thumbFront = document.getElementById('thumbFront');
const thumbSide = document.getElementById('thumbSide');
const thumbRear = document.getElementById('thumbRear');
const detailBrandBadge = document.getElementById('detailBrandBadge');
const detailTitle = document.getElementById('detailTitle');
const detailDescription = document.getElementById('detailDescription');
const detailPriceUSD = document.getElementById('detailPriceUSD');
const detailPriceUZS = document.getElementById('detailPriceUZS');
const detailYear = document.getElementById('detailYear');
const detailFuel = document.getElementById('detailFuel');
const detailTransmission = document.getElementById('detailTransmission');
const detailEngine = document.getElementById('detailEngine');
const detailHorsepower = document.getElementById('detailHorsepower');
const detailMileage = document.getElementById('detailMileage');
const detailColor = document.getElementById('detailColor');
const detailAddToCartBtn = document.getElementById('detailAddToCartBtn');
const detailDirectCheckoutBtn = document.getElementById('detailDirectCheckoutBtn');

// Success Modal
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const successReceiptBox = document.getElementById('successReceiptBox');
const toastContainer = document.getElementById('toastContainer');

// Mobil menyu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

/* ==========================================================================
   3. MODELGA MOS SVG TASVIR GENERATORI (FALLBACK)
   --------------------------------------------------------------------------
   Agar biror internet uzilishi yoki CDN vaqtinchalik yuklanmasa, 
   hech qachon noto'g'ri mashina ko'rinmaydi. Aynan shu model va burchak aks etadi!
   ========================================================================== */
function generateCarSvg(car, angle = 'front') {
  const angleTexts = {
    front: "OLD KO'RINISHI (FRONT)",
    side: "YONBOSH KO'RINISHI (SIDE)",
    rear: "ORQA KO'RINISHI (REAR)"
  };
  const angleLabel = angleTexts[angle] || "KO'RINISH";
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0e1524"/>
          <stop offset="100%" stop-color="#182338"/>
        </linearGradient>
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="300" cy="180" r="140" fill="rgba(56, 189, 248, 0.04)"/>
      
      <!-- Car silhouette icon -->
      <g transform="translate(240, 80) scale(2.4)" fill="#38bdf8" opacity="0.85">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
        <circle cx="7.5" cy="14.5" r="1.5"/>
        <circle cx="16.5" cy="14.5" r="1.5"/>
      </g>

      <!-- Car brand and model -->
      <text x="300" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="2">
        ${car.brand.toUpperCase()}
      </text>
      <text x="300" y="260" font-family="'Space Grotesk', sans-serif" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">
        ${car.name}
      </text>
      <text x="300" y="295" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#94a3b8" text-anchor="middle">
        ${car.year} • ${car.fuelType} • ${car.engine}
      </text>

      <!-- Angle indicator pill -->
      <rect x="200" y="318" width="200" height="30" rx="15" fill="rgba(56, 189, 248, 0.15)" stroke="rgba(56, 189, 248, 0.4)"/>
      <text x="300" y="338" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
        ${angleLabel}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ==========================================================================
   4. SAHIFA YUKLANGANDA ISHGA TUSHISH
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTelegramNotice();
  renderBrandChips();
  applyFiltersAndSort();
  initCartFromStorage();
  initEventListeners();
});

function initTelegramNotice() {
  const isTokenConfigured = TELEGRAM_BOT_TOKEN && 
    TELEGRAM_BOT_TOKEN !== "SIZNING_BOT_TOKENINGIZNI_SHU_YERGA_YOZING" && 
    TELEGRAM_CHAT_ID && 
    TELEGRAM_CHAT_ID !== "SIZNING_CHAT_IDINGIZNI_SHU_YERGA_YOZING";

  if (!isTokenConfigured) {
    botConfigAlert.style.display = 'flex';
    botStatusPill.innerHTML = '<span class="status-dot" style="background:#f59e0b; box-shadow:0 0 8px #f59e0b"></span> Bot sozlanishi kutilmoqda';
    botStatusPill.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    botStatusPill.style.color = '#fbbf24';
  } else {
    botConfigAlert.style.display = 'none';
    botStatusPill.innerHTML = '<span class="status-dot"></span> Telegram Bot Faol';
  }
}

/* ==========================================================================
   5. BREND CHIP-LARINI YARATISH
   ========================================================================== */
function renderBrandChips() {
  const brands = ['Barchasi', ...new Set(allCars.map(c => c.brand))];
  brandChipsContainer.innerHTML = '';

  brands.forEach(brand => {
    const chip = document.createElement('button');
    chip.className = `brand-chip ${brand === 'Barchasi' ? 'active' : ''}`;
    chip.textContent = brand;
    chip.dataset.brand = brand;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFiltersAndSort();
    });
    brandChipsContainer.appendChild(chip);
  });
}

/* ==========================================================================
   6. FILTRLASH VA SARALASH MANTIQI
   ========================================================================== */
function applyFiltersAndSort() {
  const searchQuery = (heroSearchInput.value || '').trim().toLowerCase();
  const fuelQuery = heroFuelFilter.value;
  const categoryQuery = categoryFilter.value;
  const sortType = sortFilter.value;

  const activeChip = document.querySelector('.brand-chip.active');
  const selectedBrand = activeChip ? activeChip.dataset.brand : 'Barchasi';

  filteredCars = allCars.filter(car => {
    const matchesSearch = !searchQuery || 
      car.name.toLowerCase().includes(searchQuery) ||
      car.brand.toLowerCase().includes(searchQuery) ||
      car.category.toLowerCase().includes(searchQuery) ||
      car.engine.toLowerCase().includes(searchQuery) ||
      car.fuelType.toLowerCase().includes(searchQuery);

    const matchesBrand = (selectedBrand === 'Barchasi') || (car.brand === selectedBrand);
    const matchesFuel = !fuelQuery || (car.fuelType === fuelQuery);
    const matchesCategory = !categoryQuery || (car.category === categoryQuery);

    return matchesSearch && matchesBrand && matchesFuel && matchesCategory;
  });

  if (sortType === 'price-asc') {
    filteredCars.sort((a, b) => a.priceUSD - b.priceUSD);
  } else if (sortType === 'price-desc') {
    filteredCars.sort((a, b) => b.priceUSD - a.priceUSD);
  } else if (sortType === 'hp-desc') {
    filteredCars.sort((a, b) => b.horsepower - a.horsepower);
  } else if (sortType === 'year-desc') {
    filteredCars.sort((a, b) => b.year - a.year);
  }

  currentPage = 1;
  renderCarsGrid();
}

/* ==========================================================================
   7. MASHINALARNI KATALOGDA CHIQARISH (GRID RENDERING)
   ========================================================================== */
function renderCarsGrid() {
  const total = filteredCars.length;
  catalogCountText.innerHTML = `Ko'rsatilmoqda: <strong>${Math.min(currentPage * ITEMS_PER_PAGE, total)}</strong> / ${total} ta original avtomobil`;

  const hasFilterActive = (heroSearchInput.value.trim() !== '') || 
                          heroFuelFilter.value !== '' || 
                          categoryFilter.value !== '' ||
                          (document.querySelector('.brand-chip.active') && document.querySelector('.brand-chip.active').dataset.brand !== 'Barchasi');
  resetFilterWrap.style.display = hasFilterActive ? 'block' : 'none';

  if (total === 0) {
    carsGrid.innerHTML = '';
    emptyState.style.display = 'block';
    loadMoreWrap.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  const carsToDisplay = filteredCars.slice(0, currentPage * ITEMS_PER_PAGE);

  carsGrid.innerHTML = carsToDisplay.map(car => {
    const fallback = generateCarSvg(car, 'front');
    return `
    <article class="car-card" data-id="${car.id}">
      <div class="car-card-img-wrap" onclick="openCarDetail(${car.id})">
        <img class="car-card-img" 
             src="${car.images.front}" 
             alt="${car.name}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='${fallback}';">
        <div class="car-badges-row">
          <span class="badge-pill year">${car.year}</span>
          <span class="badge-pill fuel">${car.fuelType}</span>
        </div>
        <div class="angles-indicator" title="Ushbu mashinaning aynan o'ziga tegishli 3 ta burchagi (oldi, yon, orqa)">
          <i class="fa-solid fa-camera-rotate"></i> 3 Burchak
        </div>
      </div>

      <div class="car-card-body">
        <span class="car-brand-name">${car.brand} • ${car.category}</span>
        <h3 class="car-model-name">${car.name}</h3>

        <div class="car-specs-row">
          <div class="car-spec-mini">
            <i class="fa-solid fa-horse-head"></i>
            <span class="spec-m-val">${car.horsepower} ot k.</span>
            <span class="spec-m-title">Quvvati</span>
          </div>
          <div class="car-spec-mini">
            <i class="fa-solid fa-gauge-high"></i>
            <span class="spec-m-val">${car.engine.split(' ')[0]}</span>
            <span class="spec-m-title">Motor</span>
          </div>
          <div class="car-spec-mini">
            <i class="fa-solid fa-road"></i>
            <span class="spec-m-val">${car.mileage.includes('0') ? '0 km' : car.mileage}</span>
            <span class="spec-m-title">Yurgan</span>
          </div>
        </div>

        <div class="car-price-row">
          <div class="price-main">$${car.priceUSD.toLocaleString()}</div>
          <div class="price-uzs">≈ ${car.priceUZS.toLocaleString()} so'm</div>
        </div>

        <div class="car-card-actions">
          <button class="btn-card-detail" onclick="openCarDetail(${car.id})">
            <i class="fa-solid fa-eye"></i> 3 Burchak
          </button>
          <button class="btn-card-cart" onclick="addToCart(${car.id})">
            <i class="fa-solid fa-cart-plus"></i> Savatga
          </button>
        </div>
      </div>
    </article>
  `}).join('');

  if (currentPage * ITEMS_PER_PAGE < total) {
    loadMoreWrap.style.display = 'block';
  } else {
    loadMoreWrap.style.display = 'none';
  }
}

/* ==========================================================================
   8. 3 BURCHAKLI RASM VA MASHINA DETALLARI MODALI
   ========================================================================== */
function openCarDetail(carId) {
  const car = allCars.find(c => c.id === carId);
  if (!car) return;

  currentDetailCar = car;
  currentDetailAngle = 'front';

  detailBrandBadge.textContent = `${car.brand} • ${car.category}`;
  detailTitle.textContent = car.name;
  detailDescription.textContent = car.description;
  detailPriceUSD.textContent = `$${car.priceUSD.toLocaleString()}`;
  detailPriceUZS.textContent = `≈ ${car.priceUZS.toLocaleString()} so'm`;

  detailYear.textContent = car.year;
  detailFuel.textContent = car.fuelType;
  detailTransmission.textContent = car.transmission;
  detailEngine.textContent = car.engine;
  detailHorsepower.textContent = `${car.horsepower} ot kuchi`;
  detailMileage.textContent = car.mileage;
  detailColor.textContent = car.color;

  // Thumbnails
  const frontFallback = generateCarSvg(car, 'front');
  const sideFallback = generateCarSvg(car, 'side');
  const rearFallback = generateCarSvg(car, 'rear');

  thumbFront.src = car.images.front;
  thumbFront.onerror = () => { thumbFront.src = frontFallback; };

  thumbSide.src = car.images.side;
  thumbSide.onerror = () => { thumbSide.src = sideFallback; };

  thumbRear.src = car.images.rear;
  thumbRear.onerror = () => { thumbRear.src = rearFallback; };

  setDetailAngle('front');

  carDetailModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function setDetailAngle(angleKey) {
  if (!currentDetailCar) return;

  currentDetailAngle = angleKey;
  const imgUrl = currentDetailCar.images[angleKey] || currentDetailCar.images.front;
  
  detailMainImg.src = imgUrl;
  detailMainImg.onerror = () => {
    detailMainImg.src = generateCarSvg(currentDetailCar, angleKey);
  };

  const labels = {
    front: '<i class="fa-solid fa-eye"></i> Old ko\'rinishi',
    side: '<i class="fa-solid fa-arrows-left-right"></i> Yonbosh ko\'rinishi',
    rear: '<i class="fa-solid fa-car-rear"></i> Orqa ko\'rinishi'
  };

  currentAngleBadge.innerHTML = labels[angleKey];

  document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.angle === angleKey);
  });
  document.querySelectorAll('.thumb-item').forEach(thumb => {
    thumb.classList.toggle('active', thumb.dataset.angle === angleKey);
  });
}

function closeCarDetail() {
  carDetailModal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   9. SAVAT (CART) BOSHQARUVI
   ========================================================================== */
function initCartFromStorage() {
  try {
    const saved = localStorage.getItem('auto_shopping_cart');
    if (saved) {
      cartItems = JSON.parse(saved);
    }
  } catch (e) {
    cartItems = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  localStorage.setItem('auto_shopping_cart', JSON.stringify(cartItems));
  updateCartUI();
}

function addToCart(carId) {
  const car = allCars.find(c => c.id === carId);
  if (!car) return;

  const existing = cartItems.find(item => item.id === carId);
  if (existing) {
    showToast(`${car.name} allaqachon savatingizda mavjud!`, 'info');
  } else {
    cartItems.push(car);
    saveCartToStorage();
    showToast(`${car.name} savatga qo'shildi!`, 'success');
  }

  cartCount.style.transform = 'scale(1.4)';
  setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
}

function removeFromCart(carId) {
  cartItems = cartItems.filter(item => item.id !== carId);
  saveCartToStorage();
  showToast("Avtomobil savatdan olib tashlandi", 'info');
}

function updateCartUI() {
  const count = cartItems.length;
  cartCount.textContent = count;
  cartDrawerCount.textContent = count;
  summaryCarCount.textContent = `${count} ta`;

  if (count === 0) {
    cartEmptyState.style.display = 'block';
    cartItemsWrap.style.display = 'none';
    return;
  }

  cartEmptyState.style.display = 'none';
  cartItemsWrap.style.display = 'block';

  cartItemsList.innerHTML = cartItems.map(car => `
    <div class="cart-item-card">
      <div class="cart-item-thumb">
        <img src="${car.images.front}" alt="${car.name}" onerror="this.src='${generateCarSvg(car, 'front')}';">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-title">${car.name}</h4>
        <div class="cart-item-specs">${car.year} • ${car.fuelType} • ${car.engine}</div>
        <div class="cart-item-price">$${car.priceUSD.toLocaleString()}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${car.id})" title="O'chirish">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  const totalUSD = cartItems.reduce((sum, item) => sum + item.priceUSD, 0);
  const totalUZS = cartItems.reduce((sum, item) => sum + item.priceUZS, 0);

  summaryTotalUSD.textContent = `$${totalUSD.toLocaleString()}`;
  summaryTotalUZS.textContent = `≈ ${totalUZS.toLocaleString()} so'm`;
}

function openCartDrawer() {
  cartDrawerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  cartDrawerOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   10. BUYURTMANI TELEGRAM BOTGA YUBORISH
   ========================================================================== */
checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (cartItems.length === 0) {
    showToast("Savatingiz bo'sh! Avval avtomobil tanlang.", 'error');
    return;
  }

  const name = clientFullName.value.trim();
  const phone = clientPhone.value.trim();
  const address = clientAddress.value.trim();
  const message = clientMessage.value.trim() || "Izoh qoldirilmadi";

  let hasError = false;

  if (!name) {
    clientFullName.parentElement.classList.add('has-error');
    hasError = true;
  } else {
    clientFullName.parentElement.classList.remove('has-error');
  }

  if (!phone || phone.length < 9) {
    clientPhone.parentElement.classList.add('has-error');
    hasError = true;
  } else {
    clientPhone.parentElement.classList.remove('has-error');
  }

  if (!address) {
    clientAddress.parentElement.classList.add('has-error');
    hasError = true;
  } else {
    clientAddress.parentElement.classList.remove('has-error');
  }

  if (hasError) {
    showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", 'error');
    return;
  }

  setSubmitLoading(true);

  const totalUSD = cartItems.reduce((sum, item) => sum + item.priceUSD, 0);
  const totalUZS = cartItems.reduce((sum, item) => sum + item.priceUZS, 0);
  const orderTime = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  const mainCar = cartItems[0];
  const carPhotoUrl = mainCar.images.front;

  const carsListText = cartItems.map((car, idx) => 
    `${idx + 1}. <b>${car.name}</b> (${car.year})\n   💰 Narxi: <b>$${car.priceUSD.toLocaleString()}</b> (≈ ${car.priceUZS.toLocaleString()} so'm)\n   ⚡ Turi: ${car.fuelType} | ${car.engine}`
  ).join('\n\n');

  const telegramMessage = `
🚗 <b>AUTO SHOPPING — YANGI BUYURTMA!</b>

👤 <b>Mijoz:</b> ${name}
📞 <b>Telefon:</b> ${phone}
📍 <b>Manzil:</b> ${address}
💬 <b>Xabar/Izoh:</b> ${message}

━━━━━━━━━━━━━━━━━━━━
🚘 <b>TANLANGAN AVTOMOBIL(LAR):</b>
${carsListText}

━━━━━━━━━━━━━━━━━━━━
💵 <b>JAMI SUMMA:</b> <b>$${totalUSD.toLocaleString()}</b>
🇺🇿 <b>So'mda:</b> ≈ ${totalUZS.toLocaleString()} so'm
⏰ <b>Vaqt:</b> ${orderTime}
  `.trim();

  try {
    const isTokenConfigured = TELEGRAM_BOT_TOKEN && 
      TELEGRAM_BOT_TOKEN !== "SIZNING_BOT_TOKENINGIZNI_SHU_YERGA_YOZING" && 
      TELEGRAM_CHAT_ID && 
      TELEGRAM_CHAT_ID !== "SIZNING_CHAT_IDINGIZNI_SHU_YERGA_YOZING";

    if (isTokenConfigured) {
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          photo: carPhotoUrl,
          caption: telegramMessage,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();

      if (!result.ok) {
        const textFallbackUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(textFallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage + `\n\n🖼 <b>Avto rasmi:</b> ${carPhotoUrl}`,
            parse_mode: 'HTML'
          })
        });
      }
    } else {
      console.warn("DIQQAT: Telegram Bot Token yoki Chat ID hali kiritilmagan.");
    }

    showSuccessOrderModal({
      name,
      phone,
      address,
      cars: cartItems,
      totalUSD,
      totalUZS,
      time: orderTime
    });

    cartItems = [];
    saveCartToStorage();
    checkoutForm.reset();
    closeCartDrawer();

  } catch (err) {
    console.error("Telegramga yuborishda xatolik:", err);
    showSuccessOrderModal({
      name,
      phone,
      address,
      cars: cartItems,
      totalUSD,
      totalUZS,
      time: orderTime
    });
    cartItems = [];
    saveCartToStorage();
    checkoutForm.reset();
    closeCartDrawer();
  } finally {
    setSubmitLoading(false);
  }
});

function setSubmitLoading(isLoading) {
  const textSpan = submitOrderBtn.querySelector('.btn-text-content');
  const spinnerSpan = submitOrderBtn.querySelector('.btn-spinner');

  if (isLoading) {
    submitOrderBtn.disabled = true;
    textSpan.style.display = 'none';
    spinnerSpan.style.display = 'inline-flex';
  } else {
    submitOrderBtn.disabled = false;
    textSpan.style.display = 'inline-flex';
    spinnerSpan.style.display = 'none';
  }
}

function showSuccessOrderModal(data) {
  successReceiptBox.innerHTML = `
    <div class="receipt-item">
      <span>Buyurtmachi:</span>
      <strong>${data.name}</strong>
    </div>
    <div class="receipt-item">
      <span>Telefon:</span>
      <strong>${data.phone}</strong>
    </div>
    <div class="receipt-item">
      <span>Manzil:</span>
      <span>${data.address}</span>
    </div>
    <div class="receipt-item">
      <span>Tanlangan mashina(lar):</span>
      <strong>${data.cars.map(c => c.name).join(', ')}</strong>
    </div>
    <div class="receipt-item">
      <span>Jami summa:</span>
      <span style="color:var(--accent-cyan)">$${data.totalUSD.toLocaleString()} (≈ ${data.totalUZS.toLocaleString()} so'm)</span>
    </div>
  `;

  successModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   11. TOAST BILDIRISHNOMALARI
   ========================================================================== */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' 
    ? '<i class="fa-solid fa-circle-check" style="color:var(--accent-green)"></i>' 
    : type === 'error'
    ? '<i class="fa-solid fa-triangle-exclamation" style="color:var(--accent-red)"></i>'
    : '<i class="fa-solid fa-circle-info" style="color:var(--accent-cyan)"></i>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   12. EVENT TINGLOVCHILAR
   ========================================================================== */
function initEventListeners() {
  heroSearchBtn.addEventListener('click', applyFiltersAndSort);
  heroSearchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFiltersAndSort();
  });
  heroFuelFilter.addEventListener('change', applyFiltersAndSort);
  categoryFilter.addEventListener('change', applyFiltersAndSort);
  sortFilter.addEventListener('change', applyFiltersAndSort);

  const resetAll = () => {
    heroSearchInput.value = '';
    heroFuelFilter.value = '';
    categoryFilter.value = '';
    sortFilter.value = 'default';
    document.querySelectorAll('.brand-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.brand === 'Barchasi');
    });
    applyFiltersAndSort();
  };

  resetFilterBtn.addEventListener('click', resetAll);
  emptyResetBtn.addEventListener('click', resetAll);

  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    renderCarsGrid();
  });

  openCartBtn.addEventListener('click', openCartDrawer);
  closeCartBtn.addEventListener('click', closeCartDrawer);
  exploreCarsBtn.addEventListener('click', closeCartDrawer);

  cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cartDrawerOverlay) closeCartDrawer();
  });

  closeDetailModalBtn.addEventListener('click', closeCarDetail);
  carDetailModal.addEventListener('click', (e) => {
    if (e.target === carDetailModal) closeCarDetail();
  });

  document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setDetailAngle(btn.dataset.angle);
    });
  });

  document.querySelectorAll('.thumb-item').forEach(thumb => {
    thumb.addEventListener('click', () => {
      setDetailAngle(thumb.dataset.angle);
    });
  });

  detailAddToCartBtn.addEventListener('click', () => {
    if (currentDetailCar) addToCart(currentDetailCar.id);
  });

  detailDirectCheckoutBtn.addEventListener('click', () => {
    if (currentDetailCar) {
      addToCart(currentDetailCar.id);
      closeCarDetail();
      openCartDrawer();
    }
  });

  closeSuccessBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
  });

  clientPhone.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('998')) {
      val = '+' + val;
    } else if (val.length > 0 && !val.startsWith('+')) {
      val = '+998' + val;
    }
    e.target.value = val;
  });

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCarDetail();
      closeCartDrawer();
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
