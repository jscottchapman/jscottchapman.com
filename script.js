document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const buttons = document.querySelectorAll('.theme-btn');

  // Load saved theme or default to terminal
  const savedTheme = localStorage.getItem('theme') || 'terminal';
  setTheme(savedTheme);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
      localStorage.setItem('theme', theme);
    });
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
});
