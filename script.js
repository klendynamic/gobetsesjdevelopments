// Small JS for SJ Developments site
document.addEventListener('DOMContentLoaded', function(){
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle for small screens
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('show');
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        const offset = 70; // top nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top,behavior:'smooth'});
        // close nav on mobile when navigating
        if(navLinks && navLinks.classList.contains('show')){
          navLinks.classList.remove('show');
          if(navToggle) navToggle.setAttribute('aria-expanded','false');
        }
      }
    });
  });

  // Services carousel: left/right arrows that smoothly scroll the horizontal services track
  const servicesTrack = document.querySelector('.services-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  function updateCarouselButtons(){
    if(!servicesTrack || !prevBtn || !nextBtn) return;
    const maxScroll = servicesTrack.scrollWidth - servicesTrack.clientWidth;
    // keep buttons visible but mark inactive at ends
    prevBtn.classList.toggle('inactive', !(servicesTrack.scrollLeft > 8));
    nextBtn.classList.toggle('inactive', !(servicesTrack.scrollLeft < maxScroll - 8));
  }
  if(servicesTrack && (prevBtn || nextBtn)){
    const scrollAmount = () => Math.round(servicesTrack.clientWidth * 0.8);
    if(prevBtn) prevBtn.addEventListener('click', ()=> servicesTrack.scrollBy({left: -scrollAmount(), behavior:'smooth'}));
    if(nextBtn) nextBtn.addEventListener('click', ()=> servicesTrack.scrollBy({left: scrollAmount(), behavior:'smooth'}));
    // update button visibility on scroll/resize
    servicesTrack.addEventListener('scroll', updateCarouselButtons);
    window.addEventListener('resize', updateCarouselButtons);
    // initialize
    updateCarouselButtons();
  }

  // keyboard navigation for services track when focused
  if(servicesTrack){
    servicesTrack.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){
        e.preventDefault();
        servicesTrack.scrollBy({left: -Math.round(servicesTrack.clientWidth * 0.6), behavior:'smooth'});
      } else if(e.key === 'ArrowRight'){
        e.preventDefault();
        servicesTrack.scrollBy({left: Math.round(servicesTrack.clientWidth * 0.6), behavior:'smooth'});
      }
    });
  }

  // Projects rail: left/right arrows to scroll projects track
  const projectsTrack = document.querySelector('.projects-track');
  const projectsPrev = document.querySelector('.projects-prev');
  const projectsNext = document.querySelector('.projects-next');
  function updateProjectsButtons(){
    if(!projectsTrack || !projectsPrev || !projectsNext) return;
    const maxScroll = projectsTrack.scrollWidth - projectsTrack.clientWidth;
    // keep visible but toggle inactive class at ends
    projectsPrev.classList.toggle('inactive', !(projectsTrack.scrollLeft > 8));
    projectsNext.classList.toggle('inactive', !(projectsTrack.scrollLeft < maxScroll - 8));
  }
  if(projectsTrack && (projectsPrev || projectsNext)){
    const projScrollAmt = () => Math.round(projectsTrack.clientWidth * 0.85);
    if(projectsPrev) projectsPrev.addEventListener('click', ()=> projectsTrack.scrollBy({left: -projScrollAmt(), behavior:'smooth'}));
    if(projectsNext) projectsNext.addEventListener('click', ()=> projectsTrack.scrollBy({left: projScrollAmt(), behavior:'smooth'}));
    projectsTrack.addEventListener('scroll', updateProjectsButtons);
    window.addEventListener('resize', updateProjectsButtons);
    updateProjectsButtons();
  }

  // keyboard navigation for projects track when focused
  if(projectsTrack){
    projectsTrack.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){
        e.preventDefault();
        projectsTrack.scrollBy({left: -Math.round(projectsTrack.clientWidth * 0.7), behavior:'smooth'});
      } else if(e.key === 'ArrowRight'){
        e.preventDefault();
        projectsTrack.scrollBy({left: Math.round(projectsTrack.clientWidth * 0.7), behavior:'smooth'});
      }
    });
  }

  // Hero scroll arrow behaviour: animate briefly and smooth-scroll to #about
  const heroScrollBtn = document.querySelector('.hero-scroll');
  const siteHeader = document.querySelector('.site-header');
  const aboutSection = document.querySelector('#about');
  if(heroScrollBtn && aboutSection){
    const scrollToAbout = ()=>{
      const navHeight = siteHeader ? siteHeader.getBoundingClientRect().height : 70;
      const top = aboutSection.getBoundingClientRect().top + window.scrollY - navHeight - 12; // small extra offset
      // add pressed state to stop bounce and give feedback
      heroScrollBtn.classList.add('clicked');
      // perform smooth scroll
      window.scrollTo({top, behavior:'smooth'});
      // remove clicked state after animation completes
      setTimeout(()=> heroScrollBtn.classList.remove('clicked'), 700);
    };

    heroScrollBtn.addEventListener('click', function(e){
      e.preventDefault();
      scrollToAbout();
    });

    // keyboard activation for accessibility (Enter / Space)
    heroScrollBtn.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
        e.preventDefault();
        scrollToAbout();
      }
    });
  }

  // Reveal-on-scroll for aside box (if present)
  const revealTargets = document.querySelectorAll('.reveal-on-scroll');
  if(revealTargets && revealTargets.length){
    const observer = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    revealTargets.forEach(t=> observer.observe(t));
  }

  // Project Modal System
  const projectModal = document.getElementById('project-modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalMainImage = document.getElementById('modal-main-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalLocation = document.getElementById('modal-location');
  const modalDate = document.getElementById('modal-date');
  const modalType = document.getElementById('modal-type');
  const modalThumbs = document.querySelector('.modal-thumbnails'); // Changed to container
  const modalPrev = document.querySelector('.modal-prev');
  const modalNext = document.querySelector('.modal-next');

  // Project data - you can expand this with more projects and images
  const projectData = {
    modishane: {
      title: 'Renovation Of Admin Block And 1x3 Classroom ',
      description: 'Scope of work :  Construction of new Grade R facility,Construction of play area,Renovation of admin block and 1 x 3 classroom blockPaving',
      location: 'Modishane Primary School,GoodHope,Limpopo',
      date: 'June 2023',
      type: 'Renovation',
      images: [
        'images/Projects/Modishane/IMG-20251106-WA0021.jpg',
        'images/Projects/Modishane/IMG-20251106-WA0020.jpg',
        'images/Projects/Modishane/IMG-20251106-WA0017.jpg',
        'images/Projects/Modishane/IMG-20251106-WA0024.jpg',
        'images/Projects/Modishane/IMG-20251106-WA0018.jpg'
      ]
    },
    kgomotlou: {
      title: 'Storm Water Management On Ablution Toilets',
      description: 'Scope of work: Construction of Screen wall, Construction of v-drain ,Paving around the  toilet',
      location: 'Kgomotlou Primary School,Limpopo',
      date: 'October 2024',
      type: 'General Building',
      images: [
        'images/Projects/Kgomotlou/DJI_0097.JPG',
        'images/Projects/Kgomotlou/DJI_0379.JPG',
        'images/Projects/Kgomotlou/DJI_0439.JPG',
        'images/Projects/Kgomotlou/DJI_0440.JPG',
        'images/Projects/Kgomotlou/DJI_0442.JPG'
      ]
    },
    pitsaneng: {
      title: 'Storm Water Management On Ablution Toilets',
      description: 'Scope of work: Construction of Retaining wall, Construction of v-drain ,Paving around the  toilet',
      location: 'Pitsaneng Primary School,Limpopo',
      date: 'October 2024',
      type: 'General Building',
      images: [
        'images/Projects/Pitsaneng/DJI_0351.JPG',
        'images/Projects/Pitsaneng/DJI_0350.JPG',
        'images/Projects/Pitsaneng/DJI_0354.JPG',
        'images/Projects/Pitsaneng/DJI_0358.JPG'
      ]
    },
    letau: {
      title: 'Storm Water Management On Ablution Toilets',
      description: 'Scope of work : Construction of Retaining wall, Construction of v-drain ,Paving around the  toilet',
      location: 'Letau Secondary School, Limpopo',
      date: 'October 2024',
      type: 'General Building',
      images: [
        'images/Projects/Letau/DJI_0339.JPG',
        'images/Projects/Letau/DJI_0292.JPG',
        'images/Projects/Letau/DJI_0421.JPG',
        'images/Projects/Letau/DJI_0422.JPG'
      ]
    },
    DepartmentofEconomicDevelopmentEnvironmentandTourismLimpopo: {
      title: 'Department of Economic Development, Environment and Tourism Limpopo',
      description: 'SUPPLY AND DELIVERY OF LAWN MOWER',
      location: 'Limpopo',
      date: 'March 2025',
      type: 'Supply of Office Stationery, Furniture & Equipments',
      images: [
        'images/Projects/grass machine/IMG-20251106-WA0026.jpg',
        'images/Projects/grass machine/IMG-20251106-WA0027.jpg',
        'images/Projects/grass machine/IMG-20251106-WA0029.jpg'
      ]
    },
    LimpopoDepartmentofTransportAndCommunitySafety: {
      title: 'Limpopo Department of Transport And Community Safety',
      description: 'Replacement of vinyl floor for Modular office at Nebo Traffic Station',
      location: 'Nebo, Limpopo',
      date: 'March 2025',
      type: 'Maintenance Of Mobile Offices',
      images: [
        'images/Projects/MobileClass/mobileclassroom.jpg',
        'images/Projects/MobileClass/IMG-20251106-WA0012.jpg',
        'images/Projects/MobileClass/IMG-20251106-WA0013.jpg',
        'images/Projects/MobileClass/IMG-20251106-WA0014.jpg',
        'images/Projects/grass machine/IMG-20251106-WA0030.jpg'
      ]
    }
  };

  let currentProject = null;
  let currentImageIndex = 0;

  // Open modal function
  function openModal(projectKey) {
    currentProject = projectData[projectKey];
    if (!currentProject) return;
    
    currentImageIndex = 0;
    updateModalContent();
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  // Close modal function
  function closeModal() {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Update modal content
  function updateModalContent() {
    if (!currentProject) return;
    
    modalTitle.textContent = currentProject.title;
    // Render description: if it contains commas, split into bullets for clarity
    const descText = currentProject.description || '';
    if (descText.includes(',')) {
      const parts = descText.split(',').map(s => s.trim()).filter(Boolean);
      modalDesc.innerHTML = '<ul class="modal-desc-list">' + parts.map(p => `<li>${p}</li>`).join('') + '</ul>';
    } else {
      modalDesc.textContent = descText;
    }
    modalLocation.textContent = currentProject.location;
    modalDate.textContent = currentProject.date;
    modalType.textContent = currentProject.type;
    
    // Update main image
    modalMainImage.src = currentProject.images[currentImageIndex];
    modalMainImage.alt = currentProject.title;
    
    // Generate thumbnails dynamically
    modalThumbs.innerHTML = '';
    currentProject.images.forEach((imageSrc, index) => {
      const thumb = document.createElement('img');
      thumb.className = 'modal-thumb';
      thumb.src = imageSrc;
      thumb.alt = `${currentProject.title} - Image ${index + 1}`;
      thumb.classList.toggle('active', index === currentImageIndex);
      
      thumb.addEventListener('click', () => {
        currentImageIndex = index;
        updateModalContent();
      });
      
      modalThumbs.appendChild(thumb);
    });
  }

  // Navigate images
  function nextImage() {
    if (currentProject && currentImageIndex < currentProject.images.length - 1) {
      currentImageIndex++;
      updateModalContent();
    }
  }

  function prevImage() {
    if (currentProject && currentImageIndex > 0) {
      currentImageIndex--;
      updateModalContent();
    }
  }

  // Event listeners for projects
  document.querySelectorAll('.project[data-project]').forEach(project => {
    project.addEventListener('click', function() {
      const projectKey = this.getAttribute('data-project');
      openModal(projectKey);
    });
  });

  // Modal controls
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalNext) modalNext.addEventListener('click', nextImage);
  if (modalPrev) modalPrev.addEventListener('click', prevImage);

  // Thumbnail clicks
  modalThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      currentImageIndex = index;
      updateModalContent();
    });
  });

  // Keyboard navigation for modal
  document.addEventListener('keydown', function(e) {
    if (!projectModal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevImage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextImage();
        break;
    }
  });
});
