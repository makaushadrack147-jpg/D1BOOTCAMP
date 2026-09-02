//  Exercise 1:

function calculateTip() {
    // Fetch the values from the input fields
    let billAmount = document.getElementById('billAmt').value;
    let serviceQuality = document.getElementById('serviceQual').value;
    let numberOfPeople = document.getElementById('numOfPeople').value;

    // Condition 1: Check if serviceQuality is 0 or billAmount is empty
    if (serviceQuality == 0 || billAmount == '') {
        alert('Please enter the bill amount and select a service quality level');
        return;
    }

    // Condition 2: Check if numberOfPeople is empty or smaller than 1
    if (numberOfPeople == '' || numberOfPeople < 1) {
        numberOfPeople = 1;
        // Hide the "each" text when numberOfPeople is set to default
        document.getElementById('each').style.display = 'none';
    } else {
        document.getElementById('each').style.display = 'block';
    }

    // Calculate the total tip per person
    let total = (billAmount * serviceQuality) / numberOfPeople;
    
    // Round to two decimal points using toFixed
    total = parseFloat(total).toFixed(2);

    // Display the result
    document.getElementById('tip').textContent = total;
    document.getElementById('totalTip').style.display = 'block';
}


//  Exercise 2: 

// Email validation using REGEX
function validateEmailWithRegex(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Email validation WITHOUT regex (manual validation)
function validateEmailWithoutRegex(email) {
    // Check if email contains @ sign
    if (email.indexOf('@') === -1) {
        return false;
    }

    // Split by @ to get local and domain parts
    const parts = email.split('@');
    if (parts.length !== 2) {
        return false;
    }

    const localPart = parts[0];
    const domainPart = parts[1];

    // Check if local part is not empty
    if (localPart.length === 0) {
        return false;
    }

    // Check if domain part contains a dot
    if (domainPart.indexOf('.') === -1) {
        return false;
    }

    // Split domain by dot
    const domainParts = domainPart.split('.');
    
    // Check if there's something before and after the dot
    for (let part of domainParts) {
        if (part.length === 0) {
            return false;
        }
    }

    // Check if domain ends with at least 2 character extension
    const lastPart = domainParts[domainParts.length - 1];
    if (lastPart.length < 2) {
        return false;
    }

    return true;
}

// Handle email form submission
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('emailInput').value.trim();
        const resultDiv = document.getElementById('emailResult');
        
        // Use regex validation (you can switch to validateEmailWithoutRegex() to test without regex)
        const isValid = validateEmailWithRegex(email);
        
        if (isValid) {
            resultDiv.innerHTML = '<p class="success">✓ Valid email address!</p>';
        } else {
            resultDiv.innerHTML = '<p class="error">✗ Invalid email address. Please enter a valid email.</p>';
        }
    });
});


// Exercise 3:
function getGeolocation() {
    const geoResultDiv = document.getElementById('geoResult');
    const geoButton = document.getElementById('geoButton');
    
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
        geoResultDiv.innerHTML = '<p class="error">Geolocation is not supported by your browser.</p>';
        return;
    }

    // Show loading message
    geoButton.disabled = true;
    geoResultDiv.innerHTML = '<p>Getting your location...</p>';

    // Get the user's position
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Success callback
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            geoResultDiv.innerHTML = `
                <div class="geolocation-result">
                    <p><strong>Latitude:</strong> ${latitude}</p>
                    <p><strong>Longitude:</strong> ${longitude}</p>
                </div>
            `;
            geoButton.disabled = false;
        },
        function(error) {
            // Error callback
            let errorMessage = '';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Permission denied. Please enable location access in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get user location timed out.';
                    break;
                default:
                    errorMessage = 'An unknown error occurred.';
            }
            
            geoResultDiv.innerHTML = `<p class="error">${errorMessage}</p>`;
            geoButton.disabled = false;
        }
    );
}
