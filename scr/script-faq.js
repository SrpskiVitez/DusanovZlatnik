document.querySelectorAll('.lang-section ol li strong').forEach((question) => {
  question.addEventListener('click', (e) => {
    e.stopPropagation(); // da ne kaska više događaja
    const li = question.parentElement;
    li.classList.toggle('open');
  });
});
