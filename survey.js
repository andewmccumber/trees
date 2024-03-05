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

// ... (rest of your initial code)

document.getElementById('next').addEventListener('click', () => {
    // Check which radio button is selected
    let choice = document.querySelector('input[name="sameSpecies"]:checked')?.value;
    
    // Make sure the user has made a selection
    if (!choice) {
        alert("Please select Yes or No before moving on to the next pair.");
        return;
    }
    console.log(currentSpecies);
    let dataToSend = JSON.stringify({
        species1: currentSpecies[0],
        species2: currentSpecies[1],
        choice: choice
    });
console.log(dataToSend);
    // Send the choice to the Google Apps Script
fetch('https://script.google.com/macros/s/AKfycbzdY8nmJ64Zxc6-irgXCIZ8nRvZWb2-kSuJ8DTsdJ71g1FgG28wKbmglGkDzYbQ0SlO/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Corrected line: headers property
        },
        body: dataToSend,
        credentials: 'include'
})
    })
    .then(response => {
     if (!response.ok) {
         throw new Error('Network response was not ok');
     }
     return response.json();
})
.then(data => {
    console.log(data);
    // Clear the previous selection
    document.querySelector('input[name="sameSpecies"]:checked').checked = false;
    // Load the next pair
    displayNewPair();
})
.catch(error => {
    console.error("Error posting data:", error);
 });

// Do not call displayNewPair() here directly, let it be called after JSON is loaded
