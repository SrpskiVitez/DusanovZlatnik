document.addEventListener("DOMContentLoaded", function () {
   if (L.DomUtil.get('map') != null && L.DomUtil.get('map')._leaflet_id) {
    return; // već inicijalizovano
  }
  const map = L.map('map').setView([45.08, 19.75], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const monasteries = [
    { name: 'Бешеново', coords: [45.0742, 19.6685], priority: 1, desc: 'Реконструкција после уништења' },
    { name: 'Раковац', coords: [45.1505, 19.7392], priority: 2, desc: 'Фреске и зграде захтевају санацију' },
    { name: 'Беочин', coords: [45.1761, 19.6561], priority: 3, desc: 'Рестаураторски радови' },
    { name: 'Кувеждин', coords: [45.1027, 19.5623], priority: 4, desc: 'Одржавање и рестаурација' },
    { name: 'Гргетег', coords: [45.1300, 19.7969], priority: 5, desc: 'Добро очуван' },
    { name: 'Јазак', coords: [45.1164, 19.8228], priority: 6, desc: 'Надоградња иконописа' },
    { name: 'Велика Ремета', coords: [45.1478, 19.7925], priority: 2, desc: 'Санација зидова' },
    { name: 'Мала Ремета', coords: [45.0583, 19.7353], priority: 6, desc: 'Добро стање' },
    { name: 'Шишатовац', coords: [45.1061, 19.5931], priority: 2, desc: 'Ратна оштећења' },
    { name: 'Дивша', coords: [45.1516, 19.4750], priority: 3, desc: 'Изолован положај' },
    { name: 'Ђипша', coords: [45.1589, 19.5361], priority: 3, desc: 'Делимично обновљен' },
    { name: 'Крушедол', coords: [45.1328, 19.8514], priority: 3, desc: 'Рестаурација унутрашњости' },
    { name: 'Хопово', coords: [45.1425, 19.7897], priority: 6, desc: 'Фасада' },
    { name: 'Јазак Стари', coords: [45.1232, 19.8221], priority: 2, desc: 'Археолошки локалитет' },
    { name: 'Врдник (Раваница)', coords: [45.1394, 19.7842], priority: 3, desc: 'Историјски значајан' },
    { name: 'Привина Глава', coords: [45.1842, 19.5208], priority: 3, desc: 'Иконе и фреске' }
  ];

  monasteries.forEach(function (m) {
    L.circleMarker(m.coords, {
      radius: 8,
      fillColor: m.priority <= 2 ? 'red' : (m.priority <= 4 ? 'orange' : 'green'),
      color: '#000',
      weight: 1,
      fillOpacity: 0.8
    }).addTo(map)
      .bindPopup('<b>' + m.name + '</b><br>Приоритет: ' + m.priority + '<br>' + m.desc);
  });
});
