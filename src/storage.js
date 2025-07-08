// Storage utility functions
const HOURS_DATA_KEY = 'fypm_hours_data';
const SETTINGS_KEY = 'fypm_settings';

// Helper function to get today's date in YYYY-MM-DD format
function getTodayFormatted() {
    return new Date().toISOString().split('T')[0];
}

// Default settings - notice we use a function to ensure fresh defaults each time
function getDefaultSettings() {
    return {
        payRate: 20.00,
        travelRate: 15.00,
        travelPayType: 'normal',
        payPeriodDays: 14,
        payPeriodStartDate: getTodayFormatted(), // Today's date in YYYY-MM-DD format
        withholdingPercentage: 20,
        paydayDelay: 3 // Number of days after the pay period ends until pay is received
    };
}

// Load hours data from localStorage
export function loadHoursData() {
    const storedData = localStorage.getItem(HOURS_DATA_KEY);
    return storedData ? JSON.parse(storedData) : {};
}

// Save hours data to localStorage
export function saveHoursData(data) {
    try {
        console.log('Attempting to save hours data:', data);
        
        // Stringify the hours data
        const hoursJSON = JSON.stringify(data);
        console.log('Hours JSON to save:', hoursJSON);
        
        // Save to localStorage
        localStorage.setItem(HOURS_DATA_KEY, hoursJSON);
        console.log('Hours data saved to localStorage');
        
        return true;
    } catch (error) {
        console.error('Error saving hours data to localStorage:', error);
        return false;
    }
}

// Save hours for a specific date
export function saveHoursForDate(date, hoursWorked, travelTime) {
    // Ensure consistent date formatting for storage
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0); // Normalize to beginning of day
    const dateString = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    console.log(`Saving hours for date: ${dateString}`, {
        originalDate: date,
        normalizedDate: dateObj,
        dateString: dateString,
        hoursWorked: parseFloat(hoursWorked) || 0,
        travelTime: parseFloat(travelTime) || 0
    });
    
    const hoursData = loadHoursData();
    
    hoursData[dateString] = {
        hoursWorked: parseFloat(hoursWorked) || 0,
        travelTime: parseFloat(travelTime) || 0,
        date: dateString
    };
    
    saveHoursData(hoursData);
    return hoursData;
}

// Get hours for a specific date
export function getHoursForDate(date) {
    // Ensure consistent date formatting for lookup
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0); // Normalize to beginning of day
    const dateString = dateObj.toISOString().split('T')[0];
    
    console.log(`Getting hours for date: ${dateString}`, {
        originalDate: date,
        normalizedDate: dateObj,
        dateString: dateString
    });
    
    const hoursData = loadHoursData();
    
    if (hoursData[dateString]) {
        console.log(`Found hours for ${dateString}:`, hoursData[dateString]);
    } else {
        console.log(`No hours found for ${dateString}`);
    }
    
    return hoursData[dateString] || { hoursWorked: 0, travelTime: 0, date: dateString };
}

// Delete hours for a specific date
export function deleteHoursForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    const hoursData = loadHoursData();
    
    if (hoursData[dateString]) {
        delete hoursData[dateString];
        saveHoursData(hoursData);
    }
    
    return hoursData;
}

// Clear all hours data
export function clearAllHoursData() {
    localStorage.removeItem(HOURS_DATA_KEY);
    return {};
}

// Load settings from localStorage
export function loadSettings() {
    try {
        console.log('Attempting to load settings from localStorage');
        
        // Try to retrieve settings from localStorage
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        console.log('Raw stored settings:', storedSettings);
        
        // Parse or use defaults
        const settings = storedSettings ? JSON.parse(storedSettings) : getDefaultSettings();
        
        // Ensure payPeriodStartDate is always a valid string
        if (!settings.payPeriodStartDate || settings.payPeriodStartDate === 'undefined') {
            console.warn('Invalid payPeriodStartDate detected, resetting to today:', settings.payPeriodStartDate);
            settings.payPeriodStartDate = getTodayFormatted();
        }
        
        console.log('Loaded settings:', settings);
        
        return settings;
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
        return getDefaultSettings();
    }
}

// Save settings to localStorage
export function saveSettings(settings) {
    try {
        console.log('Attempting to save settings:', settings);
        
        // Ensure payPeriodStartDate is valid
        if (!settings.payPeriodStartDate || settings.payPeriodStartDate === 'undefined') {
            console.warn('Invalid payPeriodStartDate provided, using today instead:', settings.payPeriodStartDate);
            settings.payPeriodStartDate = getTodayFormatted();
        }
        
        // Create the merged settings object with defaults as fallback
        const defaults = getDefaultSettings();
        const mergedSettings = {
            payRate: settings.payRate || defaults.payRate,
            travelRate: settings.travelRate || defaults.travelRate,
            travelPayType: settings.travelPayType || defaults.travelPayType,
            payPeriodDays: settings.payPeriodDays || defaults.payPeriodDays,
            payPeriodStartDate: settings.payPeriodStartDate || defaults.payPeriodStartDate,
            withholdingPercentage: settings.withholdingPercentage || defaults.withholdingPercentage,
            paydayDelay: (settings.paydayDelay !== undefined) ? settings.paydayDelay : defaults.paydayDelay
        };
        
        console.log('Merged settings to save:', mergedSettings);
        
        // Stringify the settings
        const settingsJSON = JSON.stringify(mergedSettings);
        console.log('Settings JSON to save:', settingsJSON);
        
        // Save to localStorage
        localStorage.setItem(SETTINGS_KEY, settingsJSON);
        console.log('Settings saved to localStorage');
        
        // Verify the save by loading again
        const savedSettings = loadSettings();
        console.log('Verified saved settings:', savedSettings);
        
        return savedSettings;
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
        return getDefaultSettings();
    }
}

// Format currency value
export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

// Format hours value
export function formatHours(hours) {
    return parseFloat(hours).toFixed(2);
}

// Check if localStorage is available and working
export function isLocalStorageAvailable() {
    try {
        const testKey = 'fypm_test';
        localStorage.setItem(testKey, 'test');
        const testResult = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        const isAvailable = testResult === 'test';
        console.log('localStorage availability test:', isAvailable ? 'PASSED' : 'FAILED');
        
        if (!isAvailable) {
            console.error('localStorage is not available or not working properly');
        }
        
        return isAvailable;
    } catch (error) {
        console.error('Error testing localStorage availability:', error);
        return false;
    }
}

// Debug utility to view all stored data
export function debugStorageState() {
    return {
        isLocalStorageAvailable: isLocalStorageAvailable(),
        hoursData: loadHoursData(),
        settings: loadSettings(),
        allStorageKeys: Object.keys(localStorage),
        totalItems: localStorage.length,
        estimatedSize: getTotalStorageSize()
    };
}

// Calculate approximate size of localStorage
function getTotalStorageSize() {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        size += (key.length + value.length) * 2; // Unicode characters use 2 bytes
    }
    
    // Return size in KB
    return (size / 1024).toFixed(2) + ' KB';
}
