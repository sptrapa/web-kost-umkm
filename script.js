// 1. Data Kost (Mock Data)
const dataKost = [
  {
    id: 1,
    nama: "Kamar Exclusif A1",
    kategori: "AC",
    harga: 1200000,
    fasilitas: ["AC", "Kamar Mandi Dalam", "Kasur Springbed", "Wi-Fi"],
    tersedia: true,
    gambar: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nama: "Kamar Standard B2",
    kategori: "Non-AC",
    harga: 700000,
    fasilitas: ["Kipas Angin", "Kamar Mandi Luar", "Kasur Foam", "Wi-Fi"],
    tersedia: true,
    gambar: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    nama: "Kamar VIP C1",
    kategori: "AC",
    harga: 1500000,
    fasilitas: ["AC", "Kamar Mandi Dalam", "TV", "Water Heater", "Wi-Fi"],
    tersedia: false,
    gambar: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80"
  }
];

// 2. Fungsi Render Daftar Kost ke DOM
function renderKostList(items) {
  const container = document.getElementById("kost-list");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">Tidak ada kamar yang cocok.</p>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition">
      <img src="${item.gambar}" alt="${item.nama}" class="w-full h-48 object-cover" />
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">${item.nama}</h3>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${item.tersedia ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}">
            ${item.tersedia ? 'Tersedia' : 'Penuh'}
          </span>
        </div>
        <p class="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-3">
          Rp ${item.harga.toLocaleString('id-ID')} <span class="text-xs font-normal text-gray-500 dark:text-gray-400">/ bulan</span>
        </p>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${item.fasilitas.map(f => `<span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">${f}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// 3. Logika Dark Mode
function setupDarkMode() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  // Cek preferensi awal
  if (localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
  renderKostList(dataKost);
  setupDarkMode();
});