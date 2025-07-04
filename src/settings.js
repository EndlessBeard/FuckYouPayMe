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
    
    // Create a custom event for settings changes
    const settingsChangedEvent = new CustomEvent('settingsChanged');
    
    // Add event listeners for all input changes
    const allInputs = [payRateInput, travelRateInput, payPeriodDaysInput, 
                      payPeriodStartDateInput, withholdingPercentageInput];
    
    allInputs.forEach(input => {
        input.addEventListener('change', () => {
            console.log(`Setting ${input.id} changed to ${input.value}`);
        });
    });
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
    
    console.log('Saving settings:', settings);
    
    // Save settings
    saveSettings(settings);
    
    // Retrieve the saved settings to confirm
    const savedSettings = loadSettings();
    console.log('Settings saved and retrieved:', savedSettings);
    
    // Update paycheck display with new settings
    updatePaycheckDisplay();
    console.log('Paycheck display updated');
    
    // Update dashboard with new settings
    updateDashboard();
    console.log('Dashboard updated with new settings');
    
    // Show confirmation
    alert('Settings saved successfully!');
}

// Get current settings
export function getSettings() {
    // Always reload settings from localStorage to ensure we have the latest
    const settings = loadSettings();
    console.log('Getting latest settings:', settings);
    return settings;
}
