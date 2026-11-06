
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
