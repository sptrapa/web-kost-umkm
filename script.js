// 1. Data Kost (Mock Data Tetap)
const dataKost = [
  { id: 1, nama: "Kamar Exclusif A1", kategori: "AC", harga: 1200000, fasilitas: ["AC", "Kamar Mandi Dalam", "Wi-Fi"], tersedia: true, gambar: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80" },
  { id: 2, nama: "Kamar Standard B2", kategori: "Non-AC", harga: 700000, fasilitas: ["Kipas Angin", "Kamar Mandi Luar", "Wi-Fi"], tersedia: true, gambar: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80" },
  { id: 3, nama: "Kamar VIP C1", kategori: "AC", harga: 1500000, fasilitas: ["AC", "Kamar Mandi Dalam", "TV", "Wi-Fi"], tersedia: false, gambar: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80" }
];

// 2. STATE KITA (Jantung dari aplikasi, ala React)
let state = {
  kamar: dataKost,
  filterAktif: "semua", // bisa 'semua', 'AC', atau 'Non-AC'
  tema: localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
};

// 3. FUNGSI RENDER UTAMA (UI = f(state))
// Fungsi ini HANYA bertugas membaca State lalu menggambar HTML
function renderApp() {
  renderTema();
  renderFilterButtons();
  renderDaftarKamar();
}

function renderTema() {
  if (state.tema === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

function renderFilterButtons() {
  const filterContainer = document.getElementById("filter-container");
  if (!filterContainer) return;

  const categories = ["semua", "AC", "Non-AC"];
  filterContainer.innerHTML = categories.map(cat => {
    // Tombol akan berwarna biru (aktif) JIKA nilai 'cat' sama dengan 'state.filterAktif'
    const isActive = state.filterAktif === cat;
    const baseClass = "px-4 py-2 border rounded-lg text-sm font-medium transition capitalize";
    const activeClass = isActive 
      ? "bg-indigo-600 text-white border-indigo-600" 
      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";
    
    return `<button class="${baseClass} ${activeClass}" onclick="handleFilterChange('${cat}')">${cat}</button>`;
  }).join('');
}

function renderDaftarKamar() {
  const container = document.getElementById("kost-list");
  if (!container) return;

  // Filter data murni berdasarkan State
  const dataFiltered = state.filterAktif === "semua" 
    ? state.kamar 
    : state.kamar.filter(item => item.kategori === state.filterAktif);

  if (dataFiltered.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center py-8">Tidak ada kamar.</p>`;
    return;
  }

  container.innerHTML = dataFiltered.map(item => `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
      <img src="${item.gambar}" alt="${item.nama}" class="w-full h-48 object-cover" />
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">${item.nama}</h3>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.tersedia ? 'bg-green-100 text-green-800 dark:bg-green-900/40' : 'bg-red-100 text-red-800 dark:bg-red-900/40'}">
            ${item.tersedia ? 'Tersedia' : 'Penuh'}
          </span>
        </div>
        <p class="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-3">
          Rp ${item.harga.toLocaleString('id-ID')}
        </p>
        <div class="flex flex-wrap gap-1.5">
          ${item.fasilitas.map(f => `<span class="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded">${f}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// 4. ACTIONS (Fungsi untuk MENGUBAH State, lalu memanggil renderApp)
function handleFilterChange(kategoriBaru) {
  state.filterAktif = kategoriBaru; // 1. Ubah state
  renderApp(); // 2. Render ulang
}

function handleToggleTema() {
  state.tema = state.tema === "light" ? "dark" : "light"; // 1. Ubah state
  renderApp(); // 2. Render ulang
}

// 5. Inisialisasi Aplikasi
document.addEventListener("DOMContentLoaded", () => {
  // Pasang event listener untuk tombol tema (karena tombol ini ada di HTML statis, bukan di-render JS)
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", handleToggleTema);

  // Jalankan render pertama kali
  renderApp();
});