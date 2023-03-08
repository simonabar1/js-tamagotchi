// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"



const startButton = document.getElementById('start-button');
const avatarSelection = document.getElementById('avatar-selection');
const petDashboard = document.getElementById('pet-dashboard');
const petIcon = document.getElementById('pet-icon'); // select the pet icon element by id

startButton.addEventListener('click', function() {
  startButton.style.display = 'none';
  avatarSelection.style.display = 'block';

  const avatarIcons = document.querySelectorAll('.avatar');

  avatarIcons.forEach(function(icon) {
    icon.addEventListener('click', function() {
      avatarSelection.style.display = 'none';
      petDashboard.style.display = 'block';
      const selectedAvatarClass = icon.getAttribute('id'); // get the id instead of data-avatar
      petIcon.className = `icon ${selectedAvatarClass}`; // update the class of the pet icon element
    });
  });

  resetPetStats(); // Reset pet's stats when starting a new game

  // Set up age and health updates
  setInterval(function() {
    pet_info.age++;
    pet_info.health -= 5;
    pet_info.hunger += 1;
    checkAndUpdatePetInfoInHtml();
    checkForGameOver();


    // Check if pet is K.O.
    if (pet_info.age >= pet_info.max_age || pet_info.hunger >= 100) {
      petDashboard.style.display = 'none';
      const gameOverSection = document.createElement('div');
      gameOverSection.innerHTML = '<h1>Game Over</h1><button id="new-game-button">New Game</button>';
      document.body.appendChild(gameOverSection);
      const newGameButton = document.getElementById('new-game-button');
      newGameButton.addEventListener('click', function() {
        resetPetStats(); // Reset pet's stats when starting a new game
        gameOverSection.remove(); // Remove game over section
        startButton.click(); // Click start button to restart the game
      });
    }
  }, 60000);
});

function resetPetStats() {
  pet_info = {name: generatePetName(), hunger: 50, happiness: 50, health: 90, age: 0};
}



function generatePetName() {
  const names = ['Buddy', 'Charlie', 'Max', 'Lucy', 'Daisy', 'Bailey', 'Rocky', 'Sadie', 'Molly', 'Jack'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

document.addEventListener('DOMContentLoaded', function() {
  checkAndUpdatePetInfoInHtml();
  document.querySelector('.treat-button').addEventListener('click', clickedTreatButton);
  document.querySelector('.play-button').addEventListener('click', clickedPlayButton);
  document.querySelector('.exercise-button').addEventListener('click', clickedExerciseButton);
  document.querySelector('.health-button').addEventListener('click', clickedHealthButton);
});

var pet_info = {name: generatePetName(), hunger: 50, happiness: 50, health: 90, age: 0};



function clickedTreatButton() {
  pet_info.weight = (pet_info.weight * 1 + 1);
  pet_info.hunger = (pet_info.hunger * 1 - 1);
  pet_info.happiness = (pet_info.happiness * 1 + 5);
  checkAndUpdatePetInfoInHtml();
  checkForGameOver();

}

function clickedPlayButton() {
  pet_info.weight = pet_info.weight - 1;
  pet_info.happiness = (pet_info.happiness * 1 + 5);
  pet_info.hunger = (pet_info.hunger * 1 + 5);
  checkAndUpdatePetInfoInHtml();
  checkForGameOver();

}

function clickedExerciseButton() {
  pet_info.weight = pet_info.weight - 2;
  pet_info.happiness = pet_info.happiness - 1;
  pet_info.hunger = (pet_info.hunger * 1 + 5);
  checkAndUpdatePetInfoInHtml();
  checkForGameOver();

}

function clickedHealthButton() {
  pet_info.health = (pet_info.health * 1 + 2);
  checkAndUpdatePetInfoInHtml();
  checkForGameOver();

}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  if (pet_info.hunger > 100 || pet_info.happiness < 0 || pet_info.health < 0) {
    document.querySelector('.name').textContent = '';
    document.querySelector('.weight').textContent = '';
    document.querySelector('.happiness').textContent = '';
    document.querySelector('.health').textContent = '';
    document.querySelector('.age').textContent = '';
    document.querySelector('.hunger').textContent = '';
  } else {
    updatePetInfoInHtml();
  }
}


function checkWeightAndHappinessBeforeUpdating() {
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }

  if (pet_info.health < 0) {
    pet_info.health = 0;
  }
}

// Updates your HTML with the current values in your pet_info dictionary
function updatePetInfoInHtml() {
  document.querySelector('.name').textContent = pet_info['name'];
  document.querySelector('.weight').textContent = pet_info['weight'];
  document.querySelector('.happiness').textContent = pet_info['happiness'];
  document.querySelector('.health').textContent = pet_info['health'];
  document.querySelector('.age').textContent = pet_info['age'];
  document.querySelector('.hunger').textContent = pet_info['hunger'];

}

function checkForGameOver() {
  if (pet_info.hunger > 100 || pet_info.happiness < 0 || pet_info.health < 0 || pet_info.age > 20) {
    const petIcon = document.getElementById('pet-icon');
    const currentAvatarClass = petIcon.classList[1]; // get the current avatar icon class
    const gameOverAvatarClass = currentAvatarClass + '-ko'; // append '-ko' to the current class
    petIcon.classList.remove(currentAvatarClass); // remove the current class
    petIcon.classList.add(gameOverAvatarClass); // add the game over class
    const statsSection = document.querySelector('.stats');
    statsSection.style.display = 'none';
    const gameOverSection = document.querySelector('.game-over');
    gameOverSection.style.display = 'block';
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.style.display = 'none';

  }
}


// Avatar Selection

// Get all avatar images
const avatarImages = document.querySelectorAll('.avatar');

// Loop through each avatar image and add a click event listener
avatarImages.forEach(function(image) {
  image.addEventListener('click', function() {
    // Get the data-avatar attribute value
    const avatarNumber = this.getAttribute('data-avatar');

    // Set the pet's avatar image to the selected image
    const petAvatar = document.getElementById('icon');
    petAvatar.style.backgroundImage = `url(https://example.com/avatar${avatarNumber}.png)`;

    // Hide the avatar selection section
    const avatarSelection = document.getElementById('avatar-selection');
    avatarSelection.style.display = 'none';

    // Show the pet dashboard
    const petDashboard = document.getElementById('pet-dashboard');
    petDashboard.style.display = 'block';
  });
});


/// Adding a new game button in the game page

const startAgainBtn = document.getElementById('again-button');
startAgainBtn.addEventListener('click', () => {
  avatarSelection.style.display = 'block';
  petDashboard.style.display = 'none';

  resetPetStats();
  const statsSection = document.querySelector('.stats');
  statsSection.style.display = 'block';
  const gameOverSection = document.querySelector('.game-over');
  gameOverSection.style.display = 'none';
  const buttonContainer = document.querySelector('.button-container');
  buttonContainer.style.display = 'block';
});

// Declare a variable to store the pet's name
let petName;

function generatePetName() {
  // Check if the pet's name has already been set
  if (!petName) {
    const names = ['Buddy', 'Charlie', 'Max', 'Lucy', 'Daisy', 'Bailey', 'Rocky', 'Sadie', 'Molly', 'Jack'];
    const randomIndex = Math.floor(Math.random() * names.length);
    // Set the pet's name to a randomly generated name
    petName = names[randomIndex];
  }
  // Return the pet's name
  return petName;
}

function resetPetStats() {
  // Only generate a new name if the pet's name has not been set yet
  if (!petName) {
    petName = generatePetName();
  }
  pet_info = {name: petName, hunger: 50, happiness: 50, health: 90, age: 0};
}
