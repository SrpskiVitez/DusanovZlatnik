document.querySelectorAll('.lang-section ol li strong').forEach((question) => {
  question.addEventListener('click', () => {
    const li = question.parentElement;
    li.classList.toggle('open');
  });
});
