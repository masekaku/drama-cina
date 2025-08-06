document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("dramaListContainer");
  try {
    const response = await fetch("data/drama-list.json");
    const dramas = await response.json();
    container.innerHTML = "";
    dramas.forEach(drama => {
      const item = document.createElement("div");
      item.className = "drama-item";
      item.innerHTML = `
        <img src="${drama.thumbnail}" alt="${drama.title}" width="100%" loading="lazy" />
        <h3>${drama.title}</h3>
      `;
      item.addEventListener("click", () => {
        showSafelink(() => {
          window.location.href = `drama.html?id=${drama.id}`;
        });
      });
      container.appendChild(item);
    });
  } catch (err) {
    container.innerHTML = "<p>Gagal memuat daftar drama.</p>";
  }
});

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