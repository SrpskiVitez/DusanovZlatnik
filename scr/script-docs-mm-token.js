// Dodavanje MetaMask tokena (van DOMContentLoaded-a)
document.getElementById('addTokenBtn').addEventListener('click', addTokenToMetaMask);

async function addTokenToMetaMask() {
  const lang = document.documentElement.getAttribute('data-lang') || 'sr';

  const messages = {
    'sr': {
      noMetaMask: 'MetaMask није пронађен. Молимо вас да га инсталирате.',
      success: 'Токен је успешно додат у MetaMask!',
      rejected: 'Корисник је одбио додавање токена.',
      error: 'Дошло је до грешке при додавању токена.'
    },
    'sr-latin': {
      noMetaMask: 'MetaMask nije pronađen. Molimo vas da ga instalirate.',
      success: 'Token je uspešno dodat u MetaMask!',
      rejected: 'Korisnik je odbio dodavanje tokena.',
      error: 'Došlo je do greške pri dodavanju tokena.'
    },
    'en': {
      noMetaMask: 'MetaMask not found. Please install it.',
      success: 'Token was successfully added to MetaMask!',
      rejected: 'User rejected the token addition.',
      error: 'An error occurred while adding the token.'
    }
  };

  const t = messages[lang] || messages['sr'];

  if (typeof window.ethereum === 'undefined') {
    alert(t.noMetaMask);
    return;
  }

  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0x27a81dce6f4bd0f2a6f3c17e195ecdb773051a00',
          symbol: 'ZLATNIK',
          decimals: 18,
          image: 'https://srpskivitez.github.io/DusanovZlatnik/pic/logo_500_tra.png'
        }
      }
    });

    if (wasAdded) {
      alert(t.success);
    } else {
      alert(t.rejected);
    }
  } catch (error) {
    console.error('Грешка:', error);
    alert(t.error);
  }
}