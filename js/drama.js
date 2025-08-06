// drama.js
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const dramaId = params.get('id');

  if (!dramaId) {
    document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
    return;
  }

  // Pastikan path sesuai, gunakan path absolut dari root
  fetch('/data/drama-detail.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const drama = data.dramas.find(d => d.id === dramaId);

      if (!drama) {
        document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
        return;
      }

      // Tampilkan judul drama
      document.getElementById('dramaTitle').textContent = drama.title;

      const mainVideo = document.getElementById('mainVideo');
      const loadingMessage = document.getElementById('loadingMessage');

      if (drama.episodes && drama.episodes.length > 0) {
        const firstEpisodeId = drama.episodes[0].id;
        const videoUrl = drama.source + firstEpisodeId + '.mp4';

        // Muat episode pertama
        mainVideo.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        mainVideo.load();
        loadingMessage.style.display = 'none';

        // Daftar episode
        const episodeList = document.getElementById('episodeItems');
        drama.episodes.forEach((ep, idx) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.textContent = String(idx + 1).padStart(2, '0');
          btn.onclick = () => {
            const newUrl = drama.source + ep.id + '.mp4';
            mainVideo.querySelector('source').src = newUrl;
            mainVideo.load();
          };
          li.appendChild(btn);
          episodeList.appendChild(li);
        });
      } else {
        loadingMessage.textContent = 'Episode tidak tersedia';
      }
    })
    .catch(err => {
      console.error('Gagal memuat detail drama:', err);
      document.getElementById('dramaTitle').textContent = 'Gagal memuat detail drama';
    });
});