# **Payroll App Development Outline (Interactive Dashboard & Calendar)**

This outline details the structure, styling, and JavaScript logic for a robust web application to track payroll hours, featuring a dark mode UI, a custom title bar, a dynamic dashboard with integrated daily hour input, and an interactive calendar.

## **1\. Core Features**

* **Dark Mode UI**: A sleek, dark-themed interface for reduced eye strain.  
* **Custom Title Bar**: A thin title bar with the app name "Fuck You Pay Me" and a menu icon (placeholder for future functionality).  
* **Dynamic Dashboard**:  
  * Displays summaries for the last week, current week, and days until the next payday.  
  * **New Integrated Daily Hour Input**: A section within the dashboard to show and edit hours for the *selected day* from the calendar. This includes fields for "Hours Worked," "Travel Time," and a "Save" button.  
* **Interactive Calendar**:  
  * An interactive calendar that allows users to select a date.  
  * Highlights the selected day (defaulting to the current day on load).  
  * Highlights days with recorded hours.  
* **Hour Tracking**: Input and store daily hours worked and travel time.  
* **Pay Period Definition**: Allow users to define their pay rate, travel rate, pay period length, and the *start date* of their pay cycle.  
* **Withholding Configuration**: Allow users to define withholding percentages.  
* **Paycheck Calculation (Automatic)**: Calculate gross pay, apply withholdings, and display net pay for the *current pay period* automatically upon any data change.  
* **Data Persistence (Local Storage)**: Save user data (hours, settings) locally in the browser for continuous use.

## **2\. HTML Structure (index.html)**

The HTML has been significantly restructured. The hours-input-section is removed and its elements are integrated into a new dashboard-item within the \#dashboard-section.  
`<!DOCTYPE html>`  
`<html lang="en">`  
`<head>`  
    `<meta charset="UTF-8">`  
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`  
    `<title>Fuck You Pay Me</title>`  
    `<link rel="stylesheet" href="style.css">`  
    `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">`  
`</head>`  
`<body>`  
    `<div class="title-bar">`  
        `<h1 class="app-title">Fuck You Pay Me</h1>`  
        `<div class="menu-icon">`  
            `<div class="bar"></div>`  
            `<div class="bar"></div>`  
            `<div class="bar"></div>`  
        `</div>`  
    `</div>`

    `<div class="container">`  
        `<main>`  
            `<!-- Dashboard Section - Now includes daily input -->`  
            `<section id="dashboard-section" class="card dashboard-card">`  
                `<h2>Dashboard</h2>`  
                `<div class="dashboard-summary">`  
                    `<div class="dashboard-item">`  
                        `<h3>Last Week</h3>`  
                        `<p>Hours: <span id="dashboard-last-week-hours">0.00</span></p>`  
                        `<p>Pay: <span id="dashboard-last-week-pay">$0.00</span></p>`  
                    `</div>`  
                    `<div class="dashboard-item current-week">`  
                        `<h3>Current Week</h3>`  
                        `<p>Hours: <span id="dashboard-current-week-hours">0.00</span></p>`  
                        `<p>Pay: <span id="dashboard-current-week-pay">$0.00</span></p>`  
                    `</div>`  
                    `<div class="dashboard-item payday-countdown">`  
                        `<h3>Next Payday In</h3>`  
                        `<p><span id="dashboard-days-till-payday">0</span> days</p>`  
                    `</div>`  
                `</div>`

                `<!-- New: Selected Day Hours Input within Dashboard -->`  
                `<div id="selected-day-input-card" class="card selected-day-input-card">`  
                    `<h3>Hours for <span id="selected-date-display">Today</span></h3>`  
                    `<div class="input-group">`  
                        `<label for="daily-hours-worked">Hours Worked:</label>`  
                        `<input type="number" id="daily-hours-worked" step="0.01" min="0">`  
                    `</div>`  
                    `<div class="input-group">`  
                        `<label for="daily-travel-time">Travel Time (hours):</label>`  
                        `<input type="number" id="daily-travel-time" step="0.01" min="0">`  
                    `</div>`  
                    `<button id="save-daily-hours-btn" class="btn primary">Save</button>`  
                `</div>`  
            `</section>`

            `<!-- Section for Dynamic Calendar -->`  
            `<section id="calendar-section" class="card">`  
                `<h2>Calendar</h2>`  
                `<div class="calendar-navigation">`  
                    `<button id="prev-month-btn" class="btn secondary"><</button>`  
                    `<span id="current-month-year" class="month-year-display">July 2025</span>`  
                    `<button id="next-month-btn" class="btn secondary">></button>`  
                `</div>`  
                `<div class="calendar-grid-header">`  
                    `<span>Mon</span>`  
                    `<span>Tue</span>`  
                    `<span>Wed</span>`  
                    `<span>Thu</span>`  
                    `<span>Fri</span>`  
                    `<span>Sat</span>`  
                    `<span>Sun</span>`  
                `</div>`  
                `<div id="calendar-grid" class="calendar-grid">`  
                    `<!-- Calendar days will be dynamically added here by JavaScript -->`  
                `</div>`  
            `</section>`

            `<!-- Section for Recorded Hours List -->`  
            `<section id="recorded-hours-list-section" class="card">`  
                `<h2>Recorded Hours</h2>`  
                `<div class="hours-list-container">`  
                    `<ul id="recorded-hours-list">`  
                        `<!-- Daily hours will be dynamically added here by JavaScript -->`  
                    `</ul>`  
                `</div>`  
                `<button id="clear-hours-btn" class="btn danger">Clear All Hours</button>`  
            `</section>`

            `<!-- Section for Settings (Pay Rate, Withholdings, Pay Period) -->`  
            `<section id="settings-section" class="card">`  
                `<h2>Settings</h2>`  
                `<div class="input-group">`  
                    `<label for="pay-rate">Hourly Pay Rate ($):</label>`  
                    `<input type="number" id="pay-rate" value="20.00" step="0.01" min="0">`  
                `</div>`  
                `<div class="input-group">`  
                    `<label for="travel-rate">Travel Pay Rate ($):</label>`  
                    `<input type="number" id="travel-rate" value="15.00" step="0.01" min="0">`  
                `</div>`  
                `<div class="input-group">`  
                    `<label for="pay-period-days">Pay Period Length (days):</label>`  
                    `<input type="number" id="pay-period-days" value="14" min="1">`  
                `</div>`  
                `<div class="input-group">`  
                    `<label for="pay-period-start-date">Pay Period Start Date:</label>`  
                    `<input type="date" id="pay-period-start-date" value="">`  
                `</div>`  
                `<div class="input-group">`  
                    `<label for="withholding-percentage">Withholding Percentage (%):</label>`  
                    `<input type="number" id="withholding-percentage" value="20" step="0.01" min="0" max="100">`  
                `</div>`  
                `<button id="save-settings-btn" class="btn primary">Save Settings</button>`  
            `</section>`

            `<!-- Section for Paycheck Calculation Display -->`  
            `<section id="paycheck-display-section" class="card">`  
                `<h2>Estimated Paycheck (Current Pay Period)</h2>`  
                `<div class="summary-item">`  
                    `<span>Pay Period Dates:</span>`  
                    `<span id="display-pay-period-dates">N/A</span>`  
                `</div>`  
                `<div class="summary-item">`  
                    `<span>Total Hours Worked:</span>`  
                    `<span id="display-total-hours">0.00</span>`  
                `</div>`  
                `<div class="summary-item">`  
                    `<span>Total Travel Time:</span>`  
                    `<span id="display-total-travel-time">0.00</span>`  
                `</div>`  
                `<div class="summary-item">`  
                    `<span>Gross Pay:</span>`  
                    `<span id="display-gross-pay">$0.00</span>`  
                `</div>`  
                `<div class="summary-item">`  
                    `<span>Total Withholdings:</span>`  
                    `<span id="display-withholdings">$0.00</span>`  
                `</div>`  
                `<div class="summary-item net-pay">`  
                    `<span>Net Pay:</span>`  
                    `<span id="display-net-pay">$0.00</span>`  
                `</div>`  
            `</section>`  
        `</main>`

        `<footer>`  
            `<p>© 2025 Fuck You Pay Me. All rights reserved.</p>`  
        `</footer>`  
    `</div>`

    `<script src="script.js"></script>`  
`</body>`  
`</html>`

## **3\. CSS Styling (style.css)**

The CSS has been further refined to accommodate the new dashboard layout and ensure the calendar highlighting is precise.  
`/* Color Palette for Dark Mode */`  
`:root {`  
    `--bg-primary: #1a1a2e; /* Dark Blue/Purple */`  
    `--bg-secondary: #16213e; /* Slightly lighter dark blue */`  
    `--card-bg: #0f3460; /* Darker blue for cards */`  
    `--text-primary: #e0e0e0; /* Light gray text */`  
    `--text-secondary: #b0b0b0; /* Slightly darker light gray */`  
    `--border-color: #0d2a4a; /* Darker border */`  
    `--input-bg: #2d4263; /* Input background */`  
    `--input-border: #3e5c76; /* Input border */`  
    `--button-primary-bg: #007bff; /* Blue */`  
    `--button-primary-hover: #0056b3;`  
    `--button-danger-bg: #dc3545; /* Red */`  
    `--button-danger-hover: #c82333;`  
    `--button-secondary-bg: #4a5d7c; /* Darker gray for secondary buttons */`  
    `--button-secondary-hover: #3a4b65;`  
    `--highlight-color: #ffeb3b; /* Yellow for payday countdown */`  
    `--net-pay-color: #28a745; /* Green for net pay */`  
    `--calendar-highlight-bg: #28a745; /* Green for days with hours */`  
    `--calendar-highlight-border: #1e7e34;`  
    `--calendar-selected-bg: #007bff; /* Blue for selected day */`  
    `--calendar-selected-border: #0056b3;`  
`}`

`/* Basic Reset & Body Styling */`  
`body {`  
    `font-family: 'Inter', sans-serif;`  
    `margin: 0;`  
    `padding: 0; /* Remove body padding, container will handle it */`  
    `background-color: var(--bg-primary);`  
    `color: var(--text-primary);`  
    `display: flex;`  
    `flex-direction: column; /* Stack title bar and container */`  
    `min-height: 100vh;`  
    `box-sizing: border-box;`  
`}`

`/* Title Bar Styling */`  
`.title-bar {`  
    `background-color: var(--bg-secondary);`  
    `color: white;`  
    `padding: 15px 20px;`  
    `display: flex;`  
    `justify-content: space-between;`  
    `align-items: center;`  
    `box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);`  
    `height: 60px; /* Thin height */`  
    `flex-shrink: 0; /* Prevent shrinking */`  
`}`

`.app-title {`  
    `margin: 0;`  
    `font-size: 1.8em;`  
    `font-weight: 700;`  
    `letter-spacing: 1px;`  
    `text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);`  
`}`

`.menu-icon {`  
    `width: 30px;`  
    `height: 20px;`  
    `display: flex;`  
    `flex-direction: column;`  
    `justify-content: space-between;`  
    `cursor: pointer;`  
    `padding: 5px;`  
    `border-radius: 5px;`  
    `transition: background-color 0.3s ease;`  
`}`

`.menu-icon:hover {`  
    `background-color: rgba(255, 255, 255, 0.1);`  
`}`

`.menu-icon .bar {`  
    `width: 100%;`  
    `height: 3px;`  
    `background-color: white;`  
    `border-radius: 2px;`  
`}`

`/* Main Container Styling */`  
`.container {`  
    `flex-grow: 1; /* Take remaining space */`  
    `background-color: var(--bg-primary);`  
    `padding: 20px; /* Padding for the main content area */`  
    `max-width: 900px; /* Max width for desktop */`  
    `width: 100%;`  
    `margin: 20px auto; /* Center the container with margin */`  
    `box-sizing: border-box;`  
    `display: flex;`  
    `flex-direction: column;`  
    `gap: 25px; /* Space between sections */`  
`}`

`/* Card Styling for Sections */`  
`.card {`  
    `background-color: var(--card-bg);`  
    `border-radius: 12px;`  
    `padding: 25px;`  
    `box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);`  
    `border: 1px solid var(--border-color);`  
`}`

`.card h2 {`  
    `color: var(--text-primary);`  
    `font-size: 1.6em;`  
    `margin-top: 0;`  
    `margin-bottom: 20px;`  
    `border-bottom: 2px solid var(--border-color);`  
    `padding-bottom: 10px;`  
`}`

`/* Input Group Styling */`  
`.input-group {`  
    `margin-bottom: 18px;`  
`}`

`.input-group label {`  
    `display: block;`  
    `margin-bottom: 8px;`  
    `font-weight: 600;`  
    `color: var(--text-secondary);`  
    `font-size: 0.95em;`  
`}`

`.input-group input[type="number"],`  
`.input-group input[type="date"] {`  
    `width: calc(100% - 22px); /* Account for padding and border */`  
    `padding: 12px 10px;`  
    `border: 1px solid var(--input-border);`  
    `border-radius: 8px;`  
    `font-size: 1em;`  
    `box-sizing: border-box;`  
    `background-color: var(--input-bg);`  
    `color: var(--text-primary);`  
    `transition: border-color 0.3s ease, box-shadow 0.3s ease;`  
`}`

`.input-group input[type="number"]:focus,`  
`.input-group input[type="date"]:focus {`  
    `border-color: var(--button-primary-bg); /* Highlight on focus */`  
    `outline: none;`  
    `box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);`  
`}`

`/* Button Styling */`  
`.btn {`  
    `display: inline-block;`  
    `padding: 12px 25px;`  
    `border: none;`  
    `border-radius: 8px;`  
    `cursor: pointer;`  
    `font-size: 1em;`  
    `font-weight: 600;`  
    `transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;`  
    `margin-top: 10px;`  
`}`

`.btn.primary {`  
    `background-color: var(--button-primary-bg);`  
    `color: white;`  
    `box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);`  
`}`

`.btn.primary:hover {`  
    `background-color: var(--button-primary-hover);`  
    `transform: translateY(-2px);`  
    `box-shadow: 0 6px 12px rgba(0, 123, 255, 0.3);`  
`}`

`.btn.danger {`  
    `background-color: var(--button-danger-bg);`  
    `color: white;`  
    `box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);`  
`}`

`.btn.danger:hover {`  
    `background-color: var(--button-danger-hover);`  
    `transform: translateY(-2px);`  
    `box-shadow: 0 6px 12px rgba(220, 53, 69, 0.3);`  
`}`

`.btn.secondary {`  
    `background-color: var(--button-secondary-bg);`  
    `color: var(--text-primary);`  
    `box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);`  
`}`

`.btn.secondary:hover {`  
    `background-color: var(--button-secondary-hover);`  
    `transform: translateY(-1px);`  
    `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);`  
`}`

`/* Recorded Hours List */`  
`.hours-list-container {`  
    `max-height: 250px; /* Scrollable area for hours */`  
    `overflow-y: auto;`  
    `border: 1px solid var(--border-color);`  
    `border-radius: 8px;`  
    `margin-top: 20px;`  
    `padding: 10px;`  
    `background-color: var(--bg-secondary);`  
`}`

`#recorded-hours-list {`  
    `list-style: none;`  
    `padding: 0;`  
    `margin: 0;`  
`}`

`#recorded-hours-list li {`  
    `background-color: var(--input-bg);`  
    `padding: 12px 15px;`  
    `margin-bottom: 8px;`  
    `border-radius: 6px;`  
    `display: flex;`  
    `justify-content: space-between;`  
    `align-items: center;`  
    `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);`  
    `border: 1px solid var(--input-border);`  
    `font-size: 0.95em;`  
    `color: var(--text-primary);`  
`}`

`#recorded-hours-list li:last-child {`  
    `margin-bottom: 0;`  
`}`

`#recorded-hours-list li .delete-btn {`  
    `background: none;`  
    `border: none;`  
    `color: var(--button-danger-bg);`  
    `font-size: 1.2em;`  
    `cursor: pointer;`  
    `transition: color 0.2s ease;`  
`}`

`#recorded-hours-list li .delete-btn:hover {`  
    `color: var(--button-danger-hover);`  
`}`

`/* Paycheck Display Styling */`  
`.summary-item {`  
    `display: flex;`  
    `justify-content: space-between;`  
    `padding: 10px 0;`  
    `border-bottom: 1px dashed var(--border-color);`  
    `font-size: 1.1em;`  
`}`

`.summary-item:last-of-type {`  
    `border-bottom: none;`  
`}`

`.summary-item span:first-child {`  
    `font-weight: 500;`  
    `color: var(--text-secondary);`  
`}`

`.summary-item span:last-child {`  
    `font-weight: 600;`  
    `color: var(--text-primary);`  
`}`

`.summary-item.net-pay {`  
    `font-size: 1.4em;`  
    `font-weight: 700;`  
    `color: var(--net-pay-color); /* Green for net pay */`  
    `margin-top: 15px;`  
    `padding-top: 15px;`  
    `border-top: 2px solid var(--net-pay-color);`  
`}`

`/* Dashboard Styling */`  
`.dashboard-card {`  
    `background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%); /* Gradient background */`  
    `color: white;`  
    `padding: 30px;`  
    `text-align: center;`  
    `box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);`  
    `border: none; /* Remove default border */`  
`}`

`.dashboard-card h2 {`  
    `color: white;`  
    `border-bottom: 2px solid rgba(255, 255, 255, 0.3);`  
    `padding-bottom: 15px;`  
    `margin-bottom: 25px;`  
`}`

`.dashboard-summary {`  
    `display: flex;`  
    `flex-wrap: wrap; /* Allow wrapping on smaller screens */`  
    `justify-content: space-around;`  
    `gap: 20px;`  
    `margin-bottom: 30px; /* Space between summary and daily input */`  
`}`

`.dashboard-item {`  
    `background-color: rgba(255, 255, 255, 0.15); /* Slightly transparent white */`  
    `border-radius: 10px;`  
    `padding: 20px;`  
    `flex: 1; /* Distribute space evenly */`  
    `min-width: 200px; /* Minimum width for items */`  
    `box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);`  
    `backdrop-filter: blur(5px); /* Frosted glass effect */`  
    `-webkit-backdrop-filter: blur(5px);`  
`}`

`.dashboard-item h3 {`  
    `color: white;`  
    `font-size: 1.3em;`  
    `margin-top: 0;`  
    `margin-bottom: 10px;`  
`}`

`.dashboard-item p {`  
    `font-size: 1.1em;`  
    `margin: 5px 0;`  
`}`

`.dashboard-item span {`  
    `font-weight: 700;`  
    `font-size: 1.2em;`  
`}`

`.dashboard-item.current-week {`  
    `background-color: rgba(255, 255, 255, 0.25); /* More prominent for current week */`  
`}`

`.dashboard-item.payday-countdown span {`  
    `font-size: 2em; /* Larger for countdown */`  
    `color: var(--highlight-color); /* Yellow for emphasis */`  
`}`

`/* New: Selected Day Input Card within Dashboard */`  
`.selected-day-input-card {`  
    `background-color: var(--bg-secondary); /* Use a slightly different background */`  
    `padding: 20px;`  
    `border-radius: 10px;`  
    `border: 1px solid var(--border-color);`  
    `text-align: left; /* Align text within this card */`  
    `color: var(--text-primary);`  
`}`

`.selected-day-input-card h3 {`  
    `color: var(--text-primary);`  
    `font-size: 1.4em;`  
    `margin-top: 0;`  
    `margin-bottom: 20px;`  
    `border-bottom: 1px solid var(--border-color);`  
    `padding-bottom: 10px;`  
`}`

`/* Calendar Styling */`  
`#calendar-section {`  
    `text-align: center;`  
`}`

`.calendar-navigation {`  
    `display: flex;`  
    `justify-content: center;`  
    `align-items: center;`  
    `margin-bottom: 20px;`  
    `gap: 15px;`  
`}`

`.month-year-display {`  
    `font-size: 1.5em;`  
    `font-weight: 600;`  
    `color: var(--text-primary);`  
    `min-width: 150px; /* Ensure space for month/year */`  
`}`

`.calendar-grid-header {`  
    `display: grid;`  
    `grid-template-columns: repeat(7, 1fr);`  
    `gap: 5px;`  
    `margin-bottom: 10px;`  
    `font-weight: 600;`  
    `color: var(--text-secondary);`  
`}`

`.calendar-grid {`  
    `display: grid;`  
    `grid-template-columns: repeat(7, 1fr);`  
    `gap: 5px;`  
`}`

`.calendar-grid .day {`  
    `background-color: var(--input-bg);`  
    `border: 1px solid var(--input-border);`  
    `border-radius: 8px;`  
    `padding: 10px 5px;`  
    `aspect-ratio: 1 / 1; /* Make days square */`  
    `display: flex;`  
    `flex-direction: column;`  
    `justify-content: center;`  
    `align-items: center;`  
    `font-size: 0.9em;`  
    `font-weight: 500;`  
    `color: var(--text-primary);`  
    `transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;`  
    `cursor: pointer; /* Indicate clickable */`  
`}`

`.calendar-grid .day.empty {`  
    `background-color: transparent;`  
    `border: 1px dashed var(--border-color);`  
    `color: var(--text-secondary);`  
    `opacity: 0.5;`  
    `cursor: default;`  
`}`

`.calendar-grid .day.has-hours {`  
    `background-color: var(--calendar-highlight-bg); /* Green highlight for hours */`  
    `border-color: var(--calendar-highlight-border);`  
    `color: white;`  
    `font-weight: 700;`  
    `box-shadow: 0 2px 8px rgba(40, 167, 69, 0.4);`  
`}`

`/* Selected day styling */`  
`.calendar-grid .day.selected-day {`  
    `background-color: var(--calendar-selected-bg); /* Blue for selected day */`  
    `border-color: var(--calendar-selected-border);`  
    `color: white;`  
    `font-weight: 700;`  
    `box-shadow: 0 0 0 3px var(--calendar-selected-bg), 0 2px 10px rgba(0, 123, 255, 0.4);`  
    `transform: scale(1.05); /* Slightly enlarge selected day */`  
`}`

`/* If a day has hours AND is selected, combine effects */`  
`.calendar-grid .day.has-hours.selected-day {`  
    `background-image: linear-gradient(45deg, var(--calendar-highlight-bg), var(--calendar-selected-bg));`  
    `border-color: var(--calendar-selected-border);`  
    `box-shadow: 0 0 0 3px var(--calendar-selected-bg), 0 2px 10px rgba(0, 123, 255, 0.4);`  
`}`

`/* Footer Styling */`  
`footer {`  
    `text-align: center;`  
    `margin-top: 30px;`  
    `padding-top: 20px;`  
    `border-top: 1px solid var(--border-color);`  
    `color: var(--text-secondary);`  
    `font-size: 0.9em;`  
`}`

`/* Responsive Design */`  
`@media (max-width: 768px) {`  
    `.title-bar {`  
        `padding: 10px 15px;`  
        `height: 50px;`  
    `}`  
    `.app-title {`  
        `font-size: 1.5em;`  
    `}`  
    `.menu-icon {`  
        `width: 25px;`  
        `height: 18px;`  
    `}`  
    `.menu-icon .bar {`  
        `height: 2px;`  
    `}`

    `.container {`  
        `padding: 15px;`  
        `gap: 20px;`  
        `margin: 15px auto;`  
    `}`

    `header h1 {`  
        `font-size: 1.8em;`  
    `}`

    `.card h2 {`  
        `font-size: 1.4em;`  
    `}`

    `.btn {`  
        `padding: 10px 20px;`  
        `font-size: 0.95em;`  
    `}`

    `.summary-item {`  
        `font-size: 1em;`  
    `}`

    `.summary-item.net-pay {`  
        `font-size: 1.2em;`  
    `}`

    `.dashboard-summary {`  
        `flex-direction: column; /* Stack items vertically on small screens */`  
        `align-items: center;`  
    `}`

    `.dashboard-item {`  
        `width: 90%; /* Take more width when stacked */`  
        `min-width: unset; /* Remove min-width constraint */`  
    `}`

    `.calendar-grid .day {`  
        `font-size: 0.8em;`  
        `padding: 8px 3px;`  
    `}`  
`}`

`@media (max-width: 480px) {`  
    `.title-bar {`  
        `padding: 8px 10px;`  
        `height: 45px;`  
    `}`  
    `.app-title {`  
        `font-size: 1.3em;`  
    `}`

    `.container {`  
        `padding: 10px;`  
        `gap: 15px;`  
        `margin: 10px auto;`  
    `}`

    `header h1 {`  
        `font-size: 1.6em;`  
    `}`

    `.card h2 {`  
        `font-size: 1.2em;`  
    `}`

    `.input-group label {`  
        `font-size: 0.9em;`  
    `}`

    `.input-group input {`  
        `padding: 10px;`  
        `font-size: 0.9em;`  
    `}`

    `.calendar-navigation {`  
        `gap: 10px;`  
    `}`

    `.month-year-display {`  
        `font-size: 1.2em;`  
        `min-width: 120px;`  
    `}`  
`}`

## **4\. JavaScript Logic (script.js)**

The JavaScript has undergone significant changes to manage the selectedDate, populate the new dashboard input fields, and handle the calendar's interactive highlighting and date selection.  
`// script.js`

`// DOM Elements - Title Bar & Menu (for future expansion)`  
`const appTitle = document.querySelector('.app-title');`  
`const menuIcon = document.querySelector('.menu-icon');`

`// DOM Elements - Settings`  
`const payRateInput = document.getElementById('pay-rate');`  
`const travelRateInput = document.getElementById('travel-rate');`  
`const payPeriodDaysInput = document.getElementById('pay-period-days');`  
`const payPeriodStartDateInput = document.getElementById('pay-period-start-date');`  
`const withholdingPercentageInput = document.getElementById('withholding-percentage');`  
`const saveSettingsBtn = document.getElementById('save-settings-btn');`

`// DOM Elements - Dashboard Summary`  
`const dashboardLastWeekHours = document.getElementById('dashboard-last-week-hours');`  
`const dashboardLastWeekPay = document.getElementById('dashboard-last-week-pay');`  
`const dashboardCurrentWeekHours = document.getElementById('dashboard-current-week-hours');`  
`const dashboardCurrentWeekPay = document.getElementById('dashboard-current-week-pay');`  
`const dashboardDaysTillPayday = document.getElementById('dashboard-days-till-payday');`

`// DOM Elements - Selected Day Hours Input (New Location)`  
`const selectedDateDisplay = document.getElementById('selected-date-display');`  
`const dailyHoursWorkedInput = document.getElementById('daily-hours-worked');`  
`const dailyTravelTimeInput = document.getElementById('daily-travel-time');`  
`const saveDailyHoursBtn = document.getElementById('save-daily-hours-btn');`

`// DOM Elements - Recorded Hours List`  
`const recordedHoursList = document.getElementById('recorded-hours-list');`  
`const clearHoursBtn = document.getElementById('clear-hours-btn');`

`// DOM Elements - Paycheck Calculation Display`  
`const displayPayPeriodDates = document.getElementById('display-pay-period-dates');`  
`const displayTotalHours = document.getElementById('display-total-hours');`  
`const displayTotalTravelTime = document.getElementById('display-total-travel-time');`  
`const displayGrossPay = document.getElementById('display-gross-pay');`  
`const displayWithholdings = document.getElementById('display-withholdings');`  
`const displayNetPay = document.getElementById('display-net-pay');`

`// DOM Elements - Calendar`  
`const prevMonthBtn = document.getElementById('prev-month-btn');`  
`const nextMonthBtn = document.getElementById('next-month-btn');`  
`const currentMonthYearDisplay = document.getElementById('current-month-year');`  
`const calendarGrid = document.getElementById('calendar-grid');`

`// --- Global Data Structures ---`  
`let settings = {`  
    `payRate: 20.00,`  
    `travelRate: 15.00,`  
    `payPeriodDays: 14,`  
    `payPeriodStartDate: '', // YYYY-MM-DD format`  
    `withholdingPercentage: 20`  
`};`

`// Array to store daily hour entries`  
`// Each entry will be an object: { date: 'YYYY-MM-DD', hoursWorked: number, travelTime: number }`  
`let dailyHours = [];`

`// Calendar and selected date state`  
`let currentCalendarDate = new Date(); // Tracks the month displayed in the calendar`  
`let selectedDate = new Date(); // Tracks the currently selected day for input`

`// --- Helper Functions ---`

`/**`  
 `* Formats a Date object into YYYY-MM-DD string.`  
 `* @param {Date} date - The date object to format.`  
 `* @returns {string} Formatted date string.`  
 `*/`  
`function formatDateToYYYYMMDD(date) {`  
    `const yyyy = date.getFullYear();`  
    `const mm = String(date.getMonth() + 1).padStart(2, '0');`  
    `const dd = String(date.getDate()).padStart(2, '0');`  
    ``return `${yyyy}-${mm}-${dd}`;``  
`}`

`/**`  
 `* Displays a custom message box.`  
 `* @param {string} title - The title of the message box.`  
 `* @param {string} message - The message to display.`  
 `* @param {function} [onConfirmCallback=null] - Callback function for a "Confirm" action.`  
 `*/`  
`function showMessageBox(title, message, onConfirmCallback = null) {`  
    `const messageBox = document.createElement('div');`  
    `messageBox.className = 'message-box';`  
    `` messageBox.innerHTML = ` ``  
        `<div class="message-box-content">`  
            `<h3>${title}</h3>`  
            `<p>${message}</p>`  
            `<div class="message-box-buttons">`  
                `<button class="message-box-close-btn">OK</button>`  
                `${onConfirmCallback ? '<button class="message-box-confirm-btn">Confirm</button>' : ''}`  
            `</div>`  
        `</div>`  
    `` `; ``  
    `document.body.appendChild(messageBox);`

    `// Add message box specific styling dynamically`  
    `const style = document.createElement('style');`  
    `` style.innerHTML = ` ``  
        `.message-box {`  
            `position: fixed;`  
            `top: 0;`  
            `left: 0;`  
            `width: 100%;`  
            `height: 100%;`  
            `background-color: rgba(0, 0, 0, 0.7); /* Darker overlay */`  
            `display: flex;`  
            `justify-content: center;`  
            `align-items: center;`  
            `z-index: 1000;`  
        `}`  
        `.message-box-content {`  
            `background-color: var(--card-bg); /* Use card background for message box */`  
            `color: var(--text-primary);`  
            `padding: 30px;`  
            `border-radius: 10px;`  
            `box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);`  
            `text-align: center;`  
            `max-width: 400px;`  
            `width: 90%;`  
            `border: 1px solid var(--border-color);`  
        `}`  
        `.message-box-content h3 {`  
            `margin-top: 0;`  
            `color: var(--text-primary);`  
        `}`  
        `.message-box-content p {`  
            `margin-bottom: 20px;`  
            `color: var(--text-secondary);`  
        `}`  
        `.message-box-buttons {`  
            `display: flex;`  
            `justify-content: center;`  
            `gap: 10px;`  
            `margin-top: 20px;`  
        `}`  
        `.message-box-close-btn, .message-box-confirm-btn {`  
            `background-color: var(--button-primary-bg);`  
            `color: white;`  
            `padding: 10px 20px;`  
            `border: none;`  
            `border-radius: 5px;`  
            `cursor: pointer;`  
            `font-size: 1em;`  
            `transition: background-color 0.3s ease;`  
        `}`  
        `.message-box-close-btn:hover, .message-box-confirm-btn:hover {`  
            `background-color: var(--button-primary-hover);`  
        `}`  
        `.message-box-confirm-btn {`  
            `background-color: var(--button-danger-bg); /* Red for confirm/danger */`  
        `}`  
        `.message-box-confirm-btn:hover {`  
            `background-color: var(--button-danger-hover);`  
        `}`  
    `` `; ``  
    `document.head.appendChild(style);`

    `messageBox.querySelector('.message-box-close-btn').addEventListener('click', () => {`  
        `document.body.removeChild(messageBox);`  
        `document.head.removeChild(style); // Clean up style tag`  
    `});`

    `if (onConfirmCallback) {`  
        `messageBox.querySelector('.message-box-confirm-btn').addEventListener('click', () => {`  
            `onConfirmCallback();`  
            `document.body.removeChild(messageBox);`  
            `document.head.removeChild(style); // Clean up style tag`  
        `});`  
    `}`  
`}`

`/**`  
 `* Saves settings and daily hours to Local Storage.`  
 `*/`  
`function saveData() {`  
    `try {`  
        `localStorage.setItem('payrollSettings', JSON.stringify(settings));`  
        `localStorage.setItem('dailyHours', JSON.stringify(dailyHours));`  
        `console.log('Data saved to Local Storage.');`  
    `} catch (e) {`  
        `console.error('Error saving data to Local Storage:', e);`  
        `showMessageBox('Error', 'Could not save data. Please check your browser settings.');`  
    `}`  
`}`

`/**`  
 `* Loads settings and daily hours from Local Storage.`  
 `*/`  
`function loadData() {`  
    `try {`  
        `const savedSettings = localStorage.getItem('payrollSettings');`  
        `const savedHours = localStorage.getItem('dailyHours');`

        `if (savedSettings) {`  
            `const parsedSettings = JSON.parse(savedSettings);`  
            `// Merge saved settings with default, ensuring new properties are added`  
            `settings = { ...settings, ...parsedSettings };`  
            `applySettingsToInputs();`  
        `}`  
        `if (savedHours) {`  
            `dailyHours = JSON.parse(savedHours);`  
            `renderRecordedHours();`  
        `}`  
        `console.log('Data loaded from Local Storage.');`  
    `} catch (e) {`  
        `console.error('Error loading data from Local Storage:', e);`  
        `showMessageBox('Error', 'Could not load saved data. Data might be corrupted.');`  
    `}`  
`}`

`/**`  
 `* Applies current settings to the input fields.`  
 `*/`  
`function applySettingsToInputs() {`  
    `payRateInput.value = settings.payRate;`  
    `travelRateInput.value = settings.travelRate;`  
    `payPeriodDaysInput.value = settings.payPeriodDays;`  
    `payPeriodStartDateInput.value = settings.payPeriodStartDate;`  
    `withholdingPercentageInput.value = settings.withholdingPercentage;`  
`}`

`/**`  
 `* Renders the list of recorded daily hours.`  
 `*/`  
`function renderRecordedHours() {`  
    `recordedHoursList.innerHTML = ''; // Clear existing list`  
    `if (dailyHours.length === 0) {`  
        `recordedHoursList.innerHTML = '<li class="text-center">No hours recorded yet.</li>';`  
        `return;`  
    `}`

    `// Sort dailyHours by date in descending order (most recent first)`  
    `const sortedHours = [...dailyHours].sort((a, b) => new Date(b.date) - new Date(a.date));`

    `sortedHours.forEach((entry, index) => {`  
        `// Find the original index to delete correctly (important if filtering/sorting changes order)`  
        `// This assumes unique combinations of date, hoursWorked, travelTime for simplicity.`  
        `// A unique ID for each entry would be more robust in a larger app.`  
        `const originalIndex = dailyHours.findIndex(item =>`  
            `item.date === entry.date &&`  
            `item.hoursWorked === entry.hoursWorked &&`  
            `item.travelTime === entry.travelTime`  
        `);`

        `const listItem = document.createElement('li');`  
        `` listItem.innerHTML = ` ``  
            `<span>${entry.date}: Work ${entry.hoursWorked} hrs, Travel ${entry.travelTime} hrs</span>`  
            `<button class="delete-btn" data-original-index="${originalIndex}">×</button>`  
        `` `; ``  
        `recordedHoursList.appendChild(listItem);`  
    `});`

    `// Attach event listeners to delete buttons`  
    `document.querySelectorAll('.delete-btn').forEach(button => {`  
        `button.addEventListener('click', deleteHourEntry);`  
    `});`  
`}`

`/**`  
 `* Gets the start and end dates of the week containing the given date.`  
 `* Assumes week starts on Monday (day 1).`  
 `* @param {Date} date - The date to base the week calculation on.`  
 `* @returns {{start: Date, end: Date}} Object with start and end Date objects.`  
 `*/`  
`function getWeekRange(date) {`  
    `const d = new Date(date);`  
    `const dayOfWeek = (d.getDay() + 6) % 7; // Adjust Sunday (0) to be 6, Monday (1) to be 0`  
    `const startOfWeek = new Date(d);`  
    `startOfWeek.setDate(d.getDate() - dayOfWeek);`  
    `startOfWeek.setHours(0, 0, 0, 0);`

    `const endOfWeek = new Date(startOfWeek);`  
    `endOfWeek.setDate(startOfWeek.getDate() + 6);`  
    `endOfWeek.setHours(23, 59, 59, 999);`  
    `return { start: startOfWeek, end: endOfWeek };`  
`}`

`/**`  
 `* Gets the start and end dates of the pay period containing the given date.`  
 `* @param {Date} currentDate - The date to base the pay period calculation on.`  
 `* @param {number} payPeriodDays - The length of the pay period in days.`  
 `* @param {string} payPeriodStartDateStr - The fixed start date of the pay period cycle (YYYY-MM-DD).`  
 `* @returns {{start: Date, end: Date}} Object with start and end Date objects.`  
 `*/`  
`function getPayPeriodRange(currentDate, payPeriodDays, payPeriodStartDateStr) {`  
    `if (!payPeriodStartDateStr) {`  
        `// Fallback or error if no start date is set`  
        `return { start: new Date(0), end: new Date(0) }; // Return epoch or invalid dates`  
    `}`

    `const cycleStartDate = new Date(payPeriodStartDateStr + 'T00:00:00'); // Ensure UTC for consistent calculations`  
    `cycleStartDate.setHours(0, 0, 0, 0);`

    `const msPerDay = 24 * 60 * 60 * 1000;`  
    `const diffDays = Math.floor((currentDate.getTime() - cycleStartDate.getTime()) / msPerDay);`

    `// Calculate which pay period number we are in`  
    `const payPeriodNumber = Math.floor(diffDays / payPeriodDays);`

    `const periodStart = new Date(cycleStartDate.getTime() + (payPeriodNumber * payPeriodDays * msPerDay));`  
    `periodStart.setHours(0, 0, 0, 0);`

    `const periodEnd = new Date(periodStart.getTime() + (payPeriodDays * msPerDay) - 1); // -1ms to stay within the day`  
    `periodEnd.setHours(23, 59, 59, 999);`

    `return { start: periodStart, end: periodEnd };`  
`}`

`/**`  
 `* Filters daily hours entries by a given date range.`  
 `* @param {Array<object>} hoursArray - The array of daily hour entries.`  
 `* @param {Date} startDate - The start Date object of the range (inclusive).`  
 `* @param {Date} endDate - The end Date object of the range (inclusive).`  
 `* @returns {Array<object>} Filtered array of hour entries.`  
 `*/`  
`function filterHoursByDateRange(hoursArray, startDate, endDate) {`  
    `return hoursArray.filter(entry => {`  
        `const entryDate = new Date(entry.date + 'T00:00:00'); // Ensure consistent time for comparison`  
        `entryDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison`  
        `return entryDate >= startDate && entryDate <= endDate;`  
    `});`  
`}`

`/**`  
 `* Calculates total hours worked, travel time, and gross pay for a given set of hour entries.`  
 `* @param {Array<object>} filteredHours - Array of hour entries within a specific range.`  
 `* @param {number} payRate - Hourly pay rate.`  
 `* @param {number} travelRate - Travel pay rate.`  
 `* @returns {{totalHoursWorked: number, totalTravelTime: number, grossPay: number}} Summary object.`  
 `*/`  
`function calculateSummaryForRange(filteredHours, payRate, travelRate) {`  
    `let totalHoursWorked = 0;`  
    `let totalTravelTime = 0;`

    `filteredHours.forEach(entry => {`  
        `totalHoursWorked += parseFloat(entry.hoursWorked) || 0;`  
        `totalTravelTime += parseFloat(entry.travelTime) || 0;`  
    `});`

    `const grossPay = (totalHoursWorked * payRate) + (totalTravelTime * travelRate);`  
    `return { totalHoursWorked, totalTravelTime, grossPay };`  
`}`

`/**`  
 `* Renders the dashboard with last week's, current week's, and next payday information.`  
 `*/`  
`function renderDashboard() {`  
    `const today = new Date();`  
    `today.setHours(0, 0, 0, 0); // Normalize today's date`

    `// Last Week's Summary`  
    `const lastWeek = new Date(today);`  
    `lastWeek.setDate(today.getDate() - 7);`  
    `const { start: lastWeekStart, end: lastWeekEnd } = getWeekRange(lastWeek);`  
    `const lastWeekHours = filterHoursByDateRange(dailyHours, lastWeekStart, lastWeekEnd);`  
    `const lastWeekSummary = calculateSummaryForRange(lastWeekHours, settings.payRate, settings.travelRate);`

    `dashboardLastWeekHours.textContent = lastWeekSummary.totalHoursWorked.toFixed(2);`  
    ``dashboardLastWeekPay.textContent = `$${lastWeekSummary.grossPay.toFixed(2)}`;``

    `// Current Week's Summary`  
    `const { start: currentWeekStart, end: currentWeekEnd } = getWeekRange(today);`  
    `const currentWeekHours = filterHoursByDateRange(dailyHours, currentWeekStart, currentWeekEnd);`  
    `const currentWeekSummary = calculateSummaryForRange(currentWeekHours, settings.payRate, settings.travelRate);`

    `dashboardCurrentWeekHours.textContent = currentWeekSummary.totalHoursWorked.toFixed(2);`  
    ``dashboardCurrentWeekPay.textContent = `$${currentWeekSummary.grossPay.toFixed(2)}`;``

    `// Days till next payday`  
    `const daysTillNextPayday = calculateDaysTillNextPayday();`  
    `dashboardDaysTillPayday.textContent = daysTillNextPayday >= 0 ? daysTillNextPayday : 'N/A';`  
`}`

`/**`  
 `* Calculates the number of days until the next payday.`  
 `* @returns {number} Days until next payday, or -1 if settings are invalid.`  
 `*/`  
`function calculateDaysTillNextPayday() {`  
    `if (!settings.payPeriodStartDate || isNaN(settings.payPeriodDays) || settings.payPeriodDays <= 0) {`  
        `return -1; // Invalid settings`  
    `}`

    `const today = new Date();`  
    `today.setHours(0, 0, 0, 0);`

    `const payPeriodStart = new Date(settings.payPeriodStartDate + 'T00:00:00');`  
    `payPeriodStart.setHours(0, 0, 0, 0);`

    `const msPerDay = 24 * 60 * 60 * 1000;`

    `// Calculate the number of days since the defined pay period start date`  
    `const daysSinceStart = Math.floor((today.getTime() - payPeriodStart.getTime()) / msPerDay);`

    `// Calculate how many full pay periods have passed`  
    `const periodsPassed = Math.floor(daysSinceStart / settings.payPeriodDays);`

    `// Calculate the start date of the *current* pay period`  
    `const currentPeriodStartDate = new Date(payPeriodStart.getTime() + (periodsPassed * settings.payPeriodDays * msPerDay));`  
    `currentPeriodStartDate.setHours(0, 0, 0, 0);`

    `// Calculate the end date of the *current* pay period`  
    `const currentPeriodEndDate = new Date(currentPeriodStartDate.getTime() + (settings.payPeriodDays * msPerDay) - 1);`  
    `currentPeriodEndDate.setHours(23, 59, 59, 999);`

    `// If today is within the current period, next payday is currentPeriodEndDate + 1 day`  
    `// If today is past the current period end, next payday is the end of the *next* period + 1 day`  
    `let nextPaydayDate;`  
    `if (today <= currentPeriodEndDate) {`  
        `nextPaydayDate = new Date(currentPeriodEndDate.getTime() + msPerDay);`  
        `nextPaydayDate.setHours(0, 0, 0, 0);`  
    `} else {`  
        `// Today is past the current period, calculate the next period's start and end`  
        `const nextPeriodStartDate = new Date(currentPeriodStartDate.getTime() + (settings.payPeriodDays * msPerDay));`  
        `const nextPeriodEndDate = new Date(nextPeriodStartDate.getTime() + (settings.payPeriodDays * msPerDay) - 1);`  
        `nextPaydayDate = new Date(nextPeriodEndDate.getTime() + msPerDay);`  
        `nextPaydayDate.setHours(0, 0, 0, 0);`  
    `}`

    `const daysLeft = Math.ceil((nextPaydayDate.getTime() - today.getTime()) / msPerDay);`

    `return daysLeft;`  
`}`

`/**`  
 `* Calculates the estimated paycheck based on current settings and recorded hours`  
 `* for the CURRENT PAY PERIOD.`  
 `*/`  
`function calculatePaycheck() {`  
    `const today = new Date();`  
    `today.setHours(0, 0, 0, 0);`

    `const { start: payPeriodStart, end: payPeriodEnd } = getPayPeriodRange(today, settings.payPeriodDays, settings.payPeriodStartDate);`

    `// Format dates for display`  
    `const options = { year: 'numeric', month: 'short', day: 'numeric' };`  
    ``displayPayPeriodDates.textContent = `${payPeriodStart.toLocaleDateString('en-US', options)} - ${payPeriodEnd.toLocaleDateString('en-US', options)}`;``

    `const currentPayPeriodHours = filterHoursByDateRange(dailyHours, payPeriodStart, payPeriodEnd);`  
    `const { totalHoursWorked, totalTravelTime, grossPay } = calculateSummaryForRange(currentPayPeriodHours, settings.payRate, settings.travelRate);`

    `const withholdingsAmount = grossPay * (settings.withholdingPercentage / 100);`  
    `const netPay = grossPay - withholdingsAmount;`

    `displayTotalHours.textContent = totalHoursWorked.toFixed(2);`  
    `displayTotalTravelTime.textContent = totalTravelTime.toFixed(2);`  
    ``displayGrossPay.textContent = `$${grossPay.toFixed(2)}`;``  
    ``displayWithholdings.textContent = `$${withholdingsAmount.toFixed(2)}`;``  
    ``displayNetPay.textContent = `$${netPay.toFixed(2)}`;``  
`}`

`/**`  
 `* Renders the calendar for the currentCalendarDate.`  
 `* Highlights days with recorded hours and the selected day.`  
 `*/`  
`function renderCalendar() {`  
    `calendarGrid.innerHTML = ''; // Clear existing grid`  
    `currentMonthYearDisplay.textContent = currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });`

    `const year = currentCalendarDate.getFullYear();`  
    `const month = currentCalendarDate.getMonth(); // 0-indexed`

    `// Get the first day of the month (Monday = 0, Sunday = 6 for grid alignment)`  
    `const firstDayOfMonth = new Date(year, month, 1);`  
    `const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to make Monday 0`

    `// Get number of days in the month`  
    `const daysInMonth = new Date(year, month + 1, 0).getDate();`

    `// Get formatted selected date for highlighting`  
    `const selectedDateStr = formatDateToYYYYMMDD(selectedDate);`

    `// Get dates with recorded hours for highlighting`  
    `const recordedDates = new Set(dailyHours.map(entry => entry.date));`

    `// Add empty divs for days before the first day of the month`  
    `for (let i = 0; i < startingDayOfWeek; i++) {`  
        `const emptyDay = document.createElement('div');`  
        `emptyDay.classList.add('day', 'empty');`  
        `calendarGrid.appendChild(emptyDay);`  
    `}`

    `// Add days of the month`  
    `for (let day = 1; day <= daysInMonth; day++) {`  
        `const dayElement = document.createElement('div');`  
        `dayElement.classList.add('day');`  
        `dayElement.textContent = day;`

        ``const currentDayFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;``  
        `dayElement.dataset.date = currentDayFormatted; // Store date for click handling`

        `if (recordedDates.has(currentDayFormatted)) {`  
            `dayElement.classList.add('has-hours');`  
        `}`

        `if (currentDayFormatted === selectedDateStr) {`  
            `dayElement.classList.add('selected-day');`  
        `}`

        `dayElement.addEventListener('click', handleDayClick);`  
        `calendarGrid.appendChild(dayElement);`  
    `}`  
`}`

`/**`  
 `* Handles click events on calendar days.`  
 `* @param {Event} event - The click event.`  
 `*/`  
`function handleDayClick(event) {`  
    `const clickedDateStr = event.target.dataset.date;`  
    `if (clickedDateStr) {`  
        `selectedDate = new Date(clickedDateStr + 'T00:00:00'); // Set selected date`  
        `renderCalendar(); // Re-render calendar to update highlight`  
        `renderSelectedDayInput(); // Update the input fields for the newly selected day`  
    `}`  
`}`

`/**`  
 `* Populates the daily hours input fields in the dashboard based on the selectedDate.`  
 `*/`  
`function renderSelectedDayInput() {`  
    `const selectedDateStr = formatDateToYYYYMMDD(selectedDate);`  
    `selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });`

    `const entryForSelectedDate = dailyHours.find(entry => entry.date === selectedDateStr);`

    `if (entryForSelectedDate) {`  
        `dailyHoursWorkedInput.value = entryForSelectedDate.hoursWorked;`  
        `dailyTravelTimeInput.value = entryForSelectedDate.travelTime;`  
    `} else {`  
        `dailyHoursWorkedInput.value = '';`  
        `dailyTravelTimeInput.value = '';`  
    `}`  
`}`

`// --- Event Listeners ---`

`// Save Settings`  
`saveSettingsBtn.addEventListener('click', () => {`  
    `const newPayRate = parseFloat(payRateInput.value);`  
    `const newTravelRate = parseFloat(travelRateInput.value);`  
    `const newPayPeriodDays = parseInt(payPeriodDaysInput.value);`  
    `const newPayPeriodStartDate = payPeriodStartDateInput.value;`  
    `const newWithholdingPercentage = parseFloat(withholdingPercentageInput.value);`

    `if (isNaN(newPayRate) || newPayRate < 0 ||`  
        `isNaN(newTravelRate) || newTravelRate < 0 ||`  
        `isNaN(newPayPeriodDays) || newPayPeriodDays < 1 ||`  
        `!newPayPeriodStartDate ||`  
        `isNaN(newWithholdingPercentage) || newWithholdingPercentage < 0 || newWithholdingPercentage > 100) {`  
        `showMessageBox('Input Error', 'Please enter valid positive numbers for all settings and select a Pay Period Start Date.');`  
        `return;`  
    `}`

    `settings.payRate = newPayRate;`  
    `settings.travelRate = newTravelRate;`  
    `settings.payPeriodDays = newPayPeriodDays;`  
    `settings.payPeriodStartDate = newPayPeriodStartDate;`  
    `settings.withholdingPercentage = newWithholdingPercentage;`

    `saveData();`  
    `calculatePaycheck(); // Recalculate if settings change`  
    `renderDashboard(); // Update dashboard`  
    `renderCalendar(); // Update calendar as settings might affect pay period`  
    `showMessageBox('Settings Saved', 'Your payroll settings have been updated successfully!');`  
`});`

`// Save Daily Hours (New button in dashboard)`  
`saveDailyHoursBtn.addEventListener('click', () => {`  
    `const date = formatDateToYYYYMMDD(selectedDate);`  
    `const hoursWorked = parseFloat(dailyHoursWorkedInput.value);`  
    `const travelTime = parseFloat(dailyTravelTimeInput.value);`

    `if (isNaN(hoursWorked) || hoursWorked < 0) {`  
        `showMessageBox('Input Error', 'Please enter valid hours worked (0 or more).');`  
        `return;`  
    `}`  
    `if (isNaN(travelTime) || travelTime < 0) {`  
        `showMessageBox('Input Error', 'Please enter valid travel time (0 or more).');`  
        `return;`  
    `}`

    `const existingIndex = dailyHours.findIndex(entry => entry.date === date);`

    `if (existingIndex !== -1) {`  
        `// Update existing entry`  
        `dailyHours[existingIndex] = { date, hoursWorked, travelTime };`  
    `} else {`  
        `// Add new entry`  
        `dailyHours.push({ date, hoursWorked, travelTime });`  
    `}`

    `saveData();`  
    `renderRecordedHours();`  
    `calculatePaycheck();`  
    `renderDashboard();`  
    `renderCalendar(); // Re-render calendar to update highlight for saved day`  
    ``showMessageBox('Hours Saved', `Hours for ${selectedDate.toLocaleDateString()} have been saved.`);``  
`});`

`// Delete Hour Entry`  
`function deleteHourEntry(event) {`  
    `const originalIndexToDelete = parseInt(event.target.dataset.originalIndex);`  
    `if (!isNaN(originalIndexToDelete) && originalIndexToDelete >= 0 && originalIndexToDelete < dailyHours.length) {`  
        `showMessageBox('Confirm Delete', 'Are you sure you want to delete this hour entry?', () => {`  
            `dailyHours.splice(originalIndexToDelete, 1);`  
            `saveData();`  
            `renderRecordedHours();`  
            `calculatePaycheck(); // Recalculate after deleting`  
            `renderDashboard(); // Update dashboard`  
            `renderCalendar(); // Update calendar`  
            `renderSelectedDayInput(); // Update input fields if selected day was deleted`  
            `showMessageBox('Entry Deleted', 'The hour entry has been successfully deleted.');`  
        `});`  
    `}`  
`}`

`// Clear All Hours`  
`clearHoursBtn.addEventListener('click', () => {`  
    `showMessageBox('Confirm Clear', 'Are you sure you want to clear all recorded hours? This cannot be undone.', () => {`  
        `dailyHours = [];`  
        `saveData();`  
        `renderRecordedHours();`  
        `calculatePaycheck();`  
        `renderDashboard();`  
        `renderCalendar();`  
        `renderSelectedDayInput(); // Clear input fields after clearing all`  
        `showMessageBox('Hours Cleared', 'All recorded hours have been cleared.');`  
    `});`  
`});`

`// Calendar Navigation`  
`prevMonthBtn.addEventListener('click', () => {`  
    `currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);`  
    `renderCalendar();`  
`});`

`nextMonthBtn.addEventListener('click', () => {`  
    `currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);`  
    `renderCalendar();`  
`});`

`// --- Initialization ---`  
`document.addEventListener('DOMContentLoaded', () => {`  
    `// Set selected date to today initially`  
    `selectedDate = new Date();`  
    `selectedDate.setHours(0, 0, 0, 0); // Normalize to start of day`

    `// Set current calendar month to today's month`  
    `currentCalendarDate = new Date(selectedDate);`

    `// Set a default pay period start date if not already set (e.g., first day of current month)`  
    `if (!settings.payPeriodStartDate) {`  
        `const today = new Date();`  
        `const yyyy = today.getFullYear();`  
        `const mm = String(today.getMonth() + 1).padStart(2, '0');`  
        ``settings.payPeriodStartDate = `${yyyy}-${mm}-01`;``  
    `}`

    `loadData(); // Load any saved data on app start`  
    `calculatePaycheck(); // Perform initial calculation for current pay period`  
    `renderDashboard(); // Render the dashboard`  
    `renderCalendar(); // Render the initial calendar`  
    `renderSelectedDayInput(); // Populate initial selected day input`  
`});`

## **5\. User Flow / Interactions**

1. **Initial Load**: The app loads with the "Fuck You Pay Me" title bar and a dark theme. Any previously saved settings and hours are loaded from local storage. The dashboard (including the "Hours for Today" input) and current pay period calculation are displayed automatically. The calendar for the current month is rendered, highlighting the current day and any days with recorded hours.  
2. **Date Selection (Calendar)**: The user clicks on a day in the calendar.  
   * The clicked day becomes the selected day and is highlighted.  
   * The "Hours for \[Selected Date\]" section in the dashboard updates to show that date.  
   * The input fields (Hours Worked, Travel Time) in this section are automatically populated with any existing hours for that selected day, or are cleared if no hours are recorded.  
3. **Input Daily Hours**: Within the dashboard's "Hours for \[Selected Date\]" section, the user enters or modifies "Hours Worked" and "Travel Time" for the selected day.  
4. **Save Daily Hours**: The user clicks the "Save" button in the dashboard's daily input section.  
   * The hours are saved (or updated) for the selected day in local storage.  
   * The "Recorded Hours" list, Dashboard summaries, Paycheck display, and Calendar all automatically update to reflect the change. The calendar will now highlight the saved day as having hours.  
5. **Configure Settings**: The user updates pay rates, pay period length, or the **Pay Period Start Date**. They click "Save Settings". All displays (dashboard, paycheck, calendar) automatically update.  
6. **Review Recorded Hours**: The "Recorded Hours" list shows all entered data. Users can delete individual entries if needed. Deleting an entry automatically updates all relevant displays.  
7. **Dashboard View**: The "Dashboard" section is prominently displayed, split into three clear horizontal parts for weekly summaries and payday countdown, plus the interactive daily hour input.  
8. **Paycheck Display**: The "Estimated Paycheck" section explicitly calculates pay for the *current pay period* and updates automatically.  
9. **Clear Data**: The user can click "Clear All Hours" to remove all recorded hour entries, with a custom confirmation dialog. This action also automatically updates all displays.

## **6\. Future Enhancements**

* **Menu Functionality**: Implement the 3-bar menu to open a sidebar or modal with additional options (e.g., dark mode toggle, export/import data, about section).  
* **Detailed Withholdings**: Allow for multiple withholding types (e.g., federal tax, state tax, social security, medicare, 401k) with different percentages or fixed amounts.  
* **Overtime Calculation**: Implement rules for overtime pay (e.g., 1.5x pay after 40 hours in a week).  
* **Data Export/Import**: Allow users to export their data (e.g., as a CSV file) and import it back.  
* **Graphical Representation**: Add simple charts or graphs to visualize hours worked over time.  
* **User Accounts**: For multi-user scenarios, integrate a backend with user authentication.