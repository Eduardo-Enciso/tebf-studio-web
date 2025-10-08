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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="accordion-icon"><path d="M12 15.0006L17.5228 9.47778L18.9371 10.892L12 17.8291L5.06291 10.892L6.47712 9.47778L12 15.0006Z"></path></svg>
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
    
    // --- LÓGICA DE CARGA DINÁMICA DE SWIPER.JS ---
    const portfolioSectionObserver = new IntersectionObserver((entries, observer) => {
        // Check if the portfolio section is intersecting with the viewport
        if (entries[0].isIntersecting) {
            console.log('Portfolio section is visible, loading Swiper.js...');
            
            // Dynamically import only the necessary Swiper modules
            import('https://cdn.jsdelivr.net/npm/swiper@11/swiper.mjs')
                .then(({
                    default: Swiper
                }) => {
                    import('https://cdn.jsdelivr.net/npm/swiper@11/modules/navigation.mjs')
                        .then(({
                            default: Navigation
                        }) => {
                            // Now that the modules are loaded, initialize Swiper
                            // We pass the imported modules to the Swiper instance
                            window.Swiper = Swiper; // Make Swiper globally available if needed
                            window.SwiperNavigation = Navigation;
                            
                            // Initialize Swiper with your existing configuration
                            initializeSwiper(portfolioItemsData); 

                            console.log('Swiper.js loaded and initialized successfully.');
                        });
                }).catch(error => console.error("Failed to load Swiper modules:", error));

            // Stop observing the portfolio section since we've loaded the script
            observer.unobserve(entries[0].target);
        }
    }, {
        // Start loading when the section is 200px away from being visible
        rootMargin: '200px' 
    });

    // Start observing the portfolio section
    const portfolioEl = document.getElementById('portfolio');
    if (portfolioEl) {
        portfolioSectionObserver.observe(portfolioEl);
    }

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
            linkedin: el.dataset.linkedin,
            appleMusic: el.dataset.appleMusic,
            soundcloud: el.dataset.soundcloud,
            deezer: el.dataset.deezer
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
    
    function updateSoundCloudScale() {
        const activeWrapper = document.querySelector('.swiper-slide-active .soundcloud-classic-wrapper');
        
        if (!activeWrapper || document.querySelector('.portfolio-slider-wrapper').classList.contains('is-hidden')) {
             return;
        }

        const containerWidth = activeWrapper.offsetWidth;
        const scale = containerWidth / 480;

        document.documentElement.style.setProperty('--soundcloud-scale', scale);
    }
    
    function createPortfolioItemHTML(item) {
        const tagsHTML = item.tags.split(' ').map(tag => `<span class="tag">${tag.replace(/-/g, ' ')}</span>`).join('');
        
        let linksHTML = '';
        if (item.artistLinks) {
            const socialSVGs = {
                spotify: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.333 14.933c-.2.333-.533.4-.866.2-2.333-1.4-5.266-1.733-8.8-1.066-.333.067-.6-.133-.667-.466-.067-.333.133-.6.467-.667 3.8-.733 7.066-.333 9.666 1.2.334.2.4.534.2.867zm1.067-2.333c-.267.333-.667.467-1.067.267-2.666-1.6-6.6-2.067-9.733-1.133-.4.133-.8-.133-.933-.533-.133-.4.133-.8.533-.933 3.533-1.067 7.933-.533 10.933 1.267.4.2.533.667.267 1.067zm1-2.467c-.267.4-.8.534-1.2.267-3.067-1.866-8.2-2.266-11.467-1.2-.466.133-.933-.2-.1-.666-.133-.467.2-.934.667-1.067 3.667-1.2 9.267-.733 12.733 1.333.4.267.533.8.267 1.2z"/></svg>',
                instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.428 2.175 8.796 2.163 12 2.163zm0 1.444c-3.117 0-3.486.012-4.71.068-2.92.132-4.343 1.543-4.475 4.475-.056 1.225-.068 1.594-.068 4.71s.012 3.486.068 4.71c.132 2.932 1.555 4.343 4.475 4.475 1.225.056 1.594.068 4.71.068s3.486-.012 4.71-.068c2.92-.132 4.343-1.543 4.475-4.475.056-1.225.068-1.594.068-4.71s-.012-3.486-.068-4.71c-.132-2.932-1.555-4.343-4.475-4.475C15.486 3.619 15.117 3.607 12 3.607zm0 3.082a5.31 5.31 0 1 0 0 10.62 5.31 5.31 0 0 0 0-10.62zm0 8.778a3.468 3.468 0 1 1 0-6.936 3.468 3.468 0 0 1 0 6.936zm4.868-8.62a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>',
                youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M20 4.47A2.47 2.47 0 0 0 17.53 2H6.47A2.47 2.47 0 0 0 4 4.47v15.06A2.47 2.47 0 0 0 6.47 22h11.06A2.47 2.47 0 0 0 20 19.53V4.47zM10 16.5v-9l6 4.5-6 4.5z"></path></svg>',
                facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm2.5 10.5h-2v5h-3v-5h-2v-3h2v-2c0-1.7 1.1-4 4-4h2v3h-1.5c-.5 0-1 .5-1 1v2h2.5l-.5 3z"/></svg>',
                website: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M10 6V8H5V19H19V14H21V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8C3 6.89543 3.89543 6 5 6H10ZM14 4V6H18.5858L11.2929 13.2929L12.7071 14.7071L20 7.41421V12H22V4H14Z"></path></svg>',
                linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9 17H6v-7h3v7zm-1.5-8.25A1.75 1.75 0 1 1 7.5 7a1.75 1.75 0 0 1 0 1.75zm10.5 8.25h-3v-3.5c0-1-.5-2-1.5-2s-1.5 1-1.5 2v3.5h-3v-7h3v1.25c.5-.75 1.5-1.25 2.5-1.25 2 0 3.5 1.5 3.5 4v4.5z"/></svg>',
                appleMusic: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',
                soundcloud: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',
                deezer: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="artist-link-icon"><path d="M2 17h2v-5H2v5zm4 0h2V7H6v10zm4 0h2v-8h-2v8zm4 0h2V4h-2v13zm4 0h2v-6h-2v6z"/></svg>'
};
            const titleMap = { spotify: 'Listen on Spotify', instagram: 'Follow on Instagram', youtube: 'Watch on YouTube', facebook: 'Find on Facebook', website: 'Visit Website', linkedin: 'View on LinkedIn', appleMusic: 'Listen on Apple Music',soundcloud: 'Listen on SoundCloud', deezer: 'Listen on Deezer' };
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

        // Check if Swiper and Navigation module are loaded
        if (typeof window.Swiper === 'undefined' || typeof window.SwiperNavigation === 'undefined') {
            console.log("Swiper not loaded yet, skipping initialization.");
            
            // Render static HTML so the layout doesn't break
            const slidesHTML = dataToRender.map(createPortfolioItemHTML).join('');
            portfolioSliderEl.innerHTML = slidesHTML;

            // Trigger smart load for the static items
            triggerInitialSmartLoad();
            return;
        }
        
        const slidesHTML = dataToRender.map(createPortfolioItemHTML).join('');
        portfolioSliderEl.innerHTML = slidesHTML;
        
        if (!portfolioSliderEl || !portfolioSliderEl.children.length) return;

        swiperInstance = new Swiper('.portfolio-swiper', {
            modules: [window.SwiperNavigation],
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
        swiperInstance.on('transitionEnd', updateSoundCloudScale);
        swiperInstance.on('resize', updateSoundCloudScale);
        
        updateSoundCloudScale();
        triggerInitialSmartLoad();
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
        
        // Removed the initial swiper initialization from here. It will be called by the IntersectionObserver.
        
        setupFilterButtons(desktopFilterContainer, 'desktop');
        setupFilterButtons(filterPanelBody, 'mobile');
        
        const portfolioLazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerInitialSmartLoad();
                    observer.unobserve(portfolioSection);
                }
            });
        }, { rootMargin: '0px 0px 100px 0px' });

        portfolioLazyLoadObserver.observe(portfolioSection);

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