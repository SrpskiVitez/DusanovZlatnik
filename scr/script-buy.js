// script-buy.js

// UI елементи
const tokenAmountInput = document.getElementById("buyAmount");
const priceDisplay = document.getElementById("bnbPrice");
const confirmButton = document.getElementById("buyNowBtn");
const checkbox = document.getElementById("buyTermsCheckbox");

// Modal за MetaMask мобилни browser
const metamaskModal = document.getElementById("metamaskModal");
const openInMetaMaskBtn = document.getElementById("openInMetaMask");
const closeMetaMaskModalBtn = document.querySelector(".close-metamask");

// Језик
const lang = document.documentElement.lang || "sr";

// Локализоване поруке
const messages = {
  "sr": {
    success: "✅ Успешна куповина златника!",
    error: "❌ Грешка при куповини. Проверите MetaMask и покушајте поново.",
    no_wallet: "Web3 новчаник није пронађен. Инсталирај MetaMask.",
    not_active: "⛔ Продаја још није активна.",
  },
  "sr-latin": {
    success: "✅ Uspešna kupovina zlatnika!",
    error: "❌ Greška pri kupovini. Proverite MetaMask i pokušajte ponovo.",
    no_wallet: "Web3 novčanik nije pronađen. Instaliraj MetaMask.",
    not_active: "⛔ Prodaja još nije aktivna.",
  },
  "en": {
    success: "✅ Successful token purchase!",
    error: "❌ Error during purchase. Check MetaMask and try again.",
    no_wallet: "Web3 wallet not found. Please install MetaMask.",
    not_active: "⛔ Presale is not active.",
  }
};

// Константе
const TOKEN_PRICE_RSD = 1;
const BNB_PER_RSD = 1 / 76000;
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

// Провера да ли је у питању мобилни уређај
function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Провера да ли је у MetaMask мобилном browser-у
function isMetaMaskBrowser() {
  return /MetaMaskMobile/i.test(navigator.userAgent);
}

// Ако је мобилни уређај, није MetaMask browser и нема Web3, прикажи модал за упутство
function checkMetaMaskMobile() {
  if (isMobile() && !isMetaMaskBrowser() && !window.ethereum) {
    metamaskModal.style.display = "flex";
    // Подешавање линка који отвара MetaMask мобилни browser
    const dappUrl = window.location.href.replace(/^https?:\/\//, "");
    openInMetaMaskBtn.href = `metamask://dapp/${dappUrl}`;
  }
}

// Затварање MetaMask модала
closeMetaMaskModalBtn.addEventListener("click", () => {
  metamaskModal.style.display = "none";
});

// Иницијализација Web3 и конекције са паметним уговором
async function init() {
  if (!window.ethereum) {
    alert(messages[lang]?.no_wallet || messages["sr"].no_wallet);
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, ABI, signer);

    const isActive = await contract.presaleActive();
    if (!isActive) {
      alert(messages[lang]?.not_active || messages["sr"].not_active);
      confirmButton.disabled = true;
    }
  } catch (err) {
    console.error("Иницијација није успела:", err);
    alert(messages[lang]?.error || messages["sr"].error);
  }
}

// Израчунај вредност у BNB за дати број токена
function calculateBNBAmount(tokens) {
  return tokens * TOKEN_PRICE_RSD * BNB_PER_RSD;
}

// Ажурирање приказа цене у BNB
tokenAmountInput.addEventListener("input", () => {
  const tokens = parseInt(tokenAmountInput.value);
  if (!isNaN(tokens) && tokens > 0) {
    const bnb = calculateBNBAmount(tokens);
    priceDisplay.textContent = bnb.toFixed(6);
    confirmButton.disabled = !checkbox.checked;
  } else {
    priceDisplay.textContent = "—";
    confirmButton.disabled = true;
  }
});

// Омогућавање дугмета куповине само ако је услов прихваћен и унет број токена
checkbox.addEventListener("change", () => {
  const tokens = parseInt(tokenAmountInput.value);
  confirmButton.disabled = !(checkbox.checked && tokens > 0);
});

// Куповина токена - позив паметног уговора
confirmButton.addEventListener("click", async () => {
  const tokens = parseInt(tokenAmountInput.value);
  if (isNaN(tokens) || tokens <= 0) return;

  const bnbToSend = calculateBNBAmount(tokens);
  const valueToSend = ethers.utils.parseUnits(bnbToSend.toString(), "ether");

  try {
    const tx = await contract.buyTokens({ value: valueToSend });
    await tx.wait();
    alert(messages[lang]?.success || messages["sr"].success);
  } catch (err) {
    console.error("Грешка током трансакције:", err);
    alert(messages[lang]?.error || messages["sr"].error);
  }
});

// Покрени проверу MetaMask мобилног browser-а
checkMetaMaskMobile();

// Покрени иницијализацију Web3
init();
