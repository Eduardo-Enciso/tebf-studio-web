document.addEventListener('DOMContentLoaded', function () {

    // --- DYNAMIC SERVICES LOGIC ---
    // This section remains unchanged as it controls the services accordion.
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
                    <button class="accordion-toggle" aria-expanded="false">
                        <i class="ri-arrow-down-s-line"></i>
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


    // --- HERO VIDEO & SOUND LOGIC ---
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

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavIcon = document.getElementById('mobile-nav-icon');
    
    if (mobileNavToggle && mobileNav && mobileNavIcon) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('is-open');
            mobileNavIcon.className = isOpen ? 'ri-close-line' : 'ri-menu-line';
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('is-open');
                mobileNavIcon.className = 'ri-menu-line';
            });
        });
    }

    // --- GEAR MAP LOGIC ---
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
    
    // --- PORTFOLIO LAZY LOAD LOGIC (DEFINITIVE VERSION) ---
    const portfolioItemsData = Array.from(document.querySelectorAll('#portfolio-slider-data .portfolio-data-item')).map(el => ({
        // This is our single source of truth.
        isLoaded: false, // Our persistent memory flag.
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
        
        dataObject.isLoaded = true; // Update the master data object
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
        
        scaleClassicPlayers();
    }
    
    function triggerFullLoadWithPriority() {
        if (fullLoadTriggered) return;
        fullLoadTriggered = true;
        console.log("User interaction detected. Loading all remaining players with priority.");

        // Priority Load: Load the currently active slide first.
        if (swiperInstance && swiperInstance.slides[swiperInstance.activeIndex]) {
            loadIframeForSlide(swiperInstance.slides[swiperInstance.activeIndex]);
        }
        
        // Load the rest in the background.
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

    function scaleClassicPlayers() {
        document.querySelectorAll('.soundcloud-classic-wrapper').forEach(wrapper => {
            const viewport = wrapper.querySelector('.soundcloud-classic-viewport');
            if (viewport) {
                const scale = wrapper.offsetWidth / 480;
                viewport.style.transform = `scale(${scale})`;
            }
        });
    }
    
    function createPortfolioItemHTML(item) {
        const tagsHTML = item.tags.split(' ').map(tag => `<span class="tag">${tag.replace(/-/g, ' ')}</span>`).join('');
        const iconMap = { 
            spotify: { class: 'ri-spotify-fill', title: 'Listen on Spotify' }, 
            instagram: { class: 'ri-instagram-line', title: 'Follow on Instagram' }, 
            youtube: { class: 'ri-youtube-line', title: 'Watch on YouTube' }, 
            facebook: { class: 'ri-facebook-box-line', title: 'Find on Facebook' }, 
            website: { class: 'ri-global-line', title: 'Visit Website' }, 
            linkedin: { class: 'ri-linkedin-box-line', title: 'View on LinkedIn' }
        };
        let linksHTML = '';
        if (item.artistLinks) {
            const linksArray = Object.keys(item.artistLinks)
                .map(key => (iconMap[key] && item.artistLinks[key]) ? `<a href="${item.artistLinks[key]}" target="_blank" rel="noopener noreferrer" title="${iconMap[key].title}" aria-label="${iconMap[key].title}"><i class="${iconMap[key].class}"></i></a>` : '')
                .join('');
            if(linksArray) linksHTML = `<div class="artist-links">${linksArray}</div>`;
        }
        
        const encodedUrl = encodeURIComponent(item.soundcloudUrl);
        const soundcloudSrc = `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23EE8F00&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
        
        let mediaHTML;
        // The check now happens against the master data object.
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
        swiperInstance.on('transitionEnd', scaleClassicPlayers);
        swiperInstance.on('resize', scaleClassicPlayers);
        
        scaleClassicPlayers();
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

        // Trigger full load BEFORE rebuilding, ensuring all potentially visible items are ready.
        triggerFullLoadWithPriority();

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
    
    // --- Setup for Filters and Lazy Load Trigger ---
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

        mobileFilterTrigger.addEventListener('click', () => filterPanelOverlay.classList.add('is-open'));
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

    window.addEventListener('resize', scaleClassicPlayers);

    document.querySelectorAll('.slider-btn').forEach(button => {
        const handleTouchStart = () => button.classList.add('btn-active-touch');
        const handleTouchEnd = () => button.classList.remove('btn-active-touch');
        button.addEventListener('touchstart', handleTouchStart, { passive: true });
        button.addEventListener('touchend', handleTouchEnd);
        button.addEventListener('touchcancel', handleTouchEnd);
    });

    // --- INSTRUMENT MODAL LOGIC ---
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

    // --- MOBILE CONTACT MODAL LOGIC ---
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

