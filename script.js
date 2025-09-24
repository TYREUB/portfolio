// Enhanced galaxy background animation with layers, twinkle, comets and parallax
function galaxyBg(){
  const canvas = document.getElementById('galaxy-bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;

  // performance: adapt star count to viewport
  const starCount = Math.max(80, Math.min(260, Math.floor((w*h)/9000)));

  // stars with twinkle
  const stars = new Array(starCount).fill(0).map(()=>({
    x: Math.random()*w,
    y: Math.random()*h,
    r: Math.random()*1.6 + 0.3,
    baseAlpha: Math.random()*0.8 + 0.2,
    twinkle: Math.random()*0.02 + 0.006,
    phase: Math.random()*Math.PI*2
  }));

  // layered nebulas (soft radial gradients)
  const clouds = new Array(6).fill(0).map(()=>({
    x: Math.random()*w,
    y: Math.random()*h,
    r: Math.random()*200 + 120,
    dx: (Math.random()-0.5)*0.05,
    dy: (Math.random()-0.5)*0.04,
    hue: 200 + Math.random()*80,
    alpha: 0.06 + Math.random()*0.08
  }));

  // comets
  const comets = [];

  // parallax by mouse
  let mx = w/2, my = h/2;
  window.addEventListener('mousemove', (e)=>{
    mx = (e.clientX/w - 0.5) * 30;
    my = (e.clientY/h - 0.5) * 20;
  });

  // offscreen canvas for blurred nebula to improve perf
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const offCtx = off.getContext('2d');

  function renderOff(){
    offCtx.clearRect(0,0,w,h);
    clouds.forEach((c,i)=>{
      const g = offCtx.createRadialGradient(c.x, c.y, c.r*0.1, c.x, c.y, c.r);
      g.addColorStop(0, `hsla(${c.hue}, 80%, 70%, ${c.alpha})`);
      g.addColorStop(0.5, `hsla(${c.hue+30}, 70%, 60%, ${c.alpha*0.6})`);
      g.addColorStop(1, `hsla(${c.hue+80}, 60%, 40%, 0)`);
      offCtx.fillStyle = g;
      offCtx.beginPath();
      offCtx.arc(c.x, c.y, c.r, 0, Math.PI*2);
      offCtx.fill();
    });
    // apply blur by scaling trick
    // draw small scaled version and enlarge to create soft blur effect
  }
  renderOff();

  let last = performance.now();
  function draw(now){
    const dt = now - last;
    last = now;
    // cap fps-ish by skipping frames if too close
    // clear
    ctx.clearRect(0,0,w,h);

    // draw nebula (offscreen) with parallax shift
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.9;
    // subtle parallax
    ctx.drawImage(off, mx*0.6, my*0.6, w, h, 0, 0, w, h);
    ctx.restore();

    // draw stars
    stars.forEach((s, i)=>{
      s.phase += s.twinkle * (dt/16);
      const alpha = s.baseAlpha + Math.sin(s.phase) * 0.6 * s.twinkle * 40;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, alpha))})`;
      ctx.arc(s.x + mx*0.4*(s.r/3), s.y + my*0.35*(s.r/3), s.r, 0, Math.PI*2);
      ctx.fill();
    });

    // occasionally spawn a comet
    if(Math.random() < 0.008){
      comets.push({
        x: Math.random()*w,
        y: -40,
        vx: -1 + Math.random()*2,
        vy: 2 + Math.random()*6,
        life: 0,
        maxLife: 300 + Math.random()*200
      });
    }

    // draw comets
    for(let i = comets.length -1; i>=0; i--){
      const c = comets[i];
      c.x += c.vx + mx*0.02;
      c.y += c.vy + my*0.01;
      c.life++;
      const t = c.life / c.maxLife;
      ctx.beginPath();
      const size = 1.6 + (1-t)*3;
      const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx*12, c.y - c.vy*12);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(1, 'rgba(150,180,255,0.0)');
      ctx.fillStyle = grad;
      ctx.ellipse(c.x, c.y, size, size*0.6, Math.atan2(c.vy, c.vx), 0, Math.PI*2);
      ctx.fill();
      if(c.life > c.maxLife || c.x < -100 || c.x > w+100 || c.y > h+100) comets.splice(i,1);
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  window.addEventListener('resize', ()=>{
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    off.width = w; off.height = h;
    // reposition clouds
    clouds.forEach(c=>{ c.x = Math.random()*w; c.y = Math.random()*h; c.r = Math.random()*200 + 120 });
    stars.forEach(s=>{ s.x = Math.random()*w; s.y = Math.random()*h });
    renderOff();
  });
}

document.addEventListener('DOMContentLoaded', galaxyBg);
// Menu toggle
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // hamburger open/close
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const open = toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open){
        mobileOverlay.classList.add('open');
        mobileOverlay.setAttribute('aria-hidden','false');
      } else {
        mobileOverlay.classList.remove('open');
        mobileOverlay.setAttribute('aria-hidden','true');
      }
    });
  }

  // close overlay when clicking a mobile link
  mobileLinks.forEach(a=>a.addEventListener('click', (e)=>{
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden','true');
  }));

  // smooth scroll for nav links
  function handleNavClick(e){
    const href = this.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      const target = document.querySelector(href);
      if(target){
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }
  }
  navLinks.forEach(a=>a.addEventListener('click', handleNavClick));
  mobileLinks.forEach(a=>a.addEventListener('click', handleNavClick));

  // year
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  // reveal on scroll

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry, i)=>{
      if(entry.isIntersecting){
        const el = entry.target;
        // Animation spéciale pour les cartes
        if(el.classList.contains('card')){
          setTimeout(()=> el.classList.add('visible'), 80 * (i+1));
        } else if(el.classList.contains('skill-list') || el.closest('.skill')){
          setTimeout(()=> el.classList.add('visible'), 60 * (i+1));
        } else {
          el.classList.add('visible');
        }

        // animate progress bars when skills section appears
        if(el.id === 'skills' || el.closest('#skills')){
          document.querySelectorAll('.progress-fill').forEach((fill, idx)=>{
            const target = Number(fill.getAttribute('data-percent') || 0);
            setTimeout(()=>{
              fill.style.width = target + '%';
              const percentEl = fill.closest('.skill').querySelector('.skill-percent');
              if(percentEl){
                animateCount(percentEl, target, 1200);
              }
            }, idx * 160);
          });
        }

        observer.unobserve(entry.target);
      }
    })
  },{threshold:0.14});
  // observe reveals (include skills container and each reveal element)
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  // active nav link detection
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  function updateActive(){
    const mid = window.scrollY + window.innerHeight/3;
    let activeId = sections[0] && sections[0].id;
    for(const s of sections){
      if(s.offsetTop <= mid) activeId = s.id;
    }
    navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('href') === '#'+activeId));
  }
  updateActive();
  window.addEventListener('scroll', updateActive, {passive:true});

  // helper: animate integer count up
  function animateCount(el, to, duration){
    const start = 0;
    const startTime = performance.now();
    function tick(now){
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * (to - start) + start);
      el.textContent = value + '%';
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = to + '%';
    }
    requestAnimationFrame(tick);
  }

  // --- CV download availability check ---
  (function checkCV(){
    const btn = document.getElementById('btn-download');
    const status = document.getElementById('cv-status');
    if(!btn || !status) return;
    // try several filename variants
    const candidates = [
      'Najib Adem CV.pdf',
      'Najib_Adem_CV.pdf',
      'najib-adem-cv.pdf',
      'cv-najib-adem.pdf'
    ];

    let found = false;
    // try fetch HEAD (some servers may not support HEAD, fallback to GET with range)
    function testPath(path){
      return fetch(path, {method:'HEAD'}).then(r=>r.ok).catch(()=>{
        // fallback try GET but don't download body
        return fetch(path, {method:'GET'}).then(r=>r.ok).catch(()=>false);
      });
    }

    Promise.all(candidates.map(p=>testPath(p).then(ok=>({p,ok})))).then(results=>{
      const ok = results.find(r=>r.ok);
      if(ok){
        btn.href = './' + ok.p;
        btn.classList.remove('disabled');
        btn.removeAttribute('title');
        status.textContent = 'CV prêt à télécharger.';
        found = true;
      } else {
        // Do not disable the button; keep default href (./Najib Adem CV.pdf) so clicking will attempt to open/download the file.
        btn.classList.remove('disabled');
        btn.setAttribute('title', 'Si le téléchargement ne fonctionne pas, placez le fichier "Najib Adem CV.pdf" dans le dossier Portfolio (voir README).');
        // keep status minimal (no long automatic-not-found phrase)
        status.textContent = '';
      }
    }).catch(()=>{
      btn.classList.add('disabled');
      status.textContent = 'Impossible de vérifier la présence du CV automatiquement. Vérifie que le fichier est dans le dossier.';
    });
  })();
});
