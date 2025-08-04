// MODAL ZA KUPOVINU

const buyButton = document.getElementById('buy'); // dugme koje otvara modal, moraš imati <button id="buyButton">
const buyModal = document.getElementById('buyModal');
const closeBuyBtn = buyModal.querySelector('.close-buy');
const buyTermsCheckbox = document.getElementById('buyTermsCheckbox');
const contractInfo = document.getElementById('contractInfo');
const copyContractBtn = document.getElementById('copyContractBtn');
const contractAddressInput = document.getElementById('contractAddress');

// Otvori modal
buyButton.addEventListener('click', () => {
  buyModal.style.display = 'block';
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

// Checkbox logika: prikaz adrese kad se čekira
buyTermsCheckbox.addEventListener('change', () => {
  contractInfo.style.display = buyTermsCheckbox.checked ? 'block' : 'none';
});

// Dugme za kopiranje adrese
copyContractBtn.addEventListener('click', () => {
  contractAddressInput.select();
  contractAddressInput.setSelectionRange(0, 99999); // za mobilne

  navigator.clipboard.writeText(contractAddressInput.value)
    .then(() => {
      copyContractBtn.textContent = "✅";
      setTimeout(() => copyContractBtn.textContent = "📋", 2000);
    })
    .catch(err => {
      alert("Грешка при копирању адресе.");
    });
});
