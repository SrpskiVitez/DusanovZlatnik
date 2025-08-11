document.addEventListener("DOMContentLoaded", () => {
  // KONFIGURACIJA
  const PRESALE_CONTRACT_ADDRESS = "0xF173D56F1893aE48A42566EA4f56062e48682F67";
  const TOKEN_PRICE_RSD = 1;
  const BNB_PER_RSD = 1 / 76000;

  const ABI = [
    "function buyTokens() payable",
    "function presaleActive() view returns (bool)"
  ];

  // ELEMENTI IZ HTML
  const tokenAmountInput = document.getElementById("buyAmount");
  const priceDisplay = document.getElementById("bnbPrice");
  const buyNowButton = document.getElementById("buyNow"); // ✅ novo dugme
  const termsCheckbox = document.getElementById("buyTermsCheckbox");
  const contractInfo = document.getElementById("contractInfo");

  let signer, contract;

  // Izračunavanje BNB vrednosti
  function calculateBNBAmount(tokens) {
    return tokens * TOKEN_PRICE_RSD * BNB_PER_RSD;
  }

  // Ažuriranje prikaza cene
  function updatePrice() {
    const tokens = parseInt(tokenAmountInput.value);
    if (!isNaN(tokens) && tokens > 0) {
      priceDisplay.textContent = calculateBNBAmount(tokens).toFixed(6);
    } else {
      priceDisplay.textContent = "—";
    }
  }

  // Povezivanje sa Web3
  async function initWeb3() {
    try {
      let provider;
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        alert("Web3 novčanik nije pronađen. Instaliraj MetaMask.");
        return false;
      }

      signer = provider.getSigner();
      contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, ABI, signer);

      const isActive = await contract.presaleActive();
      if (!isActive) {
        alert("⛔ Prodaja još nije aktivna.");
        return false;
      }
      return true;
    } catch (err) {
      console.error("Greška pri povezivanju:", err);
      alert("❌ Greška pri povezivanju sa novčanikom.");
      return false;
    }
  }

  // Kupovina tokena
  async function handlePurchase() {
    const tokens = parseInt(tokenAmountInput.value);
    if (isNaN(tokens) || tokens <= 0) {
      alert("Unesi validan broj zlatnika.");
      return;
    }
    if (!termsCheckbox.checked) {
      alert("Moraš prihvatiti uslove kupovine.");
      return;
    }

    const connected = await initWeb3();
    if (!connected) return;

    try {
      const bnbToSend = calculateBNBAmount(tokens);
      const valueToSend = ethers.utils.parseUnits(bnbToSend.toString(), "ether");

      const tx = await contract.buyTokens({ value: valueToSend });
      await tx.wait();
      alert("✅ Uspešna kupovina zlatnika!");
    } catch (err) {
      console.error("Greška tokom kupovine:", err);
      alert("❌ Greška pri kupovini. Proverite novčanik i pokušajte ponovo.");
    }
  }

  // EVENTI
  if (tokenAmountInput) {
    tokenAmountInput.addEventListener("input", updatePrice);
  }
  if (buyNowButton) {
    buyNowButton.addEventListener("click", handlePurchase);
  }
  if (termsCheckbox && contractInfo) {
    termsCheckbox.addEventListener("change", () => {
      contractInfo.style.display = termsCheckbox.checked ? "block" : "none";
      if (termsCheckbox.checked) updatePrice();
    });
  }

  // Inicijalni prikaz
  updatePrice();
});
