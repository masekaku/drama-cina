const urlParams = new URLSearchParams(window.location.search);
const dramaId = urlParams.get('id');
const episodeParam = urlParams.get('episode') || '1';

let currentEpisode = episodeParam;

async function loadDramaDetail() {
  const res = await fetch('data/drama-detail.json');
  const data = await res.json();
  const drama = data.find(d => d.id === dramaId);

  if (!drama) return;

  document.getElementById('drama-title').textContent = drama.title;

  loadEpisodes(drama.episodes);
  playEpisode(currentEpisode, drama.episodes);
}

function loadEpisodes(episodes) {
  const container = document.getElementById('episode-list');
  episodes.forEach(ep => {
    const btn = document.createElement('button');
    btn.textContent = `Episode ${ep.episode}`;
    btn.addEventListener('click', () => showSafelink(ep.episode, ep.url));
    container.appendChild(btn);
  });
}

function showSafelink(episode, videoUrl) {
  const overlay = document.getElementById('safelink-overlay');
  const countdownEl = document.getElementById('safelink-countdown');
  overlay.classList.remove('hidden');

  let timeLeft = 5;
  countdownEl.textContent = timeLeft;

  const interval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(interval);
      overlay.classList.add('hidden');
      document.getElementById('video-player').src = videoUrl;
      currentEpisode = episode;
    }
  }, 1000);
}

function playEpisode(episodeNumber, episodes) {
  const episode = episodes.find(ep => ep.episode == episodeNumber);
  if (episode) {
    document.getElementById('video-player').src = episode.url;
  }
}

loadDramaDetail();