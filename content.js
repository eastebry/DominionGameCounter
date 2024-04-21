
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
            console.log("Found Button")
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
  console.log(gameHistory);
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

  // add current timestamp to game history
  gameHistory.push(Date.now());

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