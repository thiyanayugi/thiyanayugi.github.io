// Minimal, performance-focused portfolio script
// Features: typewriter (title & rotating subtitle), nav toggle & highlighting, parallax, horizontal scroll sections,
// ripple effect, contact form + notifications. Emphasis on: small surface, requestAnimationFrame, IntersectionObserver,
// reduced-motion respect, visibility pause, event delegation, lazy/non-critical deferral.

(()=>{ 'use strict';
const q=(s,sc=document)=>sc.querySelector(s); const qa=(s,sc=document)=>sc.querySelectorAll(s);
const raf=cb=>requestAnimationFrame(cb);
const prefersReduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Typewriter ------------------------------------------------------------
function typewriter(){
  const title=q('.typewriter'); const sub=q('.typewriter-subtitle');
  if(!title && !sub) return;
  if(prefersReduce){ if(title) title.textContent=title.dataset.text||''; if(sub){ const f=(sub.dataset.texts||'').split(',')[0]; if(f) sub.textContent=f; } return; }
  if(title){
    const text=title.dataset.text||''; let i=0; const start=performance.now()+600; const speed=90;
    const step=t=>{ if(document.hidden) return raf(step); if(t<start) return raf(step); const tgt=Math.min(text.length,Math.floor((t-start)/speed)); if(tgt!==i){ i=tgt; title.textContent=text.slice(0,i); } if(i<text.length) raf(step); };
    title.textContent=''; raf(step);
  }
  if(sub){
    const words=(sub.dataset.texts||'').split(',').map(w=>w.trim()).filter(Boolean); if(!words.length) return;
    let wi=0, chars=0, del=false, pause=0, last=performance.now();
    const loop=t=>{ if(document.hidden){ last=t; return raf(loop);} const dt=t-last; last=t; const w=words[wi]; if(!del){ chars+=dt/140; if(chars>=w.length){ chars=w.length; del=true; pause=t+1800; } } else if(t>pause){ chars-=dt/110; if(chars<=0){ chars=0; del=false; wi=(wi+1)%words.length; } } sub.textContent=w.slice(0,Math.floor(Math.max(0,Math.min(w.length,chars)))); raf(loop); };
    raf(loop);
  }
}

// --- Navigation + Highlight ------------------------------------------------
function navigation(){
  const hamburger=q('#hamburger'); const menu=q('#nav-menu'); const links=qa('.nav-link'); const navbar=q('.navbar');
  if(hamburger && menu){
    hamburger.addEventListener('click',()=>{ hamburger.classList.toggle('active'); menu.classList.toggle('active'); document.body.style.overflow=menu.classList.contains('active')?'hidden':''; });
    document.addEventListener('click',e=>{ if(!hamburger.contains(e.target)&&!menu.contains(e.target)){ hamburger.classList.remove('active'); menu.classList.remove('active'); document.body.style.overflow=''; } });
  }
  links.forEach(a=>a.addEventListener('click',e=>{ if(a.getAttribute('href')==='#') e.preventDefault(); if(menu&&menu.classList.contains('active')){ hamburger.classList.remove('active'); menu.classList.remove('active'); document.body.style.overflow=''; }}));
  const sections=qa('section[id]'); if(sections.length){
    const io=new IntersectionObserver(es=>{
      es.forEach(en=>{ if(!en.isIntersecting) return; const id=en.target.id; links.forEach(l=>{ const match=l.getAttribute('href')===`#${id}`; l.classList.toggle('active',match); match?l.setAttribute('aria-current','true'):l.removeAttribute('aria-current'); }); });
    },{threshold:.5}); sections.forEach(s=>io.observe(s));
  }
  if(navbar){ let ticking=false; const onScroll=()=>{ if(ticking) return; ticking=true; raf(()=>{ navbar.classList.toggle('navbar--scrolled',window.scrollY>50); ticking=false; }); }; window.addEventListener('scroll',onScroll,{passive:true}); onScroll(); }
  let rT; window.addEventListener('resize',()=>{ clearTimeout(rT); rT=setTimeout(()=>{ if(window.innerWidth>768 && menu){ hamburger.classList.remove('active'); menu.classList.remove('active'); document.body.style.overflow=''; } },180); },{passive:true});
}

// --- Parallax (pointer + subtle scroll) ------------------------------------
function parallax(){ if(prefersReduce) return; const hero=q('.hero'); if(!hero) return; const particles=qa('.particle',hero); let rect=hero.getBoundingClientRect(); const upd=()=>rect=hero.getBoundingClientRect(); window.addEventListener('resize',upd,{passive:true});
  let pmTick=false; hero.addEventListener('pointermove',e=>{ if(pmTick) return; pmTick=true; raf(()=>{ if(document.hidden){ pmTick=false; return; } const x=(e.clientX-rect.left-rect.width/2)/(rect.width/2); const y=(e.clientY-rect.top-rect.height/2)/(rect.height/2); particles.forEach((p,i)=>{ const f=(i%2?0.3:0.5)*((i%3)+1); p.style.transform=`translate3d(${(x*14*f).toFixed(2)}px, ${(y*10*f).toFixed(2)}px,0)`; }); pmTick=false; }); },{passive:true}); hero.addEventListener('pointerleave',()=>particles.forEach(p=>p.style.transform='')); let scTick=false; const onScroll=()=>{ if(scTick) return; scTick=true; raf(()=>{ if(window.innerWidth>768 && !document.hidden){ const s=window.pageYOffset; if(s<window.innerHeight) hero.style.transform=`translateY(${(s*-0.09).toFixed(2)}px)`; } scTick=false; }); }; window.addEventListener('scroll',onScroll,{passive:true}); upd(); }

// --- Horizontal Scroll Sections -------------------------------------------
function horizontalScroll(){ const defs=[['.skills.skills--hscroll','.skills.skills--hscroll .skills-grid-min','--hscroll-height'],['#achievements.achievements--hscroll','#achievements.achievements--hscroll .achievements-grid','--ach-h']]; const navH=()=>q('.navbar')?.offsetHeight||70; const setup=(wrapSel,rowSel,cssVar)=>{ const wrap=q(wrapSel); const row=q(rowSel); if(!wrap||!row) return; let enabled=false,maxX=0,start=0,end=0; function layout(){ enabled=window.innerWidth>900; if(!enabled){ wrap.style.removeProperty(cssVar); wrap.removeAttribute('data-hscroll-ready'); row.style.transform=''; return; } const container=wrap.querySelector('.container'); maxX=Math.max(0,row.scrollWidth-container.clientWidth); const travel=maxX*1.8+300; wrap.style.setProperty(cssVar,`${Math.max(travel,window.innerHeight-navH()+200)}px`); wrap.setAttribute('data-hscroll-ready','true'); start=navH(); end=window.innerHeight; } let tick=false; function onScroll(){ if(!enabled||tick) return; tick=true; raf(()=>{ const r=wrap.getBoundingClientRect(); const total=r.height-end+start; if(r.top<=start && r.bottom>end){ const prog=Math.min(1,Math.max(0,(start-r.top)/Math.max(1,total))); row.style.transform=`translate3d(${-prog*maxX}px,0,0)`; } else if(r.top>start){ row.style.transform='translate3d(0,0,0)'; } else if(r.bottom<=end){ row.style.transform=`translate3d(${-maxX}px,0,0)`; } tick=false; }); } layout(); onScroll(); window.addEventListener('resize',()=>{ layout(); onScroll(); },{passive:true}); window.addEventListener('scroll',onScroll,{passive:true}); }; defs.forEach(d=>setup(...d)); }

// --- Ripple (delegated) ---------------------------------------------------
function rippleDelegated(){ document.addEventListener('click',e=>{ const btn=e.target.closest('.btn'); if(!btn) return; const r=btn.getBoundingClientRect(); const size=Math.max(r.width,r.height); const span=document.createElement('span'); span.className='ripple-circle'; span.style.width=span.style.height=size+'px'; span.style.left=(e.clientX-r.left-size/2)+'px'; span.style.top=(e.clientY-r.top-size/2)+'px'; btn.appendChild(span); setTimeout(()=>span.remove(),520); }); }

// --- Notifications + Contact Form with EmailJS ----------------------------------------
function contact(){ 
  const form=q('#contact-form'); 
  if(!form) return; 
  
  // Initialize EmailJS
  emailjs.init('h81hTW_zBRE5hrLhv');
  
  const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  let note=null; 
  
  const show=(msg,type='info')=>{ 
    if(!note){ 
      note=document.createElement('div'); 
      document.body.appendChild(note); 
    } 
    note.className=`notification notification--${type}`; 
    note.setAttribute('role','status'); 
    note.setAttribute('aria-live','polite'); 
    note.innerHTML=`<div class="notification-content"><span class="notification-message">${msg}</span><button class="notification-close" type="button" aria-label="Close">×</button></div>`; 
    requestAnimationFrame(()=>note.classList.add('notification--visible')); 
    clearTimeout(show._t); 
    show._t=setTimeout(()=>{ hide(); },5000); 
  }; 
  
  const hide=()=>{ 
    if(note){ 
      note.classList.remove('notification--visible'); 
      setTimeout(()=>note&&note.remove(),280); 
      note=null; 
    } 
  }; 
  
  document.addEventListener('click',e=>{ 
    if(e.target.closest('.notification-close')) hide(); 
  }); 
  
  form.addEventListener('submit',e=>{ 
    e.preventDefault(); 
    const fd=new FormData(form); 
    const data={ 
      from_name:fd.get('name')?.trim(), 
      reply_to:fd.get('email')?.trim(), 
      subject:fd.get('subject')?.trim(), 
      message:fd.get('message')?.trim() 
    }; 
    
    if(Object.values(data).some(v=>!v)){ 
      show('Please fill in all fields.','error'); 
      return; 
    } 
    
    if(!email.test(data.reply_to)){ 
      show('Please enter a valid email address.','error'); 
      return; 
    } 
    
    const btn=form.querySelector('button[type="submit"]'); 
    const orig=btn.textContent; 
    btn.textContent='Sending...'; 
    btn.disabled=true; 
    btn.style.opacity='0.7'; 
    
    // Send confirmation email to user (with you in BCC via template settings)
    emailjs.send('service_uore6zr', 'template_qzn9hoa', data)
      .then(() => {
        show('Thank you for your message! I\'ll get back to you soon.','success'); 
        form.reset(); 
        btn.textContent=orig; 
        btn.disabled=false; 
        btn.style.opacity='1'; 
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        show('Oops! Something went wrong. Please try again or email me directly.','error'); 
        btn.textContent=orig; 
        btn.disabled=false; 
        btn.style.opacity='1'; 
      });
  }); 
}

// --- Horizontal Scroll Sections -------------------------------------------
function horizontalScroll(){ const defs=[['.skills.skills--hscroll','.skills.skills--hscroll .skills-grid-min','--hscroll-height'],['#achievements.achievements--hscroll','#achievements.achievements--hscroll .achievements-grid','--ach-h'],['.education--hscroll','.education--hscroll .education-grid','--edu-h']]; const navH=()=>q('.navbar')?.offsetHeight||70; const setup=(wrapSel,rowSel,cssVar)=>{ const wrap=q(wrapSel); const row=q(rowSel); if(!wrap||!row) return; let enabled=false,maxX=0,start=0,end=0; function layout(){ enabled=window.innerWidth>900; if(!enabled){ wrap.style.removeProperty(cssVar); wrap.removeAttribute('data-hscroll-ready'); row.style.transform=''; return; } const container=wrap.querySelector('.container'); maxX=Math.max(0,row.scrollWidth-container.clientWidth); const travel=maxX*1.8+300; wrap.style.setProperty(cssVar,`${Math.max(travel,window.innerHeight-navH()+200)}px`); wrap.setAttribute('data-hscroll-ready','true'); start=navH(); end=window.innerHeight; } let tick=false; function onScroll(){ if(!enabled||tick) return; tick=true; raf(()=>{ const r=wrap.getBoundingClientRect(); const total=r.height-end+start; if(r.top<=start && r.bottom>end){ const prog=Math.min(1,Math.max(0,(start-r.top)/Math.max(1,total))); row.style.transform=`translate3d(${-prog*maxX}px,0,0)`; } else if(r.top>start){ row.style.transform='translate3d(0,0,0)'; } else if(r.bottom<=end){ row.style.transform=`translate3d(${-maxX}px,0,0)`; } tick=false; }); } layout(); onScroll(); window.addEventListener('resize',()=>{ layout(); onScroll(); },{passive:true}); window.addEventListener('scroll',onScroll,{passive:true}); }; defs.forEach(d=>setup(...d)); }

// --- Init (critical first, extras deferred) --------------------------------
document.addEventListener('DOMContentLoaded',()=>{
  typewriter();
  navigation();
  contact();
  (window.requestIdleCallback?requestIdleCallback:fn=>setTimeout(fn,50))(()=>{ parallax(); horizontalScroll(); rippleDelegated(); });
  document.body.classList.add('loaded');
});

})();

// Concepts used:
// 1. requestAnimationFrame-driven animations (smooth typing & parallax).
// 2. IntersectionObserver for section-based nav highlighting.
// 3. Feature detection & progressive enhancement (requestIdleCallback fallback, reduced-motion media query).
// 4. Event delegation (single click for ripple & notification close).
// 5. Throttling via rAF state flags instead of setInterval/scroll storms.
// 6. Visibility-aware loops (skip work when tab hidden implicitly via short-circuit patterns).
// 7. Minimal DOM queries (selectors stored per use; heavy operations throttled & conditional).
// 8. Accessibility: aria-current updates, aria-live notifications, focus-safe close button.
// 9. Responsive behavior (auto-close nav on resize, width gates for horizontal scroll & parallax intensity).
// 10. Single reusable notification element reduces DOM churn & memory.

// ==========================================
// NEURAL NETWORK ANIMATION (Hero Right Side)
// ==========================================
const canvas = document.getElementById('neural-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60;
    const connectionDistance = 100;
    const mouseDistance = 150;

    // Resize
    function resize() {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5; // Velocity
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8'; // Cyan nodes
            ctx.fill();
        }
    }

    // Initialize
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and Draw Particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw Connections (Synapses)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / connectionDistance})`; // Fade out
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================
// PROJECT FILTERING
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                // Trigger animation
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ==========================================
// ROBUST PROJECT FILTERING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    console.log('Found filter buttons:', filterBtns.length);
    console.log('Found project cards:', projectCards.length);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default behavior
            
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            console.log('Filtering by:', filter);
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    // Reset animation
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
});

// ==========================================
// PROJECT FILTERING LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }
            });
        });
    });
});

// ==========================================
// RESTORED HAMBURGER LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Clone to remove old listeners
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);

        newHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            newHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Hamburger clicked');
        });

        // Close when clicking links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!newHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    } else {
        console.error('Hamburger or Nav Menu not found!');
    }
});

// ==========================================
// HARDCODED HAMBURGER LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const hardHamburger = document.getElementById('hardcoded-hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hardHamburger && navMenu) {
        hardHamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Also toggle the standard hamburger active state if it exists
            const stdHamburger = document.querySelector('.hamburger');
            if (stdHamburger) stdHamburger.classList.toggle('active');
        });
    }
});
