document.addEventListener('DOMContentLoaded', function () {
  fetch('./data/drama-list.json')
    .then(response => response.json())
    .then(data => {
      const dramaListContainer = document.getElementById('dramaList');
      data.dramas.forEach(drama => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `drama.html?id=${drama.id}`;
        a.textContent = drama.title;
        a.style.color = '#ff6600';
        a.style.textDecoration = 'none';

        a.onmouseover = () => a.style.textDecoration = 'underline';
        a.onmouseout = () => a.style.textDecoration = 'none';

        li.appendChild(a);
        dramaListContainer.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Gagal memuat daftar drama:', error);
      const container = document.getElementById('dramaList');
      container.innerHTML = '<li>Gagal memuat daftar drama.</li>';
    });
});