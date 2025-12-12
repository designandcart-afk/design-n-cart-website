// Replace the entire content of script.js with this FINAL version

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const menu = document.querySelector('.menu-list');
    const closeBtn = document.querySelector('.close-menu-btn');

    if (hamburger && menu && closeBtn) {
        const openMenu = () => menu.classList.add('active');
        const closeMenu = () => menu.classList.remove('active');

        hamburger.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
    }


    // --- Scroll Animation Logic ---
    const animatedElements = document.querySelectorAll('.fade-in-section');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    }


    // --- NEW: Accordion Logic for About Page ---
    const accordionTriggers = document.querySelectorAll('.collapsible-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const parentItem = this.parentElement;
            
            // This is the logic to close other items
            const allItems = document.querySelectorAll('.collapsible-item');
            allItems.forEach(item => {
                if (item !== parentItem && item.classList.contains('is-open')) {
                    item.classList.remove('is-open');
                }
            });

            // This toggles the clicked item
            parentItem.classList.toggle('is-open');
        });
    });

});