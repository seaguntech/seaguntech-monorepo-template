/* global localStorage, window, document */

(function () {
  try {
    var key = 'theme';
    var stored = localStorage.getItem(key);
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved =
      stored === 'dark' || stored === 'light'
        ? stored
        : systemDark
          ? 'dark'
          : 'light';

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  } catch {
    return;
  }
})();
