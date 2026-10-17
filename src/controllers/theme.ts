// Theme Management Controller

export function initTheme() {
  const THEME_KEY = 'xai_bot_theme_preference';
  
  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch (_) {}
  };

  // Check stored preference or default to dark (original site baseline)
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light') {
      applyTheme(false);
    } else {
      applyTheme(true);
    }
  } catch (_) {}

  // Attach to theme toggle buttons in header & footer
  const themeBtns = document.querySelectorAll('button[aria-label="Toggle theme"], footer button');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      applyTheme(!isCurrentlyDark);
    });
  });
}
