// js/drama.js
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const dramaId = params.get('id');

  const titleElement = document.getElementById('dramaTitle');
  const videoElement = document.getElementById('mainVideo');
  const loadingMessage = document.getElementById('loadingMessage');
  const episodeList = document.getElementById('episodeItems');

  if (!dramaId) {
    titleElement.textContent = 'Drama tidak ditemukan';
    return;
  }

  fetch('/data/drama-detail.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal mengambil data JSON');
      }
      return response.json();
    })
    .then(data => {
      const drama = data.dramas.find(d => d.id === dramaId);

      if (!drama) {
        titleElement.textContent = 'Drama tidak ditemukan';
        return;
      }

      titleElement.textContent = drama.title;

      if (drama.episodes && drama.episodes.length > 0) {
        const firstEpisode = drama.episodes[0];
        const videoUrl = drama.source + firstEpisode.id + '.mp4';

        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
        videoElement.load();
        loadingMessage.style.display = 'none';

        drama.episodes.forEach((ep, idx) => {
          const li = document.createElement('li');
          const btn = document.createElement('button');
          btn.textContent = String(idx + 1).padStart(2, '0');
          btn.onclick = () => {
            const newUrl = drama.source + ep.id + '.mp4';
            videoElement.querySelector('source').src = newUrl;
            videoElement.load();
          };
          li.appendChild(btn);
          episodeList.appendChild(li);
        });
      } else {
        loadingMessage.textContent = 'Episode tidak tersedia';
      }
    })
    .catch(error => {
      console.error('Gagal memuat detail drama:', error);
      titleElement.textContent = 'Gagal memuat detail drama';
    });
});