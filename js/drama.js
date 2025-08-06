// js/drama.js
const SECRET_KEY = 'a5a10fa4e4724c768b51297b4dd3a69d'; // HARUS sama dengan Python

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKey(secret) {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );
}

async function decryptVideoUrl(encryptedData, secret) {
  const json = JSON.parse(encryptedData);
  const key = await getKey(secret);
  const iv = base64ToArrayBuffer(json.iv);
  const data = base64ToArrayBuffer(json.data);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    data
  );
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const dramaId = params.get('id');

  if (!dramaId) {
    document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
    return;
  }

  try {
    const response = await fetch('./data/drama-detail.json');
    const data = await response.json();
    const drama = data.dramas.find(d => d.id === dramaId);

    if (!drama) {
      document.getElementById('dramaTitle').textContent = 'Drama tidak ditemukan';
      return;
    }

    document.getElementById('dramaTitle').textContent = drama.title;

    const mainVideo = document.getElementById('mainVideo');
    const loadingMessage = document.getElementById('loadingMessage');
    const episodeList = document.getElementById('episodeItems');

    if (drama.episodes && drama.episodes.length > 0) {
      // Tampilkan episode list
      drama.episodes.forEach((ep, idx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = String(idx + 1).padStart(2, '0');
        btn.onclick = async () => {
          loadingMessage.style.display = 'block';
          mainVideo.pause();

          const decryptedUrl = await decryptVideoUrl(ep.encrypted, SECRET_KEY);

          mainVideo.innerHTML = `<source src="${decryptedUrl}" type="video/mp4">`;
          mainVideo.load();
          mainVideo.play();
          loadingMessage.style.display = 'none';
        };
        li.appendChild(btn);
        episodeList.appendChild(li);
      });

      // Otomatis mainkan episode pertama
      const firstEpisodeUrl = await decryptVideoUrl(drama.episodes[0].encrypted, SECRET_KEY);
      mainVideo.innerHTML = `<source src="${firstEpisodeUrl}" type="video/mp4">`;
      mainVideo.load();
      mainVideo.play();
      loadingMessage.style.display = 'none';
    } else {
      loadingMessage.textContent = 'Episode tidak tersedia';
    }
  } catch (err) {
    console.error('Gagal memuat detail drama:', err);
    document.getElementById('dramaTitle').textContent = 'Gagal memuat detail drama';
  }
});