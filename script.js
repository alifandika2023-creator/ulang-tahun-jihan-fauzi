
/* DATA LOGIN */
const CONFIG = {
  username: "jihan",
  password: "2210"
};

/* PINDAH HALAMAN */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const screen = document.getElementById(screenId);

  if (screen) {
    screen.classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* MUSIK */
const birthdayMusic = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");

async function playMusic() {
  try {
    await birthdayMusic.play();
    musicButton.textContent = "🎵 Pause Music";
  } catch (error) {
    musicButton.textContent = "🎵 Play Music";
  }
}

function toggleMusic() {
  if (birthdayMusic.paused) {
    playMusic();
  } else {
    birthdayMusic.pause();
    musicButton.textContent = "🎵 Play Music";
  }
}

/* LOGIN */
document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  if (username === CONFIG.username && password === CONFIG.password) {
    errorMessage.textContent = "";

    showScreen("loading");
    playMusic();

    setTimeout(() => {
      showScreen("main");
      celebrateHearts(25);
    }, 2200);
  } else {
    errorMessage.textContent =
      "Username atau password salah nih! Coba lagi yaa 💗";
  }
});

/* API LILIN */
let candlesOff = false;
let micStream = null;
let micAudioContext = null;
let micSource = null;
let micAnalyser = null;
let micCheckTimer = null;
let blowStartedAt = 0;

function setCandlesOff(off) {
  const flames = document.getElementById("flames");
  const blowButton = document.getElementById("blowButton");
  const cakeHint = document.getElementById("cakeHint");

  candlesOff = off;
  flames.classList.toggle("off", off);

  blowButton.textContent = off
    ? "✨ Nyalakan Lagi"
    : "🌬️ Tiup Lilinnya!";

  if (off) {
    cakeHint.textContent =
      "YAY! 🎉 Make a wish, Jihan! Semoga impianmu tercapai 💗";

    celebrateHearts(35);
    stopMicBlow();
  } else {
    cakeHint.textContent =
      "Yuk, tiup lilinnya dan buat permohonan! 💗";
  }
}

function blowCandles() {
  setCandlesOff(!candlesOff);
}

/* TIUP LILIN MENGGUNAKAN MIKROFON */
async function startMicBlow() {
  const micButton = document.getElementById("micButton");
  const cakeHint = document.getElementById("cakeHint");

  if (micStream) {
    stopMicBlow();
    cakeHint.textContent = "Mikrofon dimatikan. 💗";
    return;
  }

  if (!navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia) {
    cakeHint.textContent =
      "Mikrofon perlu HTTPS atau localhost. Gunakan tombol tiup manual yaa! 💗";
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    micAudioContext = new AudioContextClass();
    await micAudioContext.resume();

    micSource = micAudioContext.createMediaStreamSource(micStream);
    micAnalyser = micAudioContext.createAnalyser();
    micAnalyser.fftSize = 1024;

    micSource.connect(micAnalyser);

    micButton.textContent = "⏹️ Matikan Mic";
    cakeHint.textContent =
      "Mikrofon aktif! Tiup ke arah mic selama sebentar yaa 🌬️";

    blowStartedAt = 0;
    monitorMic();
  } catch (error) {
    cakeHint.textContent =
      "Izin mikrofon belum diberikan atau mic tidak tersedia. Pakai tombol manual yaa 💗";

    stopMicBlow();
  }
}

function monitorMic() {
  if (!micAnalyser || candlesOff) return;

  const samples = new Uint8Array(micAnalyser.fftSize);

  micAnalyser.getByteTimeDomainData(samples);

  let sum = 0;

  for (let i = 0; i < samples.length; i++) {
    const value = (samples[i] - 128) / 128;
    sum += value * value;
  }

  const rms = Math.sqrt(sum / samples.length);
  const threshold = 0.19;

  if (rms > threshold) {
    if (!blowStartedAt) {
      blowStartedAt = Date.now();
    }

    if (Date.now() - blowStartedAt > 650) {
      setCandlesOff(true);

      document.getElementById("cakeHint").textContent =
        "Tiupan terdeteksi! Lilinnya mati! 🎉💗";

      return;
    }
  } else {
    blowStartedAt = 0;
  }

  micCheckTimer = requestAnimationFrame(monitorMic);
}

function stopMicBlow() {
  if (micCheckTimer) {
    cancelAnimationFrame(micCheckTimer);
  }

  micCheckTimer = null;

  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
  }

  micStream = null;

  if (micSource) {
    try {
      micSource.disconnect();
    } catch (error) {}
  }

  micSource = null;
  micAnalyser = null;

  if (micAudioContext) {
    micAudioContext.close().catch(() => {});
  }

  micAudioContext = null;

  const micButton = document.getElementById("micButton");

  if (micButton) {
    micButton.textContent = "🎙️ Tiup pakai mic";
  }
}

/* POPUP HADIAH, SURAT, GALERI */
function showPopup(id) {
  const popup = document.getElementById(id);

  if (popup) {
    popup.classList.add("show");
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);

  if (popup) {
    popup.classList.remove("show");
  }
}

function openGift() {
  showPopup("giftPopup");
  celebrateHearts(25);
}

function openLetter() {
  showPopup("letterPopup");
  celebrateHearts(15);
}

function openGallery() {
  showPopup("galleryPopup");
}

function openSecret() {
  showPopup("secretPopup");
}

/* TUTUP POPUP DENGAN KLIK DI LUAR */
document.querySelectorAll(".popup").forEach(popup => {
  popup.addEventListener("click", function(event) {
    if (event.target === popup) {
      popup.classList.remove("show");
    }
  });
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".popup.show").forEach(popup => {
      popup.classList.remove("show");
    });
  }
});

/* GALERI FOTO */
function enlargePhoto(src, caption) {
  const enlargedImage = document.getElementById("enlargedImage");
  const enlargedCaption = document.getElementById("enlargedCaption");

  enlargedImage.onerror = function() {
    this.onerror = null;
    this.src = "foto.jpg";
  };

  enlargedImage.src = src;
  enlargedCaption.textContent = caption;

  showPopup("photoPopup");
}

/* PESAN RAHASIA */
const secretMessages = [
  "Salah satu hal yang bikin kamu istimewa adalah caramu menjadi diri sendiri. Kamu nggak harus sempurna untuk layak disayangi, Jihan. 💖",

  "Alif berharap kamu selalu punya alasan untuk tersenyum, berani mengejar impianmu, dan dikelilingi orang-orang yang tulus menyayangimu. 🌷",

  "Kalau kamu sedang lelah, istirahatlah sebentar. Kamu nggak harus menghadapi semuanya sekaligus. Kamu tetap berharga, bahkan di hari-hari yang berat. 🫶"
];

function showSecret(index) {
  document.getElementById("secretMessage").textContent =
    secretMessages[index];

  celebrateHearts(8);
}

/* ANIMASI HATI */
function celebrateHearts(amount) {
  const container = document.getElementById("hearts");
  const emojis = ["💗", "💖", "💕", "💘", "🌸", "✨"];

  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent =
      emojis[Math.floor(Math.random() * emojis.length)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (15 + Math.random() * 22) + "px";
    heart.style.animationDuration = (4 + Math.random() * 4) + "s";

    container.appendChild(heart);

    setTimeout(() => heart.remove(), 8500);
  }
}

/* HATI KECIL YANG TERBANG */
setInterval(() => {
  const container = document.getElementById("hearts");
  const heart = document.createElement("span");

  heart.className = "floating-heart";

  heart.textContent = ["💗", "💕", "🌸"][
    Math.floor(Math.random() * 3)
  ];

  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = (15 + Math.random() * 15) + "px";
  heart.style.animationDuration = (5 + Math.random() * 3) + "s";

  container.appendChild(heart);

  setTimeout(() => heart.remove(), 8500);
}, 1100);

/* BERSIHKAN MIKROFON SAAT HALAMAN DITUTUP */
window.addEventListener("beforeunload", stopMicBlow);
