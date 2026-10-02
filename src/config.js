// All settings can be overridden from the URL, e.g. index.html?channel=ThriceTheThird&dim=0.5
const q = new URLSearchParams(location.search);
const num = (k, d) => (q.has(k) && !isNaN(+q.get(k)) ? +q.get(k) : d);

window.CFG = {
  channel: (q.get('channel') || 'ThriceTheThird').toLowerCase(),
  dim: num('dim', 0.35),            // 0-1 night tint strength
  stars: num('stars', 60),          // star count, 0 to disable
  maxMessages: num('max', 14),      // chat lines kept on screen
  fadeMs: num('fade', 90000),       // chat line lifetime, 0 = never fade
  start: q.has('start') ? +q.get('start') : null, // epoch ms; default = page load
  ignore: (q.get('ignore') || 'wizebot,nightbot,streamelements,streamlabs,moobot,fossabot')
    .toLowerCase().split(',').filter(Boolean),
  hideCommands: q.get('commands') !== 'show',
};
