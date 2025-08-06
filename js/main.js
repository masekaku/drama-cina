document.addEventListener("DOMContentLoaded", function () {
  const dramaListContainer = document.getElementById("drama-list");

  fetch("data/drama-list.json")
    .then((response) => response.json())
    .then((dramas) => {
      dramas.forEach((drama) => {
        const card = document.createElement("div");
        card.className = "drama-card";
        card.innerHTML = `
          <img src="${drama.thumbnail}" alt="${drama.title}" loading="lazy">
          <div class="drama-info">
            <h3>${drama.title}</h3>
            <p>${drama.description}</p>
            <a href="drama.html?id=${drama.id}" class="watch-button">Lihat Drama</a>
          </div>
        `;
        dramaListContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Gagal memuat daftar drama:", error);
      dramaListContainer.innerHTML = "<p>Gagal memuat drama. Silakan coba lagi nanti.</p>";
    });
});