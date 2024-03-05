const surveyState = {
  speciesImages: null,
  currentSpecies: [],
  currentImages: []
};

// Function to load the species images mapping
async function loadSpeciesImages() {
  try {
    const response = await fetch('speciesImagePaths.json');
    surveyState.speciesImages = await response.json();
    selectRandomSpeciesPair();
  } catch (error) {
    console.error('Failed to load species images:', error);
  }
}

// Function to select a random species pair and display their images
function selectRandomSpeciesPair() {
  const speciesKeys = Object.keys(surveyState.speciesImages);
  surveyState.currentSpecies = [
    speciesKeys[Math.floor(Math.random() * speciesKeys.length)],
    speciesKeys[Math.floor(Math.random() * speciesKeys.length)]
  ];
  displayRandomImagesForCurrentSpecies();
}

// Function to display random images for the current species pair
function displayRandomImagesForCurrentSpecies() {
  surveyState.currentSpecies.forEach((species, index) => {
    const imageList = surveyState.speciesImages[species];
    const randomImageIndex = Math.floor(Math.random() * imageList.length);
    surveyState.currentImages[index] = imageList[randomImageIndex];
    document.getElementById(`image${index + 1}`).src = imageList[randomImageIndex];
  });
}

// Function to replace an image for a given species
function replaceImageForSpecies(speciesIndex) {
  const species = surveyState.currentSpecies[speciesIndex];
  const imageList = surveyState.speciesImages[species];
  let randomImageIndex;
  do {
    randomImageIndex = Math.floor(Math.random() * imageList.length);
  } while (surveyState.currentImages[speciesIndex] === imageList[randomImageIndex]);
  surveyState.currentImages[speciesIndex] = imageList[randomImageIndex];
  document.getElementById(`image${speciesIndex + 1}`).src = imageList[randomImageIndex];
}

// Record the user's choice and proceed to the next pair
function recordChoice(choice) {
  // Here you would add the code to record the choice to Google Sheets
  // For example:
  // recordToGoogleSheets(surveyState.currentSpecies[0], surveyState.currentSpecies[1], choice);
  console.log('Choice recorded:', surveyState.currentSpecies[0], surveyState.currentSpecies[1], choice);
  selectRandomSpeciesPair();
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('replace1').addEventListener('click', () => replaceImageForSpecies(0));
  document.getElementById('replace2').addEventListener('click', () => replaceImageForSpecies(1));
  document.getElementById('sameSpecies').addEventListener('click', () => recordChoice('Same'));
  document.getElementById('differentSpecies').addEventListener('click', () => recordChoice('Different'));
  document.getElementById('next').addEventListener('click', selectRandomSpeciesPair);

  // Load the species images mapping
  loadSpeciesImages();
});
