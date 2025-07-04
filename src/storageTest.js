// Test utilities for data persistence
import * as storage from './storage.js';

// Test data for settings
const testSettings = {
    payRate: 25.50,
    travelRate: 18.75,
    payPeriodDays: 7,
    payPeriodStartDate: '2025-07-01',
    withholdingPercentage: 15
};

// Test data for hours
const testHoursData = [
    { date: new Date('2025-07-01'), hoursWorked: 8, travelTime: 1 },
    { date: new Date('2025-07-02'), hoursWorked: 7.5, travelTime: 0.5 },
    { date: new Date('2025-07-03'), hoursWorked: 6, travelTime: 1.5 }
];

// Test settings persistence
function testSettingsPersistence() {
    console.log('🧪 Testing Settings Persistence...');
    
    // Save test settings
    const savedSettings = storage.saveSettings(testSettings);
    console.log('✅ Settings saved:', savedSettings);
    
    // Clear memory variables by reloading the page
    console.log('⏳ Simulating page reload...');
    
    // Load settings from localStorage
    const loadedSettings = storage.loadSettings();
    console.log('📂 Settings loaded from localStorage:', loadedSettings);
    
    // Verify settings match
    const settingsMatch = Object.keys(testSettings).every(key => 
        testSettings[key] === loadedSettings[key]
    );
    
    console.log(settingsMatch 
        ? '✅ Settings persistence test PASSED' 
        : '❌ Settings persistence test FAILED');
    
    return settingsMatch;
}

// Test hours data persistence
function testHoursDataPersistence() {
    console.log('\n🧪 Testing Hours Data Persistence...');
    
    // Clear any existing hours data
    storage.clearAllHoursData();
    
    // Save test hours data
    testHoursData.forEach(entry => {
        storage.saveHoursForDate(entry.date, entry.hoursWorked, entry.travelTime);
    });
    console.log('✅ Hours data saved for dates:', 
        testHoursData.map(entry => entry.date.toISOString().split('T')[0]).join(', '));
    
    // Clear memory variables by simulating page reload
    console.log('⏳ Simulating page reload...');
    
    // Load hours data from localStorage
    const loadedHoursData = storage.loadHoursData();
    console.log('📂 Hours data loaded from localStorage:', loadedHoursData);
    
    // Verify each date's data
    let allDatesMatch = true;
    testHoursData.forEach(entry => {
        const dateString = entry.date.toISOString().split('T')[0];
        const loadedEntry = loadedHoursData[dateString];
        
        if (!loadedEntry) {
            console.log(`❌ Missing data for date: ${dateString}`);
            allDatesMatch = false;
            return;
        }
        
        const hoursMatch = parseFloat(entry.hoursWorked) === parseFloat(loadedEntry.hoursWorked);
        const travelMatch = parseFloat(entry.travelTime) === parseFloat(loadedEntry.travelTime);
        
        if (!hoursMatch || !travelMatch) {
            console.log(`❌ Data mismatch for date: ${dateString}`);
            console.log(`   Expected: Hours=${entry.hoursWorked}, Travel=${entry.travelTime}`);
            console.log(`   Actual: Hours=${loadedEntry.hoursWorked}, Travel=${loadedEntry.travelTime}`);
            allDatesMatch = false;
        }
    });
    
    console.log(allDatesMatch 
        ? '✅ Hours data persistence test PASSED' 
        : '❌ Hours data persistence test FAILED');
    
    return allDatesMatch;
}

// Test data deletion
function testDataDeletion() {
    console.log('\n🧪 Testing Data Deletion...');
    
    // Delete one date's data
    const dateToDelete = testHoursData[1].date;
    const dateString = dateToDelete.toISOString().split('T')[0];
    
    console.log(`🗑️ Deleting data for date: ${dateString}`);
    storage.deleteHoursForDate(dateToDelete);
    
    // Verify deletion
    const loadedHoursData = storage.loadHoursData();
    const deletionSuccessful = !loadedHoursData[dateString];
    
    console.log(deletionSuccessful 
        ? `✅ Deletion test PASSED - Data for ${dateString} successfully removed` 
        : `❌ Deletion test FAILED - Data for ${dateString} still exists`);
    
    // Clear all data
    console.log('🗑️ Clearing all hours data');
    storage.clearAllHoursData();
    
    // Verify all data cleared
    const emptyHoursData = storage.loadHoursData();
    const clearSuccessful = Object.keys(emptyHoursData).length === 0;
    
    console.log(clearSuccessful 
        ? '✅ Clear all data test PASSED - All hours data removed' 
        : `❌ Clear all data test FAILED - ${Object.keys(emptyHoursData).length} entries remain`);
    
    return deletionSuccessful && clearSuccessful;
}

// Run all tests
export function runStorageTests() {
    console.log('🧪🧪🧪 STARTING DATA PERSISTENCE TESTS 🧪🧪🧪\n');
    
    const settingsTestPassed = testSettingsPersistence();
    const hoursTestPassed = testHoursDataPersistence();
    const deletionTestPassed = testDataDeletion();
    
    console.log('\n🧪🧪🧪 TEST SUMMARY 🧪🧪🧪');
    console.log(`Settings Persistence: ${settingsTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Hours Data Persistence: ${hoursTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Data Deletion: ${deletionTestPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    const allTestsPassed = settingsTestPassed && hoursTestPassed && deletionTestPassed;
    console.log(`\nOverall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    return allTestsPassed;
}

// Add a method to restore default test data (useful for manual testing)
export function setupTestData() {
    // Save test settings
    storage.saveSettings(testSettings);
    
    // Clear any existing hours data
    storage.clearAllHoursData();
    
    // Save test hours data
    testHoursData.forEach(entry => {
        storage.saveHoursForDate(entry.date, entry.hoursWorked, entry.travelTime);
    });
    
    console.log('✅ Test data has been set up successfully');
    console.log('Settings:', storage.loadSettings());
    console.log('Hours data:', storage.loadHoursData());
    
    return { settings: storage.loadSettings(), hoursData: storage.loadHoursData() };
}
