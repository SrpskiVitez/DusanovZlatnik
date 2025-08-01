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

        // Trenutni URL
        const currentUrl = window.location.pathname; // npr /docs/whitepaper-sr-latin.html
        // Izvuci naziv fajla
        const fileName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1); // whitepaper-sr-latin.html

        // Parsiraj bazu imena fajla i jezik
        // Pretpostavimo da imena imaju format: [basename]-[lang].html ili [basename].html za sr ćirilicu
        // Na primer: whitepaper.html (sr ćirilica), whitepaper-sr-latin.html (sr latinica), whitepaper-en.html (eng)

        let baseName = fileName;
        let currentLangInFile = 'sr';

        if (fileName.includes('-')) {
          const parts = fileName.split('-');
          const langPart = parts.pop().split('.')[0]; // uzmi deo pre .html
          baseName = parts.join('-');
          currentLangInFile = langPart;
        } else {
          baseName = fileName.replace('.html', '');
        }

        // Izračunaj novi naziv fajla
        let newFileName = '';

        if (selectedLang === 'sr') {
          newFileName = baseName + '.html'; // npr whitepaper.html
        } else {
          newFileName = baseName + '-' + selectedLang + '.html'; // npr whitepaper-en.html ili whitepaper-sr-latin.html
        }

        // Preusmeri
        const newPath = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + newFileName;
        window.location.href = newPath;
      });
    });
  }

});
