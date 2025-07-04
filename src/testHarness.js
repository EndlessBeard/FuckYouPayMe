// Storage Test Harness
import { runStorageTests, setupTestData } from './storageTest.js';

// Expose test functions to the global scope so they can be run from the console
window.StorageTest = {
    runTests: runStorageTests,
    setupTestData: setupTestData
};

// Create a test UI for the tests
function createTestUI() {
    // Create a button to run tests
    const testButton = document.createElement('button');
    testButton.textContent = 'Run Storage Tests';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '10px 15px';
    testButton.style.backgroundColor = '#007bff';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    testButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    testButton.addEventListener('click', () => {
        console.clear();
        runStorageTests();
    });
    
    // Create a button to set up test data
    const setupButton = document.createElement('button');
    setupButton.textContent = 'Setup Test Data';
    setupButton.style.position = 'fixed';
    setupButton.style.bottom = '20px';
    setupButton.style.right = '170px';
    setupButton.style.zIndex = '9999';
    setupButton.style.padding = '10px 15px';
    setupButton.style.backgroundColor = '#28a745';
    setupButton.style.color = 'white';
    setupButton.style.border = 'none';
    setupButton.style.borderRadius = '5px';
    setupButton.style.cursor = 'pointer';
    setupButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    setupButton.addEventListener('click', () => {
        console.clear();
        setupTestData();
        alert('Test data has been set up. Check the console for details.');
    });
    
    // Add buttons to the page
    document.body.appendChild(testButton);
    document.body.appendChild(setupButton);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createTestUI();
    
    // Log instructions
    console.log('Storage Test Harness loaded');
    console.log('You can run storage tests by:');
    console.log('1. Clicking the "Run Storage Tests" button');
    console.log('2. Typing StorageTest.runTests() in the console');
    console.log('3. Typing StorageTest.setupTestData() to set up test data');
});

export { runStorageTests, setupTestData };
