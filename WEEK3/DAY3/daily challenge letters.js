// 
const lettersInput = document.getElementById('lettersInput');
const validStatus = document.getElementById('validStatus');
const invalidStatus = document.getElementById('invalidStatus');

//  Method 1: Using input event with Regular Expressions ==========
// This is the most modern and reliable approach
lettersInput.addEventListener('input', function() {
    // Get the current value
    let currentValue = this.value;
    
    // Remove any character that is NOT a letter (a-z, A-Z)
    // RegExp pattern: /[^a-zA-Z]/g
    // ^ means "NOT"
    // a-z matches lowercase letters
    // A-Z matches uppercase letters
    // g means "global" (replace all occurrences)
    let filteredValue = currentValue.replace(/[^a-zA-Z]/g, '');
    
    // Update the input value if it changed
    if (currentValue !== filteredValue) {
        this.value = filteredValue;
        // Show that invalid characters were detected and removed
        invalidStatus.classList.add('show');
        validStatus.style.display = 'none';
        console.warn(`Removed non-letter characters. Before: "${currentValue}" → After: "${filteredValue}"`);
    } else if (filteredValue.length > 0) {
        // Show that input is valid
        invalidStatus.classList.remove('show');
        validStatus.style.display = 'block';
        console.log(`Valid input: "${filteredValue}"`);
    }
});

// Method 2: Alternative using keypress event ==========
// Uncomment below to use this method instead
/*
lettersInput.addEventListener('keypress', function(e) {
    const char = String.fromCharCode(e.which);
    
    // Check if the character is a letter
    if (!/[a-zA-Z]/.test(char)) {
        e.preventDefault(); // Prevent the character from being typed
        console.log(`Character "${char}" not allowed - must be a letter`);
    }
});
*/

//  Method 3: Alternative using keydown event ==========
// Uncomment below to use this method instead
/*
lettersInput.addEventListener('keydown', function(e) {
    const key = e.key;
    
    // Allow: Backspace, Delete, Tab, Escape, Enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (allowedKeys.includes(key)) {
        return; // Allow these keys
    }
    
    // Only allow alphabetic keys
    if (!/[a-zA-Z]/.test(key)) {
        e.preventDefault(); // Prevent the character from being typed
        console.log(`Key "${key}" not allowed - must be a letter`);
    }
});
*/

// Method 4: Alternative using keyup event ==========
// Uncomment below to use this method instead (similar to input event)
/*
lettersInput.addEventListener('keyup', function() {
    this.value = this.value.replace(/[^a-zA-Z]/g, '');
});
*/

// Log initialization
console.log('Letters-only input initialized. Only a-z and A-Z characters are allowed.');
console.log('Currently using the "input" event with Regular Expressions method.');
console.log('Other methods are available as comments in the code.');
