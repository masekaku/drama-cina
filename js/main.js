// js/main.js
document.addEventListener("DOMContentLoaded", function () {
  const dramaListEl = document.getElementById("dramaList");

  fetch("./data/drama-list.json")
    .then((res) => res.json())
    .then((data) => {
      data.dramas.forEach((drama) => {
        const card = document.createElement("div");
        card.className = "drama-card";
        card.innerHTML = `
          <img src="${drama.thumbnail}" alt="${drama.title}" />
          <h3>${drama.title}</h3>
        `;
        card.addEventListener("click", () => {
          window.location.href = `drama.html?id=${encodeURIComponent(drama.id)}`;
        });
        dramaListEl.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Gagal memuat daftar drama:", error);
      dramaListEl.innerHTML = "<p>Gagal memuat daftar drama.</p>";
    });
});
