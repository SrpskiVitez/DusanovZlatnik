document.addEventListener('DOMContentLoaded', () => {
  const lang = document.documentElement.getAttribute('data-lang') || 'sr';

  // Labeli po jezicima
  const chartLabels = {
    'sr': [
      "Јавна продаја",
      "Фонд за развој",
      "Маркетинг и промоција",
      "Награде за заједницу",
      "Културни грантови",
      "Ликвидносни фонд",
      "Тим и саветници",
      "Резерве"
    ],
    'sr-latin': [
      "Javna prodaja",
      "Fond za razvoj",
      "Marketing i promocija",
      "Nagrade za zajednicu",
      "Kulturni grantovi",
      "Likvidnosni fond",
      "Tim i savetnici",
      "Rezerve"
    ],
    'en': [
      "Public Sale",
      "Development Fund",
      "Marketing & Promotion",
      "Community Rewards",
      "Cultural Grants",
      "Liquidity Fund",
      "Team & Advisors",
      "Reserves"
    ]
  };

  const chartColors = [
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#8e44ad",
    "#3498db",
    "#2ecc71",
    "#1abc9c",
    "#34495e"
  ];

  const chartValues = [15, 15, 10, 10, 10, 15, 10, 15];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: '#d9d4c9',
          font: { size: 14 }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ": " + context.parsed + "%";
          }
        }
      }
    }
  };

  function createChart(canvasId, lang) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const data = {
      labels: chartLabels[lang] || chartLabels['sr'],
      datasets: [{
        label: "Procenat",
        data: chartValues,
        backgroundColor: chartColors,
        borderColor: "#fff",
        borderWidth: 1
      }]
    };

    new Chart(ctx, {
      type: "pie",
      data: data,
      options: chartOptions
    });
  }

  createChart("chart", lang);

  // LANGUAGE SWITCHER
  const languageSwitcher = document.getElementById('language-switcher');
  if (languageSwitcher) {
    languageSwitcher.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();

        const selectedLang = link.getAttribute('data-lang');
        if (!selectedLang) return;

        // Trenutni URL (putanja)
        const currentUrl = window.location.pathname; // npr /docs/whitepaper-sr-latin.html
        // Izvuci naziv fajla
        const fileName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1); // whitepaper-sr-latin.html

        // Parsiraj bazu imena fajla i jezik
        // Pretpostavka: imena su u formatu:
        // [basename].html          => sr ćirilica
        // [basename]-sr-latin.html => sr latinica
        // [basename]-en.html       => engleski

        let baseName = fileName.replace('.html', '');
        let currentLangInFile = 'sr';

        // Prepoznaj i ukloni jezički sufiks ako postoji
        const langSuffixMatch = baseName.match(/-(sr|sr-latin|en)$/);
        if (langSuffixMatch) {
          currentLangInFile = langSuffixMatch[1];
          baseName = baseName.replace(/-(sr|sr-latin|en)$/, '');
        }

        // Izračunaj novi naziv fajla
        let newFileName = '';
        if (selectedLang === 'sr') {
          // Za ćirilicu nema dodatnog sufiksa
          newFileName = baseName + '.html';
        } else {
          // Za latinicu i engleski dodaj sufiks
          newFileName = baseName + '-' + selectedLang + '.html';
        }

        // Formiraj novi URL i preusmeri
        const newPath = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + newFileName;
        window.location.href = newPath;
      });
    });
  }

});

// Dodavanje MetaMask tokena (van DOMContentLoaded-a)
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
