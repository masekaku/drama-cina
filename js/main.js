// main.js

document.addEventListener("DOMContentLoaded", () => {
  fetch('data/drama-list.json')
    .then(response => response.json())
    .then(data => {
      const container = document.querySelector('.drama-list');
      data.forEach(drama => {
        const card = document.createElement('div');
        card.className = 'drama-card';
        card.innerHTML = `
          <img src="${drama.thumbnail}" alt="${drama.title}">
          <h3>${drama.title}</h3>
        `;
        card.addEventListener('click', () => {
          window.location.href = `drama.html?id=${encodeURIComponent(drama.id)}`;
        });
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Gagal memuat daftar drama:", error);
    });
});