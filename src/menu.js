// Menu functionality
export function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Sections to toggle
    const sections = {
        'calendar-section': document.getElementById('calendar-section'),
        'recorded-hours-list-section': document.getElementById('recorded-hours-list-section'),
        'settings-section': document.getElementById('settings-section'),
        'paycheck-display-section': document.getElementById('paycheck-display-section')
    };
    
    // Toggle menu when menu icon is clicked
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing the menu
        menuToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && 
            !menuOverlay.contains(event.target) && 
            menuOverlay.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });
    
    // Handle touch events for mobile
    document.addEventListener('touchstart', (event) => {
        if (!menuToggle.contains(event.target) && 
            !menuOverlay.contains(event.target) && 
            menuOverlay.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });
    
    // Set the initial active menu item (calendar by default)
    setActiveMenuItem('calendar-section');
    
    // Add click event listeners to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            
            // Toggle visibility of sections
            Object.keys(sections).forEach(id => {
                if (id === sectionId) {
                    sections[id].style.display = 'block';
                    sections[id].classList.add('section-fadeIn');
                } else {
                    sections[id].style.display = 'none';
                    sections[id].classList.remove('section-fadeIn');
                }
            });
            
            // Set active menu item
            setActiveMenuItem(sectionId);
            
            // Close the menu after selection
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    });
    
    // Helper function to set active menu item
    function setActiveMenuItem(sectionId) {
        menuItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}
