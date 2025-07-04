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
    console.log('Loaded settings for display:', settings);
    
    // Display settings in form
    payRateInput.value = settings.payRate;
    travelRateInput.value = settings.travelRate;
    payPeriodDaysInput.value = settings.payPeriodDays;
    
    // Make sure the date is properly formatted for the date input
    // Date inputs require YYYY-MM-DD format
    if (settings.payPeriodStartDate) {
        try {
            // Normalize the date format
            const dateObj = new Date(settings.payPeriodStartDate);
            if (!isNaN(dateObj.getTime())) {
                // Valid date, format it as YYYY-MM-DD
                const formattedDate = dateObj.toISOString().split('T')[0];
                payPeriodStartDateInput.value = formattedDate;
                console.log('Pay period start date set to:', formattedDate);
            } else {
                // Invalid date, set to today
                const today = new Date().toISOString().split('T')[0];
                payPeriodStartDateInput.value = today;
                console.warn('Invalid pay period start date, defaulting to today:', today);
            }
        } catch (error) {
            console.error('Error formatting pay period start date:', error);
            // Default to today
            payPeriodStartDateInput.value = new Date().toISOString().split('T')[0];
        }
    } else {
        // No date set, use today
        payPeriodStartDateInput.value = new Date().toISOString().split('T')[0];
        console.warn('No pay period start date found, defaulting to today');
    }
    
    withholdingPercentageInput.value = settings.withholdingPercentage;
}

// Save user settings
function saveUserSettings() {
    console.group('Saving Settings Process');
    
    try {
        // Get values from form
        const payRate = parseFloat(payRateInput.value) || 0;
        const travelRate = parseFloat(travelRateInput.value) || 0;
        const payPeriodDays = parseInt(payPeriodDaysInput.value) || 14;
        
        // Get the pay period start date and ensure it's valid
        let payPeriodStartDate = payPeriodStartDateInput.value;
        
        // Validate the date format (should be YYYY-MM-DD)
        if (!payPeriodStartDate || !payPeriodStartDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.warn('Invalid pay period start date format:', payPeriodStartDate);
            // Default to today's date
            payPeriodStartDate = new Date().toISOString().split('T')[0];
            console.log('Using today as fallback date:', payPeriodStartDate);
        } else {
            // Additional validation - make sure it's a valid date
            const testDate = new Date(payPeriodStartDate);
            if (isNaN(testDate.getTime())) {
                console.warn('Pay period start date is not a valid date:', payPeriodStartDate);
                // Default to today's date
                payPeriodStartDate = new Date().toISOString().split('T')[0];
                console.log('Using today as fallback date:', payPeriodStartDate);
            }
        }
        
        const withholdingPercentage = parseFloat(withholdingPercentageInput.value) || 0;
        
        console.log('Form values retrieved:', {
            payRate,
            travelRate,
            payPeriodDays,
            payPeriodStartDate,
            withholdingPercentage
        });
        
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
        const savedSettings = saveSettings(settings);
        console.log('Settings saved and returned:', savedSettings);
        
        // Check if save was successful by comparing values
        const saveSuccessful = Object.keys(settings).every(key => 
            savedSettings[key] === settings[key]
        );
        
        console.log('Save successful?', saveSuccessful ? 'YES' : 'NO');
        
        if (!saveSuccessful) {
            console.warn('Settings may not have been saved correctly:');
            console.warn('- Original:', settings);
            console.warn('- Saved:', savedSettings);
        }
        
        // Update paycheck display with new settings
        updatePaycheckDisplay();
        console.log('Paycheck display updated');
        
        // Update dashboard with new settings
        updateDashboard();
        console.log('Dashboard updated with new settings');
        
        // Show confirmation
        alert(saveSuccessful ? 
            'Settings saved successfully!' : 
            'Warning: Settings may not have saved correctly. Please check the console for details.');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings: ' + error.message);
    }
    
    console.groupEnd();
}

// Get current settings
export function getSettings() {
    // Always reload settings from localStorage to ensure we have the latest
    const settings = loadSettings();
    console.log('Getting latest settings:', settings);
    return settings;
}
