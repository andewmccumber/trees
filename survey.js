let speciesMapping = {}; // To be filled with your JSON data
let currentSpecies = [];

// Load species mapping from JSON
fetch('speciesImagePaths.json')
    .then(response => response.json())
    .then(data => {
        speciesMapping = data;
        console.log("Species mapping loaded:", speciesMapping); // Log to check the loaded mapping
        displayNewPair(); // Call this after the mapping is loaded
    })
    .catch(error => {
        console.error("Error loading species mapping:", error);
    });

function getRandomImage(species) {
    const images = speciesMapping[species];
    if (!images || images.length === 0) {
        console.error(`No images found for species: ${species}`);
        return ''; // Return an empty string or a placeholder image path
    }
    return images[Math.floor(Math.random() * images.length)];
}

function displayNewPair() {
    // Ensure speciesMapping is not empty
    if (Object.keys(speciesMapping).length === 0) {
        console.error('Species mapping is empty or not yet loaded');
        return; // Exit the function if speciesMapping is not ready
    }

    const speciesKeys = Object.keys(speciesMapping);
    currentSpecies = [
        speciesKeys[Math.floor(Math.random() * speciesKeys.length)],
        speciesKeys[Math.floor(Math.random() * speciesKeys.length)]
    ];

    // Display the images for the current pair
    document.getElementById('image1').src = getRandomImage(currentSpecies[0]);
    document.getElementById('image2').src = getRandomImage(currentSpecies[1]);
}

document.getElementById('next').addEventListener('click', displayNewPair);
document.getElementById('replace1').addEventListener('click', () => {
    document.getElementById('image1').src = getRandomImage(currentSpecies[0]);
});
document.getElementById('replace2').addEventListener('click', () => {
    document.getElementById('image2').src = getRandomImage(currentSpecies[1]);
});

// Handle the 'submit' button click event
document.getElementById('submit').addEventListener('click', () => {
    const choice = confirm("Do you think these are the same species?");
    fetch('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL', {
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({
            species1: currentSpecies[0],
            species2: currentSpecies[1],
            choice: choice ? "Yes" : "No"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayNewPair(); // Move to the next pair after submitting
    })
    .catch(error => {
        console.error("Error posting data:", error);
    });
});

// Do not call displayNewPair() here directly, let it be called after JSON is loaded
