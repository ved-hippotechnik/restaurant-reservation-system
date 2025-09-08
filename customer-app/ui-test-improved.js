const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const testReport = {
  timestamp: new Date().toISOString(),
  overallScore: 10,
  criticalIssues: [],
  majorIssues: [],
  minorIssues: [],
  accessibilityViolations: [],
  performanceMetrics: {},
  customerApp: {},
  adminApp: {},
  newFeatures: {
    implemented: [],
    notImplemented: [],
    withIssues: []
  }
};

async function testCustomerApp() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  console.log('\n📱 Testing Customer App (Port 3002)...\n');
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Test Home Page
    console.log('Testing Home Page...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle2', timeout: 30000 });
    
    const homePageElements = await page.evaluate(() => {
      return {
        hasNavbar: !!document.querySelector('nav, [role="navigation"], header'),
        hasHeroSection: !!document.querySelector('h1, [class*="hero"], [class*="Hero"]'),
        hasSearchButton: !!document.querySelector('a[href*="search"], button:contains("Search")'),
        pageTitle: document.title
      };
    });
    
    testReport.customerApp.homePage = homePageElements;
    console.log('✅ Home Page:', homePageElements);
    
    // Test Search Page
    console.log('\nTesting Search Page...');
    await page.goto('http://localhost:3002/search', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const searchPageElements = await page.evaluate(() => {
      const searchInput = document.querySelector('input[type="text"], input[type="search"], input[placeholder*="earch"]');
      const filters = document.querySelectorAll('select, [role="combobox"]');
      const cards = document.querySelectorAll('[class*="Card"], [class*="card"]');
      
      return {
        hasSearchInput: !!searchInput,
        searchPlaceholder: searchInput?.placeholder || '',
        filterCount: filters.length,
        restaurantCardCount: cards.length,
        hasResults: cards.length > 0
      };
    });
    
    testReport.customerApp.searchPage = searchPageElements;
    console.log('✅ Search Page:', searchPageElements);
    
    if (searchPageElements.hasSearchInput) {
      testReport.newFeatures.implemented.push('Search functionality with input field');
    } else {
      testReport.newFeatures.notImplemented.push('Search input field');
      testReport.majorIssues.push('Search input field not found');
    }
    
    if (searchPageElements.filterCount > 0) {
      testReport.newFeatures.implemented.push('Search filters (' + searchPageElements.filterCount + ' filters)');
    } else {
      testReport.newFeatures.withIssues.push('Search filters not visible or not implemented');
    }
    
    // Test Restaurant Details Page
    console.log('\nTesting Restaurant Details Page...');
    await page.goto('http://localhost:3002/restaurant/1', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const detailsPageElements = await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"], [class*="tab"]');
      const images = document.querySelectorAll('img');
      const buttons = document.querySelectorAll('button');
      
      return {
        hasTitle: !!document.querySelector('h1, h2, h3'),
        titleText: document.querySelector('h1, h2, h3')?.textContent || '',
        tabCount: tabs.length,
        imageCount: images.length,
        hasReservationButton: Array.from(buttons).some(btn => 
          btn.textContent?.toLowerCase().includes('reserve') || 
          btn.textContent?.toLowerCase().includes('book')
        ),
        hasRating: !!document.querySelector('[class*="ating"], [class*="Rating"]')
      };
    });
    
    testReport.customerApp.restaurantDetails = detailsPageElements;
    console.log('✅ Restaurant Details:', detailsPageElements);
    
    if (detailsPageElements.tabCount > 0) {
      testReport.newFeatures.implemented.push('Restaurant details tabs (' + detailsPageElements.tabCount + ' tabs)');
    } else {
      testReport.newFeatures.withIssues.push('Restaurant details tabs not implemented');
    }
    
    if (detailsPageElements.hasReservationButton) {
      testReport.newFeatures.implemented.push('Reservation button in restaurant details');
    }
    
    // Test My Reservations Page
    console.log('\nTesting My Reservations Page...');
    await page.goto('http://localhost:3002/reservations', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const reservationsPageElements = await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"], [class*="tab"]');
      const cards = document.querySelectorAll('[class*="Card"], [class*="card"]');
      
      return {
        hasTitle: !!document.querySelector('h1, h2'),
        titleText: document.querySelector('h1, h2')?.textContent || '',
        tabCount: tabs.length,
        reservationCount: cards.length,
        hasEmptyState: document.body.textContent?.includes('No reservations') || 
                      document.body.textContent?.includes('no reservations')
      };
    });
    
    testReport.customerApp.myReservations = reservationsPageElements;
    console.log('✅ My Reservations:', reservationsPageElements);
    
    if (reservationsPageElements.tabCount > 0) {
      testReport.newFeatures.implemented.push('My Reservations tabs (' + reservationsPageElements.tabCount + ' tabs)');
    }
    
    // Test Responsive Design
    console.log('\nTesting Responsive Design...');
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await page.goto('http://localhost:3002/search', { waitUntil: 'networkidle2' });
      
      const isResponsive = await page.evaluate(() => {
        return document.body.scrollWidth <= window.innerWidth;
      });
      
      testReport.customerApp['responsive_' + viewport.name] = isResponsive;
      console.log(viewport.name + ': ' + (isResponsive ? '✅' : '❌'));
      
      if (!isResponsive && viewport.name === 'Mobile') {
        testReport.majorIssues.push('Mobile responsiveness issues in customer app');
      }
    }
    
    // Accessibility Testing
    console.log('\nTesting Accessibility...');
    const accessibilityResults = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const inputs = Array.from(document.querySelectorAll('input'));
      
      return {
        imagesWithAlt: images.filter(img => img.alt).length,
        totalImages: images.length,
        buttonsWithAriaLabel: buttons.filter(btn => btn.getAttribute('aria-label')).length,
        totalButtons: buttons.length,
        inputsWithLabel: inputs.filter(input => 
          input.getAttribute('aria-label') || 
          input.labels?.length > 0 ||
          input.placeholder
        ).length,
        totalInputs: inputs.length,
        hasSkipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
        hasLandmarks: !!document.querySelector('[role="main"], main')
      };
    });
    
    testReport.customerApp.accessibility = accessibilityResults;
    console.log('✅ Accessibility:', accessibilityResults);
    
    if (accessibilityResults.totalImages > 0 && 
        accessibilityResults.imagesWithAlt < accessibilityResults.totalImages) {
      testReport.accessibilityViolations.push(
        'Missing alt text: ' + (accessibilityResults.totalImages - accessibilityResults.imagesWithAlt) + ' images'
      );
    }
    
  } catch (error) {
    console.error('Error testing customer app:', error.message);
    testReport.criticalIssues.push('Customer app testing failed: ' + error.message);
    testReport.overallScore -= 2;
  } finally {
    await browser.close();
  }
}

async function testAdminApp() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  console.log('\n🔧 Testing Admin App (Port 3001)...\n');
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Test Login/Home
    console.log('Testing Admin Home/Login...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const hasLoginForm = await page.evaluate(() => {
      return !!document.querySelector('input[type="email"], input[type="text"], input[name*="user"], input[name*="email"]');
    });
    
    testReport.adminApp.hasLogin = hasLoginForm;
    console.log('Has Login Form: ' + (hasLoginForm ? '✅' : '❌'));
    
    // Try to access protected pages
    console.log('\nTesting Tables Management...');
    await page.goto('http://localhost:3001/tables', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const tablesPageElements = await page.evaluate(() => {
      const tables = document.querySelectorAll('table, [class*="Table"], [class*="table"]');
      const buttons = Array.from(document.querySelectorAll('button'));
      const rows = document.querySelectorAll('tbody tr, [class*="row"]');
      
      return {
        hasTableDisplay: tables.length > 0,
        hasAddButton: buttons.some(btn => 
          btn.textContent?.toLowerCase().includes('add') ||
          btn.getAttribute('aria-label')?.toLowerCase().includes('add')
        ),
        tableRowCount: rows.length,
        hasActions: buttons.some(btn => 
          btn.textContent?.toLowerCase().includes('edit') ||
          btn.textContent?.toLowerCase().includes('delete')
        )
      };
    });
    
    testReport.adminApp.tablesManagement = tablesPageElements;
    console.log('✅ Tables Management:', tablesPageElements);
    
    if (tablesPageElements.hasTableDisplay && tablesPageElements.hasAddButton) {
      testReport.newFeatures.implemented.push('Tables Management with CRUD operations');
    } else if (tablesPageElements.hasTableDisplay) {
      testReport.newFeatures.withIssues.push('Tables Management (partial implementation)');
    } else {
      testReport.newFeatures.notImplemented.push('Tables Management');
    }
    
    // Test Customer Management
    console.log('\nTesting Customer Management...');
    await page.goto('http://localhost:3001/customers', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const customersPageElements = await page.evaluate(() => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="earch"]');
      const filters = document.querySelectorAll('select, [role="combobox"]');
      const list = document.querySelectorAll('table, [class*="List"], [class*="list"]');
      
      return {
        hasSearchBar: !!searchInput,
        filterCount: filters.length,
        hasCustomerList: list.length > 0,
        pageContent: document.body.textContent?.substring(0, 100) || ''
      };
    });
    
    testReport.adminApp.customerManagement = customersPageElements;
    console.log('✅ Customer Management:', customersPageElements);
    
    if (customersPageElements.hasSearchBar && customersPageElements.hasCustomerList) {
      testReport.newFeatures.implemented.push('Customer Management with search');
    } else if (customersPageElements.hasCustomerList) {
      testReport.newFeatures.withIssues.push('Customer Management (search not working)');
    }
    
    // Test Settings Page
    console.log('\nTesting Settings Page...');
    await page.goto('http://localhost:3001/settings', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const settingsPageElements = await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"], [class*="tab"]');
      const inputs = document.querySelectorAll('input, select, textarea');
      const saveButton = document.querySelector('button[type="submit"], button:contains("Save")');
      
      return {
        tabCount: tabs.length,
        formFieldCount: inputs.length,
        hasSaveButton: !!saveButton,
        pageContent: document.body.textContent?.substring(0, 100) || ''
      };
    });
    
    testReport.adminApp.settings = settingsPageElements;
    console.log('✅ Settings:', settingsPageElements);
    
    if (settingsPageElements.tabCount > 0 && settingsPageElements.formFieldCount > 0) {
      testReport.newFeatures.implemented.push('Settings page with ' + settingsPageElements.tabCount + ' tabs');
    } else if (settingsPageElements.formFieldCount > 0) {
      testReport.newFeatures.withIssues.push('Settings page (tabs not implemented)');
    }
    
    // Performance Testing
    console.log('\nTesting Performance...');
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        pageLoadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        resourcesLoaded: performance.getEntriesByType('resource').length
      };
    });
    
    testReport.adminApp.performance = performanceMetrics;
    console.log('✅ Performance:', performanceMetrics);
    
    if (performanceMetrics.pageLoadTime > 3000) {
      testReport.minorIssues.push('Slow page load in admin app: ' + performanceMetrics.pageLoadTime + 'ms');
    }
    
  } catch (error) {
    console.error('Error testing admin app:', error.message);
    testReport.criticalIssues.push('Admin app testing failed: ' + error.message);
    testReport.overallScore -= 2;
  } finally {
    await browser.close();
  }
}

async function generateFinalReport() {
  // Calculate final score
  testReport.overallScore -= testReport.criticalIssues.length * 2;
  testReport.overallScore -= testReport.majorIssues.length * 1;
  testReport.overallScore -= testReport.minorIssues.length * 0.5;
  testReport.overallScore -= testReport.accessibilityViolations.length * 0.5;
  testReport.overallScore = Math.max(0, testReport.overallScore);
  
  const report = [
    '',
    '================================================================================',
    '🔍 COMPREHENSIVE UI QUALITY ASSURANCE REPORT',
    '================================================================================',
    'Generated: ' + testReport.timestamp,
    '',
    '📊 OVERALL UI QUALITY SCORE: ' + testReport.overallScore.toFixed(1) + '/10',
    '================================================================================',
    '',
    '🎯 NEW FEATURES ASSESSMENT',
    '---------------------------',
    '✅ IMPLEMENTED (' + testReport.newFeatures.implemented.length + '):',
    testReport.newFeatures.implemented.map(f => '  • ' + f).join('\n') || '  None',
    '',
    '⚠️ PARTIALLY IMPLEMENTED (' + testReport.newFeatures.withIssues.length + '):',
    testReport.newFeatures.withIssues.map(f => '  • ' + f).join('\n') || '  None',
    '',
    '❌ NOT IMPLEMENTED (' + testReport.newFeatures.notImplemented.length + '):',
    testReport.newFeatures.notImplemented.map(f => '  • ' + f).join('\n') || '  None',
    '',
    '📱 CUSTOMER APP RESULTS',
    '------------------------',
    'Search Page:',
    '  • Search Input: ' + (testReport.customerApp.searchPage?.hasSearchInput ? '✅' : '❌'),
    '  • Filters: ' + (testReport.customerApp.searchPage?.filterCount || 0),
    '  • Restaurant Cards: ' + (testReport.customerApp.searchPage?.restaurantCardCount || 0),
    '',
    'Restaurant Details:',
    '  • Title: ' + (testReport.customerApp.restaurantDetails?.hasTitle ? '✅' : '❌'),
    '  • Tabs: ' + (testReport.customerApp.restaurantDetails?.tabCount || 0),
    '  • Images: ' + (testReport.customerApp.restaurantDetails?.imageCount || 0),
    '  • Reservation Button: ' + (testReport.customerApp.restaurantDetails?.hasReservationButton ? '✅' : '❌'),
    '',
    'My Reservations:',
    '  • Title: ' + (testReport.customerApp.myReservations?.hasTitle ? '✅' : '❌'),
    '  • Tabs: ' + (testReport.customerApp.myReservations?.tabCount || 0),
    '',
    'Responsive Design:',
    '  • Mobile: ' + (testReport.customerApp.responsive_Mobile ? '✅' : '❌'),
    '  • Tablet: ' + (testReport.customerApp.responsive_Tablet ? '✅' : '❌'),
    '  • Desktop: ' + (testReport.customerApp.responsive_Desktop ? '✅' : '❌'),
    '',
    '🔧 ADMIN APP RESULTS',
    '--------------------',
    'Tables Management:',
    '  • Table Display: ' + (testReport.adminApp.tablesManagement?.hasTableDisplay ? '✅' : '❌'),
    '  • Add Button: ' + (testReport.adminApp.tablesManagement?.hasAddButton ? '✅' : '❌'),
    '  • Row Count: ' + (testReport.adminApp.tablesManagement?.tableRowCount || 0),
    '',
    'Customer Management:',
    '  • Search Bar: ' + (testReport.adminApp.customerManagement?.hasSearchBar ? '✅' : '❌'),
    '  • Filters: ' + (testReport.adminApp.customerManagement?.filterCount || 0),
    '  • Customer List: ' + (testReport.adminApp.customerManagement?.hasCustomerList ? '✅' : '❌'),
    '',
    'Settings:',
    '  • Tabs: ' + (testReport.adminApp.settings?.tabCount || 0),
    '  • Form Fields: ' + (testReport.adminApp.settings?.formFieldCount || 0),
    '  • Save Button: ' + (testReport.adminApp.settings?.hasSaveButton ? '✅' : '❌'),
    '',
    '♿ ACCESSIBILITY COMPLIANCE',
    '---------------------------',
    'Customer App:',
    '  • Images with Alt Text: ' + (testReport.customerApp.accessibility?.imagesWithAlt || 0) + '/' + (testReport.customerApp.accessibility?.totalImages || 0),
    '  • Buttons with ARIA: ' + (testReport.customerApp.accessibility?.buttonsWithAriaLabel || 0) + '/' + (testReport.customerApp.accessibility?.totalButtons || 0),
    '  • Inputs with Labels: ' + (testReport.customerApp.accessibility?.inputsWithLabel || 0) + '/' + (testReport.customerApp.accessibility?.totalInputs || 0),
    '  • Skip Links: ' + (testReport.customerApp.accessibility?.hasSkipLink ? '✅' : '❌'),
    '  • Landmarks: ' + (testReport.customerApp.accessibility?.hasLandmarks ? '✅' : '❌'),
    '',
    'Violations: ' + testReport.accessibilityViolations.length,
    testReport.accessibilityViolations.map(v => '  • ' + v).join('\n') || '  None',
    '',
    '⚡ PERFORMANCE METRICS',
    '----------------------',
    'Admin App:',
    '  • Page Load: ' + (testReport.adminApp.performance?.pageLoadTime || 'N/A') + 'ms',
    '  • DOM Ready: ' + (testReport.adminApp.performance?.domReadyTime || 'N/A') + 'ms',
    '  • Resources: ' + (testReport.adminApp.performance?.resourcesLoaded || 0),
    '',
    '🚨 ISSUES SUMMARY',
    '-----------------',
    'Critical Issues (' + testReport.criticalIssues.length + '):',
    testReport.criticalIssues.map(i => '  • ' + i).join('\n') || '  None',
    '',
    'Major Issues (' + testReport.majorIssues.length + '):',
    testReport.majorIssues.map(i => '  • ' + i).join('\n') || '  None',
    '',
    'Minor Issues (' + testReport.minorIssues.length + '):',
    testReport.minorIssues.map(i => '  • ' + i).join('\n') || '  None',
    '',
    '📋 RECOMMENDATIONS',
    '------------------',
    '1. ' + (testReport.overallScore < 5 ? 'CRITICAL: Address major implementation gaps immediately' : 'Continue with current implementation'),
    '2. ' + (testReport.newFeatures.notImplemented.length > 0 ? 'Complete missing features implementation' : 'All major features are implemented'),
    '3. ' + (testReport.accessibilityViolations.length > 0 ? 'Fix accessibility violations for WCAG compliance' : 'Maintain good accessibility practices'),
    '4. ' + (testReport.customerApp.responsive_Mobile === false ? 'Fix mobile responsiveness issues' : 'Mobile experience is good'),
    '5. ' + (testReport.adminApp.performance?.pageLoadTime > 3000 ? 'Optimize page load performance' : 'Performance is acceptable'),
    '',
    '🏆 STRENGTHS',
    '------------',
    testReport.newFeatures.implemented.length > 5 ? '• Most new features successfully implemented' : '',
    testReport.customerApp.responsive_Desktop ? '• Desktop responsiveness working well' : '',
    testReport.overallScore >= 7 ? '• Overall implementation quality is good' : '',
    '',
    '🎯 PRIORITY FIXES',
    '-----------------',
    testReport.criticalIssues.length > 0 ? '1. Fix critical issues blocking functionality' : '',
    testReport.newFeatures.notImplemented.length > 0 ? '2. Complete unimplemented features' : '',
    testReport.accessibilityViolations.length > 0 ? '3. Address accessibility violations' : '',
    !testReport.customerApp.responsive_Mobile ? '4. Fix mobile responsiveness' : '',
    '',
    '================================================================================'
  ].join('\n');
  
  console.log(report);
  
  // Save detailed JSON report
  await fs.writeFile(
    '/Users/vedthampi/Desktop/Desktop/Hippo/Restaurant Reservation System/customer-app/ui-qa-final-report.json',
    JSON.stringify(testReport, null, 2)
  );
  
  console.log('\n📁 Detailed JSON report saved to ui-qa-final-report.json\n');
}

// Main execution
async function runTests() {
  console.log('\n🚀 Starting Comprehensive UI Quality Assurance Testing\n');
  console.log('='.repeat(60));
  
  await testCustomerApp();
  await testAdminApp();
  await generateFinalReport();
  
  console.log('\n✅ Testing Complete!\n');
}

runTests().catch(console.error);
