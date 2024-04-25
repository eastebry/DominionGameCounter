
let GAME_LIMIT = 2;
const DAY_IN_MS = 86400000; // number of milliseconds in a day


function updateButtons() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        for (let node of addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const buttons = node.querySelectorAll('.automatch-button');
            for (let button of buttons) {
              if (hitGameLimit()) {
                button.remove()
              }
              else {
                let games = checkGames()
                button.innerText = `Play Game(${games}/${GAME_LIMIT})`;
              }
            }
          }
        }
      }
    }
  });

  observer.observe(targetNode, config);
}

function hitGameLimit() {
  // load game history from local storage
  let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
  // count the number of timestamps in the game history that represent times within the last day
  const now = Date.now();
  let count = 0;
  for (let timestamp of gameHistory) {
    if (now - timestamp < DAY_IN_MS) {
      count++;
    }
  }

  return count >= GAME_LIMIT;
}

function countGame() {
  // load game history from local storage
  let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

// Get today's date at 12:00:00 AM, converted to a unix timestamp
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  // add current timestamp to game history
  gameHistory.push(todayTimestamp);

  // remove elements from front of game history until it is no longer than GAME_LIMIT
  while (gameHistory.length > GAME_LIMIT) {
    gameHistory.shift();
  }

  // save game history back to local storage
  localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

function checkGames() {
  // load game history from local storage
  let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

  // count the number of timestamps in the game history that represent times within the last day
  const now = Date.now();
  let count = 0;
  for (let timestamp of gameHistory) {
    if (now - timestamp < DAY_IN_MS) {
      count++;
    }
  }

  return count;
}

window.addEventListener('load', () => {
  updateButtons();
  window.addEventListener('click', event => {
    if (event.target.classList.contains('automatch-button')) {
      countGame();
    }
  });

});