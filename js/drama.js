// js/drama.js document.addEventListener("DOMContentLoaded", function () { const titleEl = document.getElementById("dramaTitle"); const videoEl = document.getElementById("mainVideo"); const episodeListEl = document.getElementById("episodeList"); const loadingMessage = document.getElementById("loadingMessage");

const baseUrls = { videy: "https://cdn.videy.co/", quax: "https://qu.ax/" };

const params = new URLSearchParams(window.location.search); const dramaId = params.get("id");

if (!dramaId) { titleEl.textContent = "Drama tidak ditemukan."; return; }

fetch("./data/drama-detail.json") .then((res) => res.json()) .then((data) => { const drama = data.dramas.find((d) => d.id === dramaId);

if (!drama) {
    titleEl.textContent = "Drama tidak ditemukan.";
    return;
  }

  titleEl.textContent = drama.title;

  // Tampilkan episode
  drama.episodes.forEach((episode, index) => {
    const btn = document.createElement("button");
    btn.textContent = (index + 1).toString().padStart(2, "0");
    btn.addEventListener("click", () => {
      const videoUrl = (baseUrls[episode.source] || baseUrls.videy) + episode.id + ".mp4";
      videoEl.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
      videoEl.load();
    });
    episodeListEl.appendChild(btn);
  });

  // Load episode pertama otomatis
  if (drama.episodes.length > 0) {
    const first = drama.episodes[0];
    const videoUrl = (baseUrls[first.source] || baseUrls.videy) + first.id + ".mp4";
    videoEl.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;
    videoEl.load();
  }

  loadingMessage.style.display = "none";
})
.catch((err) => {
  console.error("Gagal memuat detail drama:", err);
  titleEl.textContent = "Gagal memuat detail drama.";
});

});

