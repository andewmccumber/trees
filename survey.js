let speciesMapping = {}; // To be filled with your JSON data
let currentSpecies = [];

// Firebase configuration
var  firebaseConfig = {
    apiKey: "AIzaSyDC4xQKkPVejkYvt4NWsIoxmg47i9Awi3o",
    authDomain: "treetest-a122b.firebaseapp.com",
    projectId: "treetest-a122b",
    storageBucket: "treetest-a122b.appspot.com",
    messagingSenderId: "885813433565",
    appId: "1:885813433565:web:e8049a92e754311cfc7734",
    measurementId: "G-KYSP0LT1DP"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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

  // Log the species and choice
  console.log(currentSpecies, choice);
  
  // Prepare the survey data object
  let surveyData = {
    species1: currentSpecies[0],
    species2: currentSpecies[1],
    choice: choice
  };

  // Log the data to be sent
  console.log(surveyData);

  // Get a reference to the Firebase Realtime Database service
  var database = firebase.database();

  // Write the new survey data to the database
  var newEntryRef = database.ref('surveyEntries').push();
  newEntryRef.set(surveyData)
    .then(function() {
      console.log('Survey data saved successfully!');
      // Clear the previous selection
      document.querySelector('input[name="sameSpecies"]:checked').checked = false;
      // Load the next pair of images
      displayNewPair();
    })
    .catch(function(error) {
      console.error("Failed to save survey data: ", error);
    });
});

