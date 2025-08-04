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

// Modal за куповину
const buyModal = document.getElementById("buyModal");
const closeBuyModalBtn = document.querySelector(".close-buy");

// Dugme koje otvara modal
const buyButton = document.getElementById("buy");

// Језик
const lang = document.documentElement.lang || "sr";

// Локализоване поруке
const messages = {
  "sr": {
    success: "✅ Успешна куповина златника!",
    error: "❌ Грешка при куповини. Проверите MetaMask и покушајте поново.",
    no_wallet: "Web3 новчаник није пронађен. Инсталирај MetaMask.",
    not_active: "⛔ Продаја још није активна.",
    already_requested: "⏳ Већ је послат захтев за приступ MetaMask новчанику. Молимо сачекајте и покушајте касније."
  },
  "sr-latin": {
    success: "✅ Uspešna kupovina zlatnika!",
    error: "❌ Greška pri kupovini. Proverite MetaMask i pokušajte ponovo.",
    no_wallet: "Web3 novčanik nije pronađen. Instaliraj MetaMask.",
    not_active: "⛔ Prodaja još nije aktivna.",
    already_requested: "⏳ Već je poslat zahtev za pristup MetaMask novčaniku. Molimo sačekajte i pokušajte kasnije."
  },
  "en": {
    success: "✅ Successful token purchase!",
    error: "❌ Error during purchase. Check MetaMask and try again.",
    no_wallet: "Web3 wallet not found. Please install MetaMask.",
    not_active: "⛔ Presale is not active.",
    already_requested: "⏳ A request to access MetaMask wallet is already pending. Please wait and try again later."
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
let initialized = false;  // flag da init() bude pozvan samo jednom

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

// Затварање Buy модала
closeBuyModalBtn.addEventListener("click", () => {
  buyModal.style.display = "none";
});

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

// Иницијализација Web3 и конекције са паметним уговором
async function init() {
  if (!window.ethereum) {
    alert(messages[lang]?.no_wallet || messages["sr"].no_wallet);
    return false;
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
      return false;
    } else {
      confirmButton.disabled = true; // još uvek dok korisnik ne unese iznos i prihvati uslove
      tokenAmountInput.disabled = false;
    }
    return true;
  } catch (err) {
    if (err.code === -32002) {
      alert(messages[lang]?.already_requested || messages["sr"].already_requested);
    } else {
      console.error("Иницијација није успела:", err);
      alert(messages[lang]?.error || messages["sr"].error);
    }
    return false;
  }
}

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

// Otvaranje modala za kupovinu ili metamask modal ako je potrebno
buyButton.addEventListener("click", async () => {
  console.log("Kliknuto dugme za kupovinu");

  const isStandalone = window.navigator.standalone === true;
  console.log("Je li standalone (ikona na homescreenu)?", isStandalone);
  console.log("isMobile:", isMobile());
  console.log("isMetaMaskBrowser:", isMetaMaskBrowser());
  console.log("window.ethereum:", window.ethereum);

  if (isMobile() && !isMetaMaskBrowser() && !window.ethereum) {
    console.log("Prikazujem metamaskModal za klasični mobilni browser");
    metamaskModal.style.display = "flex";
    const dappUrl = window.location.href.replace(/^https?:\/\//, "");
    openInMetaMaskBtn.href = `metamask://dapp/${dappUrl}`;
    alert("Otvorite u MetaMask aplikaciji da biste nastavili."); // ovo ne radi u svakom scenariju
    return;
  }

  // Fallback za Safari – može da ima ethereum, ali nije MetaMask
  if (isMobile() && !isMetaMaskBrowser() && window.ethereum && !isStandalone) {
    console.log("Safari + drugi wallet, prikazujem upozorenje");
    alert("Овај претраживач није подржан. Молимо отворите у MetaMask апликацији.");
    return;
  }

  if (!initialized) {
    const success = await init();
    if (!success) {
      console.log("init nije uspeo");
      return;
    }
    initialized = true;
  }

  console.log("Otvaram modal za kupovinu");
  buyModal.style.display = "flex";
  tokenAmountInput.disabled = false;
});


// Pokreni proveru MetaMask mobilnog browser-a odmah na load
checkMetaMaskMobile();
