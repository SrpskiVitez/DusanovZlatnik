// MODAL ZA KUPOVINU

const buyButton = document.getElementById('buy'); // dugme koje otvara modal
const buyModal = document.getElementById('buyModal');
const closeBuyBtn = buyModal.querySelector('.close-buy');
const buyTermsCheckbox = document.getElementById('buyTermsCheckbox');
const contractInfo = document.getElementById('contractInfo');
const copyContractBtn = document.getElementById('copyContractBtn');
const contractAddressInput = document.getElementById('contractAddress');
const tokenAmountInput = document.getElementById('buyAmount');
const tokenAmountDisplay = document.getElementById('tokenAmountDisplay');
const bnbAmountDisplay = document.getElementById('bnbAmountDisplay');
const confirmButton = document.getElementById('buyNowBtn');

// Cene i konverzija
const TOKEN_PRICE_RSD = 100;
const RSD_TO_BNB = 0.00001316;

// Otvori modal
buyButton.addEventListener('click', () => {
  buyModal.style.display = 'block';
  resetModalState();
});

// Zatvori modal
closeBuyBtn.addEventListener('click', () => {
  buyModal.style.display = 'none';
});

// Zatvori klikom van modala
window.addEventListener('click', (e) => {
  if (e.target === buyModal) {
    buyModal.style.display = 'none';
  }
});

// Reset stanja kada se modal otvori
function resetModalState() {
  buyTermsCheckbox.checked = false;
  contractInfo.style.display = 'none';
  confirmButton.disabled = true;
  tokenAmountDisplay.textContent = "X";
  bnbAmountDisplay.textContent = "Y";
  tokenAmountInput.value = "";
}

// Ažuriraj BNB kad se unosi broj zlatnika
tokenAmountInput.addEventListener("input", () => {
  updateContractInfo();
  validateForm();
});

// Ažuriraj kada se čekira/odčekira uslov
buyTermsCheckbox.addEventListener('change', () => {
  updateContractInfo();
  validateForm();
});

// Izračunaj i prikaži broj tokena i BNB
function updateContractInfo() {
  const tokenCount = parseInt(tokenAmountInput.value) || 0;
  const totalRSD = tokenCount * TOKEN_PRICE_RSD;
  const bnbAmount = totalRSD * RSD_TO_BNB;

  tokenAmountDisplay.textContent = tokenCount || "X";
  bnbAmountDisplay.textContent = tokenCount ? bnbAmount.toFixed(6) : "Y";

  contractInfo.style.display = buyTermsCheckbox.checked ? 'block' : 'none';
}

// Provera validnosti i aktiviranje dugmeta
function validateForm() {
  const tokenCount = parseInt(tokenAmountInput.value);
  if (tokenCount > 0 && buyTermsCheckbox.checked) {
    confirmButton.disabled = false;
  } else {
    confirmButton.disabled = true;
  }
}

// Dugme za kopiranje adrese
copyContractBtn.addEventListener('click', () => {
  contractAddressInput.select();
  contractAddressInput.setSelectionRange(0, 99999); // za mobilne

  navigator.clipboard.writeText(contractAddressInput.value)
    .then(() => {
      copyContractBtn.textContent = "✅";
      setTimeout(() => copyContractBtn.textContent = "📋", 2000);
    })
    .catch(() => {
      alert("Грешка при копирању адресе.");
    });
});
