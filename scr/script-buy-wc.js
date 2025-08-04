// script-buy-wc.js

// UI елементи
const tokenAmountInput = document.getElementById("buyAmount");
const priceDisplay = document.getElementById("bnbPrice");
const confirmButton = document.getElementById("buyNowBtn");
const checkbox = document.getElementById("buyTermsCheckbox");

// Језик
const lang = document.documentElement.lang || "sr";

// Локализоване поруке
const messages = {
  "sr": {
    success: "✅ Успешна куповина златника!",
    error: "❌ Грешка при куповини. Проверите новчаник и покушајте поново.",
    no_wallet: "Web3 новчаник није пронађен. Инсталирај MetaMask или користи WalletConnect.",
    not_active: "⛔ Продаја још није активна.",
  },
  "sr-latin": {
    success: "✅ Uspešna kupovina zlatnika!",
    error: "❌ Greška pri kupovini. Proverite novčanik i pokušajte ponovo.",
    no_wallet: "Web3 novčanik nije pronađen. Instaliraj MetaMask ili koristi WalletConnect.",
    not_active: "⛔ Prodaja još nije aktivna.",
  },
  "en": {
    success: "✅ Successful token purchase!",
    error: "❌ Error during purchase. Check your wallet and try again.",
    no_wallet: "Web3 wallet not found. Please install MetaMask or use WalletConnect.",
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

async function init() {
  try {
    let provider;

    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else {
      // WalletConnect fallback
      const WalletConnectProvider = window.WalletConnectProvider?.default || window.WalletConnectProvider;
      if (!WalletConnectProvider) {
        alert(messages[lang]?.no_wallet || messages["sr"].no_wallet);
        return;
      }

      const wcProvider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org"
        },
        chainId: 56
      });

      await wcProvider.enable();
      provider = new ethers.providers.Web3Provider(wcProvider);
    }

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

// Израчунај вредност у BNB
function calculateBNBAmount(tokens) {
  return tokens * TOKEN_PRICE_RSD * BNB_PER_RSD;
}

// Ажурира цену
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

// Потврда услова
checkbox.addEventListener("change", () => {
  const tokens = parseInt(tokenAmountInput.value);
  confirmButton.disabled = !(checkbox.checked && tokens > 0);
});

// Куповина
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

// Покрени
init();
