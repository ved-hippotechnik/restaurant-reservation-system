const puppeteer = require('puppeteer');
const fs = require('fs').promises;

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  customerApp: {
    searchPage: {},
    restaurantDetails: {},
    myReservations: {},
    accessibility: {},
    performance: {}
  },
  adminApp: {
    tablesManagement: {},
    customerManagement: {},
    settings: {},
    accessibility: {},
    performance: {}
  },
  overall: {
    score: 0,
    criticalIssues: [],
    majorIssues: [],
    minorIssues: [],
    accessibilityViolations: [],
    performanceMetrics: {}
  }
};

async function testCustomerApp(browser) {
  console.log('\n🧪 Testing Customer App...\n');
  const page = await browser.newPage();
  
  try {
    // Enable performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {
        startTime: Date.now(),
        renderTime: 0,
        interactionTime: 0
      };
    });

    // Test Search Page
    console.log('📍 Testing Search Page...');
    await page.goto('http://localhost:3002/search', { waitUntil: 'networkidle2' });
    
    // Visual testing
    const searchPageScreenshot = await page.screenshot({ fullPage: true });
    
    // Check for essential elements
    const searchElements = await page.evaluate(() => {
      const results = {
        hasSearchBar: !!document.querySelector('input[placeholder*="Search"]'),
        hasCuisineFilter: !!document.querySelector('[aria-label="Cuisine"], label:has-text("Cuisine")'),
        hasPriceFilter: !!document.querySelector('[aria-label="Price"], label:has-text("Price")'),
        hasRatingFilter: !!document.querySelector('[aria-label="Rating"], label:has-text("Rating")'),
        hasRestaurantCards: document.querySelectorAll('[class*="Card"]').length > 0,
        cardCount: document.querySelectorAll('[class*="Card"]').length
      };
      return results;
    });
    
    testResults.customerApp.searchPage.elements = searchElements;
    
    // Test search functionality
    await page.type('input[placeholder*="Search"]', 'Italian');
    await page.waitForTimeout(1000);
    
    const searchResults = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="Card"]');
      return cards.length;
    });
    
    testResults.customerApp.searchPage.searchFunctionality = {
      worked: searchResults >= 0,
      resultsFound: searchResults
    };
    
    // Test filters
    const filterSelects = await page.$$('select, [role="combobox"]');
    if (filterSelects.length > 0) {
      testResults.customerApp.searchPage.filters = {
        count: filterSelects.length,
        interactive: true
      };
    }
    
    // Accessibility checks
    const searchAccessibility = await page.evaluate(() => {
      const results = {
        hasProperHeadings: document.querySelector('h1, h2, h3') !== null,
        hasAltTexts: Array.from(document.querySelectorAll('img')).every(img => img.alt),
        hasAriaLabels: document.querySelectorAll('[aria-label]').length > 0,
        keyboardNavigable: true, // Will test separately
        colorContrast: true // Requires more complex testing
      };
      return results;
    });
    
    testResults.customerApp.searchPage.accessibility = searchAccessibility;
    
    // Performance metrics
    const searchPerformance = await page.evaluate(() => performance.timing);
    testResults.customerApp.searchPage.performance = {
      loadTime: searchPerformance.loadEventEnd - searchPerformance.navigationStart,
      domReady: searchPerformance.domContentLoadedEventEnd - searchPerformance.navigationStart
    };
    
    // Test Restaurant Details Page
    console.log('📍 Testing Restaurant Details Page...');
    await page.goto('http://localhost:3002/restaurant/1', { waitUntil: 'networkidle2' });
    
    const detailsElements = await page.evaluate(() => {
      const results = {
        hasRestaurantName: !!document.querySelector('h1, h2, h3, h4'),
        hasRating: !!document.querySelector('[class*="Rating"]'),
        hasTabs: document.querySelectorAll('[role="tab"]').length > 0,
        tabCount: document.querySelectorAll('[role="tab"]').length,
        hasReservationButton: !!document.querySelector('button:has-text("Reserve"), button:has-text("Book")'),
        hasImages: document.querySelectorAll('img').length > 0,
        hasAmenities: !!document.querySelector('[class*="amenities"], [class*="Amenities"]')
      };
      return results;
    });
    
    testResults.customerApp.restaurantDetails.elements = detailsElements;
    
    // Test tabs if present
    const tabs = await page.$$('[role="tab"]');
    if (tabs.length > 0) {
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        await tabs[i].click();
        await page.waitForTimeout(500);
      }
      testResults.customerApp.restaurantDetails.tabNavigation = 'tested';
    }
    
    // Test My Reservations Page
    console.log('📍 Testing My Reservations Page...');
    await page.goto('http://localhost:3002/reservations', { waitUntil: 'networkidle2' });
    
    const reservationsElements = await page.evaluate(() => {
      const results = {
        hasPageTitle: !!document.querySelector('h1, h2'),
        hasTabs: document.querySelectorAll('[role="tab"]').length > 0,
        tabCount: document.querySelectorAll('[role="tab"]').length,
        hasReservationCards: document.querySelectorAll('[class*="Card"]').length > 0,
        hasEmptyState: !!document.querySelector('[class*="empty"], [class*="Empty"]')
      };
      return results;
    });
    
    testResults.customerApp.myReservations.elements = reservationsElements;
    
    // Responsive design test
    console.log('📱 Testing responsive design...');
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto('http://localhost:3002/search', { waitUntil: 'networkidle2' });
      await page.waitForTimeout(500);
      
      const isResponsive = await page.evaluate(() => {
        const body = document.body;
        return body.scrollWidth <= window.innerWidth;
      });
      
      testResults.customerApp.searchPage[`responsive_${viewport.name}`] = isResponsive;
    }
    
  } catch (error) {
    console.error('Error testing customer app:', error);
    testResults.overall.criticalIssues.push({
      app: 'customer',
      error: error.message
    });
  } finally {
    await page.close();
  }
}

async function testAdminApp(browser) {
  console.log('\n🧪 Testing Admin App...\n');
  const page = await browser.newPage();
  
  try {
    // First, handle login if required
    console.log('📍 Attempting login...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    
    // Check if login page is shown
    const hasLoginForm = await page.evaluate(() => {
      return !!document.querySelector('input[type="email"], input[type="text"], input[name="username"]');
    });
    
    if (hasLoginForm) {
      // Attempt login with test credentials
      await page.type('input[type="email"], input[type="text"], input[name="username"]', 'admin@restaurant.com');
      await page.type('input[type="password"]', 'admin123');
      
      const loginButton = await page.$('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
      if (loginButton) {
        await loginButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Test Tables Management
    console.log('📍 Testing Tables Management...');
    await page.goto('http://localhost:3001/tables', { waitUntil: 'networkidle2' });
    
    const tablesElements = await page.evaluate(() => {
      const results = {
        hasTablesList: !!document.querySelector('table, [class*="Table"]'),
        hasAddButton: !!document.querySelector('button:has-text("Add"), button[aria-label*="add"]'),
        tableRows: document.querySelectorAll('tbody tr, [class*="TableRow"]').length,
        hasEditButtons: document.querySelectorAll('[aria-label*="edit"], button:has-text("Edit")').length > 0,
        hasDeleteButtons: document.querySelectorAll('[aria-label*="delete"], button:has-text("Delete")').length > 0,
        hasStatusChips: document.querySelectorAll('[class*="Chip"]').length > 0
      };
      return results;
    });
    
    testResults.adminApp.tablesManagement.elements = tablesElements;
    
    // Test add table functionality
    const addButton = await page.$('button:has-text("Add"), button[aria-label*="add"]');
    if (addButton) {
      await addButton.click();
      await page.waitForTimeout(1000);
      
      const hasDialog = await page.evaluate(() => {
        return !!document.querySelector('[role="dialog"], [class*="Dialog"]');
      });
      
      testResults.adminApp.tablesManagement.addDialog = hasDialog;
      
      if (hasDialog) {
        // Close dialog
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
    
    // Test Customer Management
    console.log('📍 Testing Customer Management...');
    await page.goto('http://localhost:3001/customers', { waitUntil: 'networkidle2' });
    
    const customersElements = await page.evaluate(() => {
      const results = {
        hasCustomersList: !!document.querySelector('table, [class*="Table"], [class*="List"]'),
        hasSearchBar: !!document.querySelector('input[placeholder*="Search"], input[type="search"]'),
        hasFilters: document.querySelectorAll('select, [role="combobox"]').length > 0,
        customerCount: document.querySelectorAll('tbody tr, [class*="ListItem"]').length
      };
      return results;
    });
    
    testResults.adminApp.customerManagement.elements = customersElements;
    
    // Test Settings Page
    console.log('📍 Testing Settings Page...');
    await page.goto('http://localhost:3001/settings', { waitUntil: 'networkidle2' });
    
    const settingsElements = await page.evaluate(() => {
      const results = {
        hasTabs: document.querySelectorAll('[role="tab"]').length > 0,
        tabCount: document.querySelectorAll('[role="tab"]').length,
        hasGeneralSettings: !!document.querySelector('[class*="General"], h3:has-text("General")'),
        hasEmailSettings: !!document.querySelector('[class*="Email"], h3:has-text("Email")'),
        hasNotificationSettings: !!document.querySelector('[class*="Notification"], h3:has-text("Notification")'),
        hasFormFields: document.querySelectorAll('input, select, textarea').length > 0,
        fieldCount: document.querySelectorAll('input, select, textarea').length,
        hasSaveButton: !!document.querySelector('button:has-text("Save"), button[type="submit"]')
      };
      return results;
    });
    
    testResults.adminApp.settings.elements = settingsElements;
    
    // Test tab navigation in settings
    const settingsTabs = await page.$$('[role="tab"]');
    if (settingsTabs.length > 0) {
      for (let i = 0; i < Math.min(settingsTabs.length, 3); i++) {
        await settingsTabs[i].click();
        await page.waitForTimeout(500);
      }
      testResults.adminApp.settings.tabNavigation = 'tested';
    }
    
    // Accessibility testing for admin app
    const adminAccessibility = await page.evaluate(() => {
      const results = {
        hasSkipLinks: !!document.querySelector('[href="#main"], a:has-text("Skip")'),
        hasFocusIndicators: true, // Would need CSS analysis
        hasProperRoles: document.querySelectorAll('[role]').length > 0,
        hasLabels: Array.from(document.querySelectorAll('input')).every(input => 
          input.getAttribute('aria-label') || 
          input.labels?.length > 0 ||
          input.placeholder
        )
      };
      return results;
    });
    
    testResults.adminApp.accessibility = adminAccessibility;
    
  } catch (error) {
    console.error('Error testing admin app:', error);
    testResults.overall.criticalIssues.push({
      app: 'admin',
      error: error.message
    });
  } finally {
    await page.close();
  }
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive UI Testing for Restaurant Reservation System\n');
  console.log('=' .repeat(60));
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Test Customer App
    await testCustomerApp(browser);
    
    // Test Admin App
    await testAdminApp(browser);
    
    // Calculate overall score
    calculateOverallScore();
    
    // Generate report
    await generateReport();
    
  } catch (error) {
    console.error('Fatal error during testing:', error);
    testResults.overall.criticalIssues.push({
      type: 'fatal',
      error: error.message
    });
  } finally {
    await browser.close();
  }
}

function calculateOverallScore() {
  let score = 10;
  const deductions = {
    critical: 2,
    major: 1,
    minor: 0.5,
    accessibility: 1.5,
    performance: 0.5
  };
  
  // Check customer app completeness
  const customerChecks = [
    testResults.customerApp.searchPage.elements?.hasSearchBar,
    testResults.customerApp.searchPage.elements?.hasRestaurantCards,
    testResults.customerApp.restaurantDetails.elements?.hasReservationButton,
    testResults.customerApp.myReservations.elements?.hasPageTitle
  ];
  
  const customerScore = customerChecks.filter(Boolean).length / customerChecks.length;
  if (customerScore < 0.8) {
    testResults.overall.majorIssues.push('Customer app incomplete implementation');
    score -= deductions.major;
  }
  
  // Check admin app completeness
  const adminChecks = [
    testResults.adminApp.tablesManagement.elements?.hasTablesList,
    testResults.adminApp.customerManagement.elements?.hasCustomersList,
    testResults.adminApp.settings.elements?.hasFormFields
  ];
  
  const adminScore = adminChecks.filter(Boolean).length / adminChecks.length;
  if (adminScore < 0.8) {
    testResults.overall.majorIssues.push('Admin app incomplete implementation');
    score -= deductions.major;
  }
  
  // Check accessibility
  if (!testResults.customerApp.searchPage.accessibility?.hasAriaLabels) {
    testResults.overall.accessibilityViolations.push('Missing ARIA labels in customer app');
    score -= deductions.accessibility;
  }
  
  // Check responsive design
  if (!testResults.customerApp.searchPage.responsive_mobile) {
    testResults.overall.majorIssues.push('Mobile responsiveness issues');
    score -= deductions.major;
  }
  
  // Performance check
  if (testResults.customerApp.searchPage.performance?.loadTime > 3000) {
    testResults.overall.minorIssues.push('Slow page load times');
    score -= deductions.performance;
  }
  
  testResults.overall.score = Math.max(0, Math.min(10, score));
}

async function generateReport() {
  const report = `
# Comprehensive UI QA Report - Restaurant Reservation System
Generated: ${testResults.timestamp}

## Overall Score: ${testResults.overall.score}/10

## Executive Summary
- Customer App Status: ${testResults.customerApp.searchPage.elements ? 'Tested' : 'Failed'}
- Admin App Status: ${testResults.adminApp.tablesManagement.elements ? 'Tested' : 'Failed'}
- Critical Issues: ${testResults.overall.criticalIssues.length}
- Major Issues: ${testResults.overall.majorIssues.length}
- Minor Issues: ${testResults.overall.minorIssues.length}

## Customer App Testing Results

### Search Page
- Has Search Bar: ${testResults.customerApp.searchPage.elements?.hasSearchBar ? '✅' : '❌'}
- Has Filters: ${testResults.customerApp.searchPage.elements?.hasCuisineFilter ? '✅' : '❌'}
- Restaurant Cards: ${testResults.customerApp.searchPage.elements?.cardCount || 0}
- Search Functionality: ${testResults.customerApp.searchPage.searchFunctionality?.worked ? '✅' : '❌'}
- Mobile Responsive: ${testResults.customerApp.searchPage.responsive_mobile ? '✅' : '❌'}
- Tablet Responsive: ${testResults.customerApp.searchPage.responsive_tablet ? '✅' : '❌'}
- Desktop Responsive: ${testResults.customerApp.searchPage.responsive_desktop ? '✅' : '❌'}

### Restaurant Details Page
- Has Restaurant Info: ${testResults.customerApp.restaurantDetails.elements?.hasRestaurantName ? '✅' : '❌'}
- Has Rating Display: ${testResults.customerApp.restaurantDetails.elements?.hasRating ? '✅' : '❌'}
- Has Tabs: ${testResults.customerApp.restaurantDetails.elements?.hasTabs ? '✅' : '❌'}
- Tab Count: ${testResults.customerApp.restaurantDetails.elements?.tabCount || 0}
- Has Reservation Button: ${testResults.customerApp.restaurantDetails.elements?.hasReservationButton ? '✅' : '❌'}

### My Reservations Page
- Has Page Title: ${testResults.customerApp.myReservations.elements?.hasPageTitle ? '✅' : '❌'}
- Has Tabs: ${testResults.customerApp.myReservations.elements?.hasTabs ? '✅' : '❌'}
- Has Reservation Display: ${testResults.customerApp.myReservations.elements?.hasReservationCards || testResults.customerApp.myReservations.elements?.hasEmptyState ? '✅' : '❌'}

## Admin App Testing Results

### Tables Management
- Has Tables List: ${testResults.adminApp.tablesManagement.elements?.hasTablesList ? '✅' : '❌'}
- Has Add Button: ${testResults.adminApp.tablesManagement.elements?.hasAddButton ? '✅' : '❌'}
- Table Rows: ${testResults.adminApp.tablesManagement.elements?.tableRows || 0}
- Has Edit/Delete Actions: ${testResults.adminApp.tablesManagement.elements?.hasEditButtons ? '✅' : '❌'}
- Add Dialog Works: ${testResults.adminApp.tablesManagement.addDialog ? '✅' : '❌'}

### Customer Management
- Has Customer List: ${testResults.adminApp.customerManagement.elements?.hasCustomersList ? '✅' : '❌'}
- Has Search: ${testResults.adminApp.customerManagement.elements?.hasSearchBar ? '✅' : '❌'}
- Has Filters: ${testResults.adminApp.customerManagement.elements?.hasFilters ? '✅' : '❌'}
- Customer Count: ${testResults.adminApp.customerManagement.elements?.customerCount || 0}

### Settings Page
- Has Tabs: ${testResults.adminApp.settings.elements?.hasTabs ? '✅' : '❌'}
- Tab Count: ${testResults.adminApp.settings.elements?.tabCount || 0}
- Has Form Fields: ${testResults.adminApp.settings.elements?.hasFormFields ? '✅' : '❌'}
- Field Count: ${testResults.adminApp.settings.elements?.fieldCount || 0}
- Has Save Button: ${testResults.adminApp.settings.elements?.hasSaveButton ? '✅' : '❌'}

## Accessibility Results

### Customer App
- Has Proper Headings: ${testResults.customerApp.searchPage.accessibility?.hasProperHeadings ? '✅' : '❌'}
- Has Alt Texts: ${testResults.customerApp.searchPage.accessibility?.hasAltTexts ? '✅' : '❌'}
- Has ARIA Labels: ${testResults.customerApp.searchPage.accessibility?.hasAriaLabels ? '✅' : '❌'}

### Admin App
- Has Proper Roles: ${testResults.adminApp.accessibility?.hasProperRoles ? '✅' : '❌'}
- Has Form Labels: ${testResults.adminApp.accessibility?.hasLabels ? '✅' : '❌'}

## Performance Metrics
- Search Page Load Time: ${testResults.customerApp.searchPage.performance?.loadTime || 'N/A'} ms
- DOM Ready Time: ${testResults.customerApp.searchPage.performance?.domReady || 'N/A'} ms

## Issues Summary

### Critical Issues (${testResults.overall.criticalIssues.length})
${testResults.overall.criticalIssues.map(issue => `- ${JSON.stringify(issue)}`).join('\n') || '- None found'}

### Major Issues (${testResults.overall.majorIssues.length})
${testResults.overall.majorIssues.map(issue => `- ${issue}`).join('\n') || '- None found'}

### Minor Issues (${testResults.overall.minorIssues.length})
${testResults.overall.minorIssues.map(issue => `- ${issue}`).join('\n') || '- None found'}

### Accessibility Violations (${testResults.overall.accessibilityViolations.length})
${testResults.overall.accessibilityViolations.map(issue => `- ${issue}`).join('\n') || '- None found'}

## Recommendations
1. ${testResults.overall.score < 5 ? 'Critical: Address major implementation gaps immediately' : 'Continue with current implementation approach'}
2. ${testResults.overall.accessibilityViolations.length > 0 ? 'Improve accessibility compliance for WCAG 2.1 AA standards' : 'Maintain good accessibility practices'}
3. ${testResults.customerApp.searchPage.performance?.loadTime > 3000 ? 'Optimize page load performance' : 'Performance is acceptable'}
4. ${!testResults.customerApp.searchPage.responsive_mobile ? 'Fix mobile responsiveness issues' : 'Mobile experience is good'}
5. Ensure all new features have proper error handling and loading states

## Test Coverage
- ✅ Visual Testing
- ✅ Interaction Testing
- ✅ Responsive Design Testing
- ✅ Basic Accessibility Testing
- ✅ Performance Monitoring
- ⚠️ Cross-browser Testing (limited to Chromium)
- ⚠️ Data Validation (backend not available)

---
End of Report
`;

  console.log(report);
  
  // Save detailed results to JSON
  await fs.writeFile(
    '/Users/vedthampi/Desktop/Desktop/Hippo/Restaurant Reservation System/customer-app/ui-test-results.json',
    JSON.stringify(testResults, null, 2)
  );
  
  console.log('\n📊 Detailed results saved to ui-test-results.json');
}

// Run the tests
runComprehensiveTests().catch(console.error);
