
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
// 5. ROOM DATA DAN HORIZONTAL SCROLLING
// ==========================================

const kostList = document.getElementById('kost-list');
const filterContainer = document.getElementById('filter-container');

// Menyimpan seluruh data kamar
let roomData = [];

// Format harga menjadi Rupiah
function formatRupiah(harga) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(harga);
}

// Membuat tombol filter
function renderFilters() {

    const categories = ['Semua', 'AC', 'Non-AC'];

    filterContainer.innerHTML = categories.map(category => `
        <button
            type="button"
            data-category="${category}"
            class="room-filter px-5 py-2 text-sm border border-[#8B7355]
            rounded-full transition duration-300
            ${category === 'Semua'
                ? 'bg-[#8B7355] text-white'
                : 'text-[#8B7355] hover:bg-[#8B7355] hover:text-white'}"
        >
            ${category}
        </button>
    `).join('');

    // Event tombol filter
    document.querySelectorAll('.room-filter').forEach(button => {

        button.addEventListener('click', () => {

            const selectedCategory = button.dataset.category;

            // Mengubah tampilan tombol aktif
            document.querySelectorAll('.room-filter').forEach(btn => {
                btn.classList.remove('bg-[#8B7355]', 'text-white');

                btn.classList.add('text-[#8B7355]');
            });

            button.classList.add('bg-[#8B7355]', 'text-white');
            button.classList.remove('text-[#8B7355]');

            // Menampilkan kamar sesuai kategori
            renderRooms(selectedCategory);

            // Kembali ke posisi awal
            kostList.scrollTo({
                left: 0,
                behavior: 'smooth'
            });

        });

    });

}


// Menampilkan kartu kamar
function renderRooms(category = 'Semua') {

    const filteredRooms = category === 'Semua'
        ? roomData
        : roomData.filter(room => room.kategori === category);

    // Jika kamar tidak ditemukan
    if (filteredRooms.length === 0) {

        kostList.innerHTML = `
            <div class="w-full py-12 text-center text-gray-500">
                Tidak ada kamar dalam kategori ini.
            </div>
        `;

        return;
    }

    // Membuat kartu kamar
    kostList.innerHTML = filteredRooms.map(room => {

        const statusClass = room.tersedia
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';

        const statusText = room.tersedia
            ? 'Tersedia'
            : 'Tidak Tersedia';

        const facilities = room.fasilitas.map(facility => `
            <span class="text-xs bg-[#F1ECE4] dark:bg-[#33332F]
            text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">
                ${facility}
            </span>
        `).join('');

        const message = encodeURIComponent(
            `Halo, saya ingin bertanya mengenai ${room.nama}. Apakah kamar ini masih tersedia?`
        );

        return `
            <article class="
                flex-none w-[85%] sm:w-[320px]
                snap-start overflow-hidden
                bg-white dark:bg-[#252522]
                border border-gray-100 dark:border-gray-800
                rounded-xl shadow-sm
                hover:shadow-lg transition duration-300
            ">

                <!-- GAMBAR KAMAR -->
                <div class="relative h-56 overflow-hidden">

                    <img
                        src="${room.gambar}"
                        alt="${room.nama}"
                        loading="lazy"
                        class="w-full h-full object-cover
                        hover:scale-105 transition duration-500"
                    >

                    <span class="
                        absolute top-4 right-4
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${statusClass}
                    ">
                        ${statusText}
                    </span>

                </div>

                <!-- INFORMASI KAMAR -->
                <div class="p-6">

                    <p class="text-xs uppercase tracking-widest
                    text-[#8B7355] mb-2">
                        ${room.kategori}
                    </p>

                    <h3 class="text-lg font-semibold
                    text-gray-900 dark:text-white mb-3">
                        ${room.nama}
                    </h3>

                    <p class="text-xl font-bold text-[#8B7355] mb-5">
                        ${formatRupiah(room.harga)}
                        <span class="text-xs font-normal text-gray-500">
                            / bulan
                        </span>
                    </p>

                    <!-- FASILITAS -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${facilities}
                    </div>

                    <!-- TOMBOL WHATSAPP -->
                    <a
                        href="${room.tersedia
                            ? `https://wa.me/6287742300083?text=${message}`
                            : '#'}"
                        ${room.tersedia
                            ? 'target="_blank" rel="noopener noreferrer"'
                            : 'aria-disabled="true"'}
                        class="
                            block text-center py-3 rounded-lg text-sm font-semibold
                            transition duration-300
                            ${room.tersedia
                                ? 'bg-[#8B7355] text-white hover:bg-[#6F5940]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        "
                    >
                        ${room.tersedia
                            ? 'Hubungi Kami'
                            : 'Kamar Tidak Tersedia'}
                    </a>

                </div>

            </article>
        `;

    }).join('');

}


// Mengambil data kamar dari JSON
async function loadRooms() {

    try {

        const response = await fetch('data.json');

        if (!response.ok) {
            throw new Error('Gagal mengambil data kamar.');
        }

        roomData = await response.json();

        // Membuat filter dan kartu kamar
        renderFilters();
        renderRooms();

    } catch (error) {

        console.error('Kesalahan:', error);

        kostList.innerHTML = `
            <div class="w-full py-12 text-center text-red-500">
                Data kamar gagal dimuat.
                Silakan periksa file data.json.
            </div>
        `;

    }

}


// Menjalankan sistem kamar
loadRooms();

