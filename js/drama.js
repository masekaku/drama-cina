// drama.js

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const dramaId = params.get("id");
  const episodeId = params.get("ep");

  if (!dramaId) {
    document.body.innerHTML = "<p>Drama tidak ditemukan.</p>";
    return;
  }

  try {
    const [detailRes, videoRes] = await Promise.all([
      fetch("data/drama-detail.json"),
      fetch("data/video-source.json"),
    ]);

    const detailData = await detailRes.json();
    const videoData = await videoRes.json();

    const drama = detailData.find((d) => d.id === dramaId);
    if (!drama) {
      document.body.innerHTML = "<p>Drama tidak ditemukan.</p>";
      return;
    }

    // Render detail
    document.querySelector(".drama-title").textContent = drama.title;
    document.querySelector(".drama-description").textContent = drama.description;
    document.querySelector(".drama-thumbnail").src = drama.thumbnail;

    // Render episode list
    const episodeList = document.querySelector(".episode-list");
    episodeList.innerHTML = "";
    drama.episodes.forEach((ep) => {
      const btn = document.createElement("button");
      btn.textContent = `Episode ${ep.ep}`;
      btn.addEventListener("click", () => {
        showSafelink(dramaId, ep.ep);
      });
      episodeList.appendChild(btn);
    });

    // If episode selected, play it
    if (episodeId) {
      const epKey = `${dramaId}_ep${episodeId}`;
      const source = videoData[epKey];
      if (source) {
        showSafelink(dramaId, episodeId, source);
      } else {
        document.querySelector(".video-player").innerHTML = "<p>Video tidak tersedia.</p>";
      }
    }

  } catch (err) {
    console.error("Gagal memuat data:", err);
  }
});

function showSafelink(dramaId, ep, videoUrl = null) {
  const container = document.querySelector(".video-player");
  container.innerHTML = `
    <div class="safelink-box">
      <p>Harap tunggu <span id="countdown">5</span> detik...</p>
      <div class="ads-placeholder">[ Iklan 300x250 ]</div>
    </div>
  `;

  let timeLeft = 5;
  const countdown = document.getElementById("countdown");
  const interval = setInterval(() => {
    timeLeft--;
    countdown.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      loadVideo(dramaId, ep);
    }
  }, 1000);
}

function loadVideo(dramaId, ep) {
  fetch("data/video-source.json")
    .then((res) => res.json())
    .then((videoData) => {
      const videoKey = `${dramaId}_ep${ep}`;
      const url = videoData[videoKey];
      if (!url) {
        document.querySelector(".video-player").innerHTML = "<p>Video tidak ditemukan.</p>";
        return;
      }
      document.querySelector(".video-player").innerHTML = `
        <video controls autoplay>
          <source src="${url}" type="video/mp4">
          Browser Anda tidak mendukung tag video.
        </video>
      `;
      history.replaceState({}, "", `?id=${dramaId}&ep=${ep}`);
    })
    .catch(() => {
      document.querySelector(".video-player").innerHTML = "<p>Gagal memuat video.</p>";
    });
}