// Storage utility functions
const HOURS_DATA_KEY = 'fypm_hours_data';
const SETTINGS_KEY = 'fypm_settings';

// Default settings
const defaultSettings = {
    payRate: 20.00,
    travelRate: 15.00,
    payPeriodDays: 14,
    payPeriodStartDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    withholdingPercentage: 20
};

// Load hours data from localStorage
export function loadHoursData() {
    const storedData = localStorage.getItem(HOURS_DATA_KEY);
    return storedData ? JSON.parse(storedData) : {};
}

// Save hours data to localStorage
export function saveHoursData(data) {
    localStorage.setItem(HOURS_DATA_KEY, JSON.stringify(data));
}

// Save hours for a specific date
export function saveHoursForDate(date, hoursWorked, travelTime) {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
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
    const dateString = date.toISOString().split('T')[0];
    const hoursData = loadHoursData();
    
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
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
}

// Save settings to localStorage
export function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        ...defaultSettings,
        ...settings
    }));
    
    return loadSettings();
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

// Debug utility to view all stored data
export function debugStorageState() {
    return {
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
