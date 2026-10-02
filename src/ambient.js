(() => {
  const { dim, stars, start } = window.CFG;
  document.documentElement.style.setProperty('--dim', dim);

  const field = document.getElementById('stars');
  for (let i = 0; i < stars; i++) {
    const s = document.createElement('i');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*70}%;--d:${3+Math.random()*5}s;--delay:-${Math.random()*8}s`;
    field.appendChild(s);
  }

  const t0 = start ?? Date.now();
  const clock = document.getElementById('clock');
  const elapsed = document.getElementById('elapsed');
  const tick = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const m = Math.max(0, Math.floor((Date.now() - t0) / 60000));
    elapsed.textContent = m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`;
  };
  tick(); setInterval(tick, 1000);
})();
