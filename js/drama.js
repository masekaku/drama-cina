// drama.js

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const dramaId = params.get('id');

  if (!dramaId) {
    document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
    return;
  }

  fetch('./data/drama-detail.json')
    .then(response => response.json())
    .then(data => {
      const drama = data.dramas.find(d => d.id === dramaId);

      if (!drama) {
        document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
        return;
      }

      const baseUrls = {
        videy: 'https://cdn.videy.co/',
        quax: 'https://qu.ax/'
      };

      document.getElementById('dramaTitle').textContent = drama.title;

      const mainVideo = document.getElementById('mainVideo');
      const loadingMessage = document.getElementById('loadingMessage');

      if (drama.episodes && drama.episodes.length > 0) {
        // Load episode pertama
        loadEpisode(drama.episodes[0].id);

        // Tampilkan daftar episode
        const episodeList = document.getElementById('episodeItems');
        drama.episodes.forEach((ep, idx) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.textContent = String(idx + 1).padStart(2, '0');
          btn.onclick = () => {
            loadEpisode(ep.id);
          };
          li.appendChild(btn);
          episodeList.appendChild(li);
        });
      } else {
        loadingMessage.textContent = 'Episode tidak tersedia';
      }

      function loadEpisode(episodeId) {
        const sourceBase = baseUrls[drama.source] || baseUrls.videy;
        const videoUrl = sourceBase + episodeId + ".mp4";

        mainVideo.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        mainVideo.load();
        loadingMessage.style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Gagal memuat detail drama:', err);
      document.getElementById('dramaTitle').textContent = 'Gagal memuat detail drama';
    });
});