// Simple i18n toggle: ES <-> EN
(function(){
  const STORAGE_KEY = 'site_lang';
  const translations = {
    // Nav
    'Inicio':'Home',
    'Sobre nosotros':'About us',
    'Mujer':'Women',
    'Hombre':'Men',
    'Niños':'Kids',
    'Novedades':'New',
    'Ofertas':'Offers',
    'Colecciones':'Collections',
    'Más':'More',
    'Ropa Deportiva':'Sportswear',
    'Trajes de Baño':'Swimwear',
    'Ropa Interior':'Underwear',
    'Sudaderas':'Sweatshirts',
    'Gorras':'Hats',
    'Accesorios':'Accessories',
    'Vestidos':'Dresses',
    'Tops y Blusas':'Tops & Blouses',
    'Pantalones':'Pants',
    'Faldas':'Skirts',
    'Chaquetas':'Jackets',
    'Shorts':'Shorts',
    'Bolsos':'Bags',
    'Joyería':'Jewelry',
    'Zapatos':'Shoes',
    'Camisas':'Shirts',
    'Camisetas':'T-Shirts',
    'Trajes':'Suits',
    'Ropa de bebé':'Baby',
    'Favoritos':'Favorites',
    'Carrito':'Cart',
    'Mi cuenta':'My account',
    // Topbar
    '¡Envío gratis en pedidos superiores a $49.99!':'Free shipping on orders over $49.99!',
    'Ayuda':'Help',
    'Seguimiento':'Tracking',
    // Filters / UI
    'Mostrando 0 productos':'Showing 0 products',
    'Mostrando 8 de 8 productos':'Showing 8 of 8 products',
    'Mostrando 9 de 9 productos':'Showing 9 of 9 products',
    'Ordenar por: Destacados':'Sort by: Featured',
    'Precio: menor a mayor':'Price: low to high',
    'Precio: mayor a menor':'Price: high to low',
    'Más nuevos':'Newest',
    'Mejor valorados':'Top rated',
    'Buscar productos, marcas y más...':'Search products, brands and more...',
    // Auth
    'Iniciar Sesión':'Sign In',
    'Registrarse':'Register',
    'Crear Cuenta':'Create Account',
    // Footer
    'Ayuda Premium':'Help',
    'Centro de ayuda 24/7':'24/7 Help Center',
    'Cómo comprar':'How to buy',
    'Guía de tallas premium':'Size guide',
    'Envíos express':'Express shipping',
    'Acerca de':'About',
    'Contacto Premium':'Contact',
    'Todos los derechos reservados.':'All rights reserved.'
  };

  function getStored(){ return localStorage.getItem(STORAGE_KEY) || 'es'; }
  function setStored(lang){ localStorage.setItem(STORAGE_KEY, lang); }

  function translateTextNode(node, lang){
    if(!node || node.nodeType !== Node.TEXT_NODE) return;
    const original = node.textContent.trim();
    if(!original) return;
    if(lang === 'es'){
      // try to find english->spanish (reverse mapping)
      for(const [es,en] of Object.entries(translations)){
        if(original === en){ node.textContent = node.textContent.replace(en, es); return; }
      }
    } else {
      if(translations[original]){ node.textContent = node.textContent.replace(original, translations[original]); return; }
      // handle patterns
      const mostrando = original.match(/Mostrando\s*(\d+)(?:\s*de\s*(\d+))?\s*productos/i);
      if(mostrando){
        const a = mostrando[2] ? `Showing ${mostrando[1]} of ${mostrando[2]} products` : `Showing ${mostrando[1]} products`;
        node.textContent = node.textContent.replace(mostrando[0], a);
        return;
      }
    }
  }

  function translateAttributes(el, lang){
    const attrMap = ['placeholder','alt','title','value','aria-label'];
    attrMap.forEach(attr=>{
      if(!el.hasAttribute || !el.hasAttribute(attr)) return;
      const val = el.getAttribute(attr).trim();
      if(!val) return;
      if(lang === 'en'){
        if(translations[val]) el.setAttribute(attr, translations[val]);
        else if(val.includes('Buscar')) el.setAttribute(attr, 'Search products, brands and more...');
      } else {
        // reverse lookup
        for(const [es,en] of Object.entries(translations)){
          if(val === en){ el.setAttribute(attr, es); return; }
        }
        if(val.includes('Search')) el.setAttribute(attr, 'Buscar productos, marcas y más...');
      }
    });
  }

  function walkAndTranslate(root, lang){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while(node = walker.nextNode()){
      translateTextNode(node, lang);
    }
    // attributes
    root.querySelectorAll('*').forEach(el=>translateAttributes(el, lang));

    // data-i18n explicit keys (preferred for stable translations)
    root.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(!key) return;
      if(lang === 'en' && translations[key]) el.textContent = translations[key];
      if(lang === 'es' && translations[key]) el.textContent = key;
    });
  }

  function updateLanguageUI(lang){
    document.querySelectorAll('.language-selector').forEach(el=>{
      el.innerHTML = '<i class="fas fa-globe"></i> ' + (lang==='en' ? 'EN' : 'ES');
    });
  }

  // If header has no .language-selector, inject a small toggle button in the top-links
  function ensureToggleButton(){
    if(document.querySelector('.language-selector')) return;
    const topLinks = document.querySelector('.top-links') || document.querySelector('.header-content');
    if(!topLinks) return;
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'language-selector';
    a.style.cursor = 'pointer';
    a.innerHTML = '<i class="fas fa-globe"></i> ES';
    topLinks.appendChild(a);
  }

  function setLanguage(lang){
    const current = getStored();
    if(lang === current) return;
    setStored(lang);
    // translate whole body
    if(lang === 'en') walkAndTranslate(document.body, 'en');
    else walkAndTranslate(document.body, 'es');
    updateLanguageUI(lang);
  }

  // initialize on load
  document.addEventListener('DOMContentLoaded', ()=>{
    const lang = getStored();
    // ensure UI shows correct label
    ensureToggleButton();
    updateLanguageUI(lang);
    // apply translations if english requested
    if(lang === 'en') walkAndTranslate(document.body, 'en');

    document.body.addEventListener('click', e=>{
      const target = e.target.closest && e.target.closest('.language-selector');
      if(!target) return;
      e.preventDefault();
      const next = getStored() === 'es' ? 'en' : 'es';
      setLanguage(next);
    });

    // Enhance mobile menu interactions site-wide
    function enhanceMobileMenu(){
      const menuToggle = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      if(menuToggle && navLinks){
        menuToggle.addEventListener('click', ()=>{
          const opened = navLinks.classList.toggle('active');
          document.body.style.overflow = opened ? 'hidden' : '';
        });

        // close menu when tapping outside
        document.addEventListener('click', (ev)=>{
          if(!navLinks.classList.contains('active')) return;
          if(ev.target.closest('.nav-links') || ev.target.closest('.mobile-menu-toggle')) return;
          navLinks.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      // accordion behavior for dropdowns on mobile
      const dropdownLinks = document.querySelectorAll('.nav-links li.dropdown > .nav-link');
      dropdownLinks.forEach(link=>{
        link.addEventListener('click', function(e){
          if(window.innerWidth > 992) return; // only mobile/tablet
          e.preventDefault();
          const parent = this.parentElement;
          const wasActive = parent.classList.contains('active');
          // close other dropdowns for clarity
          dropdownLinks.forEach(l=>{
            const p = l.parentElement;
            if(p !== parent) p.classList.remove('active');
          });
          if(wasActive) parent.classList.remove('active'); else parent.classList.add('active');
        });
      });

      // cleanup on resize (desktop behavior)
      window.addEventListener('resize', ()=>{
        if(window.innerWidth > 992){
          if(document.querySelector('.nav-links')) document.querySelectorAll('.nav-links').forEach(n=>n.classList.remove('active'));
          document.body.style.overflow = '';
          document.querySelectorAll('.nav-links li.dropdown.active').forEach(li=>li.classList.remove('active'));
        }
      });
    }

    try{ enhanceMobileMenu(); }catch(err){ /* non-fatal */ }
  });
})();
