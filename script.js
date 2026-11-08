// ==========================================
// 1. ELEMENT HTML
// ==========================================

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');


// ==========================================
// 2. DARK MODE DAN LIGHT MODE
// ==========================================

// Mengambil tema yang tersimpan di browser
const savedTheme = localStorage.getItem('theme');

// Mengambil preferensi tema perangkat
const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
).matches;

// Menentukan tema awal
let currentTheme = savedTheme ||
    (systemPrefersDark ? 'dark' : 'light');


// Fungsi untuk menerapkan tema
function applyTheme() {

    if (currentTheme === 'dark') {

        document.documentElement.classList.add('dark');
        themeIcon.textContent = '☀';

    } else {

        document.documentElement.classList.remove('dark');
        themeIcon.textContent = '☾';

    }

    // Simpan pilihan tema pengguna
    localStorage.setItem('theme', currentTheme);

}


// Event ketika tombol tema diklik
themeToggle.addEventListener('click', () => {

    currentTheme = currentTheme === 'light'
        ? 'dark'
        : 'light';

    applyTheme();

});


// ==========================================
// 3. MOBILE NAVIGATION
// ==========================================

// Membuka dan menutup menu mobile
mobileMenuButton.addEventListener('click', () => {

    const isHidden = mobileMenu.classList.contains('hidden');

    mobileMenu.classList.toggle('hidden');

    mobileMenuButton.setAttribute(
        'aria-expanded',
        String(isHidden)
    );

});


// Menutup menu setelah salah satu navigasi diklik
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileNavLinks.forEach(link => {

    link.addEventListener('click', () => {

        mobileMenu.classList.add('hidden');

        mobileMenuButton.setAttribute(
            'aria-expanded',
            'false'
        );

    });

});


// ==========================================
// 4. INISIALISASI WEBSITE
// ==========================================

applyTheme();


// ==========================================
// 5. ROOMS: DATA, FILTER, DAN SCROLL KE SAMPING
// ==========================================

const WA_NUMBER = '6287742300083';

const kostList = document.getElementById('kost-list');
const filterContainer = document.getElementById('filter-container');
const onlyAvailable = document.getElementById('only-available');

const roomArrows = document.getElementById('room-arrows');
const roomPrev = document.getElementById('room-prev');
const roomNext = document.getElementById('room-next');
const fadeLeft = document.getElementById('fade-left');
const fadeRight = document.getElementById('fade-right');
const progressWrap = document.getElementById('room-progress-wrap');
const progressBar = document.getElementById('room-progress');

// State
let roomData = [];
let activeCategory = 'Semua';


// ---------- Helper ----------

function formatRupiah(harga) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(harga);
}

// Mencegah teks dari data.json menyisipkan HTML
function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
}

const checkIcon = `
    <svg class="w-3.5 h-3.5 shrink-0 text-[#8B7355]" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12l5 5 9-10"/>
    </svg>`;

const MAX_FACILITIES = 4;


// ---------- Filter ----------

function getCategories() {
    const unique = [...new Set(roomData.map(room => room.kategori))];
    return ['Semua', ...unique];
}

function countByCategory(category) {
    return category === 'Semua'
        ? roomData.length
        : roomData.filter(room => room.kategori === category).length;
}

function renderFilters() {

    filterContainer.innerHTML = getCategories().map(category => {

        const isActive = category === activeCategory;

        return `
            <button
                type="button"
                data-category="${escapeHTML(category)}"
                aria-pressed="${isActive}"
                class="room-filter shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium
                border rounded-full transition duration-300
                ${isActive
                    ? 'bg-[#8B7355] border-[#8B7355] text-white'
                    : 'border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white'}"
            >
                ${escapeHTML(category)}
                <span class="text-xs opacity-70">${countByCategory(category)}</span>
            </button>
        `;

    }).join('');

}

// Satu event listener untuk semua tombol filter
filterContainer.addEventListener('click', event => {

    const button = event.target.closest('.room-filter');
    if (!button) return;

    activeCategory = button.dataset.category;

    renderFilters();
    renderRooms();

});

onlyAvailable.addEventListener('change', renderRooms);


// ---------- Kartu kamar ----------

function createRoomCard(room) {

    const nama = escapeHTML(room.nama);
    const kategori = escapeHTML(room.kategori);

    const message = encodeURIComponent(
        `Halo, saya ingin bertanya mengenai ${room.nama}. Apakah kamar ini masih tersedia?`
    );

    const shown = room.fasilitas.slice(0, MAX_FACILITIES);
    const extra = room.fasilitas.length - shown.length;

    const facilities = shown.map(facility => `
        <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            ${checkIcon}
            <span>${escapeHTML(facility)}</span>
        </li>
    `).join('');

    const extraFacilities = extra > 0
        ? `<li class="text-xs text-gray-500 dark:text-gray-400 pl-[22px]">+${extra} fasilitas lainnya</li>`
        : '';

    const badge = room.tersedia
        ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
              bg-green-100 text-green-700">
              <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span>Tersedia
           </span>`
        : `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
              bg-red-100 text-red-700">
              <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>Penuh
           </span>`;

    const action = room.tersedia
        ? `<a href="https://wa.me/${WA_NUMBER}?text=${message}"
              target="_blank" rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold
              bg-[#8B7355] text-white hover:bg-[#6F5940] transition duration-300">
              Hubungi via WhatsApp <span aria-hidden="true">↗</span>
           </a>`
        : `<span aria-disabled="true"
              class="flex items-center justify-center py-3 rounded-lg text-sm font-semibold
              bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed">
              Kamar Tidak Tersedia
           </span>`;

    return `
        <article class="room-card group flex flex-col flex-none snap-start
            w-[82%] sm:w-[320px] lg:w-[340px]
            overflow-hidden bg-white dark:bg-[#252522]
            border border-gray-100 dark:border-gray-800
            rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1
            transition duration-300">

            <div class="relative h-52 overflow-hidden bg-[#E9E2D6] dark:bg-[#33332F]">
                <img
                    src="${escapeHTML(room.gambar)}"
                    alt="${nama}"
                    loading="lazy"
                    draggable="false"
                    onerror="this.style.display='none'"
                    class="w-full h-full object-cover ${room.tersedia ? '' : 'grayscale opacity-80'}
                    group-hover:scale-105 transition duration-500"
                >
                <div class="absolute inset-x-0 top-0 p-4 flex items-start justify-between">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                        bg-white/90 text-[#6F5940] backdrop-blur">
                        ${kategori}
                    </span>
                    ${badge}
                </div>
            </div>

            <div class="flex flex-col flex-1 p-6">

                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    ${nama}
                </h3>

                <p class="text-2xl font-bold text-[#8B7355] mb-5">
                    ${formatRupiah(room.harga)}
                    <span class="text-xs font-normal text-gray-500 dark:text-gray-400">/ bulan</span>
                </p>

                <ul class="space-y-2 pt-5 mb-6 border-t border-gray-100 dark:border-gray-800">
                    ${facilities}
                    ${extraFacilities}
                </ul>

                <div class="mt-auto">
                    ${action}
                </div>

            </div>

        </article>
    `;
}

function renderRooms() {

    let rooms = activeCategory === 'Semua'
        ? roomData
        : roomData.filter(room => room.kategori === activeCategory);

    if (onlyAvailable.checked) {
        rooms = rooms.filter(room => room.tersedia);
    }

    if (rooms.length === 0) {

        kostList.innerHTML = `
            <div class="w-full py-16 text-center text-gray-500 dark:text-gray-400">
                <p class="font-medium mb-1">Tidak ada kamar yang cocok.</p>
                <p class="text-sm">Coba ganti kategori atau matikan filter ketersediaan.</p>
            </div>
        `;

    } else {

        kostList.innerHTML = rooms.map(createRoomCard).join('');

    }

    kostList.scrollTo({ left: 0, behavior: 'auto' });
    updateScrollUI();

}


// ---------- Kerangka saat memuat data ----------

function renderSkeleton() {

    kostList.innerHTML = Array.from({ length: 3 }, () => `
        <div class="flex-none w-[82%] sm:w-[320px] lg:w-[340px] h-[460px] rounded-2xl
            bg-[#E9E2D6] dark:bg-[#252522] animate-pulse"></div>
    `).join('');

}


// ---------- Scroll ke samping ----------

function updateScrollUI() {

    const maxScroll = kostList.scrollWidth - kostList.clientWidth;
    const hasOverflow = maxScroll > 4;
    const position = kostList.scrollLeft;

    // Panah dan indikator hanya muncul jika kamar melebihi layar
    roomArrows.classList.toggle('hidden', !hasOverflow);
    roomArrows.classList.toggle('flex', hasOverflow);
    progressWrap.classList.toggle('hidden', !hasOverflow);

    roomPrev.disabled = position <= 4;
    roomNext.disabled = position >= maxScroll - 4;

    fadeLeft.style.opacity = hasOverflow && position > 4 ? '1' : '0';
    fadeRight.style.opacity = hasOverflow && position < maxScroll - 4 ? '1' : '0';

    if (hasOverflow) {
        const ratio = kostList.clientWidth / kostList.scrollWidth;
        const thumb = Math.max(ratio * 100, 12);
        const offset = (position / maxScroll) * (100 - thumb);

        progressBar.style.width = thumb + '%';
        progressBar.style.marginLeft = offset + '%';
    }

}

let scrollTicking = false;

kostList.addEventListener('scroll', () => {

    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
        updateScrollUI();
        scrollTicking = false;
    });

}, { passive: true });

window.addEventListener('resize', updateScrollUI);

function scrollRooms(direction) {

    const card = kostList.querySelector('.room-card');
    const gap = parseFloat(getComputedStyle(kostList).columnGap) || 24;
    const step = card ? card.offsetWidth + gap : kostList.clientWidth * 0.8;

    kostList.scrollBy({ left: direction * step, behavior: 'smooth' });

}

roomPrev.addEventListener('click', () => scrollRooms(-1));
roomNext.addEventListener('click', () => scrollRooms(1));

// Navigasi keyboard (← →) saat daftar sedang fokus
kostList.addEventListener('keydown', event => {

    if (event.key === 'ArrowRight') { event.preventDefault(); scrollRooms(1); }
    if (event.key === 'ArrowLeft')  { event.preventDefault(); scrollRooms(-1); }

});


// ---------- Geser dengan mouse (desktop) ----------

let isDragging = false;
let dragMoved = false;
let startX = 0;
let startScroll = 0;

kostList.addEventListener('pointerdown', event => {

    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    isDragging = true;
    dragMoved = false;
    startX = event.clientX;
    startScroll = kostList.scrollLeft;

});

window.addEventListener('pointermove', event => {

    if (!isDragging) return;

    const distance = event.clientX - startX;

    if (Math.abs(distance) > 5 && !dragMoved) {
        dragMoved = true;
        kostList.classList.add('is-dragging');
        kostList.style.scrollSnapType = 'none';
        kostList.style.scrollBehavior = 'auto';
    }

    if (dragMoved) {
        kostList.scrollLeft = startScroll - distance;
    }

});

window.addEventListener('pointerup', () => {

    if (!isDragging) return;

    isDragging = false;
    kostList.classList.remove('is-dragging');
    kostList.style.scrollSnapType = '';
    kostList.style.scrollBehavior = '';

});

// Mencegah klik tombol WhatsApp tidak sengaja setelah menggeser
kostList.addEventListener('click', event => {

    if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
    }

}, true);


// ---------- Ambil data ----------

async function loadRooms() {

    renderSkeleton();

    try {

        const response = await fetch('data.json');

        if (!response.ok) {
            throw new Error('Gagal mengambil data kamar.');
        }

        roomData = await response.json();

        renderFilters();
        renderRooms();

    } catch (error) {

        console.error('Kesalahan:', error);

        kostList.innerHTML = `
            <div class="w-full py-12 text-center text-red-500">
                <p class="mb-4">Data kamar gagal dimuat.</p>
                <button type="button" id="retry-rooms"
                    class="px-5 py-2 text-sm border border-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-950 transition">
                    Coba lagi
                </button>
            </div>
        `;

        document.getElementById('retry-rooms')
            .addEventListener('click', loadRooms);

    }

}

loadRooms();