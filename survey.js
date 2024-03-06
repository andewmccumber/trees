// Initialize current species array to hold the current pair of species
let currentSpecies = [];
let speciesMapping = {}; // This will hold the species to images mapping

// Function to be called once the species mapping is loaded
function initializeSpeciesMapping(mapping) {
    speciesMapping = mapping;
    displayNewPair();
}

// A function to randomly select an image for a given species
function getRandomImage(species) {
    const images = speciesMapping[species];
    return images[Math.floor(Math.random() * images.length)];
}

// A function to update the images displayed in the survey
function displayNewPair() {
    // Select two random species
    const speciesKeys = Object.keys(speciesMapping);
    currentSpecies = [
        speciesKeys[Math.floor(Math.random() * speciesKeys.length)],
        speciesKeys[Math.floor(Math.random() * speciesKeys.length)]
    ];

    // Display images for these species
    document.getElementById('image1').src = getRandomImage(currentSpecies[0]);
    document.getElementById('image2').src = getRandomImage(currentSpecies[1]);
}

// A function to send the survey response to the Google Apps Script
function sendResponse(species1, species2, choice) {
    const dataToSend = JSON.stringify({ species1, species2, choice });

    fetch('https://script.google.com/a/macros/stonybrook.edu/s/AKfycbwOVEaBn3LbMQpUoUm2fReuFQjtpDEFiKUJ5HLXEauixNUJHTYwcnU4EdMBwoB8lE8w/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: dataToSend
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data successfully sent to Google Apps Script:', data);
        // Proceed to the next pair after a successful submission
        displayNewPair();
    })
    .catch(error => {
        console.error('Failed to send data:', error);
    });
}

// Load species mapping from JSON and initialize the first pair
fetch('speciesImagePaths.json')
    .then(response => response.json())
    .then(initializeSpeciesMapping)
    .catch(error => console.error('Failed to load species mapping:', error));

// Event listeners for the survey buttons
document.getElementById('next').addEventListener('click', () => {
    const choiceElement = document.querySelector('input[name="sameSpecies"]:checked');
    if (!choiceElement) {
        alert("Please select Yes or No before moving on to the next pair.");
        return;
    }
    const choice = choiceElement.value;

    sendResponse(currentSpecies[0], currentSpecies[1], choice);
    // Clear the selection for the next pair
    choiceElement.checked = false;
});

document.getElementById('replace1').addEventListener('click', () => {
    document.getElementById('image1').src = getRandomImage(currentSpecies[0]);
});

document.getElementById('replace2').addEventListener('click', () => {
    document.getElementById('image2').src = getRandomImage(currentSpecies[1]);
});
