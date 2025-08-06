document.addEventListener('DOMContentLoaded', function () {
  const dramaListContainer = document.getElementById('dramaList');

  fetch('./data/drama-list.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (!data.dramas || data.dramas.length === 0) {
        dramaListContainer.innerHTML = '<p>Tidak ada drama tersedia.</p>';
        return;
      }

      data.dramas.forEach(drama => {
        const card = document.createElement('div');
        card.className = 'drama-card';

        const link = document.createElement('a');
        link.href = `./drama.html?id=${encodeURIComponent(drama.id)}`;

        const img = document.createElement('img');
        img.src = drama.thumbnail || 'https://via.placeholder.com/300x450?text=No+Image';
        img.alt = drama.title;

        const title = document.createElement('h3');
        title.textContent = drama.title;

        link.appendChild(img);
        link.appendChild(title);
        card.appendChild(link);
        dramaListContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Gagal memuat daftar drama:', err);
      dramaListContainer.innerHTML = '<p>Gagal memuat data drama.</p>';
    });
});