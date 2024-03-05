const speciesMappingUrl = 'path/to/your/species_mapping.json'; // Adjust this path
let speciesMapping = {};
let currentPair = [];
let imageIndices = {1: 0, 2: 0}; // To keep track of which images are currently being shown

// Load the species mapping
async function loadSpeciesMapping() {
    const response = await fetch(speciesMappingUrl);
    speciesMapping = await response.json();
    selectRandomSpeciesPair();
}

function selectRandomSpeciesPair() {
    // Implementation to select a random pair of species and display initial images
}

window.onload = loadSpeciesMapping;

function displayImages() {
    // Randomly select and display images for `currentPair`
}

function replaceImage(imageNumber) {
    // Replace the image for the given imageNumber (1 or 2)
}

// Event listeners for buttons
document.getElementById('replace1').addEventListener('click', () => replaceImage(1));
document.getElementById('replace2').addEventListener('click', () => replaceImage(2));
document.getElementById('sameSpecies').addEventListener('click', () => recordChoice('Same'));
document.getElementById('differentSpecies').addEventListener('click', () => recordChoice('Different'));
document.getElementById('next').addEventListener('click', selectRandomSpeciesPair);

function doPost(e) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses"); // Make sure the sheet name matches
    const postData = JSON.parse(e.postData.contents);
    sheet.appendRow([postData.species1, postData.species2, postData.choice]);
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
}

async function recordChoice(choice) {
    const data = { species1: currentPair[0], species2: currentPair[1], choice: choice };
    // Send this data to the Google Apps Script Web App URL
    await fetch('YOUR_WEB_APP_URL', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    selectRandomSpeciesPair(); // Move to the next pair
}
