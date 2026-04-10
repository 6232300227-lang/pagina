(function () {
    function isMobileMenuViewport() {
        return window.matchMedia('(max-width: 992px)').matches;
    }

    function isDesktopViewport() {
        return window.matchMedia('(min-width: 993px)').matches;
    }

    function closeMenu(toggleBtn, navLinks) {
        navLinks.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    function openMenu(toggleBtn, navLinks) {
        navLinks.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }

        const menuSearch = navLinks.querySelector('input[type="search"], input[type="text"]');
        if (menuSearch) {
            menuSearch.focus();
        }
    }

    function bindMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        let menuToggle = document.querySelector('.mobile-menu-toggle');
        if (!navLinks || !menuToggle) {
            return;
        }

        const freshToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(freshToggle, menuToggle);
        menuToggle = freshToggle;

        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.setAttribute('aria-controls', 'mobile-main-menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.id = 'mobile-main-menu';

        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            if (!isMobileMenuViewport()) {
                return;
            }

            if (navLinks.classList.contains('active')) {
                closeMenu(menuToggle, navLinks);
            } else {
                openMenu(menuToggle, navLinks);
            }
        });

        document.addEventListener('click', function (e) {
            if (!isMobileMenuViewport()) {
                return;
            }
            const clickInsideMenu = navLinks.contains(e.target) || menuToggle.contains(e.target);
            if (!clickInsideMenu) {
                closeMenu(menuToggle, navLinks);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu(menuToggle, navLinks);
            }
        });

        navLinks.addEventListener('click', function (e) {
            const targetLink = e.target.closest('a');
            if (!targetLink) {
                return;
            }

            const parentDropdown = targetLink.closest('.dropdown');
            const isDropdownTrigger = parentDropdown && targetLink.classList.contains('nav-link');
            if (isDropdownTrigger && isMobileMenuViewport()) {
                e.preventDefault();
                parentDropdown.classList.toggle('active');
                return;
            }

            if (isMobileMenuViewport()) {
                closeMenu(menuToggle, navLinks);
            }
        });

        window.addEventListener('resize', function () {
            if (!isMobileMenuViewport()) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    function normalizeText(value) {
        return (value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function getSearchUi() {
        const input = document.getElementById('searchInput') || document.querySelector('.search-bar input[type="text"], .search-bar input[type="search"]');
        const button = document.getElementById('searchButton') || document.querySelector('.search-bar button');
        const wrapper = input ? input.closest('.search-bar') : null;
        if (!input || !button || !wrapper) {
            return null;
        }

        let suggestions = document.getElementById('searchSuggestions');
        if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.id = 'searchSuggestions';
            suggestions.className = 'search-suggestions';
        }
        // Move to <body> to escape the header stacking context entirely.
        // This ensures the panel always renders on top of all elements.
        if (suggestions.parentElement !== document.body) {
            document.body.appendChild(suggestions);
        }

        return { input: input, button: button, wrapper: wrapper, suggestions: suggestions };
    }

    function collectSearchItems() {
        const items = [];

        const navLinks = document.querySelectorAll('.nav-links a[href]');
        navLinks.forEach(function (link) {
            const label = (link.textContent || '').replace(/\s+/g, ' ').trim();
            if (!label) {
                return;
            }
            items.push({
                title: label,
                subtitle: 'Menu',
                href: link.getAttribute('href')
            });
        });

        const cards = document.querySelectorAll('.product-card, .product-item, .category-card');
        cards.forEach(function (card, index) {
            const titleEl = card.querySelector('.product-title, .product-name, h3, h4');
            const title = titleEl ? (titleEl.textContent || '').replace(/\s+/g, ' ').trim() : '';
            if (!title) {
                return;
            }

            const hrefEl = card.querySelector('a[href]');
            items.push({
                title: title,
                subtitle: 'Producto',
                href: hrefEl ? hrefEl.getAttribute('href') : null,
                element: card,
                key: 'card-' + index
            });
        });

        const seen = new Set();
        return items.filter(function (item) {
            const key = normalizeText(item.title + '|' + (item.href || '') + '|' + item.subtitle);
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    function renderResults(suggestionsEl, query, results) {
        if (!query) {
            suggestionsEl.innerHTML = '';
            suggestionsEl.classList.remove('active');
            return;
        }

        if (results.length === 0) {
            suggestionsEl.innerHTML =
                '<div class="no-suggestions">' +
                '<p>No se encontraron resultados</p>' +
                '</div>';
            suggestionsEl.classList.add('active');
            return;
        }

        const html = results.map(function (item, index) {
            const hrefAttr = item.href ? ' data-href="' + item.href + '"' : '';
            const keyAttr = item.key ? ' data-key="' + item.key + '"' : '';
            return (
                '<button type="button" class="suggestion-item" data-index="' + index + '"' + hrefAttr + keyAttr + '>' +
                '<strong>' + item.title + '</strong>' +
                '<small>' + item.subtitle + '</small>' +
                '</button>'
            );
        }).join('');

        suggestionsEl.innerHTML = html;
        suggestionsEl.classList.add('active');
    }

    function bindSearch() {
        const ui = getSearchUi();
        if (!ui) {
            return;
        }

        let lastResults = [];

        function getDesktopMenuAnchorRect() {
            const navContainer = document.querySelector('header nav .container, nav .container');
            const navLinks = document.querySelector('.nav-links');
            const viewportPadding = 12;

            if (navLinks) {
                const linksRect = navLinks.getBoundingClientRect();
                if (linksRect.width > 0) {
                    return {
                        left: Math.max(viewportPadding, linksRect.left),
                        width: Math.min(linksRect.width, window.innerWidth - viewportPadding * 2),
                        bottom: linksRect.bottom
                    };
                }
            }

            if (navContainer) {
                const containerRect = navContainer.getBoundingClientRect();
                if (containerRect.width > 0) {
                    return {
                        left: Math.max(viewportPadding, containerRect.left),
                        width: Math.min(containerRect.width, window.innerWidth - viewportPadding * 2),
                        bottom: containerRect.bottom
                    };
                }
            }

            return null;
        }

        // Position panel for desktop and mobile without changing mobile interactions.
        // setProperty with 'important' overrides CSS !important rules.
        function positionPanel() {
            const inputRect = ui.wrapper.getBoundingClientRect();
            const desktopRect = isDesktopViewport() ? getDesktopMenuAnchorRect() : null;
            const rect = desktopRect || inputRect;
            const top = desktopRect ? rect.bottom + 6 : rect.bottom + 4;
            const maxH = Math.max(200, window.innerHeight - top - 12);
            const s = ui.suggestions.style;
            s.setProperty('position', 'fixed', 'important');
            s.setProperty('top', top + 'px', 'important');
            s.setProperty('left', rect.left + 'px', 'important');
            s.setProperty('right', 'auto', 'important');
            s.setProperty('width', rect.width + 'px', 'important');
            s.setProperty('max-height', maxH + 'px', 'important');
            s.setProperty('z-index', '99999', 'important');
        }

        function hidePanel() {
            ui.suggestions.classList.remove('active');
            const s = ui.suggestions.style;
            s.removeProperty('position');
            s.removeProperty('top');
            s.removeProperty('left');
            s.removeProperty('right');
            s.removeProperty('width');
            s.removeProperty('max-height');
            s.removeProperty('z-index');
        }

        function executeSearch() {
            const rawQuery = ui.input.value || '';
            const query = normalizeText(rawQuery);
            const items = collectSearchItems();
            const results = items.filter(function (item) {
                return normalizeText(item.title).includes(query);
            });

            lastResults = results;
            renderResults(ui.suggestions, query, results);
            if (query) {
                positionPanel();
            }
        }

        ui.button.addEventListener('click', function (e) {
            e.preventDefault();
            executeSearch();
        });

        ui.input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });

        ui.input.addEventListener('input', function () {
            const query = normalizeText(ui.input.value || '');
            if (!query) {
                hidePanel();
                return;
            }
            executeSearch();
        });

        ui.suggestions.addEventListener('click', function (e) {
            const btn = e.target.closest('.suggestion-item');
            if (!btn) {
                return;
            }

            const href = btn.getAttribute('data-href');
            const key = btn.getAttribute('data-key');

            if (href) {
                window.location.href = href;
                return;
            }

            if (key) {
                const match = lastResults.find(function (item) { return item.key === key; });
                if (match && match.element) {
                    match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        // Close when clicking outside both the search bar and the panel
        document.addEventListener('click', function (e) {
            if (!ui.wrapper.contains(e.target) && !ui.suggestions.contains(e.target)) {
                hidePanel();
            }
        });

        // Reposition when viewport resizes while panel is open
        window.addEventListener('resize', function () {
            if (ui.suggestions.classList.contains('active')) {
                positionPanel();
            }
        });

        window.addEventListener('scroll', function () {
            if (ui.suggestions.classList.contains('active')) {
                positionPanel();
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            bindMobileMenu();
            bindSearch();
        });
    } else {
        bindMobileMenu();
        bindSearch();
    }
})();
