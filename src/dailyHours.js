import { saveHoursForDate, getHoursForDate, loadHoursData, clearAllHoursData } from './storage.js';
import { updateCalendar } from './calendar.js';
import { updatePaycheckDisplay } from './paycheckCalculation.js';

// DOM Elements
let selectedDateDisplay;
let hoursWorkedInput;
let travelTimeInput;
let saveDailyHoursBtn;
let recordedHoursList;
let clearHoursBtn;

// Initialize the daily hours functionality
export function initDailyHours() {
    // Get DOM elements
    selectedDateDisplay = document.getElementById('selected-date-display');
    hoursWorkedInput = document.getElementById('daily-hours-worked');
    travelTimeInput = document.getElementById('daily-travel-time');
    saveDailyHoursBtn = document.getElementById('save-daily-hours-btn');
    recordedHoursList = document.getElementById('recorded-hours-list');
    clearHoursBtn = document.getElementById('clear-hours-btn');
    
    // Add event listeners
    saveDailyHoursBtn.addEventListener('click', saveDailyHours);
    clearHoursBtn.addEventListener('click', confirmClearAllHours);
    
    // Listen for date selection events
    document.addEventListener('dateSelected', event => {
        updateDailyInputDisplay(event.detail.date);
    });
    
    // Initial render of the recorded hours list
    renderRecordedHoursList();
    
    // Set today's date as the initial selected date
    updateDailyInputDisplay(new Date());
}

// Update the daily input display for the selected date
export function updateDailyInputDisplay(date) {
    // Format the date for display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateDisplay.textContent = date.toLocaleDateString('en-US', options);
    
    // Get hours data for the selected date
    const hoursData = getHoursForDate(date);
    
    // Update input fields
    hoursWorkedInput.value = hoursData.hoursWorked || '';
    travelTimeInput.value = hoursData.travelTime || '';
}

// Save the daily hours
function saveDailyHours() {
    // Get values from inputs
    const hoursWorked = parseFloat(hoursWorkedInput.value) || 0;
    const travelTime = parseFloat(travelTimeInput.value) || 0;
    
    // Get the selected date from the date display
    const dateText = selectedDateDisplay.textContent;
    const selectedDate = new Date(dateText);
    
    // Save the hours data
    saveHoursForDate(selectedDate, hoursWorked, travelTime);
    
    // Update the UI
    renderRecordedHoursList();
    updateCalendar();
    updatePaycheckDisplay();
    
    // Show a confirmation message
    alert('Hours saved successfully!');
}

// Render the list of recorded hours
function renderRecordedHoursList() {
    // Clear the existing list
    recordedHoursList.innerHTML = '';
    
    // Get the hours data
    const hoursData = loadHoursData();
    
    // Sort the dates in descending order (most recent first)
    const sortedDates = Object.keys(hoursData).sort((a, b) => new Date(b) - new Date(a));
    
    // If there are no recorded hours, show a message
    if (sortedDates.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No hours recorded yet.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = 'var(--text-secondary)';
        recordedHoursList.appendChild(emptyMessage);
        return;
    }
    
    // Create list items for each recorded day
    sortedDates.forEach(dateString => {
        const { hoursWorked, travelTime } = hoursData[dateString];
        
        // Create the list item
        const listItem = document.createElement('li');
        
        // Format the date
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create the date element
        const dateElement = document.createElement('span');
        dateElement.textContent = formattedDate;
        dateElement.classList.add('date');
        
        // Create the hours element
        const hoursElement = document.createElement('span');
        hoursElement.textContent = `${hoursWorked} hrs`;
        hoursElement.classList.add('hours');
        
        // Create the travel element
        const travelElement = document.createElement('span');
        travelElement.textContent = `${travelTime} travel`;
        travelElement.classList.add('travel');
        
        // Create a container for the hours and travel
        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('hours-details');
        detailsContainer.appendChild(hoursElement);
        detailsContainer.appendChild(travelElement);
        
        // Add elements to the list item
        listItem.appendChild(dateElement);
        listItem.appendChild(detailsContainer);
        
        // Add click event to edit the hours for this date
        listItem.addEventListener('click', () => {
            // Create a new date object to avoid modifying the original date
            const clickedDate = new Date(date);
            
            // Dispatch an event to select this date
            const event = new CustomEvent('dateSelected', { detail: { date: clickedDate } });
            document.dispatchEvent(event);
        });
        
        // Add the list item to the list
        recordedHoursList.appendChild(listItem);
    });
}

// Confirm and clear all hours
function confirmClearAllHours() {
    const confirmed = confirm('Are you sure you want to clear all recorded hours? This action cannot be undone.');
    
    if (confirmed) {
        clearAllHoursData();
        renderRecordedHoursList();
        updateCalendar();
        updatePaycheckDisplay();
        
        // Clear the input fields
        hoursWorkedInput.value = '';
        travelTimeInput.value = '';
        
        alert('All hours have been cleared.');
    }
}
