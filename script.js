/**
 * MOHAMED RISHAN — FUTURISTIC PORTFOLIO JAVASCRIPT
 * Custom Cursor Motion Trail, 3D Parallax Scrolling, Kinetic Tilt,
 * Dynamic Typing, Project Modals & Form Submission
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. CUSTOM MOUSE POINTER MOTION & PARTICLE TRAIL ====================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const canvas = document.getElementById('cursor-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;
  let moveTimeout;

  // Resize trail canvas
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particles array for glowing trail
  const particles = [];

  class SparkParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = Math.random() * 2.5 + 1;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.color = Math.random() > 0.5 ? '#06B6D4' : '#8B5CF6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Mouse Move listener
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    // Spawn sparks on mouse movement
    if (ctx && Math.random() > 0.3) {
      particles.push(new SparkParticle(mouseX, mouseY));
    }

    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => { isMoving = false; }, 150);
  });

  // Animation Loop for Cursor Ring & Sparks
  function animateCursor() {
    // Smooth lerp for ring
    const ease = 0.18;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }

    // Render particles
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor Hover expansion on interactive elements
  const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .phone-mockup-frame, .laptop-mockup-frame, .poster-card-frame, .dock-item, .tool-card, .filter-btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) cursorRing.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorRing) cursorRing.classList.remove('cursor-hover');
    });
  });

  // Magnetic Pull Effect on Magnetic Elements
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const distanceX = e.clientX - btnCenterX;
      const distanceY = e.clientY - btnCenterY;

      btn.style.transform = `translate(${distanceX * 0.28}px, ${distanceY * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });

  // ==================== 2. FUTURISTIC 3D CARD TILT EFFECT ====================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease-out';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  // ==================== 3. PARALLAX SCROLL MOTION (UP & DOWN) ====================
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const kineticTitles = document.querySelectorAll('.kinetic-title, .kinetic-text');

  let lastScrollY = window.pageYOffset;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollY / docHeight) * 100;

    // Update Progress Bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Sticky Navbar blur
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Parallax on 3D icons when scrolling up and down
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight / 2 - rect.top) * speed;
        el.style.transform = `translateY(${offset}px)`;
      }
    });

    // Subtle kinetic typography shift
    kineticTitles.forEach(t => {
      const speed = parseFloat(t.getAttribute('data-speed')) || 1.1;
      const rect = t.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const tiltAngle = (scrollY - lastScrollY) * 0.15;
        t.style.transform = `skewX(${Math.max(-4, Math.min(4, tiltAngle))}deg)`;
      }
    });

    lastScrollY = scrollY;
  }, { passive: true });

  // Reset kinetic text skew when scrolling stops
  let scrollStopTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(() => {
      kineticTitles.forEach(t => {
        t.style.transform = 'skewX(0deg)';
        t.style.transition = 'transform 0.3s ease-out';
        setTimeout(() => { t.style.transition = ''; }, 300);
      });
    }, 120);
  });

  // ==================== 4. SCROLL-TRIGGERED REVEAL OBSERVER ====================
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // ScrollSpy Active Nav Link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  });

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // ==================== 5. DYNAMIC TYPING ANIMATIONS ====================
  // About Section Typing Effect
  const aboutPhrases = [
    "Crafting high-converting visual systems & intuitive digital experiences.",
    "Merging typography, 3D kinetic motion, and user psychology.",
    "Transforming visionary concepts into bold, unforgettable visual brand systems.",
    "Elevating modern enterprises through Figma design systems and cinematic video."
  ];

  const typedAboutElement = document.getElementById('typed-about');
  let aboutPhraseIndex = 0;
  let aboutCharIndex = 0;
  let isAboutDeleting = false;

  function typeAbout() {
    if (!typedAboutElement) return;
    const currentPhrase = aboutPhrases[aboutPhraseIndex];

    if (isAboutDeleting) {
      typedAboutElement.textContent = currentPhrase.substring(0, aboutCharIndex - 1);
      aboutCharIndex--;
    } else {
      typedAboutElement.textContent = currentPhrase.substring(0, aboutCharIndex + 1);
      aboutCharIndex++;
    }

    let nextSpeed = isAboutDeleting ? 25 : 55;

    if (!isAboutDeleting && aboutCharIndex === currentPhrase.length) {
      nextSpeed = 2400;
      isAboutDeleting = true;
    } else if (isAboutDeleting && aboutCharIndex === 0) {
      isAboutDeleting = false;
      aboutPhraseIndex = (aboutPhraseIndex + 1) % aboutPhrases.length;
      nextSpeed = 500;
    }

    setTimeout(typeAbout, nextSpeed);
  }
  typeAbout();

  // ==================== 6. WORK VIEW MORE & FILTER TABS ====================
  const viewMoreBtn = document.getElementById('view-more-btn');
  const viewMoreText = document.getElementById('view-more-text');
  const viewMoreIcon = document.getElementById('view-more-icon');
  const extraShowcases = document.getElementById('extra-showcases');
  let isExpanded = false;

  if (viewMoreBtn && extraShowcases) {
    viewMoreBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;

      if (isExpanded) {
        extraShowcases.style.display = 'block';
        extraShowcases.style.animation = 'toast-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        viewMoreText.textContent = "View Less";
        viewMoreIcon.classList.replace('fa-angles-down', 'fa-angles-up');
      } else {
        extraShowcases.style.display = 'none';
        viewMoreText.textContent = "View More Work";
        viewMoreIcon.classList.replace('fa-angles-up', 'fa-angles-down');
        document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allShowcaseBlocks = document.querySelectorAll('.showcase-block');
  const viewMoreBox = document.querySelector('.view-more-box');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Make extra-showcases visible when a specific filter is selected so filtered items render
      if (extraShowcases) {
        if (filter !== 'all') {
          extraShowcases.style.display = 'block';
        } else if (!isExpanded) {
          extraShowcases.style.display = 'none';
        }
      }

      if (viewMoreBox) {
        viewMoreBox.style.display = (filter === 'all') ? '' : 'none';
      }

      allShowcaseBlocks.forEach(block => {
        const category = block.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          block.style.display = '';
        } else {
          block.style.display = 'none';
        }
      });
    });
  });

  // ==================== 7. PROJECT DETAIL CASE STUDY MODAL ====================
  const projectDetails = {
    'project-1': {
      title: "KickOff — Sports League & Tactical Pitch App",
      category: "UI/UX Mobile App Design",
      year: "2026",
      image: "assets/images/workbanner01.png",
      overview: "Comprehensive digital product designed for modern football leagues, managers, and sports analysts. Features real-time match statistics, player telemetry cards, live tactical formation boards (4-3-3, 4-2-3-1), and custom pitch visualization in high contrast dark mode.",
      deliverables: [
        "Complete High-Fidelity Figma Mobile App System (120+ Components)",
        "Dark Mode Contrast Architecture & Accessibility Standards",
        "Interactive Tactical Pitch Vector Formation Tokens",
        "Micro-Interactions and Sound-Synced Transitions"
      ],
      tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Prototyping"]
    },
    'project-2': {
      title: "Cookies Food Express — On-Demand Mobile Delivery",
      category: "UI/UX Mobile Product Design",
      year: "2025",
      image: "assets/images/workbanner02.png",
      overview: "Intuitive food discovery and rapid checkout mobile application. Designed to simplify multi-vendor bakery orders with personalized deal carousels, dynamic cart calculations, and frictionless one-tap payment flows.",
      deliverables: [
        "End-to-End User Flow & Wireframe System",
        "Component-Driven Design Library with Auto-Layout in Figma",
        "High-Converting Promotional Banner Graphics",
        "Mobile Usability & Heuristic Evaluation"
      ],
      tools: ["Figma", "Illustrator", "Photoshop", "Design Systems"]
    },
    'project-3': {
      title: "Arsenal Home & Matchday Digital Web Portal",
      category: "Web Design & Interactive UI",
      year: "2025",
      image: "assets/images/workbanner03.png",
      overview: "Flagship interactive desktop and tablet sports portal for Arsenal FC matchday experience. Packed with responsive ball mastery stats, live telemetry feeds, player spotlight cards, and seamless ticket reservation flows.",
      deliverables: [
        "Responsive Grid Layout Architecture for 4K & Mobile",
        "Live Fixture Scoreboards & Dynamic Player Match Ratings",
        "High-Fidelity Matchday Visual Collaterals",
        "CSS/JS Interactive Motion Prototyping"
      ],
      tools: ["Figma", "HTML5", "CSS3", "JavaScript", "Photoshop"]
    },
    'project-4': {
      title: "Cyber Retro Wave & Party Club Night Posters",
      category: "Adobe Photoshop Poster Art",
      year: "2024",
      image: "assets/images/poster-cyber-wave full view.png",
      overview: "A series of high-impact event promotional posters celebrating cyber wave aesthetics, bold typography, and electrifying nightlife culture. Crafted using complex photo compositing, neon glow grading, and custom vector typography.",
      deliverables: [
        "A1/A2 Print-Ready CMYK Poster Files with 300 DPI Separation",
        "Social Media Ad Packs (1:1 Feed & 9:16 Story Formats)",
        "Advanced Color Grading & Glow Lighting Layers",
        "Over 85,000 Social Impressions and Event Sold-Out Results"
      ],
      tools: ["Adobe Photoshop", "Adobe Illustrator", "Typography", "Print Specs"]
    },
    'project-5': {
      title: "Festive Holiday & Neon Cyber Tech Product Creatives",
      category: "Brand Campaign & Ad Creative Design",
      year: "2024",
      image: "assets/images/poster-xmas-festive full view.png",
      overview: "Multi-channel advertising campaigns featuring 3D glowing cyber hardware product visuals and festive Christmas retail promotional assets. Designed to maintain brand prestige while driving record holiday conversion.",
      deliverables: [
        "High-Resolution 3D Hardware Vector Product Renders",
        "E-Commerce Holiday Banner Suites & Display Ads",
        "Print Highway Billboards & Retail Storefront Collaterals",
        "Cohesive Typography and Brand Color Harmony System"
      ],
      tools: ["Adobe Illustrator", "Adobe Photoshop", "Ad Creative", "Layout"]
    },
    'project-6': {
      title: "Vedayur — Viral Animated Social Reels & Logo Motion",
      category: "Motion Graphics & Short-Form Video Editing",
      year: "2024",
      image: "assets/images/project-6.svg",
      overview: "Viral 9:16 vertical video reel campaign, kinetic sound wave animations, fluid transitions, and wellness branding with over 1.2M collective impressions. Built for maximum retention on Instagram Reels and YouTube Shorts.",
      deliverables: [
        "60 FPS Kinetic Typography Motion Teasers",
        "Sound-Synchronized Visual Transitions & Sound Design",
        "Animated Brand Logo Reveal Stinger",
        "Short-Form Video Template System in Premiere Pro & After Effects"
      ],
      tools: ["Adobe After Effects", "Adobe Premiere Pro", "Kinetic Typography", "CapCut"]
    },
    'project-7': {
      title: "KickOff Web — Sports League & Tactical Pitch App",
      category: "UI/UX Mobile App Design",
      year: "2026",
      image: "assets/images/workbanner04.png",
      overview: "Comprehensive digital product designed for modern football leagues, managers, and sports analysts. Features real-time match statistics, player telemetry cards, live tactical formation boards (4-3-3, 4-2-3-1), and custom pitch visualization in high contrast dark mode.",
      deliverables: [
        "Complete High-Fidelity Figma Mobile App System (120+ Components)",
        "Dark Mode Contrast Architecture & Accessibility Standards",
        "Interactive Tactical Pitch Vector Formation Tokens",
        "Micro-Interactions and Sound-Synced Transitions"
      ],
      tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Prototyping"]

    },
    'project-8': {
      title: "Cyber Retro Wave & Party Club Night Posters",
      category: "Adobe Photoshop Poster Art",
      year: "2024",
      image: "assets/images/poster-night-party full view.png",
      overview: "A series of high-impact event promotional posters celebrating cyber wave aesthetics, bold typography, and electrifying nightlife culture. Crafted using complex photo compositing, neon glow grading, and custom vector typography.",
      deliverables: [
        "A1/A2 Print-Ready CMYK Poster Files with 300 DPI Separation",
        "Social Media Ad Packs (1:1 Feed & 9:16 Story Formats)",
        "Advanced Color Grading & Glow Lighting Layers",
        "Over 85,000 Social Impressions and Event Sold-Out Results"
      ],
      tools: ["Adobe Photoshop", "Adobe Illustrator", "Typography", "Print Specs"]
    },
    'project-9': {
      title: "Festive Holiday & Neon Cyber Tech Product Creatives",
      category: "Brand Campaign & Ad Creative Design",
      year: "2024",
      image: "assets/images/poster-cyber-mouse full view.png",
      overview: "Multi-channel advertising campaigns featuring 3D glowing cyber hardware product visuals and festive Christmas retail promotional assets. Designed to maintain brand prestige while driving record holiday conversion.",
      deliverables: [
        "High-Resolution 3D Hardware Vector Product Renders",
        "E-Commerce Holiday Banner Suites & Display Ads",
        "Print Highway Billboards & Retail Storefront Collaterals",
        "Cohesive Typography and Brand Color Harmony System"
      ],
      tools: ["Adobe Illustrator", "Adobe Photoshop", "Ad Creative", "Layout"]
    },
    'project-10': {
      title: "MotoVault - Your Vehicle Data Wallet",
      category: "UI/UX Mobile App Design",
      year: "2024",
      image: "assets/images/workbanner05.png",
      overview: "MotoVault is an all-in-one digital garage application designed to store vehicle documents, track service histories, and deliver automated maintenance reminders right to your pocket.",
      deliverables: [
        "Complete High-Fidelity Figma Mobile App System (120+ Components)",
        "Dark Mode Contrast Architecture & Accessibility Standards",
        "Interactive Tactical Pitch Vector Formation Tokens",
        "Micro-Interactions and Sound-Synced Transitions"
      ],
      tools: ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Prototyping"]
    },
    'project-video-1': {
      title: "Finergy Future Power — Clean Tech Commercial Motion Ad",
      category: "Commercial Motion Graphics & Video Editing",
      year: "2026",
      image: "assets/images/video-finergy-cover.png",
      video: "assets/videos/uiflow v7.mp4",
      overview: "High-energy commercial advertisement and kinetic motion reveal crafted for Finergy Clean Power. Highlights renewable solar grids, electrical particle energy arcs, and sleek 3D mechanical transitions engineered in Premiere Pro and After Effects.",
      deliverables: [
        "15-Second High-Impact Commercial Broadcast Ad",
        "Cinematic 3D Energy Particle Flow & Neon Lighting FX",
        "Custom Kinetic Typography & Synchronized Sound Design",
        "Multi-Platform Delivery (16:9 Landscape & 9:16 Social Cutdowns)"
      ],
      tools: ["Adobe Premiere Pro", "Adobe After Effects", "3D Motion Design", "Sound Design"]
    },
    'project-video-2': {
      title: "TripSogo — Cinematic Kerala Tourism & Cultural Wanderlust Reel",
      category: "Cinematic Travel Film & Reel Editing",
      year: "2025",
      image: "assets/images/video-tripsogo-cover.jpg",
      video: "assets/videos/tripsogo-travel-reel.mp4",
      overview: "A vibrant, rhythm-synchronized travel film highlighting Kerala's scenic backwaters, houseboats, and rich cultural traditions for TripSogo tourism. Built with dynamic speed ramps, immersive ambient audio, and warm cinematic color grading.",
      deliverables: [
        "Cinematic 4K Color Grading & Lumetri Looks",
        "Rhythmic Beat-Matched Jump Cuts & Speed Ramps",
        "Spatial Ambient Sound Design & Traditional Music Scoring",
        "Over 90K Organic Reach on Tourism Campaign Reels"
      ],
      tools: ["Adobe Premiere Pro", "Color Grading", "Sound Design", "After Effects"]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContentTarget = document.getElementById('modal-content-target');

  let modalVideoTimer = null;
  let modalCountdownInterval = null;

  function stopModalVideo() {
    if (modalVideoTimer) {
      clearTimeout(modalVideoTimer);
      modalVideoTimer = null;
    }
    if (modalCountdownInterval) {
      clearInterval(modalCountdownInterval);
      modalCountdownInterval = null;
    }
    const v = document.getElementById('project-modal-video');
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }

  window.openProjectModal = function (projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal || !modalContentTarget) return;

    stopModalVideo();

    const mediaHtml = data.video ? `
      <div class="video-player-wrapper" oncontextmenu="return false;" ondragstart="return false;">
        <video id="project-modal-video" 
               src="${data.video}" 
               poster="${data.image}" 
               playsinline 
               controls 
               controlsList="nodownload nofullscreen noplaybackrate" 
               disablePictureInPicture 
               disableRemotePlayback 
               oncontextmenu="return false;" 
               ondragstart="return false;" 
               style="width: 100%; max-height: 430px; display: block; object-fit: contain; background: #000; margin: 0 auto; user-select: none; -webkit-user-select: none;"></video>
        
        <!-- Top-Left: Authorship & Protection Security Badge -->
        <div class="video-security-badge">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Protected Project • View Only</span>
        </div>

        <!-- Top-Right: Auto-play 5s Preview Countdown Timer Badge -->
        <div id="video-timer-badge" style="position: absolute; top: 12px; right: 12px; background: rgba(3, 7, 18, 0.88); border: 1px solid rgba(6, 182, 212, 0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 6px 14px; border-radius: 9999px; font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: var(--cyan); display: flex; align-items: center; gap: 8px; z-index: 10; pointer-events: none; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); display: inline-block; box-shadow: 0 0 10px var(--cyan);"></span>
          <span id="video-timer-text">Auto-playing preview (5s)</span>
        </div>
      </div>
    ` : `
      <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 24px; border: 1px solid var(--border-glass); background: #07090E;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 420px; object-fit: cover;" draggable="false" oncontextmenu="return false;">
      </div>
    `;

    modalContentTarget.innerHTML = `
      <div style="margin-bottom: 18px;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--cyan); background: rgba(6, 182, 212, 0.1); padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(6, 182, 212, 0.25);">
          ${data.category} • ${data.year}
        </span>
        <h2 style="font-family: var(--font-heading); font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #FFFFFF; margin: 12px 0 16px 0;">
          ${data.title}
        </h2>
      </div>

      ${mediaHtml}

      <div style="margin-bottom: 22px;">
        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--cyan); margin-bottom: 8px; font-weight: 700;">
          Project Overview
        </h4>
        <p style="color: var(--text-secondary); font-size: 0.98rem; line-height: 1.75;">
          ${data.overview}
        </p>
      </div>

      <div style="margin-bottom: 26px;">
        <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: #FFFFFF; margin-bottom: 12px; font-weight: 700;">
          Key Deliverables & Execution
        </h4>
        <ul style="display: flex; flex-direction: column; gap: 10px; color: #CBD5E1; font-size: 0.94rem;">
          ${data.deliverables.map(d => `<li style="display: flex; align-items: flex-start; gap: 10px;"><i class="fa-solid fa-circle-check" style="color: var(--emerald); font-size: 0.95rem; margin-top: 4px;"></i> <span>${d}</span></li>`).join('')}
        </ul>
      </div>

      <div style="border-top: 1px solid var(--border-glass); padding-top: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${data.tools.map(t => `<span style="font-size: 0.8rem; font-family: var(--font-mono); background: rgba(255,255,255,0.06); padding: 5px 14px; border-radius: 6px; color: #E2E8F0; border: 1px solid var(--border-glass);">${t}</span>`).join('')}
        </div>
        <a href="#contact" onclick="stopModalVideo(); document.getElementById('project-modal').classList.remove('open')" class="btn btn-primary btn-sm magnetic-btn">
          <span>Inquire About Similar Project</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    `;

    projectModal.classList.add('open');

    // If project has video, enforce security restrictions & auto-play for 5 seconds as requested
    if (data.video) {
      const modalVideo = document.getElementById('project-modal-video');
      const timerBadge = document.getElementById('video-timer-badge');
      const timerText = document.getElementById('video-timer-text');

      if (modalVideo) {
        // Enforce anti-download and full-view removal restrictions programmatically
        modalVideo.controlsList = 'nodownload nofullscreen noplaybackrate';
        modalVideo.setAttribute('controlslist', 'nodownload nofullscreen noplaybackrate');
        modalVideo.disablePictureInPicture = true;
        modalVideo.disableRemotePlayback = true;

        // Context menu & drag protection with user-friendly security toast
        const blockVideoAction = (e) => {
          e.preventDefault();
          e.stopPropagation();
          showToast('Video download is disabled. Content is protected.', 'fa-solid fa-shield-halved');
          return false;
        };

        modalVideo.addEventListener('contextmenu', blockVideoAction);
        modalVideo.addEventListener('dragstart', (e) => e.preventDefault());
        modalVideo.addEventListener('dblclick', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        const wrapper = modalVideo.closest('.video-player-wrapper');
        if (wrapper) {
          wrapper.addEventListener('contextmenu', blockVideoAction);
          wrapper.addEventListener('dragstart', (e) => e.preventDefault());
          wrapper.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
          });
        }

        modalVideo.currentTime = 0;
        const playPromise = modalVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            modalVideo.muted = true;
            modalVideo.play().catch(() => { });
          });
        }

        let secondsRemaining = 5;
        modalCountdownInterval = setInterval(() => {
          secondsRemaining--;
          if (secondsRemaining > 0 && timerText) {
            timerText.textContent = `Auto-playing preview (${secondsRemaining}s)`;
          }
        }, 1000);

        modalVideoTimer = setTimeout(() => {
          if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
          }
          if (modalCountdownInterval) {
            clearInterval(modalCountdownInterval);
            modalCountdownInterval = null;
          }
          if (timerBadge) {
            timerBadge.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--emerald);"></i> <span>5s preview finished • Press play to continue</span>';
          }
        }, 5000);

        // Update badge dynamically when user manually plays or pauses after preview
        modalVideo.addEventListener('play', () => {
          if (!modalVideoTimer && timerBadge) {
            timerBadge.innerHTML = '<i class="fa-solid fa-play" style="color: var(--cyan);"></i> <span>Playing • Protected Preview</span>';
          }
        });

        modalVideo.addEventListener('pause', () => {
          if (!modalVideoTimer && timerBadge && modalVideo.currentTime < modalVideo.duration) {
            timerBadge.innerHTML = '<i class="fa-solid fa-pause" style="color: var(--cyan);"></i> <span>Paused • Press play to resume</span>';
          }
        });

        modalVideo.addEventListener('ended', () => {
          if (timerBadge) {
            timerBadge.innerHTML = '<i class="fa-solid fa-rotate-right" style="color: var(--cyan);"></i> <span>Video completed</span>';
          }
        });
      }
    }
  };

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      stopModalVideo();
      projectModal.classList.remove('open');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        stopModalVideo();
        projectModal.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('open')) {
        stopModalVideo();
        projectModal.classList.remove('open');
      }
    });
  }

  // ==================== 8. RESUME MODAL & DOWNLOAD ====================
  const resumeDownloadBtn = document.getElementById('resume-download-btn');
  const resumeModal = document.getElementById('resume-modal');
  const resumeCloseBtn = document.getElementById('resume-close-btn');

  if (resumeDownloadBtn && resumeModal) {
    resumeDownloadBtn.addEventListener('click', () => {
      // Trigger actual download
      const link = document.createElement('a');
      link.href = 'assets/Rishan_Resume.pdf';
      link.download = 'Rishan_Graphic_Designer_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open preview modal
      resumeModal.classList.add('open');
      showToast('Resume download initiated! Preview open.', 'fa-solid fa-file-circle-check');
    });

    if (resumeCloseBtn) {
      resumeCloseBtn.addEventListener('click', () => {
        resumeModal.classList.remove('open');
      });
    }

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('open');
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal) {
        stopModalVideo();
        projectModal.classList.remove('open');
      }
      if (resumeModal) resumeModal.classList.remove('open');
    }

    // Block Ctrl+S / Cmd+S save shortcuts when modal or media is active
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      if (projectModal && projectModal.classList.contains('open')) {
        e.preventDefault();
        showToast('Saving media is restricted. Content is view-only.', 'fa-solid fa-shield-halved');
      }
    }

    // Block 'f'/'F' fullscreen toggle shortcut when viewing video modal
    if ((e.key === 'f' || e.key === 'F') && projectModal && projectModal.classList.contains('open')) {
      if (document.getElementById('project-modal-video')) {
        e.preventDefault();
      }
    }
  });

  // Global anti-theft video protection: Prevent right-click context menu on all video elements
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'VIDEO' || e.target.closest('.video-project-card') || e.target.closest('.video-player-wrapper')) {
      e.preventDefault();
      showToast('Video download is disabled. Creative work is protected.', 'fa-solid fa-shield-halved');
      return false;
    }
  });

  // ==================== 9. CONTACT FORM SUBMISSION ====================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'fa-solid fa-circle-exclamation');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please provide a valid email address.', 'fa-solid fa-circle-exclamation');
        return;
      }

      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalContent = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Dispatching...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
        contactForm.reset();
        showToast(`Thank you, ${name}! Your inquiry has been sent to Rishan.`, 'fa-solid fa-circle-check');
      }, 1200);
    });
  }

  // ==================== 10. TOAST NOTIFICATION HELPER ====================
  function showToast(message, iconClass = 'fa-solid fa-circle-info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}" style="color: var(--cyan);"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

});
