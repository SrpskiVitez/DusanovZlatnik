const buyButton = document.getElementById('buy');
const buyModal = document.getElementById('buyModal');
const closeBuyBtn = buyModal.querySelector('.close-buy');
const buyTermsCheckbox = document.getElementById('buyTermsCheckbox');
const contractInfo = document.getElementById('contractInfo');
const buyAmountInput = document.getElementById('buyAmount');
const bnbAmountDisplay = document.getElementById('bnbAmountDisplay');
const copyContractBtn = document.getElementById('copyContractBtn');
const contractAddressInput = document.getElementById('contractAddress');

// Cena 1 zlatnika = 100 RSD → u BNB
const PRICE_PER_TOKEN_RSD = 100;
const RSD_TO_BNB = 0.00001316;

if (buyButton) {
  buyButton.addEventListener('click', () => {
    buyModal.style.display = 'block';
  });
}

closeBuyBtn.addEventListener('click', () => {
  buyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === buyModal) {
    buyModal.style.display = 'none';
  }
});

// Prikazuj polje kad se čekira "prihvatam"
buyTermsCheckbox.addEventListener('change', () => {
  contractInfo.style.display = buyTermsCheckbox.checked ? 'block' : 'none';
  if (buyTermsCheckbox.checked) updateBNBDisplay(); // inicijalni proračun
});

// Ažuriraj BNB vrednost kada korisnik unese količinu
buyAmountInput.addEventListener('input', updateBNBDisplay);

function updateBNBDisplay() {
  const amount = parseInt(buyAmountInput.value, 10);
  if (!isNaN(amount) && amount > 0) {
    const totalRSD = amount * PRICE_PER_TOKEN_RSD;
    const totalBNB = (totalRSD * RSD_TO_BNB).toFixed(6);
    bnbAmountDisplay.textContent = totalBNB;
  } else {
    bnbAmountDisplay.textContent = "0.000000";
  }
}

// Kopiranje adrese klikom
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
