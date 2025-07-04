import './style.css';
import { initCalendar } from './calendar.js';
import { initDailyHours } from './dailyHours.js';
import { initSettings } from './settings.js';
import { initPaycheckCalculation } from './paycheckCalculation.js';
import { initDashboard } from './dashboard.js';
import { initMenu } from './menu.js';
import { isLocalStorageAvailable, debugStorageState } from './storage.js';

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialized');
    
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
        alert('WARNING: Local storage is not available. Your settings and data will not be saved between sessions. This could be due to private browsing mode, browser settings, or storage quotas.');
    } else {
        console.log('localStorage is available and working');
    }
    
    // Log current storage state
    console.log('Initial storage state:', debugStorageState());
    
    // Initialize all modules in the correct order
    initMenu(); // Initialize menu first
    initDailyHours(); // Initialize daily hours before calendar to prevent undefined element errors
    initCalendar();
    initSettings();
    initPaycheckCalculation();
    initDashboard();
});
