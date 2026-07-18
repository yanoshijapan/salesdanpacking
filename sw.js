const CACHE_NAME = 'dashops-v4'; // Naikkan versi agar HP mendeteksi update

// Daftar file yang akan disimpan di memori HP
const ASSETS_TO_CACHE = [
  './index.html',
  './packing.html',
  './manifest.json',
  './manifest_packing.json',
  './adminpacking.png'
];

// Proses Install & Caching File Baru
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Memaksa service worker baru untuk langsung aktif
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Proses Aktivasi & Hapus Cache Versi Lama (v1)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Proses Fetch (Menampilkan data dari cache jika offline)
self.addEventListener('fetch', (e) => {
  // Hanya proses request yang menggunakan metode GET
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((response) => {
      // Kembalikan file dari cache jika ada, jika tidak lakukan fetch dari internet
      return response || fetch(e.request);
    })
  );
});
