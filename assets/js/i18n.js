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
    if(el.placeholder){
      if(lang === 'en'){
        if(el.placeholder.includes('Buscar')) el.placeholder = el.placeholder.replace(/Buscar[^]*/,'Search products, brands and more...');
      } else {
        if(el.placeholder.includes('Search')) el.placeholder = el.placeholder.replace(/Search[^]*/,'Buscar productos, marcas y más...');
      }
    }
  }

  function walkAndTranslate(root, lang){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while(node = walker.nextNode()){
      translateTextNode(node, lang);
    }
    // attributes
    root.querySelectorAll('[placeholder]').forEach(el=>translateAttributes(el, lang));
  }

  function updateLanguageUI(lang){
    document.querySelectorAll('.language-selector').forEach(el=>{
      el.innerHTML = '<i class="fas fa-globe"></i> ' + (lang==='en' ? 'EN' : 'ES');
    });
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
  });
})();
