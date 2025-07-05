import { formatCurrency, formatHours } from './storage.js';
import { getSettings } from './settings.js';
import { calculateWeekTotals, calculateDaysUntilPayday } from './paycheckCalculation.js';

// DOM Elements
let lastWeekHoursElement;
let lastWeekPayElement;
let currentWeekHoursElement;
let currentWeekPayElement;
let currentWeekNetElement;
let daysUntilPaydayElement;

// Initialize dashboard
export function initDashboard() {
    // Get DOM elements
    lastWeekHoursElement = document.getElementById('dashboard-last-week-hours');
    lastWeekPayElement = document.getElementById('dashboard-last-week-pay');
    currentWeekHoursElement = document.getElementById('dashboard-current-week-hours');
    currentWeekPayElement = document.getElementById('dashboard-current-week-pay');
    currentWeekNetElement = document.getElementById('dashboard-current-week-net');
    daysUntilPaydayElement = document.getElementById('dashboard-days-till-payday');
    
    // Initial update
    updateDashboard();
}

// Update dashboard with current data
export function updateDashboard() {
    // Get current settings
    const settings = getSettings();
    console.log('Updating dashboard with settings:', settings);
    
    // Calculate date ranges for current and last week
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);
    const currentWeekEnd = getEndOfWeek(today);
    
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(currentWeekEnd);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
    
    // Calculate totals for current week
    const currentWeekData = calculateWeekTotals(currentWeekStart, currentWeekEnd, settings);
    
    // Calculate totals for last week
    const lastWeekData = calculateWeekTotals(lastWeekStart, lastWeekEnd, settings);
    
    // Calculate days until next payday
    const daysUntilPayday = calculateDaysUntilPayday(settings.payPeriodStartDate, settings.payPeriodDays);
    
    // Calculate net pay for current week (apply withholding percentage)
    const withholding = (currentWeekData.grossPay * settings.withholdingPercentage) / 100;
    const netPay = currentWeekData.grossPay - withholding;
    
    // Update the dashboard display
    lastWeekHoursElement.textContent = formatHours(lastWeekData.totalHours);
    lastWeekPayElement.textContent = formatCurrency(lastWeekData.grossPay);
    currentWeekHoursElement.textContent = formatHours(currentWeekData.totalHours);
    currentWeekPayElement.textContent = formatCurrency(currentWeekData.grossPay);
    currentWeekNetElement.textContent = formatCurrency(netPay);
    daysUntilPaydayElement.textContent = daysUntilPayday;
    
    console.log('Dashboard updated with:', {
        lastWeek: { hours: lastWeekData.totalHours, pay: lastWeekData.grossPay },
        currentWeek: { 
            hours: currentWeekData.totalHours, 
            pay: currentWeekData.grossPay,
            net: netPay 
        },
        daysUntilPayday
    });
}

// Get the start of the week (Monday) for a given date
function getStartOfWeek(date) {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return startOfWeek;
}

// Get the end of the week (Sunday) for a given date
function getEndOfWeek(date) {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return endOfWeek;
}
