/* ============================================================
   SAMPAI IBU PULANG — mesin presentasi
   - Video intro  → slide 1 … slide 11
   - Sound "wosh" lembut setiap pindah slide
   - Navigasi: ← → / Spasi / klik / geser (swipe) / titik di bawah
   ============================================================ */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const stage  = $('#stage');
  const slides = $$('.slide');
  const sweep  = $('#sweep');
  const intro  = $('#intro');
  const vid    = $('#vid');
  const hud    = $('#hud');
  const hint   = $('#hint');
  const LAST   = slides.length - 1;

  let cur = -1, busy = false, started = false, sfxOn = true;

  /* ---------- skala panggung 1920x1080 ---------- */
  function fit() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  addEventListener('resize', fit); fit();

  /* ---------- sound efek (lembut) ---------- */
  const pool = [0, 1, 2].map(() => {
    const a = new Audio('assets/wosh.mp3');
    a.preload = 'auto'; a.volume = 0.85;
    return a;
  });
  let pi = 0;
  function wosh() {
    if (!sfxOn) return;
    const a = pool[pi++ % pool.length];
    try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
  }

  /* ---------- dekorasi yang dibangun lewat kode ---------- */
  function buildHills() {
    $$('[data-hills]').forEach(el => {
      const cols = el.dataset.hills.split('|');
      const H = +el.dataset.h || 400, n = cols.length;
      let paths = '';
      cols.forEach((c, i) => {
        const y0 = H * (0.14 + 0.62 * (n > 1 ? i / (n - 1) : 0));
        const a = 46 - i * 6;
        const d = i % 2 === 0
          ? `M0 ${y0 + a} C360 ${y0 - a},700 ${y0 + a * 1.2},1000 ${y0} S1600 ${y0 - a * 1.1},1920 ${y0 + a * 0.6} V${H} H0Z`
          : `M0 ${y0 - a * 0.5} C300 ${y0 + a},700 ${y0 - a},980 ${y0 + a * 0.3} S1560 ${y0 + a},1920 ${y0 - a * 0.8} V${H} H0Z`;
        paths += `<path d="${d}" fill="${c}"/>`;
      });
      el.style.height = H + 'px';
      el.innerHTML = `<svg viewBox="0 0 1920 ${H}" preserveAspectRatio="none" width="1920" height="${H}">${paths}</svg>`;
    });
  }
  function buildStars() {
    $$('[data-stars]').forEach(el => {
      const n = +el.dataset.stars; let h = '';
      for (let i = 0; i < n; i++) {
        const s = 2 + Math.random() * 4;
        h += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 60).toFixed(1)}%;width:${s}px;height:${s}px;animation-delay:${(Math.random() * 3).toFixed(2)}s;animation-duration:${(2 + Math.random() * 3).toFixed(1)}s"></i>`;
      }
      el.innerHTML = h;
    });
  }
  function buildRays() {
    $$('[data-rays]').forEach(el => {
      const n = +el.dataset.rays; let h = '';
      for (let i = 0; i < n; i++) h += `<i style="transform:rotate(${(i * 360 / n).toFixed(1)}deg)"></i>`;
      el.innerHTML = h;
    });
  }
  function buildCrowd() {
    const el = $('[data-crowd]'); if (!el) return;
    const pat = 'MCMCMCMCC'; let h = '';
    for (let i = 0; i < 90; i++) {
      const x = 62 + i * (1796 / 89);
      const k = 0.94 + ((i * 37) % 13) / 100;
      if (pat[i % 9] === 'M') {
        const w = 42 * k, hh = 108 * k;
        h += `<g class="f" style="--i:${i}"><use href="#ibu" x="${(x - w / 2).toFixed(1)}" y="${(232 - hh).toFixed(1)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}"/></g>`;
      } else {
        const w = 28 * k, hh = 73 * k;
        h += `<g class="f" style="--i:${i}"><use href="#anak" x="${(x - w / 2).toFixed(1)}" y="${(232 - hh).toFixed(1)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}"/></g>`;
      }
    }
    el.innerHTML = h;
  }
  function buildPictos() {
    $$('[data-pic="houses"]').forEach(el => {
      let h = '';
      for (let i = 0; i < 10; i++) h += `<svg class="h${i === 0 ? ' hot' : ''}" viewBox="0 0 64 64"><use href="#i-home"/></svg>`;
      el.innerHTML = h;
    });
    $$('[data-pic="dots"]').forEach(el => {
      let h = '';
      for (let i = 0; i < 50; i++) h += `<i style="--i:${i}"></i>`;
      el.innerHTML = h;
    });
  }

  /* ---------- hitung naik (count-up) ---------- */
  function runCounters(sl) {
    $$('.count', sl).forEach(el => {
      const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      const dur = +(el.dataset.dur || 1800), delay = +(el.dataset.delay || 600);
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const fmt = v => pre + v.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      const t0 = performance.now() + delay;
      el.textContent = fmt(0);
      (function step(now) {
        const k = Math.min(1, Math.max(0, (now - t0) / dur));
        el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step); else el.textContent = fmt(to);
      })(performance.now());
    });
  }

  /* ---------- HUD ---------- */
  const pills = $('#pills');
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'pill'; b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', e => { e.stopPropagation(); go(i); });
    pills.appendChild(b);
  });
  function setHud() { $$('.pill').forEach((p, i) => p.classList.toggle('on', i === cur)); }
  let hudT;
  function wake() {
    if (cur < 0) return;
    hud.classList.add('show'); stage.classList.remove('idle');
    clearTimeout(hudT);
    hudT = setTimeout(() => { hud.classList.remove('show'); stage.classList.add('idle'); }, 2600);
  }
  addEventListener('mousemove', wake);

  /* ---------- video prototype (di dalam slide) ---------- */
  const pv = $('#pvid'), phone = $('.phone'), pbar = $('.pbar i');
  function protoPlay(fromStart) {
    if (!pv) return;
    phone.classList.remove('paused', 'ended');
    if (fromStart) { try { pv.currentTime = 0; } catch (e) {} }
    pv.muted = false;
    const p = pv.play();
    if (p && p.catch) p.catch(() => { pv.muted = true; pv.play().catch(() => { phone.classList.add('paused'); }); });
  }
  function protoStop() { if (!pv) return; try { pv.pause(); } catch (e) {} }
  function protoToggle() {
    if (!pv) return;
    if (pv.ended) protoPlay(true);
    else if (pv.paused) protoPlay(false);
    else { pv.pause(); phone.classList.add('paused'); }
  }
  if (pv) {
    pv.addEventListener('timeupdate', () => { if (pv.duration) pbar.style.width = (pv.currentTime / pv.duration * 100) + '%'; });
    pv.addEventListener('ended', () => phone.classList.add('ended'));
    $('.screen', phone).addEventListener('click', e => { e.stopPropagation(); protoToggle(); });
  }

  /* ---------- pindah slide ---------- */
  function show(n) {
    if (!intro.classList.contains('gone')) { intro.classList.add('gone'); try { vid.pause(); } catch (e) {} }
    if (cur >= 0) { slides[cur].classList.remove('active'); if (pv && slides[cur].contains(pv)) protoStop(); }
    cur = n;
    const s = slides[n];
    s.classList.add('active');
    if (pv && s.contains(pv)) protoPlay(true);
    runCounters(s);
    setHud();
    try { history.replaceState(null, '', '#s' + (n + 1)); } catch (e) {}
    if (n === 0) { hint.classList.add('on'); setTimeout(() => hint.classList.remove('on'), 6500); }
    wake();
  }
  function go(n) {
    if (busy || n === cur || n < 0 || n > LAST) return;
    busy = true;
    wosh();
    sweep.classList.remove('go'); void sweep.offsetWidth; sweep.classList.add('go');
    setTimeout(() => show(n), 500);          // tepat saat layar tertutup cahaya
    setTimeout(() => { sweep.classList.remove('go'); busy = false; }, 1050);
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  /* ---------- intro video ---------- */
  let introDone = false;
  function startIntro() {
    if (started) return; started = true;
    intro.classList.add('playing');
    vid.muted = false;
    const p = vid.play();
    if (p && p.catch) p.catch(() => { vid.muted = true; vid.play().catch(() => {}); });
  }
  function endIntro() {
    if (introDone) return; introDone = true;
    go(0);
  }
  vid.addEventListener('ended', endIntro);
  $('#wait').addEventListener('click', startIntro);
  $('#start').addEventListener('click', e => { e.stopPropagation(); startIntro(); });
  $('#skip').addEventListener('click', e => { e.stopPropagation(); endIntro(); });

  /* ---------- kontrol ---------- */
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else (document.documentElement.requestFullscreen || (() => {})).call(document.documentElement);
  }
  function toggleSnd() { sfxOn = !sfxOn; $('#btn-snd').classList.toggle('off', !sfxOn); }
  $('#btn-fs').addEventListener('click', e => { e.stopPropagation(); toggleFs(); });
  $('#btn-snd').addEventListener('click', e => { e.stopPropagation(); toggleSnd(); });

  addEventListener('keydown', e => {
    const k = e.key;
    if (cur === -1) {
      if (!started && (k === ' ' || k === 'Enter' || k === 'ArrowRight')) { e.preventDefault(); startIntro(); }
      else if (started && (k === 'ArrowRight' || k === 'Escape')) endIntro();
      return;
    }
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(LAST);
    else if (k === 'f' || k === 'F') toggleFs();
    else if (k === 'm' || k === 'M') toggleSnd();
    else if ((k === 'p' || k === 'P') && pv && slides[cur].contains(pv)) protoToggle();
    wake();
  });

  stage.addEventListener('click', e => {
    if (cur < 0 || e.target.closest('#hud')) return;
    const r = stage.getBoundingClientRect();
    ((e.clientX - r.left) / r.width < 0.2) ? prev() : next();
  });
  let sx = null;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (sx === null || cur < 0) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
  });

  /* ---------- partikel harapan (debu cahaya hangat) ---------- */
  const fx = $('#fx'), ctx = fx.getContext('2d');
  const glow = document.createElement('canvas'); glow.width = glow.height = 64;
  (() => {
    const g = glow.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,238,176,1)'); gr.addColorStop(.4, 'rgba(255,205,100,.55)'); gr.addColorStop(1, 'rgba(255,190,80,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  })();
  const P = Array.from({ length: 44 }, () => ({
    x: Math.random() * 1920, y: Math.random() * 1080, s: 5 + Math.random() * 15,
    v: .15 + Math.random() * .45, ph: Math.random() * 6.28, a: .25 + Math.random() * .5
  }));
  function loop(t) {
    ctx.clearRect(0, 0, 1920, 1080);
    for (const p of P) {
      p.y -= p.v; p.x += Math.sin(t / 1800 + p.ph) * .35;
      if (p.y < -30) { p.y = 1110; p.x = Math.random() * 1920; }
      ctx.globalAlpha = p.a * (.6 + .4 * Math.sin(t / 700 + p.ph));
      ctx.drawImage(glow, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- mulai ---------- */
  buildHills(); buildStars(); buildRays(); buildCrowd(); buildPictos();
  const m = /^#s(\d+)$/.exec(location.hash);
  if (m && +m[1] >= 1 && +m[1] <= slides.length) { started = introDone = true; show(+m[1] - 1); }
})();
