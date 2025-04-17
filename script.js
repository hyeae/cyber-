// Enhanced dataset with location information
const spamNumbers = {
    "18005551234": { location: "Unknown", type: "Telemarketer", reports: 45 },
    "18885551234": { location: "United States", type: "Scam", reports: 32 },
    "12025551234": { location: "Washington DC", type: "Political", reports: 18 },
    "19005551234": { location: "Premium Rate", type: "Service", reports: 27 },
    "1855551234": { location: "New York", type: "Telemarketer", reports: 15 },
    "18665551234": { location: "Canada", type: "Scam", reports: 22 }
};

// Area code to location mapping
const areaCodeLocations = {
    "201": "New Jersey",
    "202": "Washington DC",
    "212": "New York, NY",
    "213": "Los Angeles, CA",
    "310": "Los Angeles, CA",
    "312": "Chicago, IL",
    "415": "San Francisco, CA",
    "503": "Portland, OR",
    "617": "Boston, MA",
    "650": "Silicon Valley, CA",
    "800": "Toll-Free (US)",
    "888": "Toll-Free (US)",
    "877": "Toll-Free (US)",
    "866": "Toll-Free (US)",
    "855": "Toll-Free (US)",
    "900": "Premium Rate (US)"
};

// Recent checks storage
let recentChecks = JSON.parse(localStorage.getItem('recentChecks')) || [];

// User reported numbers
let reportedNumbers = JSON.parse(localStorage.getItem('reportedNumbers')) || {};

// DOM elements
const phoneNumberInput = document.getElementById('phoneNumber');
const checkBtn = document.getElementById('checkBtn');
const resultDiv = document.getElementById('result');
const recentList = document.getElementById('recentList');
const detailsPanel = document.getElementById('numberDetails');
const detailsContent = document.getElementById('detailsContent');
const reportSpamBtn = document.getElementById('reportSpamBtn');
const reportLegitBtn = document.getElementById('reportLegitBtn');

// Format phone number (remove all non-digit characters)
function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
}

// Enhanced spam detection with pattern matching
function isSpamNumber(phoneNumber) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    // 1. Check exact match in spam database
    if (spamNumbers[formattedNumber]) {
        return true;
    }
    
    // 2. Check for common spam patterns
    const spamPatterns = [
        /^[2-9]\d{2}555\d{4}$/, // 555 numbers (like 415-555-1212)
        /^(\d)\1{6,}\d*$/,       // Repeated digits (8888888)
        /^1?800\d{7}$/,          // 800 numbers
        /^1?900\d{7}$/,          // Premium rate numbers
        /^1?[2-9]\d{2}\d{7}$/    // Potential international spam
    ];
    
    for (const pattern of spamPatterns) {
        if (pattern.test(formattedNumber)) {
            return true;
        }
    }
    
    // 3. Check area code reputation
    const areaCode = formattedNumber.substring(0, 3);
    const spamAreaCodes = ['800', '888', '877', '866', '855', '844', '900', '976'];
    if (spamAreaCodes.includes(areaCode)) {
        return true;
    }
    
    // 4. Check if number is suspiciously short
    if (formattedNumber.length < 7) {
        return true;
    }
    
    // 5. Check user reports
    if (reportedNumbers[formattedNumber] && reportedNumbers[formattedNumber].spamReports > 2) {
        return true;
    }
    
    return false;
}

// Get location information from area code
function getLocationInfo(phoneNumber) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const areaCode = formattedNumber.substring(0, 3);
    
    if (areaCodeLocations[areaCode]) {
        return areaCodeLocations[areaCode];
    }
    
    return "Unknown location";
}

// Display detailed information about the number
function showNumberDetails(phoneNumber) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const isSpam = isSpamNumber(phoneNumber);
    const location = getLocationInfo(formattedNumber);
    const areaCode = formattedNumber.substring(0, 3);
    
    let detailsHTML = `
        <p><strong>Phone Number:</strong> ${formatDisplayNumber(formattedNumber)}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Area Code:</strong> ${areaCode}</p>
    `;
    
    // Add spam database info if available
    if (spamNumbers[formattedNumber]) {
        detailsHTML += `
            <p><strong>Known as:</strong> ${spamNumbers[formattedNumber].type}</p>
            <p><strong>Reports in database:</strong> ${spamNumbers[formattedNumber].reports}</p>
        `;
    }
    
    // Add user reports if available
    if (reportedNumbers[formattedNumber]) {
        detailsHTML += `
            <p><strong>Your community reports:</strong></p>
            <p>Spam reports: ${reportedNumbers[formattedNumber].spamReports || 0}</p>
            <p>Legitimate reports: ${reportedNumbers[formattedNumber].legitReports || 0}</p>
        `;
    }
    
    detailsContent.innerHTML = detailsHTML;
    detailsPanel.classList.add('visible');
}

// Format number for display
function formatDisplayNumber(phoneNumber) {
    const formatted = formatPhoneNumber(phoneNumber);
    if (formatted.length === 10) {
        return formatted.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (formatted.length === 11) {
        return formatted.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
    }
    return formatted;
}

// Display result
function displayResult(isSpam, phoneNumber) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const displayNumber = formatDisplayNumber(formattedNumber);
    
    if (isSpam) {
        resultDiv.innerHTML = `⚠️ <span class="spam-number">${displayNumber}</span> is likely a SPAM call!`;
        resultDiv.className = 'spam';
    } else {
        resultDiv.innerHTML = `✅ <span class="not-spam-number">${displayNumber}</span> appears legitimate.`;
        resultDiv.className = 'not-spam';
    }
    
    showNumberDetails(phoneNumber);
    addToRecentChecks(phoneNumber, isSpam);
}

// Add to recent checks and update localStorage
function addToRecentChecks(phoneNumber, isSpam) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const displayNumber = formatDisplayNumber(formattedNumber);
    
    // Add to beginning of array
    recentChecks.unshift({
        number: displayNumber,
        isSpam: isSpam,
        timestamp: new Date().toLocaleString(),
        location: getLocationInfo(formattedNumber)
    });
    
    // Keep only last 5 checks
    if (recentChecks.length > 5) {
        recentChecks = recentChecks.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('recentChecks', JSON.stringify(recentChecks));
    
    // Update recent checks display
    updateRecentChecksDisplay();
}

// Update recent checks display
function updateRecentChecksDisplay() {
    recentList.innerHTML = '';
    
    recentChecks.forEach(check => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <span>${check.number}</span>
                <small>${check.location}</small>
            </div>
            <span class="${check.isSpam ? 'spam-tag' : 'not-spam-tag'}">
                ${check.isSpam ? 'SPAM' : 'Not Spam'}
            </span>
            <small>${check.timestamp}</small>
        `;
        recentList.appendChild(li);
    });
}

// Report number as spam or legitimate
function reportNumber(phoneNumber, isSpam) {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    if (!reportedNumbers[formattedNumber]) {
        reportedNumbers[formattedNumber] = { spamReports: 0, legitReports: 0 };
    }
    
    if (isSpam) {
        reportedNumbers[formattedNumber].spamReports++;
    } else {
        reportedNumbers[formattedNumber].legitReports++;
    }
    
    localStorage.setItem('reportedNumbers', JSON.stringify(reportedNumbers));
    
    // Update the display
    const isNowSpam = isSpamNumber(phoneNumber);
    displayResult(isNowSpam, phoneNumber);
}

// Event listeners
checkBtn.addEventListener('click', () => {
    const phoneNumber = phoneNumberInput.value.trim();
    
    if (!phoneNumber) {
        alert('Please enter a phone number');
        return;
    }
    
    const isSpam = isSpamNumber(phoneNumber);
    displayResult(isSpam, phoneNumber);
});

phoneNumberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkBtn.click();
    }
});

reportSpamBtn.addEventListener('click', () => {
    const phoneNumber = phoneNumberInput.value.trim();
    if (phoneNumber) {
        reportNumber(phoneNumber, true);
        alert('Thank you for reporting this number as spam!');
    }
});

reportLegitBtn.addEventListener('click', () => {
    const phoneNumber = phoneNumberInput.value.trim();
    if (phoneNumber) {
        reportNumber(phoneNumber, false);
        alert('Thank you for reporting this number as legitimate!');
    }
});

// Format phone number as user types
phoneNumberInput.addEventListener('input', function(e) {
    const input = e.target.value.replace(/\D/g, '').substring(0, 11);
    let formatted = '';
    
    if (input.length > 0) {
        formatted = '(' + input.substring(0, 3);
    }
    if (input.length > 3) {
        formatted += ') ' + input.substring(3, 6);
    }
    if (input.length > 6) {
        formatted += '-' + input.substring(6, 10);
    }
    
    e.target.value = formatted;
});

// Initialize recent checks display
updateRecentChecksDisplay();