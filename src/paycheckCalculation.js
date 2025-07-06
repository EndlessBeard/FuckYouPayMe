import { loadHoursData, formatCurrency, formatHours } from './storage.js';
import { getSettings } from './settings.js';

// DOM Elements
let payPeriodDatesElement;
let totalHoursElement;
let regularHoursElement;
let overtimeHoursElement;
let totalTravelTimeElement;
let grossPayElement;
let regularPayElement;
let overtimePayElement;
let travelPayElement;
let withholdingsElement;
let netPayElement;

// Initialize paycheck calculation
export function initPaycheckCalculation() {
    console.group('Initializing Paycheck Calculation');
    
    // Get DOM elements
    payPeriodDatesElement = document.getElementById('display-pay-period-dates');
    totalHoursElement = document.getElementById('display-total-hours');
    regularHoursElement = document.getElementById('display-regular-hours');
    overtimeHoursElement = document.getElementById('display-overtime-hours');
    totalTravelTimeElement = document.getElementById('display-total-travel-time');
    grossPayElement = document.getElementById('display-gross-pay');
    regularPayElement = document.getElementById('display-regular-pay');
    overtimePayElement = document.getElementById('display-overtime-pay');
    travelPayElement = document.getElementById('display-travel-pay');
    withholdingsElement = document.getElementById('display-withholdings');
    netPayElement = document.getElementById('display-net-pay');
    
    // Log DOM elements to check if they're found
    console.log('DOM Elements found:', {
        payPeriodDatesElement: !!payPeriodDatesElement,
        totalHoursElement: !!totalHoursElement,
        regularHoursElement: !!regularHoursElement,
        overtimeHoursElement: !!overtimeHoursElement,
        totalTravelTimeElement: !!totalTravelTimeElement,
        grossPayElement: !!grossPayElement,
        regularPayElement: !!regularPayElement,
        overtimePayElement: !!overtimePayElement,
        travelPayElement: !!travelPayElement,
        withholdingsElement: !!withholdingsElement,
        netPayElement: !!netPayElement
    });
    
    // Initial calculation
    updatePaycheckDisplay();
    
    // Listen for changes in hours data
    document.addEventListener('hoursUpdated', updatePaycheckDisplay);
    
    console.groupEnd();
}

// Update the paycheck display
export function updatePaycheckDisplay() {
    console.group('Updating Paycheck Display');
    
    // Get current settings
    const settings = getSettings();
    console.log('Settings:', settings);
    
    // Get the pay period date range
    const { startDate, endDate } = calculatePayPeriodDates(settings.payPeriodStartDate, settings.payPeriodDays);
    console.log('Pay period dates:', { 
        startDate, 
        endDate, 
        startDateFormatted: startDate.toISOString().split('T')[0],
        endDateFormatted: endDate.toISOString().split('T')[0],
        startDateTimestamp: startDate.getTime(),
        endDateTimestamp: endDate.getTime()
    });
    
    // Format the date range for display
    const formattedStartDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    payPeriodDatesElement.textContent = `${formattedStartDate} - ${formattedEndDate}`;
    
    // Check if DOM elements exist
    console.log('DOM elements check:', {
        payPeriodDatesElement: !!payPeriodDatesElement,
        totalHoursElement: !!totalHoursElement,
        regularHoursElement: !!regularHoursElement,
        overtimeHoursElement: !!overtimeHoursElement,
        totalTravelTimeElement: !!totalTravelTimeElement,
        grossPayElement: !!grossPayElement,
        regularPayElement: !!regularPayElement,
        overtimePayElement: !!overtimePayElement,
        travelPayElement: !!travelPayElement,
        withholdingsElement: !!withholdingsElement,
        netPayElement: !!netPayElement
    });
    
    // Calculate total hours and pay for the current pay period
    const { 
        totalHours, 
        regularHours, 
        overtimeHours, 
        totalTravel, 
        grossPay, 
        regularPay, 
        overtimePay, 
        travelPay 
    } = calculatePayPeriodTotals(startDate, endDate, settings);
    
    console.log('Calculation results:', { 
        totalHours, 
        regularHours, 
        overtimeHours, 
        totalTravel, 
        grossPay, 
        regularPay, 
        overtimePay, 
        travelPay 
    });
    
    // Calculate withholdings
    const withholdings = (grossPay * settings.withholdingPercentage) / 100;
    
    // Calculate net pay
    const netPay = grossPay - withholdings;
    
    // Update the display
    try {
        totalHoursElement.textContent = formatHours(totalHours);
        regularHoursElement.textContent = formatHours(regularHours);
        overtimeHoursElement.textContent = formatHours(overtimeHours);
        totalTravelTimeElement.textContent = formatHours(totalTravel);
        grossPayElement.textContent = formatCurrency(grossPay);
        regularPayElement.textContent = formatCurrency(regularPay);
        overtimePayElement.textContent = formatCurrency(overtimePay);
        travelPayElement.textContent = formatCurrency(travelPay);
        withholdingsElement.textContent = formatCurrency(withholdings);
        netPayElement.textContent = formatCurrency(netPay);
        console.log('Display updated successfully');
    } catch (error) {
        console.error('Error updating display:', error);
    }
    
    console.groupEnd();
}

// Calculate the current pay period date range
function calculatePayPeriodDates(startDateStr, periodLength) {
    console.group('Calculate Pay Period Dates');
    console.log('Inputs:', { startDateStr, periodLength });
    
    // Check if startDateStr is valid
    if (!startDateStr || startDateStr === 'undefined') {
        console.error('Invalid pay period start date:', startDateStr);
        console.groupEnd();
        
        // Use today as a fallback
        const today = new Date();
        const fallbackDate = today.toISOString().split('T')[0];
        console.warn('Using fallback date:', fallbackDate);
        
        return calculatePayPeriodDates(fallbackDate, periodLength);
    }
    
    try {
        // Parse the start date - ensure we're using the correct date without timezone issues
        // Use Date.parse to avoid timezone conversion issues
        const startDateParts = startDateStr.split('-');
        
        // Note: months are 0-indexed in JavaScript Date
        const startDateBase = new Date(
            parseInt(startDateParts[0]), // year
            parseInt(startDateParts[1]) - 1, // month (0-indexed)
            parseInt(startDateParts[2]) // day
        );
        // Set to beginning of day
        startDateBase.setHours(0, 0, 0, 0);
        
        // Validate the date is valid
        if (isNaN(startDateBase.getTime())) {
            console.error('Invalid date object created from:', startDateStr);
            console.groupEnd();
            
            // Use today as a fallback
            const today = new Date();
            const fallbackDate = today.toISOString().split('T')[0];
            console.warn('Using fallback date due to invalid date:', fallbackDate);
            
            return calculatePayPeriodDates(fallbackDate, periodLength);
        }
        
        console.log('Start date base:', startDateBase);
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day for consistent calculations
        console.log('Today:', today);
        
        // Calculate how many days have passed since the base start date
        // Add 1 to the milliseconds to handle floating point precision issues
        const msDiff = today.getTime() - startDateBase.getTime() + 1;
        const daysSinceStart = Math.floor(msDiff / (24 * 60 * 60 * 1000));
        console.log('Days since start:', daysSinceStart);
        
        // Calculate how many complete periods have passed
        const periodsPassed = Math.floor(daysSinceStart / periodLength);
        console.log('Periods passed:', periodsPassed);
        
        // Calculate the start date of the current period
        const currentPeriodStart = new Date(startDateBase);
        currentPeriodStart.setDate(startDateBase.getDate() + (periodsPassed * periodLength));
        currentPeriodStart.setHours(0, 0, 0, 0); // Ensure start of day
        
        // Calculate the end date of the current period
        const currentPeriodEnd = new Date(currentPeriodStart);
        currentPeriodEnd.setDate(currentPeriodStart.getDate() + periodLength - 1);
        currentPeriodEnd.setHours(23, 59, 59, 999); // Set to end of day
        
        console.log('Result:', { 
            startDate: currentPeriodStart, 
            endDate: currentPeriodEnd,
            formattedStart: currentPeriodStart.toISOString().split('T')[0],
            formattedEnd: currentPeriodEnd.toISOString().split('T')[0]
        });
        
        console.groupEnd();
        
        return { startDate: currentPeriodStart, endDate: currentPeriodEnd };
    } catch (error) {
        console.error('Error in calculatePayPeriodDates:', error);
        console.groupEnd();
        
        // Fallback to today
        const today = new Date();
        const fallbackDate = today.toISOString().split('T')[0];
        console.warn('Using fallback date due to error:', fallbackDate);
        
        // Only recurse once to avoid infinite loop
        if (startDateStr !== fallbackDate) {
            return calculatePayPeriodDates(fallbackDate, periodLength);
        } else {
            // Create a basic response if we're already using the fallback
            const startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + periodLength - 1);
            endDate.setHours(23, 59, 59, 999);
            return { startDate, endDate };
        }
    }
}

// Calculate total hours and pay for a date range
export function calculatePayPeriodTotals(startDate, endDate, settings) {
    console.group('Calculate Pay Period Totals');
    console.log('Date range:', { 
        startDate: startDate.toISOString().split('T')[0], 
        endDate: endDate.toISOString().split('T')[0] 
    });
    console.log('Settings:', settings);
    
    // Get all hours data
    const hoursData = loadHoursData();
    console.log('Hours data loaded:', hoursData);
    
    // Initialize pay period totals
    let totalHours = 0;
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalTravel = 0;
    
    // Process the pay period in 7-day chunks to calculate overtime correctly
    // This ensures overtime is calculated per week (40h threshold) rather than for the entire pay period
    const currentDate = new Date(startDate);
    // Ensure we're starting at the beginning of the day
    currentDate.setHours(0, 0, 0, 0);
    
    // For debugging, log all days in the pay period
    console.log('Pay period days:');
    const debugDate = new Date(startDate);
    debugDate.setHours(0, 0, 0, 0);
    
    // Create a map of date strings to make lookup easier
    const dateMap = {};
    while (debugDate <= endDate) {
        const debugDateStr = debugDate.toISOString().split('T')[0];
        const hasHours = !!hoursData[debugDateStr];
        dateMap[debugDateStr] = true;
        console.log(`- ${debugDateStr}: ${hasHours ? 'Has hours' : 'No hours'}`);
        debugDate.setDate(debugDate.getDate() + 1);
    }
    
    while (currentDate <= endDate) {
        // Create a 7-day period (or less if we're at the end of the pay period)
        const weekStartDate = new Date(currentDate);
        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // Add 6 days (7-day period)
        
        // Ensure weekEndDate doesn't go beyond the pay period endDate
        if (weekEndDate > endDate) {
            weekEndDate.setTime(endDate.getTime());
        }
        
        console.log('Processing week:', { 
            weekStart: weekStartDate.toISOString().split('T')[0], 
            weekEnd: weekEndDate.toISOString().split('T')[0] 
        });
        
        // Calculate hours for this week
        let weeklyHours = 0;
        let weeklyTravel = 0;
        
        // Loop through each day in the current week
        const weekDay = new Date(weekStartDate);
        while (weekDay <= weekEndDate) {
            // Convert date to string format (YYYY-MM-DD)
            const dateString = weekDay.toISOString().split('T')[0];
            
            // Add hours if they exist for this date
            if (hoursData[dateString]) {
                const dayHours = parseFloat(hoursData[dateString].hoursWorked) || 0;
                const dayTravel = parseFloat(hoursData[dateString].travelTime) || 0;
                
                weeklyHours += dayHours;
                weeklyTravel += dayTravel;
                
                console.log(`Day ${dateString}: ${dayHours}h worked, ${dayTravel}h travel`);
            } else {
                console.log(`Day ${dateString}: No hours recorded`);
            }
            
            // Move to next day
            weekDay.setDate(weekDay.getDate() + 1);
        }
        
        // Calculate regular and overtime hours for this week
        let weeklyRegularHours = weeklyHours;
        let weeklyOvertimeHours = 0;
        
        // If more than 40 hours were worked in this week, calculate overtime
        // This ensures overtime is calculated per week, not across the entire pay period
        if (weeklyHours > 40) {
            weeklyRegularHours = 40;
            weeklyOvertimeHours = weeklyHours - 40;
            console.log(`Week overtime: ${weeklyOvertimeHours}h over 40h`);
        }
        
        // Add this week's hours to the pay period totals
        totalHours += weeklyHours;
        totalRegularHours += weeklyRegularHours;
        totalOvertimeHours += weeklyOvertimeHours;
        totalTravel += weeklyTravel;
        
        // Move to the start of the next week
        currentDate.setDate(currentDate.getDate() + 7);
    }
    
    // Calculate gross pay with overtime at 1.5x rate
    const regularPay = totalRegularHours * settings.payRate;
    const overtimePay = totalOvertimeHours * (settings.payRate * 1.5); // Apply 1.5x multiplier for overtime
    const travelPay = totalTravel * settings.travelRate;
    const grossPay = regularPay + overtimePay + travelPay;
    
    console.log('Pay period totals:', {
        totalHours,
        regularHours: totalRegularHours,
        overtimeHours: totalOvertimeHours,
        totalTravel,
        regularPay,
        overtimePay,
        travelPay,
        grossPay
    });
    
    console.groupEnd();
    
    return { 
        totalHours, 
        regularHours: totalRegularHours,
        overtimeHours: totalOvertimeHours,
        totalTravel, 
        grossPay,
        regularPay,
        overtimePay,
        travelPay
    };
}

// Calculate days until next payday
export function calculateDaysUntilPayday(payPeriodStartDate, payPeriodDays) {
    console.group('Calculate Days Until Payday');
    console.log('Inputs:', { payPeriodStartDate, payPeriodDays });
    
    // Validate inputs
    if (!payPeriodStartDate || !payPeriodDays) {
        console.error('Missing required inputs:', { payPeriodStartDate, payPeriodDays });
        console.groupEnd();
        return 0;
    }
    
    // Get the current pay period
    const { endDate } = calculatePayPeriodDates(payPeriodStartDate, payPeriodDays);
    console.log('Pay period end date:', endDate);
    
    // Calculate days until the end of the current pay period
    const today = new Date();
    const daysUntilPayday = Math.ceil((endDate - today) / (24 * 60 * 60 * 1000)) + 1;
    
    console.log('Days until payday (raw):', daysUntilPayday);
    const result = daysUntilPayday > 0 ? daysUntilPayday : 0;
    console.log('Final result:', result);
    
    console.groupEnd();
    return result;
}

// Calculate totals for a week
export function calculateWeekTotals(weekStart, weekEnd, settings) {
    console.group('Calculate Week Totals');
    console.log('Week range:', { 
        weekStart: weekStart.toISOString().split('T')[0], 
        weekEnd: weekEnd.toISOString().split('T')[0] 
    });
    
    // Get all hours data
    const hoursData = loadHoursData();
    
    // Initialize totals
    let totalHours = 0;
    let totalTravel = 0;
    
    // For debugging, log all days in the week
    console.log('Week days:');
    const debugDate = new Date(weekStart);
    debugDate.setHours(0, 0, 0, 0);
    while (debugDate <= weekEnd) {
        const debugDateStr = debugDate.toISOString().split('T')[0];
        const hasHours = !!hoursData[debugDateStr];
        console.log(`- ${debugDateStr}: ${hasHours ? 'Has hours' : 'No hours'}`);
        debugDate.setDate(debugDate.getDate() + 1);
    }
    
    // Loop through each day in the week
    const currentDate = new Date(weekStart);
    currentDate.setHours(0, 0, 0, 0); // Normalize to beginning of day
    
    while (currentDate <= weekEnd) {
        // Convert date to string format
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Add hours if they exist for this date
        if (hoursData[dateString]) {
            const dayHours = parseFloat(hoursData[dateString].hoursWorked) || 0;
            const dayTravel = parseFloat(hoursData[dateString].travelTime) || 0;
            
            totalHours += dayHours;
            totalTravel += dayTravel;
            
            console.log(`Day ${dateString}: ${dayHours}h worked, ${dayTravel}h travel`);
        } else {
            console.log(`Day ${dateString}: No hours recorded`);
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate regular and overtime hours (overtime for hours > 40)
    // Apply the same overtime logic as in calculatePayPeriodTotals
    let regularHours = totalHours;
    let overtimeHours = 0;
    
    // If more than 40 hours were worked, calculate overtime
    if (totalHours > 40) {
        regularHours = 40;
        overtimeHours = totalHours - 40;
        console.log(`Weekly overtime detected: ${overtimeHours} hours over 40`);
    }
    
    // Calculate gross pay with overtime at 1.5x rate
    const regularPay = regularHours * settings.payRate;
    const overtimePay = overtimeHours * (settings.payRate * 1.5); // Overtime at 1.5x rate
    const travelPay = totalTravel * settings.travelRate;
    const grossPay = regularPay + overtimePay + travelPay;
    
    console.log('Week calculation results:', {
        totalHours, 
        regularHours,
        overtimeHours,
        totalTravel, 
        grossPay,
        regularPay,
        overtimePay,
        travelPay
    });
    
    console.groupEnd();
    
    return { 
        totalHours, 
        regularHours,
        overtimeHours,
        totalTravel, 
        grossPay,
        regularPay,
        overtimePay,
        travelPay
    };
}
