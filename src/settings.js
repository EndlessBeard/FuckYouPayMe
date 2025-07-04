import { loadSettings, saveSettings } from './storage.js';
import { updatePaycheckDisplay } from './paycheckCalculation.js';
import { updateDashboard } from './dashboard.js';

// DOM Elements
let payRateInput;
let travelRateInput;
let payPeriodDaysInput;
let payPeriodStartDateInput;
let withholdingPercentageInput;
let saveSettingsBtn;

// Initialize settings functionality
export function initSettings() {
    // Get DOM elements
    payRateInput = document.getElementById('pay-rate');
    travelRateInput = document.getElementById('travel-rate');
    payPeriodDaysInput = document.getElementById('pay-period-days');
    payPeriodStartDateInput = document.getElementById('pay-period-start-date');
    withholdingPercentageInput = document.getElementById('withholding-percentage');
    saveSettingsBtn = document.getElementById('save-settings-btn');
    
    // Load and display settings
    loadAndDisplaySettings();
    
    // Add event listener for save button
    saveSettingsBtn.addEventListener('click', saveUserSettings);
}

// Load and display settings
function loadAndDisplaySettings() {
    const settings = loadSettings();
    
    // Display settings in form
    payRateInput.value = settings.payRate;
    travelRateInput.value = settings.travelRate;
    payPeriodDaysInput.value = settings.payPeriodDays;
    payPeriodStartDateInput.value = settings.payPeriodStartDate;
    withholdingPercentageInput.value = settings.withholdingPercentage;
}

// Save user settings
function saveUserSettings() {
    // Get values from form
    const payRate = parseFloat(payRateInput.value) || 0;
    const travelRate = parseFloat(travelRateInput.value) || 0;
    const payPeriodDays = parseInt(payPeriodDaysInput.value) || 14;
    const payPeriodStartDate = payPeriodStartDateInput.value;
    const withholdingPercentage = parseFloat(withholdingPercentageInput.value) || 0;
    
    // Create settings object
    const settings = {
        payRate,
        travelRate,
        payPeriodDays,
        payPeriodStartDate,
        withholdingPercentage
    };
    
    // Save settings
    saveSettings(settings);
    
    // Update paycheck display with new settings
    updatePaycheckDisplay();
    
    // Update dashboard with new settings
    updateDashboard();
    
    // Show confirmation
    alert('Settings saved successfully!');
}

// Get current settings
export function getSettings() {
    return loadSettings();
}
