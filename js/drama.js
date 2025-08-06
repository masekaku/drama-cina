document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const dramaId = params.get('id');

  if (!dramaId) {
    document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
    return;
  }

  Promise.all([
    fetch('./data/drama-detail.json').then(res => res.json()),
    fetch('./data/video-source.json').then(res => res.json())
  ])
  .then(([detailData, sourceData]) => {
    const drama = detailData.dramas.find(d => d.id === dramaId);
    if (!drama) {
      document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
      return;
    }

    const mainVideo = document.getElementById('mainVideo');
    const loadingMessage = document.getElementById('loadingMessage');
    const episodeList = document.getElementById('episodeItems');
    document.getElementById('dramaTitle').textContent = drama.title;

    const getVideoUrl = (episodeId) => {
      const entry = sourceData.sources.find(s => s.episodeId === episodeId);
      return entry ? entry.url : null;
    };

    const loadEpisode = (episodeId) => {
      const url = getVideoUrl(episodeId);
      if (url) {
        mainVideo.innerHTML = `<source src="${url}" type="video/mp4">`;
        mainVideo.load();
        loadingMessage.style.display = 'none';
      } else {
        loadingMessage.textContent = 'Video tidak tersedia.';
      }
    };

    if (drama.episodes.length > 0) {
      loadEpisode(drama.episodes[0].id); // Auto play episode pertama

      drama.episodes.forEach((ep, index) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = String(index + 1).padStart(2, '0');
        btn.onclick = () => loadEpisode(ep.id);
        li.appendChild(btn);
        episodeList.appendChild(li);
      });
    } else {
      loadingMessage.textContent = 'Episode tidak tersedia';
    }
  })
  .catch(err => {
    console.error('Gagal memuat data:', err);
    document.getElementById('dramaTitle').textContent = 'Gagal memuat detail drama';
  });
});