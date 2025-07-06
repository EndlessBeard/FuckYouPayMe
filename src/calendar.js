import { getHoursForDate, loadHoursData } from './storage.js';
import { updateDailyInputDisplay } from './dailyHours.js';
import { updateDashboard } from './dashboard.js';
import { getSettings } from './settings.js';

// State variables
let currentDate = new Date();
let selectedDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// DOM Elements
let calendarGridElement;
let monthYearDisplay;
let prevMonthBtn;
let nextMonthBtn;

// Initialize the calendar
export function initCalendar() {
    // Get DOM elements
    calendarGridElement = document.getElementById('calendar-grid');
    monthYearDisplay = document.getElementById('current-month-year');
    prevMonthBtn = document.getElementById('prev-month-btn');
    nextMonthBtn = document.getElementById('next-month-btn');
    
    // Add event listeners for navigation
    prevMonthBtn.addEventListener('click', navigateToPreviousMonth);
    nextMonthBtn.addEventListener('click', navigateToNextMonth);
    
    // Render the initial calendar
    renderCalendar(currentMonth, currentYear);
    
    // Dispatch an event to notify the system about the selected date
    dispatchDateSelectedEvent(selectedDate);
}

// Render the calendar for a given month and year
function renderCalendar(month, year) {
    console.group('Rendering Calendar');
    console.log('Month/Year:', month, year);
    
    // Clear the existing calendar
    calendarGridElement.innerHTML = '';
    
    // Update the month-year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust to make Monday the first day of the week (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
    
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get current day for highlighting today
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();
    
    // Get hours data for highlighting days with recorded hours
    const hoursData = loadHoursData();
    
    // Get pay period information for highlighting pay period start dates
    const settings = getSettingsForCalendar();
    
    console.log('Getting pay period start dates with settings:', {
        payPeriodStartDate: settings.payPeriodStartDate,
        payPeriodDays: settings.payPeriodDays
    });
    
    const payPeriodStartDates = calculatePayPeriodStartDates(settings.payPeriodStartDate, settings.payPeriodDays, month, year);
    
    console.log('Pay period start dates for calendar:', 
        payPeriodStartDates.map(d => d.toISOString().split('T')[0])
    );
    
    // Create blank cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'inactive');
        calendarGridElement.appendChild(emptyCell);
    }
    
    // Create cells for days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement('div');
        dateCell.classList.add('calendar-day');
        dateCell.textContent = day;
        
        // Create a date object for this cell
        const cellDate = new Date(year, month, day);
        const dateString = cellDate.toISOString().split('T')[0];
        
        // Check if this day is today
        if (isCurrentMonth && day === todayDate) {
            dateCell.classList.add('today');
        }
        
        // Check if this day is selected
        if (selectedDate.getDate() === day && 
            selectedDate.getMonth() === month && 
            selectedDate.getFullYear() === year) {
            dateCell.classList.add('selected');
        }
        
        // Check if this day has recorded hours
        if (hoursData[dateString]) {
            dateCell.classList.add('has-hours');
        }
        
        // Check if this day is a pay period start date
        const isPeriodStart = isPayPeriodStartDate(cellDate, payPeriodStartDates);
        if (isPeriodStart) {
            dateCell.classList.add('pay-period-start');
            console.log(`Day ${dateString} is a pay period start date`);
        }
        
        // Add click event to select the day
        dateCell.addEventListener('click', () => {
            // Update selected date
            selectedDate = new Date(year, month, day);
            
            // Remove selected class from all days
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Add selected class to the clicked day
            dateCell.classList.add('selected');
            
            // Dispatch an event to notify the system about the selected date
            dispatchDateSelectedEvent(selectedDate);
        });
        
        calendarGridElement.appendChild(dateCell);
    }
    
    console.groupEnd();
}

// Navigate to the previous month
function navigateToPreviousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

// Navigate to the next month
function navigateToNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

// Dispatch custom event when a date is selected
function dispatchDateSelectedEvent(date) {
    try {
        console.group('Dispatching dateSelected Event');
        console.log('Selected date:', date);
        
        // Create and dispatch the event
        const event = new CustomEvent('dateSelected', { detail: { date } });
        document.dispatchEvent(event);
        console.log('Event dispatched');
        
        // Try to update the daily input display for the selected date
        // This might fail if initDailyHours hasn't run yet, but the event listener will handle it
        try {
            updateDailyInputDisplay(date);
        } catch (error) {
            console.warn('Could not update daily input display yet:', error.message);
            // The event listener in dailyHours.js will handle this later
        }
        
        // Also update the dashboard explicitly (it should also receive the event)
        try {
            updateDashboard();
        } catch (error) {
            console.warn('Could not update dashboard yet:', error.message);
            // The dashboard should also listen for this event independently
        }
        
        console.groupEnd();
    } catch (error) {
        console.error('Error dispatching date selected event:', error);
    }
}

// Update the calendar when hours data changes
export function updateCalendar() {
    renderCalendar(currentMonth, currentYear);
    updateDashboard();
}

// Function to get settings for the calendar (to avoid circular dependencies)
function getSettingsForCalendar() {
    return getSettings();
}

// Calculate all pay period start dates that fall within a specific month
function calculatePayPeriodStartDates(startDateStr, periodLength, month, year) {
    console.group('Calculate Pay Period Start Dates for Calendar');
    
    // Parse the base start date ensuring normalized format
    const startDateParts = startDateStr.split('-');
    const startDateBase = new Date(
        parseInt(startDateParts[0]), // year
        parseInt(startDateParts[1]) - 1, // month (0-indexed)
        parseInt(startDateParts[2]) // day
    );
    // Set to beginning of day to ensure consistent comparison
    startDateBase.setHours(0, 0, 0, 0);
    
    // If the date is invalid, return an empty array
    if (isNaN(startDateBase.getTime())) {
        console.error('Invalid pay period start date:', startDateStr);
        console.groupEnd();
        return [];
    }
    
    console.log('Base start date:', startDateBase);
    
    // Create array to store all pay period start dates for the month
    const payPeriodStartDates = [];
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    firstDayOfMonth.setHours(0, 0, 0, 0); // Normalize to beginning of day
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999); // Normalize to end of day
    
    console.log('Month range:', { 
        firstDayOfMonth: firstDayOfMonth.toISOString().split('T')[0], 
        lastDayOfMonth: lastDayOfMonth.toISOString().split('T')[0] 
    });
    
    // Calculate how many days have passed from the base start date to the first day of the month
    const daysSinceStart = Math.floor((firstDayOfMonth - startDateBase) / (24 * 60 * 60 * 1000));
    console.log('Days since start:', daysSinceStart);
    
    // Calculate how many complete periods have passed
    let periodsPassed = Math.floor(daysSinceStart / periodLength);
    
    // If the result is negative, we need to find the first pay period start date after the base date
    if (daysSinceStart < 0) {
        periodsPassed = Math.ceil(daysSinceStart / periodLength);
    }
    
    console.log('Periods passed:', periodsPassed);
    
    // Calculate the pay period start date closest to the beginning of the month
    const firstPayPeriodStart = new Date(startDateBase);
    firstPayPeriodStart.setDate(startDateBase.getDate() + (periodsPassed * periodLength));
    firstPayPeriodStart.setHours(0, 0, 0, 0); // Normalize to beginning of day
    
    console.log('First pay period start near month:', firstPayPeriodStart.toISOString().split('T')[0]);
    
    // Now iterate through all pay period start dates in this month
    let currentPayPeriodStart = new Date(firstPayPeriodStart);
    
    // If the first pay period start is before the beginning of the month, advance to the next one
    if (currentPayPeriodStart < firstDayOfMonth) {
        currentPayPeriodStart.setDate(currentPayPeriodStart.getDate() + periodLength);
        console.log('Advanced to next period start:', currentPayPeriodStart.toISOString().split('T')[0]);
    }
    
    // Add all pay period start dates that fall within this month
    while (currentPayPeriodStart <= lastDayOfMonth) {
        const exactDate = new Date(currentPayPeriodStart);
        payPeriodStartDates.push(exactDate);
        console.log('Added pay period start date:', exactDate.toISOString().split('T')[0]);
        currentPayPeriodStart.setDate(currentPayPeriodStart.getDate() + periodLength);
    }
    
    console.log('Final pay period start dates for month:', 
        payPeriodStartDates.map(d => d.toISOString().split('T')[0])
    );
    
    console.groupEnd();
    return payPeriodStartDates;
}

// Check if a date is a pay period start date
function isPayPeriodStartDate(date, payPeriodStartDates) {
    // Normalize the input date to beginning of day for consistent comparison
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    // Convert to string format for exact comparison
    const dateString = normalizedDate.toISOString().split('T')[0];
    
    // Check if any of the pay period start dates match this date exactly
    return payPeriodStartDates.some(startDate => {
        const startDateString = startDate.toISOString().split('T')[0];
        return startDateString === dateString;
    });
}
