//jezik
document.querySelectorAll('#language-switcher a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const lang = this.getAttribute('data-lang');
    if (lang === 'sr') {
      window.location.href = 'index.html';
    } else if (lang === 'sr-latin') {
      window.location.href = 'index-sr-latin.html';
    } else if (lang === 'en') {
      window.location.href = 'index-en.html';
    }
  });
});


const giftButton = document.getElementById('giftButton');
const giftModal = document.getElementById('giftModal');
const closeBtn = giftModal.querySelector('.close');


// Otvori modal na klik dugmeta
giftButton.addEventListener('click', () => {
  giftModal.style.display = 'block';
});

// Zatvori modal na klik na X
closeBtn.addEventListener('click', () => {
  giftModal.style.display = 'none';
});

// Opcionalno: zatvori modal klikom van modal-content
window.addEventListener('click', (e) => {
  if (e.target === giftModal) {
    giftModal.style.display = 'none';
  }
});


const logo = document.getElementById("rotating-logo");

let currentRotation = 0;
let targetRotation = 0;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  targetRotation = (scrollY * 0.6) % 360;
});

function animate() {
  currentRotation += (targetRotation - currentRotation) * 0.05;

  const rad = currentRotation * Math.PI / 180;
  const scaleX = Math.abs(Math.cos(rad)) * 0.7 + 0.3;

  logo.style.transform = `rotateY(${currentRotation}deg) scaleX(${scaleX})`;

  requestAnimationFrame(animate);
}

animate();


//checkbox prihvatam uslove
const termsCheckbox = document.getElementById('termsCheckbox');
const walletInput = document.getElementById('walletInput');
const sendRequestButton = document.getElementById('sendRequest');

// Kada korisnik čekira "Prihvatam uslove", omogući input
termsCheckbox.addEventListener('change', () => {
  walletInput.disabled = !termsCheckbox.checked;
  validateWallet(); // odmah proverava da li je adresa dobra
});

// Kada korisnik unosi adresu, proverava se validnost
walletInput.addEventListener('input', validateWallet);

function validateWallet() {
  const address = walletInput.value.trim();
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
  const termsAccepted = termsCheckbox.checked;

  sendRequestButton.disabled = !(isValid && termsAccepted);
}

// Lokalizovane poruke za različite jezike
const messages = {
  'sr': {
    success: 'Захтев је успешно послат! ✅',
    error: 'Грешка при слању. Покушајте поново.',
    invalid: 'Молимо унесите исправну адресу (почиње са 0x и садржи 42 карактера).',
    network: 'Мрежна грешка: '
  },
  'sr-latin': {
    success: 'Zahtev je uspešno poslat! ✅',
    error: 'Greška pri slanju. Pokušajte ponovo.',
    invalid: 'Molimo unesite ispravnu adresu (počinje sa 0x i sadrži 42 karaktera).',
    network: 'Mrežna greška: '
  },
  'en': {
    success: 'Request successfully sent! ✅',
    error: 'Error sending request. Please try again.',
    invalid: 'Please enter a valid address (starts with 0x and is 42 characters long).',
    network: 'Network error: '
  }
};

// Detekcija jezika sa <html lang="...">
const currentLang = document.documentElement.lang || 'sr';
const msg = messages[currentLang] || messages['sr'];

// Slanje adrese na Telegram
document.getElementById('sendRequest').addEventListener('click', function () {
  const walletAddress = document.getElementById('walletInput').value.trim();

  const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);

  if (!isValidWallet) {
    alert(msg.invalid);
    return;
  }

  const url = `https://dusanov-api.vercel.app/api/send`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address: walletAddress })
  })
    .then(response => {
      if (response.ok) {
        alert(msg.success);
        document.getElementById('walletInput').value = '';
        document.getElementById('giftModal').style.display = 'none';
      } else {
        alert(msg.error);
      }
    })
    .catch(error => {
      alert(msg.network + error.message);
    });
});

