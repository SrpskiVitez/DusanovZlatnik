const buyButton = document.getElementById('buy');
const buyModal = document.getElementById('buyModal');
const closeBuyBtn = buyModal.querySelector('.close-buy');
const buyTermsCheckbox = document.getElementById('buyTermsCheckbox');
const contractInfo = document.getElementById('contractInfo');
const buyAmountInput = document.getElementById('buyAmount');
const bnbAmountDisplay = document.getElementById('bnbPrice');
const confirmButton = document.getElementById('buyNowBtn');

// Konstante
const TOKEN_PRICE_RSD = 1;
const BNB_PER_RSD = 0.00001316; // ili koristi 1/76000 = 0.00001316
const PRESALE_CONTRACT_ADDRESS = "0xF173D56F1893aE48A42566EA4f56062e48682F67";
const ABI = [
  "function buyTokens() payable",
  "function tokensBought(address) view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function MAX_TOKENS_PER_BUYER() view returns (uint256)",
  "function TOTAL_TOKENS_FOR_SALE() view returns (uint256)",
  "function presaleActive() view returns (bool)"
];

let signer, contract;

// Otvori modal
buyButton.addEventListener('click', () => {
  buyModal.style.display = 'block';
  init(); // inicijalizuj Web3 svaki put kad otvori modal
});

// Zatvori modal
closeBuyBtn.addEventListener('click', () => {
  buyModal.style.display = 'none';
});

// Klik van modala zatvara modal
window.addEventListener('click', (e) => {
  if (e.target === buyModal) {
    buyModal.style.display = 'none';
  }
});

// Prikazuj polje kad se čekira "prihvatam"
buyTermsCheckbox.addEventListener('change', () => {
  contractInfo.style.display = buyTermsCheckbox.checked ? 'block' : 'none';
  updateBNBDisplay();
  updateConfirmButtonState();
});

// Ažuriraj BNB vrednost i dugme na unos količine
buyAmountInput.addEventListener('input', () => {
  updateBNBDisplay();
  updateConfirmButtonState();
});

function updateBNBDisplay() {
  const amount = parseInt(buyAmountInput.value, 10);
  if (!isNaN(amount) && amount > 0) {
    const totalBNB = calculateBNBAmount(amount);
    bnbAmountDisplay.textContent = totalBNB.toFixed(6);
  } else {
    bnbAmountDisplay.textContent = "0.000013";
  }
}

function calculateBNBAmount(tokens) {
  return tokens * TOKEN_PRICE_RSD * BNB_PER_RSD;
}

function updateConfirmButtonState() {
  const tokens = parseInt(buyAmountInput.value, 10);
  confirmButton.disabled = !(buyTermsCheckbox.checked && tokens > 0);
}

// Inicijalizuj Web3 i proveri da li je presale aktivan
async function init() {
  try {
    let provider;

    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else {
      alert("Web3 novčanik nije pronađen. Instaliraj MetaMask ili koristi WalletConnect.");
      confirmButton.disabled = true;
      return;
    }

    signer = provider.getSigner();
    contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, ABI, signer);

    const isActive = await contract.presaleActive();
    if (!isActive) {
      alert("Presale još nije aktivan.");
      confirmButton.disabled = true;
      return;
    }

    confirmButton.disabled = true; // Po defaultu disabled, enabled na checkbox + input event
  } catch (err) {
    console.error("Inicijalizacija nije uspela:", err);
    alert("Greška pri inicijalizaciji Web3.");
    confirmButton.disabled = true;
  }
}

// Handler za klik na dugme "Kupi sada"
confirmButton.addEventListener('click', async () => {
  const tokens = parseInt(buyAmountInput.value, 10);
  if (isNaN(tokens) || tokens <= 0) return;

  const bnbToSend = calculateBNBAmount(tokens);
  const valueToSend = ethers.utils.parseUnits(bnbToSend.toString(), "ether");

  try {
    const tx = await contract.buyTokens({ value: valueToSend });
    await tx.wait();
    alert("✅ Uspešna kupovina zlatnika!");
    // Resetuj formu ako želiš:
    buyAmountInput.value = '';
    bnbAmountDisplay.textContent = "0.000013";
    buyTermsCheckbox.checked = false;
    contractInfo.style.display = 'none';
    confirmButton.disabled = true;
    buyModal.style.display = 'none';
  } catch (err) {
    console.error("Greška tokom transakcije:", err);
    alert("❌ Greška pri kupovini. Proverite novčanik i pokušajte ponovo.");
  }
});

// Kada se učita stranica, inicijalno osveži prikaz
document.addEventListener("DOMContentLoaded", () => {
  updateBNBDisplay();
  updateConfirmButtonState();
});
