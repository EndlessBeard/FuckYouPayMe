import { getHoursForDate, loadHoursData } from './storage.js';
import { updateDailyInputDisplay } from './dailyHours.js';
import { updateDashboard } from './dashboard.js';

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
        // Create and dispatch the event
        const event = new CustomEvent('dateSelected', { detail: { date } });
        document.dispatchEvent(event);
        
        // Try to update the daily input display for the selected date
        // This might fail if initDailyHours hasn't run yet, but the event listener will handle it
        try {
            updateDailyInputDisplay(date);
        } catch (error) {
            console.warn('Could not update daily input display yet:', error.message);
            // The event listener in dailyHours.js will handle this later
        }
    } catch (error) {
        console.error('Error dispatching date selected event:', error);
    }
}

// Update the calendar when hours data changes
export function updateCalendar() {
    renderCalendar(currentMonth, currentYear);
    updateDashboard();
}
