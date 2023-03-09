// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import "bootstrap"



const startButton = document.getElementById('start-button');
const avatarSelection = document.getElementById('avatar-selection');
const petDashboard = document.getElementById('pet-dashboard');
const petIcon = document.getElementById('pet-icon'); // select the pet icon element by id
let isGameOver = false;

// initialize the pet_info object
var pet_info = {name: generatePetName(), hunger: 50, happiness: 50, health: 50, age: 0};

// click event handlers
document.querySelector('.treat-button').addEventListener('click', clickedTreatButton);
document.querySelector('.play-button').addEventListener('click', clickedPlayButton);
document.querySelector('.exercise-button').addEventListener('click', clickedExerciseButton);
document.querySelector('.health-button').addEventListener('click', clickedHealthButton);

// check and update pet information
checkAndUpdatePetInfoInHtml();

function clickedTreatButton() {
  pet_info.hunger = (pet_info.hunger * 1 - 6);
  pet_info.happiness = (pet_info.happiness * 1 + 4);
  checkAndUpdatePetInfoInHtml();
}

function clickedPlayButton() {
  pet_info.hunger = pet_info.hunger + 6;
  pet_info.happiness = (pet_info.happiness * 1 + 4);
  checkAndUpdatePetInfoInHtml();
}

function clickedExerciseButton() {
  pet_info.hunger = pet_info.hunger + 6;
  pet_info.happiness = pet_info.happiness - 5;
  pet_info.health = pet_info.health + 3;
  checkAndUpdatePetInfoInHtml();
}

function clickedHealthButton() {
  pet_info.health = (pet_info.health * 1 + 2);
  pet_info.happiness = pet_info.happiness - 5;
  checkAndUpdatePetInfoInHtml();
}

function shouldPetDie() {
  if (pet_info.age < 10) {
    return false;
  }

  const baseProbability = (pet_info.age - 10) / 50;
  const modifier = (pet_info.hunger + (100 - pet_info.health) + (100 - pet_info.happiness)) / 300;
  const probability = baseProbability + modifier;

  return Math.random() < probability;
}




function checkAndUpdatePetInfoInHtml() {
  checkHungerAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
  checkForGameOver();
}

function checkForGameOver() {
  if (pet_info.hunger > 100 || pet_info.happiness < 0 || pet_info.health < 0 || pet_info.age > 20 || shouldPetDie()) {
    isGameOver = true;
    const petIcon = document.getElementById('pet-icon');
    const currentAvatarClass = petIcon.classList[1]; // get the current avatar icon class
    const gameOverAvatarClass = currentAvatarClass + '-ko'; // append '-ko' to the current class
    petIcon.classList.add(gameOverAvatarClass); // add the game over class
    const statsSection = document.querySelector('.stats');
    statsSection.style.display = 'none';
    let gameOverMessage;
    if (pet_info.hunger >= 100) {
      gameOverMessage = 'Game Over! Your pet died of hunger.' }
    else if (pet_info.happiness <= 0) {
      gameOverMessage = 'Game Over! Your pet died of sadness.'}
    else if (pet_info.health <= 0) {
      gameOverMessage = 'Game Over! Your pet died of poor health.'}
    else if (pet_info.age >= 30) {
      gameOverMessage = 'Well Done! Your pet has lived a long and happy life. But it is still over.' }
    else {
      gameOverMessage = 'Game Over! Your did not take good care of your senior pet, so he passed away earlier.' }
    const gameOverSection = document.querySelector('.game-over');
    gameOverSection.style.display = 'block';
    gameOverSection.textContent = gameOverMessage;
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.style.display = 'none';
  }
}


function checkHungerAndHappinessBeforeUpdating() {
  if (pet_info.hunger <= 0) {
    pet_info.hunger = 0;
  }
  if (pet_info.happiness > 100) {
    pet_info.happiness = 100;
  }
  if (pet_info.health > 100) {
    pet_info.health = 100;
  }
}


// update HTML with pet information
function updatePetInfoInHtml() {
  document.querySelector('.name').textContent = pet_info['name'];
  document.querySelector('.hunger').textContent = pet_info['hunger'];
  document.querySelector('.happiness').textContent = pet_info['happiness'];
  document.querySelector('.health').textContent = pet_info['health'];
  document.querySelector('.age').textContent = pet_info['age'];
  updatePetHearts();
}

function updatePetHearts() {
  const hearts = document.querySelectorAll('.fa-heart');
  const hunger = pet_info.hunger;
  const health = pet_info.health;
  const happiness = pet_info.happiness;

  hearts.forEach((heart) => {
    heart.style.display = 'none';
  });

  if (hunger <= 70 && health >= 30 && happiness >= 30) {
    document.querySelector('.happy-1').style.display = 'block';
    document.querySelector('.happy-2').style.display = 'block';
    document.querySelector('.happy-3').style.display = 'block';
  } else if ((hunger > 70 && health >= 30 && happiness >= 30) || (hunger <= 70 && health < 30 && happiness >= 30) || (hunger <= 70 && health >= 30 && happiness < 30)) {
    document.querySelector('.happy-1').style.display = 'block';
    document.querySelector('.happy-2').style.display = 'block';
    document.querySelector('.sad-3').style.display = 'block';
  } else if ((hunger > 70 && health < 30 && happiness >= 30) || (hunger > 70 && health >= 30 && happiness < 30) || (hunger <= 70 && health < 30 && happiness < 30)) {
    document.querySelector('.happy-1').style.display = 'block';
    document.querySelector('.sad-2').style.display = 'block';
    document.querySelector('.sad-3').style.display = 'block';

  }   else if (hunger > 70 && health < 30 && happiness < 30) {
    document.querySelector('.sad-1').style.display = 'block';
    document.querySelector('.sad-2').style.display = 'block';
    document.querySelector('.sad-3').style.display = 'block';

  }


}




// generate a random pet name
function generatePetName() {
  const names = ['Buddy', 'Charlie', 'Max', 'Lucy', 'Daisy', 'Bailey', 'Rocky', 'Sadie', 'Molly', 'Jack'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

// update pet information every 5 seconds
setInterval(function() {
  pet_info.age += 1;
  pet_info.hunger += 7;
  pet_info.health -= 10;
  pet_info.happiness -=8;
  checkForGameOver();
  if (isGameOver === false) {
    updatePetInfoInHtml();
  }
}, 5000);





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

});







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

  const gameOverSection = document.querySelector('.game-over');
  gameOverSection.style.display = 'none';
  pet_info = { name: generatePetName(), hunger: 50, happiness: 50, health: 50, age: 0 };
  updatePetInfoInHtml();
  const statsSection = document.querySelector('.stats');
  statsSection.style.display = 'block';
  const gameButtons = document.querySelector('.button-container');
  gameButtons.style.display = 'block';
});
