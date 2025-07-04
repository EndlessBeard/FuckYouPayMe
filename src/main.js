import './style.css';
import { initCalendar } from './calendar.js';
import { initDailyHours } from './dailyHours.js';
import { initSettings } from './settings.js';
import { initPaycheckCalculation } from './paycheckCalculation.js';
import { initDashboard } from './dashboard.js';

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
    // Initialize all modules
    initCalendar();
    initDailyHours();
    initSettings();
    initPaycheckCalculation();
    initDashboard();
});
