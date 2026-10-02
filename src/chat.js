// Anonymous, read-only Twitch chat over the IRC websocket. No token, no library, cannot post.
(() => {
  const { channel, maxMessages, fadeMs, ignore, hideCommands } = window.CFG;
  const box = document.getElementById('chat');
  const listeners = [];
  window.onChat = fn => listeners.push(fn);   // games hook in here: fn({user, text, tags})

  const parseTags = s => Object.fromEntries(s.split(';').map(kv => { const i = kv.indexOf('='); return [kv.slice(0, i), kv.slice(i + 1)]; }));
  const unescapeTag = v => v.replace(/\\s/g, ' ').replace(/\\:/g, ';').replace(/\\\\/g, '\\');

  function render(text, emotes) {
    const frag = document.createDocumentFragment();
    const spans = [];
    if (emotes) for (const e of emotes.split('/')) {
      const [id, ranges] = e.split(':');
      for (const r of ranges.split(',')) { const [a, b] = r.split('-').map(Number); spans.push({ a, b, id }); }
    }
    spans.sort((x, y) => x.a - y.a);
    const chars = [...text];
    let pos = 0;
    const add = str => str && frag.appendChild(document.createTextNode(str));
    for (const s of spans) {
      add(chars.slice(pos, s.a).join(''));
      const img = new Image();
      img.className = 'emote';
      img.src = `https://static-cdn.jtvnw.net/emoticons/v2/${s.id}/default/dark/2.0`;
      frag.appendChild(img);
      pos = s.b + 1;
    }
    add(chars.slice(pos).join(''));
    return frag;
  }

  function show(user, color, text, emotes) {
    const el = document.createElement('div');
    el.className = 'msg';
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = user;                 // textContent only: chat is untrusted
    if (/^#[0-9a-f]{6}$/i.test(color)) { name.style.color = color; el.style.borderLeftColor = color; }
    el.append(name, render(text, emotes));
    box.appendChild(el);
    while (box.children.length > maxMessages) box.firstChild.remove();
    if (fadeMs) {
      setTimeout(() => el.classList.add('old'), fadeMs);
      setTimeout(() => el.remove(), fadeMs + 1600);
    }
  }

  function onLine(line) {
    if (line.startsWith('PING')) return ws.send('PONG :tmi.twitch.tv');
    const m = line.match(/^@(\S+) :(\w+)!\S+ PRIVMSG #\S+ :(.*)$/);
    if (!m) return;
    const tags = parseTags(m[1]);
    const user = unescapeTag(tags['display-name'] || m[2]);
    let text = m[3];
    if (text.startsWith('\u0001ACTION ')) text = text.slice(8).replace(/\u0001$/, '');
    if (ignore.includes(m[2].toLowerCase())) return;
    listeners.forEach(fn => { try { fn({ user, login: m[2], text, tags }); } catch (e) { console.error(e); } });
    if (hideCommands && text.startsWith('!')) return;
    if (/https?:\/\/|www\./i.test(text)) return;       // no links on stream
    show(user, tags.color, text, tags.emotes);
  }

  let ws, retry = 1000;
  function connect() {
    ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
    ws.onopen = () => {
      retry = 1000;
      ws.send('CAP REQ :twitch.tv/tags');
      ws.send('NICK justinfan' + Math.floor(10000 + Math.random() * 89999));
      ws.send('JOIN #' + channel);
    };
    ws.onmessage = e => e.data.split('\r\n').filter(Boolean).forEach(onLine);
    ws.onclose = () => { setTimeout(connect, retry); retry = Math.min(retry * 2, 30000); };
  }
  connect();

  // Local test hook: index.html?demo=1 fakes a few messages so you can see the layout offline.
  if (new URLSearchParams(location.search).has('demo')) {
    const demo = ['hi chat', 'zzz good night!', 'cozy stream tonight', 'lurking with tea', 'sleep well'];
    let i = 0;
    setInterval(() => show('Viewer' + (i % 4), ['#8fa8ff', '#ff9ecb', '#9effc0', '#ffd47a'][i % 4], demo[i++ % demo.length]), 1200);
  }
})();
