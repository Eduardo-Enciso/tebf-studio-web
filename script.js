document.addEventListener('DOMContentLoaded', function () {

    // --- LÓGICA DINÁMICA DE SERVICIOS ---
    const servicesData = {};
    const servicesDataContainer = document.getElementById('services-data');
    
    if (servicesDataContainer) {
        servicesDataContainer.querySelectorAll('[data-client-profile]').forEach(profileDiv => {
            const clientType = profileDiv.dataset.clientProfile;
            servicesData[clientType] = {
                accordion: Array.from(profileDiv.querySelectorAll('.service-item')).map(itemDiv => {
                    return {
                        title: itemDiv.dataset.title,
                        description: itemDiv.dataset.description,
                        details: Array.from(itemDiv.querySelectorAll('.service-detail')).map(detailDiv => ({
                            title: detailDiv.dataset.title,
                            text: detailDiv.dataset.text
                        }))
                    };
                })
            };
        });
    }

    const serviceSelector = document.getElementById('service-selector');
    const accordionContainer = document.getElementById('services-accordion');
    const root = document.documentElement;

    const serviceThemeColors = {
        artist: 'var(--color-artist)',
        producer: 'var(--color-producer)',
        media: 'var(--color-media)',
        enterprise: 'var(--color-enterprise)'
    };

    function createAccordionItem(item) {
        const lang = document.documentElement.lang;
        const expandLabel = lang === 'es' 
            ? `Expandir detalles de ${item.title}` 
            : `Expand details for ${item.title}`;

        const detailsHTML = item.details.map(detail => `
            <div class="service-detail-item">
                <h4>${detail.title}</h4>
                <p>${detail.text}</p>
            </div>
        `).join('');

        return `
            <div class="accordion-item">
                <div class="accordion-header">
                    <div class="accordion-text">
                        <h3 class="accordion-title">${item.title}</h3>
                        <p class="accordion-description">${item.description}</p>
                    </div>
                    <button class="accordion-toggle" aria-expanded="false" aria-label="${expandLabel}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 15.0006L17.5228 9.47778L18.9371 10.892L12 17.8291L5.06291 10.892L6.47712 9.47778L12 15.0006Z"></path></svg>
                    </button>
                </div>
                <div class="accordion-content">
                    <div class="service-detail-list">
                        ${detailsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    function updateServices(clientType) {
        const clientData = servicesData[clientType];
        if (!clientData) return;

        root.style.setProperty('--current-service-color', serviceThemeColors[clientType]);
        document.querySelectorAll('.service-selector-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.client === clientType);
        });
        accordionContainer.innerHTML = clientData.accordion.map(createAccordionItem).join('');
        assignAccordionEvents();
    }

    function assignAccordionEvents() {
        const accordionItems = accordionContainer.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const toggleButton = item.querySelector('.accordion-toggle');

            header.addEventListener('click', () => {
                const content = item.querySelector('.accordion-content');
                const wasActive = item.classList.contains('active');
                
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        otherItem.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
                    }
                });

                if (!wasActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                    toggleButton.setAttribute('aria-expanded', 'true');
                    setTimeout(() => {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                } else {
                     item.classList.remove('active');
                     content.style.maxHeight = null;
                     toggleButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    if (serviceSelector) {
        serviceSelector.addEventListener('click', (e) => {
            if (e.target.matches('.service-selector-btn')) {
                const clientType = e.target.dataset.client;
                updateServices(clientType);
            }
        });
        updateServices('artist');
    }


    // --- LÓGICA DE VIDEO Y SONIDO DEL HERO ---
    const video = document.getElementById('heroVideo');
    const soundButton = document.getElementById('sound-toggle');
    const iconMute = document.getElementById('icon-mute');
    const iconUnmute = document.getElementById('icon-unmute');
    const heroOverlay = document.querySelector('.hero-overlay');

    if (video) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log("Video autoplay was prevented."));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });
        videoObserver.observe(video);
    }

    if (soundButton && video && iconMute && iconUnmute && heroOverlay) {
        soundButton.addEventListener('click', () => {
            video.muted = !video.muted;
            iconMute.classList.toggle('is-hidden', !video.muted);
            iconUnmute.classList.toggle('is-hidden', video.muted);
            heroOverlay.classList.toggle('sound-is-active', !video.muted);
            soundButton.classList.toggle('is-blinking', video.muted);
            if (!video.muted) {
                video.currentTime = 0;
                video.play().catch(e => console.log("Video play was prevented."));
            }
        });
    }

    // --- NAVEGACIÓN MÓVIL (ACTUALIZADO PARA SVGs) ---
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    // Nuevas referencias a los SVGs
    const mobileNavIconOpen = document.getElementById('mobile-nav-icon-open');
    const mobileNavIconClose = document.getElementById('mobile-nav-icon-close');
    
    // Condición actualizada
    if (mobileNavToggle && mobileNav && mobileNavIconOpen && mobileNavIconClose) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('is-open');
            
            // Nuevo manejo de visibilidad de SVGs
            mobileNavIconOpen.classList.toggle('is-hidden', isOpen);
            mobileNavIconClose.classList.toggle('is-hidden', !isOpen);
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('is-open');

                // Resetear visibilidad de SVGs
                mobileNavIconOpen.classList.remove('is-hidden');
                mobileNavIconClose.classList.add('is-hidden');
            });
        });
    }

    // --- LÓGICA DEL MAPA DE INSTRUMENTOS ---
    document.querySelectorAll('.map-dot').forEach(dot => {
        dot.setAttribute('aria-pressed', 'false');
        dot.addEventListener('click', () => {
            const region = dot.dataset.region;
            const targetPanel = document.getElementById(`panel-${region}`);
            if (dot.classList.contains('active')) {
                dot.classList.remove('active');
                dot.setAttribute('aria-pressed', 'false');
                if (targetPanel) targetPanel.style.display = 'none';
            } else {
                document.querySelectorAll('.map-dot').forEach(d => {
                    d.classList.remove('active');
                    d.setAttribute('aria-pressed', 'false');
                });
                document.querySelectorAll('.instrument-panel').forEach(p => p.style.display = 'none');
                dot.classList.add('active');
                dot.setAttribute('aria-pressed', 'true');
                if (targetPanel) {
                    targetPanel.style.display = 'block';
                    targetPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    document.querySelectorAll('.close-panel-btn').forEach(button => {
        button.addEventListener('click', () => {
            const panelToClose = button.closest('.instrument-panel');
            const region = panelToClose.id.replace('panel-', '');
            const dotToDeactivate = document.getElementById(`dot-${region}`);
            
            panelToClose.style.display = 'none';
            if (dotToDeactivate) {
                dotToDeactivate.classList.remove('active');
                dotToDeactivate.setAttribute('aria-pressed', 'false');
            }
            const mapContainer = document.querySelector('.percussion-map-container');
            if (mapContainer) mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    
    // --- LÓGICA DE CARGA DIFERIDA DEL PORTAFOLIO ---
    const portfolioItemsData = Array.from(document.querySelectorAll('#portfolio-slider-data .portfolio-data-item')).map(el => ({
        isLoaded: false, 
        title: el.dataset.title,
        desc: el.dataset.desc,
        tags: el.dataset.tags,
        soundcloudUrl: el.dataset.soundcloudUrl,
        artistLinks: {
            spotify: el.dataset.spotify,
            instagram: el.dataset.instagram,
            youtube: el.dataset.youtube,
            facebook: el.dataset.facebook,
            website: el.dataset.website,
            linkedin: el.dataset.linkedin
        }
    }));
    
    const portfolioSliderEl = document.getElementById('portfolio-slider');
    let swiperInstance;
    let initialLoadTriggered = false;
    let fullLoadTriggered = false;

    function findDataObject(slideElement) {
        if (!slideElement) return null;
        const url = slideElement.dataset.soundcloudUrl;
        return portfolioItemsData.find(item => item.soundcloudUrl === url);
    }

    function loadIframeForSlide(slideElement) {
        const dataObject = findDataObject(slideElement);
        if (!dataObject || dataObject.isLoaded) return;

        const placeholder = slideElement.querySelector('.soundcloud-placeholder');
        if (!placeholder) return;
        
        dataObject.isLoaded = true;
        slideElement.classList.add('is-loaded');

        const soundcloudUrl = placeholder.dataset.src;
        const title = placeholder.dataset.title;

        const viewport = document.createElement('div');
        viewport.className = 'soundcloud-classic-viewport';
        
        const iframe = document.createElement('iframe');
        iframe.title = `SoundCloud player for ${title}`;
        iframe.width = '480';
        iframe.height = '166';
        iframe.scrolling = 'no';
        iframe.frameBorder = 'no';
        iframe.allow = 'autoplay';
        iframe.src = soundcloudUrl;
        
        viewport.appendChild(iframe);
        placeholder.parentNode.replaceChild(viewport, placeholder);
        
        updateSoundCloudScale();
    }
    
    function triggerFullLoadWithPriority() {
        if (fullLoadTriggered) return;
        fullLoadTriggered = true;
        console.log("User interaction detected. Loading all remaining players with priority.");

        if (swiperInstance && swiperInstance.slides[swiperInstance.activeIndex]) {
            loadIframeForSlide(swiperInstance.slides[swiperInstance.activeIndex]);
        }
        
        requestAnimationFrame(() => {
            document.querySelectorAll('#portfolio-slider .swiper-slide:not(.is-loaded)').forEach(loadIframeForSlide);
        });
    }
    
    function triggerInitialSmartLoad() {
        if (initialLoadTriggered) return;
        initialLoadTriggered = true;
        console.log("Portfolio in view. Performing initial smart load.");

        if (portfolioItemsData.length === 0) return;

        const findSlideByUrl = (url) => document.querySelector(`.swiper-slide[data-soundcloud-url="${url}"]`);

        if (window.innerWidth > 768) {
            console.log("Desktop detected. Loading 3 players.");
            loadIframeForSlide(findSlideByUrl(portfolioItemsData[portfolioItemsData.length - 1].soundcloudUrl));
            loadIframeForSlide(findSlideByUrl(portfolioItemsData[0].soundcloudUrl));
            if (portfolioItemsData.length > 1) {
                loadIframeForSlide(findSlideByUrl(portfolioItemsData[1].soundcloudUrl));
            }
        } else {
            console.log("Mobile detected. Loading 1 player.");
            loadIframeForSlide(findSlideByUrl(portfolioItemsData[0].soundcloudUrl));
        }
    }
    
    // START MODIFICATION: Replaced scaleClassicPlayers with updateSoundCloudScale
    // Efficient function to scale SoundCloud players using a CSS variable
    function updateSoundCloudScale() {
        // Measure the active slide's wrapper for accuracy.
        const activeWrapper = document.querySelector('.swiper-slide-active .soundcloud-classic-wrapper');
        
        // Exit if the slider container is hidden (e.g., no search results) or no active wrapper exists.
        if (!activeWrapper || document.querySelector('.portfolio-slider-wrapper').classList.contains('is-hidden')) {
             return;
        }

        // Read width ONCE to avoid forced reflows
        const containerWidth = activeWrapper.offsetWidth;
        const scale = containerWidth / 480;

        // Write the CSS variable to the root element ONCE
        document.documentElement.style.setProperty('--soundcloud-scale', scale);
    }
    // END MODIFICATION
    
    function createPortfolioItemHTML(item) {
        const tagsHTML = item.tags.split(' ').map(tag => `<span class="tag">${tag.replace(/-/g, ' ')}</span>`).join('');
        
        let linksHTML = '';
        if (item.artistLinks) {
            const socialSVGs = {
                spotify: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.333 14.933c-.2.333-.533.4-.866.2-2.333-1.4-5.266-1.733-8.8-1.066-.333.067-.6-.133-.667-.466-.067-.333.133-.6.467-.667 3.8-.733 7.066-.333 9.666 1.2.334.2.4.534.2.867zm1.067-2.333c-.267.333-.667.467-1.067.267-2.666-1.6-6.6-2.067-9.733-1.133-.4.133-.8-.133-.933-.533-.133-.4.133-.8.533-.933 3.533-1.067 7.933-.533 10.933 1.267.4.2.533.667.267 1.067zm1-2.467c-.267.4-.8.534-1.2.267-3.067-1.866-8.2-2.266-11.467-1.2-.466.133-.933-.2-.1-.666-.133-.467.2-.934.667-1.067 3.667-1.2 9.267-.733 12.733 1.333.4.267.533.8.267 1.2z"/></svg>',
                instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122s-.01 3.056-.06 4.122c-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06s-3.056-.01-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12s.01-3.056.06-4.122c.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6-10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>',
                youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.2 8.7c.2.5.2 1.6 0 2.1-.2.5-1 1-1 1s-2.8.3-5.2.3-5.2-.3-5.2-.3-.8-.4-1-1c-.2-.5-.2-1.6 0-2.1.2-.5 1-1 1-1s2.8-.3 5.2-.3 5.2.3 5.2.3.8.5 1 1zm-8.2 2.6l4-2.1-4-2.1v4.2z"/></svg>',
                facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm2.5 10.5h-2v5h-3v-5h-2v-3h2v-2c0-1.7 1.1-4 4-4h2v3h-1.5c-.5 0-1 .5-1 1v2h2.5l-.5 3z"/></svg>',
                website: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-8h10v2H7v-2zm-2-2h14v2H5v-2z"/></svg>',
                linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9 17H6v-7h3v7zm-1.5-8.25A1.75 1.75 0 1 1 7.5 7a1.75 1.75 0 0 1 0 1.75zm10.5 8.25h-3v-3.5c0-1-.5-2-1.5-2s-1.5 1-1.5 2v3.5h-3v-7h3v1.25c.5-.75 1.5-1.25 2.5-1.25 2 0 3.5 1.5 3.5 4v4.5z"/></svg>'
            };
            const titleMap = { spotify: 'Listen on Spotify', instagram: 'Follow on Instagram', youtube: 'Watch on YouTube', facebook: 'Find on Facebook', website: 'Visit Website', linkedin: 'View on LinkedIn' };

            const linksArray = Object.keys(item.artistLinks)
                .map(key => (socialSVGs[key] && item.artistLinks[key]) ? `<a href="${item.artistLinks[key]}" target="_blank" rel="noopener noreferrer" title="${titleMap[key]}" aria-label="${titleMap[key]}">${socialSVGs[key]}</a>` : '')
                .join('');
            if(linksArray) linksHTML = `<div class="artist-links">${linksArray}</div>`;
        }
        
        const encodedUrl = encodeURIComponent(item.soundcloudUrl);
        const soundcloudSrc = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23EE8F00&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
        
        let mediaHTML;
        if (item.isLoaded) {
            mediaHTML = `<div class="soundcloud-classic-wrapper">
                <div class="soundcloud-classic-viewport">
                    <iframe title="SoundCloud player for ${item.title}" width="480" height="166" scrolling="no" frameborder="no" allow="autoplay" src="${soundcloudSrc}"></iframe>
                </div>
            </div>`;
        } else {
            mediaHTML = `<div class="soundcloud-classic-wrapper"><div class="soundcloud-placeholder" data-src="${soundcloudSrc}" data-title="${item.title}"></div></div>`;
        }
        
        return `<div class="swiper-slide portfolio-item ${item.isLoaded ? 'is-loaded' : ''}" data-tags="${item.tags}" data-soundcloud-url="${item.soundcloudUrl}">${mediaHTML}<div class="portfolio-info"><h3 class="portfolio-title">${item.title}</h3><p class="portfolio-desc">${item.desc}</p><div class="portfolio-tags">${tagsHTML}</div>${linksHTML}</div></div>`;
    }
    
    function initializeSwiper(dataToRender) {
        if (swiperInstance) swiperInstance.destroy(true, true);
        
        const slidesHTML = dataToRender.map(createPortfolioItemHTML).join('');
        portfolioSliderEl.innerHTML = slidesHTML;
        
        if (!portfolioSliderEl || !portfolioSliderEl.children.length) return;

        swiperInstance = new Swiper('.portfolio-swiper', {
            loop: dataToRender.length > 2,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30,
            grabCursor: true,
            navigation: { nextEl: '.portfolio-next', prevEl: '.portfolio-prev' },
            breakpoints: { 320: { spaceBetween: 15 }, 768: { spaceBetween: 20 }, 1024: { spaceBetween: 30 }}
        });

        swiperInstance.on('navigationNext', triggerFullLoadWithPriority);
        swiperInstance.on('navigationPrev', triggerFullLoadWithPriority);
        swiperInstance.el.addEventListener('pointerdown', triggerFullLoadWithPriority, { once: true });
        // START MODIFICATION: Updated to call the new function
        swiperInstance.on('transitionEnd', updateSoundCloudScale);
        swiperInstance.on('resize', updateSoundCloudScale);
        
        updateSoundCloudScale();
        // END MODIFICATION
    }
    
    function applyFilters(source = 'desktop') {
        const container = source === 'mobile' ? document.querySelector('.filter-panel-body') : document.querySelector('.portfolio-filters');
        const activeAppFilters = Array.from(container.querySelectorAll('.filter-btn[data-group="app"].active:not([data-filter="all"])')).map(btn => btn.dataset.filter);
        const activeStyleFilters = Array.from(container.querySelectorAll('.filter-btn[data-group="style"].active:not([data-filter="all"])')).map(btn => btn.dataset.filter.split(',')).flat();
        
        const filteredData = portfolioItemsData.filter(item => {
            const tags = item.tags.split(' ');
            const appMatch = activeAppFilters.length === 0 || activeAppFilters.some(filter => tags.includes(filter));
            const styleMatch = activeStyleFilters.length === 0 || activeStyleFilters.some(filter => tags.includes(filter));
            return appMatch && styleMatch;
        });

        const noResultsContainer = document.getElementById('no-results-container');
        const portfolioSliderWrapper = document.querySelector('.portfolio-slider-wrapper');
        
        if (filteredData.length > 0) {
            portfolioSliderWrapper.classList.remove('is-hidden');
            noResultsContainer.classList.add('is-hidden');
            initializeSwiper(filteredData);
        } else {
            if (swiperInstance) swiperInstance.destroy(true, true);
            swiperInstance = null;
            portfolioSliderWrapper.classList.add('is-hidden');
            noResultsContainer.classList.remove('is-hidden');
            noResultsContainer.innerHTML = `<h3>No Matches Found</h3><p>Try adjusting your filters or reset them to see all projects.</p><button class="reset-filters-btn">Reset Filters</button>`;
            noResultsContainer.querySelector('.reset-filters-btn').addEventListener('click', () => clearAllFilters(source));
        }
        
        if (source === 'mobile') updateActiveFilterDisplay();
        updateDesktopClearButtonVisibility();
    }
    
    // --- Configuración de filtros y disparador de carga diferida ---
    const desktopFilterContainer = document.querySelector('.portfolio-filters');
    const filterPanelBody = document.querySelector('.filter-panel-body');
    const portfolioSection = document.getElementById('portfolio');

    if (desktopFilterContainer && filterPanelBody && portfolioSection) {
        filterPanelBody.innerHTML = desktopFilterContainer.innerHTML;

        const mobileFilterTrigger = document.getElementById('mobile-filter-trigger');
        const filterPanelOverlay = document.getElementById('filter-panel-overlay');
        const closePanelBtn = document.getElementById('filter-panel-close-btn');
        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        const desktopClearBtn = document.getElementById('desktop-clear-filters-btn');

        const portfolioFiltersContainer = document.getElementById('portfolio-filters-container');

        mobileFilterTrigger.addEventListener('click', () => {
            triggerFullLoadWithPriority();
        
            if (window.innerWidth > 768) {
                portfolioFiltersContainer.classList.remove('filters-hidden');
            } else {
                filterPanelOverlay.classList.add('is-open');
            }
        });

        closePanelBtn.addEventListener('click', () => filterPanelOverlay.classList.remove('is-open'));
        filterPanelOverlay.addEventListener('click', (e) => { if (e.target === filterPanelOverlay) filterPanelOverlay.classList.remove('is-open'); });
        applyFiltersBtn.addEventListener('click', () => { applyFilters('mobile'); filterPanelOverlay.classList.remove('is-open'); });
        clearFiltersBtn.addEventListener('click', () => clearAllFilters('mobile'));
        document.getElementById('clear-all-pills-btn').addEventListener('click', () => clearAllFilters('mobile'));
        desktopClearBtn.addEventListener('click', () => clearAllFilters('desktop'));
        
        initializeSwiper(portfolioItemsData);
        
        setupFilterButtons(desktopFilterContainer, 'desktop');
        setupFilterButtons(filterPanelBody, 'mobile');
        
        const portfolioObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerInitialSmartLoad();
                    observer.unobserve(portfolioSection);
                }
            });
        }, { rootMargin: '0px 0px 100px 0px' });

        portfolioObserver.observe(portfolioSection);

        updateDesktopClearButtonVisibility();
    }
    
    function updateActiveFilterDisplay() {
        const activeFilterButtons = Array.from(document.querySelectorAll('.filter-panel-body .filter-btn.active:not([data-filter="all"])'));
        const filterCount = activeFilterButtons.length;
        const activeFiltersPills = document.getElementById('active-filters-pills');
        activeFiltersPills.innerHTML = '';
        if (filterCount > 0) {
            document.getElementById('active-filters-container').classList.remove('is-hidden');
            document.getElementById('mobile-filter-trigger-text').textContent = `Filter Projects (${filterCount})`;
            activeFilterButtons.forEach(btn => {
                const pill = document.createElement('div');
                pill.className = 'filter-pill';
                pill.textContent = btn.textContent;
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-pill-btn';
                removeBtn.innerHTML = '&times;';
                removeBtn.onclick = () => {
                    btn.classList.remove('active');
                    if (!document.querySelector(`.filter-panel-body .filter-btn[data-group="${btn.dataset.group}"].active:not([data-filter="all"])`)) {
                        document.querySelector(`.filter-panel-body .filter-btn[data-group="${btn.dataset.group}"][data-filter="all"]`).classList.add('active');
                    }
                    applyFilters('mobile');
                };
                pill.appendChild(removeBtn);
                activeFiltersPills.appendChild(pill);
            });
        } else {
            document.getElementById('active-filters-container').classList.add('is-hidden');
            document.getElementById('mobile-filter-trigger-text').textContent = 'Filter Projects';
        }
    }
            
    function updateDesktopClearButtonVisibility() {
        const hasActiveFilters = document.querySelector('.portfolio-filters .filter-btn.active:not([data-filter="all"])');
        document.getElementById('desktop-clear-filters-container').classList.toggle('is-hidden', !hasActiveFilters);
    }

    function clearAllFilters(source) {
        const container = source === 'desktop' ? document.querySelector('.portfolio-filters') : document.querySelector('.filter-panel-body');
        container.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        container.querySelectorAll('.filter-btn[data-filter="all"]').forEach(btn => btn.classList.add('active'));
        applyFilters(source);
    }
    
    function setupFilterButtons(container, source) {
        container.addEventListener('click', (e) => {
            if (!e.target.matches('.filter-btn')) return;
            const button = e.target;
            const group = button.dataset.group;
            const filter = button.dataset.filter;
            if (filter === 'all') {
                container.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            } else {
                container.querySelector(`.filter-btn[data-group="${group}"][data-filter="all"]`).classList.remove('active');
                button.classList.toggle('active');
                if (!container.querySelector(`.filter-btn[data-group="${group}"].active:not([data-filter="all"])`)) {
                    container.querySelector(`.filter-btn[data-group="${group}"][data-filter="all"]`).classList.add('active');
                }
            }
            if (source === 'desktop') {
                applyFilters('desktop');
            }
        });
    }

    // START MODIFICATION: The global resize listener has been removed.
    // The swiper 'resize' event now handles this efficiently.
    // END MODIFICATION

    document.querySelectorAll('.slider-btn').forEach(button => {
        const handleTouchStart = () => button.classList.add('btn-active-touch');
        const handleTouchEnd = () => button.classList.remove('btn-active-touch');
        button.addEventListener('touchstart', handleTouchStart, { passive: true });
        button.addEventListener('touchend', handleTouchEnd);
        button.addEventListener('touchcancel', handleTouchEnd);
    });

    // --- LÓGICA DEL MODAL DE INSTRUMENTOS ---
    const instrumentModal = document.getElementById('instrument-modal');
    const modalImg = document.getElementById('instrument-modal-img');
    const modalName = document.getElementById('instrument-modal-name');
    const modalDesc = document.getElementById('instrument-modal-desc');
    const soundBtn = document.getElementById('instrument-sound-btn');
    const closeModalBtn = document.getElementById('instrument-modal-close');
    let currentAudio = null;

    if (instrumentModal) {
        modalImg.addEventListener('load', () => { modalImg.style.visibility = 'visible'; });

        document.querySelectorAll('.instrument-list').forEach(list => {
            list.addEventListener('click', (e) => {
                if (e.target.matches('.instrument-list-item')) {
                    const button = e.target;
                    modalImg.style.visibility = 'hidden'; 
                    modalName.textContent = button.dataset.name;
                    modalDesc.textContent = button.dataset.description;
                    modalImg.src = `assets/img/instruments/${button.dataset.instrument}.webp`;
                    modalImg.alt = button.dataset.name;
                    modalImg.onerror = () => { modalImg.src = `https://placehold.co/200x200/073B38/FFFFFF?text=${button.dataset.name.replace(/ /g, '+')}`; modalImg.style.visibility = 'visible'; };
                    soundBtn.dataset.audioSrc = `assets/audio/${button.dataset.instrument}.mp3`;
                    instrumentModal.classList.add('is-visible');
                }
            });
        });

        const playSound = (src) => {
            if (currentAudio) currentAudio.pause();
            currentAudio = new Audio(src);
            currentAudio.play().catch(console.error);
        };

        soundBtn.addEventListener('click', () => { if (soundBtn.dataset.audioSrc) playSound(soundBtn.dataset.audioSrc); });
        const closeInstrumentModal = () => { if (currentAudio) currentAudio.pause(); instrumentModal.classList.remove('is-visible'); };
        closeModalBtn.addEventListener('click', closeInstrumentModal);
        instrumentModal.addEventListener('click', (e) => { if (e.target === instrumentModal) closeInstrumentModal(); });
    }

    // --- LÓGICA DEL MODAL DE CONTACTO MÓVIL ---
    const contactPhoneLink = document.getElementById('contact-phone-link');
    const contactAppsModal = document.getElementById('contact-apps-modal');
    if(contactPhoneLink && contactAppsModal) {
        const contactAppsCloseBtn = document.getElementById('contact-apps-close');
        contactPhoneLink.addEventListener('click', (e) => { if (window.innerWidth <= 768) { e.preventDefault(); contactAppsModal.classList.add('is-visible'); } });
        const closeContactModal = () => contactAppsModal.classList.remove('is-visible');
        contactAppsCloseBtn.addEventListener('click', closeContactModal);
        contactAppsModal.addEventListener('click', (e) => { if (e.target === contactAppsModal) closeContactModal(); });
    }
});
