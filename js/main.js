document.addEventListener('DOMContentLoaded', () => {
  const dramaListContainer = document.getElementById('drama-list');

  // Pastikan element ada
  if (!dramaListContainer) {
    console.error("Elemen #drama-list tidak ditemukan di halaman.");
    return;
  }

  // Ambil data dari file JSON
  fetch('data/drama-list.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal memuat data drama');
      }
      return response.json();
    })
    .then(data => {
      // Bersihkan isi awal
      dramaListContainer.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        dramaListContainer.innerHTML = '<p>Tidak ada drama yang tersedia.</p>';
        return;
      }

      // Render setiap drama
      data.forEach(drama => {
        const dramaCard = document.createElement('div');
        dramaCard.classList.add('drama-card');

        dramaCard.innerHTML = `
          <a href="drama.html?id=${encodeURIComponent(drama.id)}">
            <img src="${drama.thumbnail}" alt="${drama.title}" loading="lazy">
            <h3>${drama.title}</h3>
            <p>${drama.description}</p>
          </a>
        `;

        dramaListContainer.appendChild(dramaCard);
      });
    })
    .catch(error => {
      console.error(error);
      dramaListContainer.innerHTML = '<p>Terjadi kesalahan saat memuat daftar drama.</p>';
    });
});