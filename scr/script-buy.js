// MODAL ZA KUPOVINU

const buyButton = document.getElementById('buy');
const buyModal = document.getElementById('buyModal');
const closeBuyBtn = buyModal.querySelector('.close-buy');
const buyTermsCheckbox = document.getElementById('buyTermsCheckbox');
const contractInfo = document.getElementById('contractInfo');
const buyAmountWrapper = document.getElementById('buyAmountWrapper');
const buyAmountInput = document.getElementById('buyAmount');
const tokenAmountDisplay = document.getElementById('tokenAmountDisplay');
const bnbAmountDisplay = document.getElementById('bnbAmountDisplay');
const copyContractBtn = document.getElementById('copyContractBtn');
const contractAddressInput = document.getElementById('contractAddress');

// 1 RSD = 0.00001316 BNB
const RSD_TO_BNB = 0.00001316;
const PRICE_PER_TOKEN_RSD = 100;

buyButton.addEventListener('click', () => {
  buyModal.style.display = 'block';
});

closeBuyBtn.addEventListener('click', () => {
  buyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === buyModal) {
    buyModal.style.display = 'none';
  }
});

// Kad se čekira "prihvatam uslove" → prikaži polja
buyTermsCheckbox.addEventListener('change', () => {
  const show = buyTermsCheckbox.checked;
  contractInfo.style.display = show ? 'block' : 'none';
  buyAmountWrapper.style.display = show ? 'block' : 'none';
});

// Kada korisnik unese broj zlatnika, preračunaj BNB
buyAmountInput.addEventListener('input', () => {
  const amount = parseInt(buyAmountInput.value, 10);
  if (!isNaN(amount) && amount > 0) {
    const totalRSD = amount * PRICE_PER_TOKEN_RSD;
    const totalBNB = (totalRSD * RSD_TO_BNB).toFixed(6);
    tokenAmountDisplay.textContent = amount;
    bnbAmountDisplay.textContent = totalBNB;
  } else {
    tokenAmountDisplay.textContent = "X";
    bnbAmountDisplay.textContent = "Y";
  }
});

// Kopiranje adrese
copyContractBtn.addEventListener('click', () => {
  contractAddressInput.select();
  contractAddressInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(contractAddressInput.value)
    .then(() => {
      copyContractBtn.textContent = "✅";
      setTimeout(() => copyContractBtn.textContent = "📋", 2000);
    })
    .catch(() => {
      alert("Грешка при копирању адресе.");
    });
});
