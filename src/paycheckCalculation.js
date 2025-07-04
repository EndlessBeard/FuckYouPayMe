import { loadHoursData, formatCurrency, formatHours } from './storage.js';
import { getSettings } from './settings.js';

// DOM Elements
let payPeriodDatesElement;
let totalHoursElement;
let totalTravelTimeElement;
let grossPayElement;
let withholdingsElement;
let netPayElement;

// Initialize paycheck calculation
export function initPaycheckCalculation() {
    // Get DOM elements
    payPeriodDatesElement = document.getElementById('display-pay-period-dates');
    totalHoursElement = document.getElementById('display-total-hours');
    totalTravelTimeElement = document.getElementById('display-total-travel-time');
    grossPayElement = document.getElementById('display-gross-pay');
    withholdingsElement = document.getElementById('display-withholdings');
    netPayElement = document.getElementById('display-net-pay');
    
    // Initial calculation
    updatePaycheckDisplay();
    
    // Listen for changes in hours data
    document.addEventListener('hoursUpdated', updatePaycheckDisplay);
}

// Update the paycheck display
export function updatePaycheckDisplay() {
    // Get current settings
    const settings = getSettings();
    
    // Get the pay period date range
    const { startDate, endDate } = calculatePayPeriodDates(settings.payPeriodStartDate, settings.payPeriodDays);
    
    // Format the date range for display
    const formattedStartDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    payPeriodDatesElement.textContent = `${formattedStartDate} - ${formattedEndDate}`;
    
    // Calculate total hours and pay for the current pay period
    const { totalHours, totalTravel, grossPay } = calculatePayPeriodTotals(startDate, endDate, settings);
    
    // Calculate withholdings
    const withholdings = (grossPay * settings.withholdingPercentage) / 100;
    
    // Calculate net pay
    const netPay = grossPay - withholdings;
    
    // Update the display
    totalHoursElement.textContent = formatHours(totalHours);
    totalTravelTimeElement.textContent = formatHours(totalTravel);
    grossPayElement.textContent = formatCurrency(grossPay);
    withholdingsElement.textContent = formatCurrency(withholdings);
    netPayElement.textContent = formatCurrency(netPay);
}

// Calculate the current pay period date range
function calculatePayPeriodDates(startDateStr, periodLength) {
    // Parse the start date
    const startDateBase = new Date(startDateStr);
    
    // Get today's date
    const today = new Date();
    
    // Calculate how many days have passed since the base start date
    const daysSinceStart = Math.floor((today - startDateBase) / (24 * 60 * 60 * 1000));
    
    // Calculate how many complete periods have passed
    const periodsPassed = Math.floor(daysSinceStart / periodLength);
    
    // Calculate the start date of the current period
    const currentPeriodStart = new Date(startDateBase);
    currentPeriodStart.setDate(startDateBase.getDate() + (periodsPassed * periodLength));
    
    // Calculate the end date of the current period
    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setDate(currentPeriodStart.getDate() + periodLength - 1);
    
    return { startDate: currentPeriodStart, endDate: currentPeriodEnd };
}

// Calculate total hours and pay for a date range
function calculatePayPeriodTotals(startDate, endDate, settings) {
    // Get all hours data
    const hoursData = loadHoursData();
    
    // Initialize totals
    let totalHours = 0;
    let totalTravel = 0;
    
    // Loop through each day in the date range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        // Convert date to string format
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Add hours if they exist for this date
        if (hoursData[dateString]) {
            totalHours += parseFloat(hoursData[dateString].hoursWorked) || 0;
            totalTravel += parseFloat(hoursData[dateString].travelTime) || 0;
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate gross pay
    const grossPay = (totalHours * settings.payRate) + (totalTravel * settings.travelRate);
    
    return { totalHours, totalTravel, grossPay };
}

// Calculate days until next payday
export function calculateDaysUntilPayday(payPeriodStartDate, payPeriodDays) {
    // Get the current pay period
    const { endDate } = calculatePayPeriodDates(payPeriodStartDate, payPeriodDays);
    
    // Calculate days until the end of the current pay period
    const today = new Date();
    const daysUntilPayday = Math.ceil((endDate - today) / (24 * 60 * 60 * 1000)) + 1;
    
    return daysUntilPayday > 0 ? daysUntilPayday : 0;
}

// Calculate totals for a week
export function calculateWeekTotals(weekStart, weekEnd, settings) {
    // Get all hours data
    const hoursData = loadHoursData();
    
    // Initialize totals
    let totalHours = 0;
    let totalTravel = 0;
    
    // Loop through each day in the week
    const currentDate = new Date(weekStart);
    while (currentDate <= weekEnd) {
        // Convert date to string format
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Add hours if they exist for this date
        if (hoursData[dateString]) {
            totalHours += parseFloat(hoursData[dateString].hoursWorked) || 0;
            totalTravel += parseFloat(hoursData[dateString].travelTime) || 0;
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate gross pay
    const grossPay = (totalHours * settings.payRate) + (totalTravel * settings.travelRate);
    
    return { totalHours, totalTravel, grossPay };
}
