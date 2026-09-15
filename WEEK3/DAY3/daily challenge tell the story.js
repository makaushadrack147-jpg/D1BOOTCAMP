// Get form and elements
const form = document.getElementById('libform');
const libButton = document.getElementById('lib-button');
const shuffleButton = document.getElementById('shuffle-button');
const storyContainer = document.getElementById('story-container');
const storyDisplay = document.getElementById('story');
const errorMessage = document.getElementById('error-message');

// Store current values and story index
let currentValues = {};
let currentStoryIndex = 0;

// Multiple story templates for variety
const storyTemplates = [
    {
        name: 'Adventure Story',
        generate: (values) => {
            return `One day, a ${values.adjective} ${values.noun} appeared in ${values.place}. ${values.person} was shocked! Without thinking, ${values.person} decided to ${values.verb} the ${values.adjective} ${values.noun}. It was the most ${values.adjective} adventure of ${values.person}'s life! The ${values.noun} disappeared into the shadows, but ${values.person} knew they would meet again someday in ${values.place}.`;
        }
    },
    {
        name: 'Fantasy Quest',
        generate: (values) => {
            return `In the mystical land of ${values.place}, there lived a legendary ${values.noun} known for being incredibly ${values.adjective}. The great hero ${values.person} was summoned to ${values.verb} this ${values.adjective} creature. Using all their strength, ${values.person} began to ${values.verb} with the ${values.noun}. The battle raged for hours, and finally, ${values.person} emerged victorious. ${values.place} would forever remember the day ${values.person} conquered the ${values.adjective} ${values.noun}.`;
        }
    },
    {
        name: 'Comedy Tale',
        generate: (values) => {
            return `${values.person} was having a normal day until they spotted a ${values.adjective} ${values.noun} running around ${values.place}. "What in the world?" exclaimed ${values.person}. The ${values.noun} suddenly started to ${values.verb} uncontrollably! It was ${values.adjective} and hilarious at the same time. ${values.person} couldn't stop laughing. The other visitors to ${values.place} joined in, and soon everyone was laughing at the silly ${values.noun}.`;
        }
    },
    {
        name: 'Mystery Thriller',
        generate: (values) => {
            return `The ${values.adjective} night had fallen upon ${values.place}. ${values.person} received a mysterious message: "A ${values.noun} has been spotted here. Do you dare to ${values.verb} and investigate?" With trembling hands, ${values.person} decided to ${values.verb} into the darkness. What they found was beyond their wildest imagination—a ${values.adjective} ${values.noun}! ${values.person} finally understood the truth about ${values.place}.`;
        }
    },
    {
        name: 'Friendship Story',
        generate: (values) => {
            return `${values.person} and their best friend met at ${values.place}. "Look! A ${values.adjective} ${values.noun}!" shouted ${values.person}. Together, they decided to ${values.verb} with the magnificent creature. The ${values.noun} seemed to enjoy their ${values.adjective} company. From that day on, the three of them became inseparable. They would often return to ${values.place} to relive their ${values.adjective} memories together.`;
        }
    }
];

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const noun = document.getElementById('noun').value.trim();
    const adjective = document.getElementById('adjective').value.trim();
    const person = document.getElementById('person').value.trim();
    const verb = document.getElementById('verb').value.trim();
    const place = document.getElementById('place').value.trim();
    
    // Validate inputs
    if (!noun || !adjective || !person || !verb || !place) {
        showError('Please fill in all fields!');
        console.warn('Form submission failed: One or more fields are empty');
        return;
    }
    
    // Clear error message
    hideError();
    
    // Store values
    currentValues = { noun, adjective, person, verb, place };
    currentStoryIndex = 0;
    
    // Generate and display story
    displayStory();
    
    // Show shuffle button
    shuffleButton.style.display = 'inline-block';
    
    console.log('Mad Libs generated successfully with values:', currentValues);
});

// Display story
function displayStory() {
    if (Object.keys(currentValues).length === 0) {
        console.error('No values available for story generation');
        return;
    }
    
    const template = storyTemplates[currentStoryIndex];
    const story = template.generate(currentValues);
    
    storyDisplay.textContent = story;
    storyContainer.style.display = 'block';
    
    console.log(`Story ${currentStoryIndex + 1} displayed: ${template.name}`);
}

// Shuffle story
shuffleButton.addEventListener('click', function() {
    if (Object.keys(currentValues).length === 0) {
        showError('Please generate a story first!');
        return;
    }
    
    // Get random story index (different from current)
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * storyTemplates.length);
    } while (newIndex === currentStoryIndex && storyTemplates.length > 1);
    
    currentStoryIndex = newIndex;
    displayStory();
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Log initialization
console.log('Mad Libs game initialized. Available stories:', storyTemplates.length);
