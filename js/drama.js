const urlParams = new URLSearchParams(window.location.search);
const dramaId = urlParams.get("id");
const videoPlayer = document.getElementById("videoPlayer");
const videoSource = document.getElementById("videoSource");
const episodeList = document.getElementById("episodeList");
const titleElement = document.getElementById("dramaTitle");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [dramaRes, sourceRes] = await Promise.all([
      fetch("data/drama-detail.json"),
      fetch("data/video-source.json")
    ]);

    const dramaData = await dramaRes.json();
    const videoData = await sourceRes.json();

    const selectedDrama = dramaData.find(d => d.id === dramaId);
    if (!selectedDrama) {
      titleElement.textContent = "Drama tidak ditemukan.";
      return;
    }

    titleElement.textContent = selectedDrama.title;
    showEpisode(selectedDrama.episodes[0], videoData);

    selectedDrama.episodes.forEach(ep => {
      const btn = document.createElement("button");
      btn.className = "episode-button";
      btn.textContent = `Episode ${ep.episode}`;
      btn.addEventListener("click", () => {
        showSafelink(() => showEpisode(ep, videoData));
      });
      episodeList.appendChild(btn);
    });

  } catch (error) {
    titleElement.textContent = "Gagal memuat detail drama.";
  }
});

function showEpisode(ep, videoData) {
  const videoItem = videoData.find(v => v.id === ep.videoId);
  if (videoItem) {
    videoSource.src = videoItem.url;
    videoPlayer.load();
  }
}

function showSafelink(callback) {
  const modal = document.getElementById("safelinkModal");
  const countdown = document.getElementById("safelinkCountdown");
  modal.classList.remove("hidden");

  let time = 5;
  countdown.textContent = time;
  const timer = setInterval(() => {
    time--;
    countdown.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      modal.classList.add("hidden");
      callback();
    }
  }, 1000);
}