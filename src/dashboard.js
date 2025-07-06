import { formatCurrency, formatHours } from './storage.js';
import { getSettings } from './settings.js';
import { calculateWeekTotals, calculateDaysUntilPayday, calculatePayPeriodTotals } from './paycheckCalculation.js';

// DOM Elements
let lastWeekHoursElement;
let lastWeekPayElement;
let currentWeekHoursElement;
let currentWeekPayElement;
let currentWeekNetElement;
let daysUntilPaydayElement;
let currentWeekTitleElement;

// State variables
let selectedDate = new Date(); // Default to today's date

// Initialize dashboard
export function initDashboard() {
    // Get DOM elements
    lastWeekHoursElement = document.getElementById('dashboard-last-week-hours');
    lastWeekPayElement = document.getElementById('dashboard-last-week-pay');
    currentWeekHoursElement = document.getElementById('dashboard-current-week-hours');
    currentWeekPayElement = document.getElementById('dashboard-current-week-pay');
    currentWeekNetElement = document.getElementById('dashboard-current-week-net');
    daysUntilPaydayElement = document.getElementById('dashboard-days-till-payday');
    currentWeekTitleElement = document.getElementById('dashboard-current-week-title');
    
    // Listen for date selection events from the calendar
    document.addEventListener('dateSelected', event => {
        console.log('Dashboard received dateSelected event:', event.detail.date);
        selectedDate = new Date(event.detail.date);
        updateDashboard();
    });
    
    // Initial update with today's date
    updateDashboard();
}

// Update dashboard with current data
export function updateDashboard() {
    // Get current settings
    const settings = getSettings();
    console.log('Updating dashboard with settings:', settings);
    
    console.group('Dashboard Date Calculation');
    console.log('Selected date:', selectedDate);
    
    // Find the pay period that contains the selected date
    const payPeriod = getPayPeriodForDate(selectedDate, settings.payPeriodStartDate, settings.payPeriodDays);
    const currentPayPeriodStart = payPeriod.startDate;
    const currentPayPeriodEnd = payPeriod.endDate;
    
    // Calculate the previous pay period
    const prevPayPeriod = getPreviousPayPeriod(currentPayPeriodStart, settings.payPeriodDays);
    const prevPayPeriodStart = prevPayPeriod.startDate;
    const prevPayPeriodEnd = prevPayPeriod.endDate;
    
    console.log('Current pay period:', {
        start: currentPayPeriodStart.toISOString().split('T')[0],
        end: currentPayPeriodEnd.toISOString().split('T')[0]
    });
    
    console.log('Previous pay period:', {
        start: prevPayPeriodStart.toISOString().split('T')[0],
        end: prevPayPeriodEnd.toISOString().split('T')[0]
    });
    console.groupEnd();
    
    // Calculate totals for current pay period
    const currentPayPeriodData = calculatePayPeriodTotals(currentPayPeriodStart, currentPayPeriodEnd, settings);
    
    // Calculate totals for previous pay period
    const prevPayPeriodData = calculatePayPeriodTotals(prevPayPeriodStart, prevPayPeriodEnd, settings);
    
    // Calculate days until next payday
    const daysUntilPayday = calculateDaysUntilPayday(
        settings.payPeriodStartDate, 
        settings.payPeriodDays,
        settings.paydayDelay
    );
    
    // Calculate net pay for current pay period (apply withholding percentage)
    const withholding = (currentPayPeriodData.grossPay * settings.withholdingPercentage) / 100;
    const netPay = currentPayPeriodData.grossPay - withholding;
    
    // Format dates for display
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCurrentPayPeriod = (
        currentPayPeriodStart.getTime() <= today.getTime() && 
        today.getTime() <= currentPayPeriodEnd.getTime()
    );
    
    // Format the pay period title
    const payPeriodStartFormatted = currentPayPeriodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const payPeriodEndFormatted = currentPayPeriodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const payPeriodTitle = isCurrentPayPeriod 
        ? "Current Pay Period" 
        : `Pay Period: ${payPeriodStartFormatted} - ${payPeriodEndFormatted}`;
    
    // Update the dashboard display
    if (currentWeekTitleElement) {
        currentWeekTitleElement.textContent = payPeriodTitle;
    }
    lastWeekHoursElement.textContent = formatHours(prevPayPeriodData.totalHours);
    lastWeekPayElement.textContent = formatCurrency(prevPayPeriodData.grossPay);
    currentWeekHoursElement.textContent = formatHours(currentPayPeriodData.totalHours);
    currentWeekPayElement.textContent = formatCurrency(currentPayPeriodData.grossPay);
    currentWeekNetElement.textContent = formatCurrency(netPay);
    daysUntilPaydayElement.textContent = daysUntilPayday;
    
    console.log('Dashboard updated with:', {
        prevPayPeriod: { 
            hours: prevPayPeriodData.totalHours, 
            regularHours: prevPayPeriodData.regularHours,
            overtimeHours: prevPayPeriodData.overtimeHours,
            pay: prevPayPeriodData.grossPay,
            regularPay: prevPayPeriodData.regularPay,
            overtimePay: prevPayPeriodData.overtimePay
        },
        currentPayPeriod: { 
            hours: currentPayPeriodData.totalHours, 
            regularHours: currentPayPeriodData.regularHours,
            overtimeHours: currentPayPeriodData.overtimeHours,
            pay: currentPayPeriodData.grossPay,
            regularPay: currentPayPeriodData.regularPay,
            overtimePay: currentPayPeriodData.overtimePay,
            net: netPay 
        },
        daysUntilPayday
    });
}

// Get the pay period that contains a specific date
function getPayPeriodForDate(date, payPeriodStartDateStr, payPeriodDays) {
    console.group('Get Pay Period For Date');
    
    // Ensure date is at the start of the day
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    console.log('Target date:', targetDate);
    
    // Parse the start date - ensure we're using the correct date without timezone issues
    const startDateParts = payPeriodStartDateStr.split('-');
    // Note: months are 0-indexed in JavaScript Date
    const startDateBase = new Date(
        parseInt(startDateParts[0]), // year
        parseInt(startDateParts[1]) - 1, // month (0-indexed)
        parseInt(startDateParts[2]) // day
    );
    // Set to beginning of day
    startDateBase.setHours(0, 0, 0, 0);
    
    console.log('Pay period base start date:', startDateBase);
    
    // Calculate how many days have passed since the base start date
    const msDiff = targetDate.getTime() - startDateBase.getTime() + 1; // Add 1ms to handle floating point precision
    const daysSinceStart = Math.floor(msDiff / (24 * 60 * 60 * 1000));
    console.log('Days since start:', daysSinceStart);
    
    // Calculate how many complete periods have passed
    const periodsPassed = Math.floor(daysSinceStart / payPeriodDays);
    console.log('Periods passed:', periodsPassed);
    
    // Calculate the start date of the pay period that contains the target date
    const periodStart = new Date(startDateBase);
    periodStart.setDate(startDateBase.getDate() + (periodsPassed * payPeriodDays));
    periodStart.setHours(0, 0, 0, 0); // Ensure start of day
    
    // Calculate the end date of the pay period
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + payPeriodDays - 1);
    periodEnd.setHours(23, 59, 59, 999); // Set to end of day
    
    console.log('Pay period containing date:', {
        startDate: periodStart,
        endDate: periodEnd,
        formattedStart: periodStart.toISOString().split('T')[0],
        formattedEnd: periodEnd.toISOString().split('T')[0]
    });
    
    console.groupEnd();
    
    return { startDate: periodStart, endDate: periodEnd };
}

// Get the previous pay period
function getPreviousPayPeriod(currentPeriodStartDate, payPeriodDays) {
    const prevPeriodStart = new Date(currentPeriodStartDate);
    prevPeriodStart.setDate(prevPeriodStart.getDate() - payPeriodDays);
    prevPeriodStart.setHours(0, 0, 0, 0); // Ensure start of day
    
    const prevPeriodEnd = new Date(prevPeriodStart);
    prevPeriodEnd.setDate(prevPeriodStart.getDate() + payPeriodDays - 1);
    prevPeriodEnd.setHours(23, 59, 59, 999); // Set to end of day
    
    return { startDate: prevPeriodStart, endDate: prevPeriodEnd };
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
