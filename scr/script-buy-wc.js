tokenAmountInput.addEventListener("input", () => {
  const tokens = parseInt(tokenAmountInput.value);
  if (!isNaN(tokens) && tokens > 0) {
    priceDisplay.textContent = calculateBNBAmount(tokens).toFixed(6);
    confirmButton.disabled = !checkbox.checked;
  }
});
