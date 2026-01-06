/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Mar 17 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Rolagem para um elemento considerando header fixo
   * AVISO: Se você alterar a estrutura do header ou sua altura, ajuste o cálculo de `headerOffset` abaixo.
   * Use `scrollto(selector)` para rolagem suave programaticamente.
   */
  const scrollto = (el) => {
    const header = select('#header') || select('header')
    const headerOffset = header ? header.offsetHeight : 0
    let elementPos = select(el).offsetTop - headerOffset - 8 // small gap so section isn't hidden
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Manipulação de hash com tentativas para lidar com mudanças de layout (fonts/imagens/conteúdo assíncrono).
   * Parâmetros:
   *  - hash (string): seletor para rolar (ex.: '#contato')
   *  - attempts (number): número de tentativas antes do snap final
   *  - baseDelay (number): ms base para backoff entre tentativas
   * Ajuste esses valores padrão se notar problemas de alinhamento em conexões lentas/dispositivos.
   */
  function scrollToHashWithRetries(hash, attempts = 8, baseDelay = 100) {
    let tries = 0
    const header = select('#header') || select('header')
    const headerOffset = header ? header.offsetHeight : 0

    const tryScroll = () => {
      const el = select(hash)
      if (!el) return
      scrollto(hash)
      tries++

      const desiredY = el.offsetTop - headerOffset - 8
      const diff = Math.abs(window.scrollY - desiredY)

      if (diff > 40 && tries < attempts) {
        setTimeout(tryScroll, baseDelay * tries)
      } else {
        el.setAttribute('tabindex', '-1')
        try { el.focus({preventScroll: true}) } catch (e) { el.focus() }

        // Final snap after a short delay in case layout continues to shift
        setTimeout(() => {
          const finalEl = select(hash)
          if (!finalEl) return
          const finalDesiredY = finalEl.offsetTop - (header ? (select('#header') || select('header')).offsetHeight : 0) - 8
          // Use instantaneous scroll to ensure exact position
          window.scrollTo({ top: finalDesiredY, behavior: 'auto' })
          try { finalEl.focus({preventScroll: true}) } catch (e) { finalEl.focus() }
        }, baseDelay * 2)
      }
    }

    // Initial small delay to allow fonts/images to load
    setTimeout(tryScroll, 60)
  }

  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        // increase attempts/delay on initial load where resources may still shift layout
        scrollToHashWithRetries(window.location.hash, 8, 120)
      }
    }
  });

  // Also try when the hash changes (clicks that navigate within the site)
  window.addEventListener('hashchange', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollToHashWithRetries(window.location.hash, 8, 120)
    }
  });

  // pageshow covers bfcache/back-forward restores where load may not fire
  window.addEventListener('pageshow', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollToHashWithRetries(window.location.hash, 8, 120)
    }
  });

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()