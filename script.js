// 1. STATE KITA (Jantung dari aplikasi, ala React)
let state = {
  kamar: [], // Array kosong, akan diisi oleh data dari fetch API
  filterAktif: "semua",
  tema: localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  isLoading: true // Menandakan data sedang dimuat
};

// 2. FUNGSI RENDER UTAMA (UI = f(state))
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
    const baseClass = "px-4 py-2 border rounded-lg text-sm font-medium transition capitalize cursor-pointer";
    const activeClass = isActive 
      ? "bg-indigo-600 text-white border-indigo-600" 
      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";
    
    return `<button class="${baseClass} ${activeClass}" onclick="handleFilterChange('${cat}')">${cat}</button>`;
  }).join('');
}

function renderDaftarKamar() {
  const container = document.getElementById("kost-list");
  if (!container) return;

  // Render status loading jika data masih di-fetch
  if (state.isLoading) {
    container.innerHTML = `<p class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 font-medium">Memuat data kamar...</p>`;
    return;
  }

  // Filter data murni berdasarkan State
  const dataFiltered = state.filterAktif === "semua" 
    ? state.kamar 
    : state.kamar.filter(item => item.kategori === state.filterAktif);

  // Jika setelah difilter hasilnya kosong
  if (dataFiltered.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">Tidak ada kamar untuk kategori ini.</p>`;
    return;
  }

  // Render UI dari data yang sudah difilter
  container.innerHTML = dataFiltered.map(item => `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition hover:shadow-lg">
      <img src="${item.gambar}" alt="${item.nama}" class="w-full h-48 object-cover" />
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">${item.nama}</h3>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.tersedia ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}">
            ${item.tersedia ? 'Tersedia' : 'Penuh'}
          </span>
        </div>
        <p class="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-3">
          Rp ${item.harga.toLocaleString('id-ID')}
        </p>
        <div class="flex flex-wrap gap-1.5">
          ${item.fasilitas.map(f => `<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">${f}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// 3. ACTIONS (Fungsi untuk MENGUBAH State, lalu memanggil renderApp)
function handleFilterChange(kategoriBaru) {
  state.filterAktif = kategoriBaru; // 1. Ubah state
  renderApp(); // 2. Render ulang
}

function handleToggleTema() {
  state.tema = state.tema === "light" ? "dark" : "light"; // 1. Ubah state
  renderApp(); // 2. Render ulang
}

// 4. FUNGSI FETCH DATA EKSTERNAL (Simulasi API API & Konsep Fullstack)
async function fetchKamarData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Gagal mengambil data dari server lokal');
    
    const data = await response.json();
    
    // Update state dengan data hasil fetch dan matikan status loading
    state.kamar = data;
    state.isLoading = false;
    
    renderApp(); // Render ulang setelah data berhasil masuk ke State
  } catch (error) {
    console.error("Error Fetching Data:", error);
    document.getElementById("kost-list").innerHTML = `
      <p class="col-span-full text-center py-8 text-red-500 font-medium">
        Gagal memuat data kost. Pastikan menjalankan proyek ini menggunakan <b>Live Server</b>.
      </p>`;
  }
}

// 5. Inisialisasi Aplikasi
document.addEventListener("DOMContentLoaded", () => {
  // Pasang event listener untuk tombol tema yang ada di HTML statis
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", handleToggleTema);

  // 1. Jalankan render pertama kali (akan menampilkan status Loading dan menyiapkan Toggle Tema)
  renderApp();
  
  // 2. Tarik data dari data.json 
  fetchKamarData();
});