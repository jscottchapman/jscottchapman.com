document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const buttons = document.querySelectorAll('.theme-btn');
  const shareBtn = document.querySelector('.share-vibe-btn');
  const toast = document.querySelector('.share-toast');

  const shareMessages = {
    terminal: "This developer's portfolio looks like a terminal. You're welcome.",
    barbie: "I found a developer portfolio with a Barbie mode. Yes, really.",
    mtv: "This portfolio site looks like 1985 MTV threw up on it. In a good way."
  };

  const toastMessages = {
    terminal: "Link copied. Hack the planet.",
    barbie: "Link copied. Go spread the sparkle.",
    mtv: "Link copied. Totally radical."
  };

  // Check URL params first, then localStorage, then default
  const urlTheme = new URLSearchParams(window.location.search).get('theme');
  const savedTheme = urlTheme || localStorage.getItem('theme') || 'terminal';
  setTheme(savedTheme, false);

  // Clean URL after reading param
  if (urlTheme && window.history.replaceState) {
    const url = new URL(window.location);
    url.searchParams.delete('theme');
    window.history.replaceState({}, '', url);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      const current = html.getAttribute('data-theme');
      if (theme === current) return;

      setTheme(theme, true);
      localStorage.setItem('theme', theme);
    });
  });

  // Share this vibe
  shareBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const shareUrl = `https://jscottchapman.com/?theme=${currentTheme}`;
    const shareText = `${shareMessages[currentTheme]}\n${shareUrl}`;

    // Try native share on mobile first
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.share({
        title: 'J Scott Chapman',
        text: shareMessages[currentTheme],
        url: shareUrl
      }).catch(() => copyToClipboard(shareText, currentTheme));
    } else {
      copyToClipboard(shareText, currentTheme);
    }
  });

  function copyToClipboard(text, theme) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(theme);
    }).catch(() => {
      const input = document.createElement('textarea');
      input.value = text;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast(theme);
    });
  }

  function setTheme(theme, animate) {
    if (animate) {
      // Flash transition for dramatic theme switches
      const flash = document.createElement('div');
      flash.className = 'theme-flash';
      document.body.appendChild(flash);

      requestAnimationFrame(() => {
        flash.classList.add('active');
        setTimeout(() => {
          html.setAttribute('data-theme', theme);
          updateButtons(theme);
          setTimeout(() => {
            flash.classList.remove('active');
            setTimeout(() => flash.remove(), 300);
          }, 50);
        }, 150);
      });
    } else {
      html.setAttribute('data-theme', theme);
      updateButtons(theme);
    }
  }

  function updateButtons(theme) {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  function showToast(theme) {
    toast.textContent = toastMessages[theme];
    toast.hidden = false;
    requestAnimationFrame(() => {
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => { toast.hidden = true; }, 300);
      }, 2500);
    });
  }

  // Konami code easter egg: unlocks a brief "chaos mode" that cycles all themes rapidly
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        chaosMode();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function chaosMode() {
    const themes = ['terminal', 'barbie', 'mtv'];
    let i = 0;
    const interval = setInterval(() => {
      html.setAttribute('data-theme', themes[i % 3]);
      updateButtons(themes[i % 3]);
      i++;
      if (i > 12) {
        clearInterval(interval);
        const final = localStorage.getItem('theme') || 'terminal';
        html.setAttribute('data-theme', final);
        updateButtons(final);
        toast.textContent = "You found the secret. Tell a friend.";
        toast.hidden = false;
        toast.classList.add('visible');
        setTimeout(() => {
          toast.classList.remove('visible');
          setTimeout(() => { toast.hidden = true; }, 300);
        }, 3000);
      }
    }, 150);
  }
});
