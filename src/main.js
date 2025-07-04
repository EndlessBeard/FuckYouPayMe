import './style.css';
import { initCalendar } from './calendar.js';
import { initDailyHours } from './dailyHours.js';
import { initSettings } from './settings.js';
import { initPaycheckCalculation } from './paycheckCalculation.js';
import { initDashboard } from './dashboard.js';
import { initMenu } from './menu.js';

// Import test harness (only active in development)
import './testHarness.js';

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
    // Initialize all modules
    initMenu(); // Initialize menu first
    initCalendar();
    initDailyHours();
    initSettings();
    initPaycheckCalculation();
    initDashboard();
});
