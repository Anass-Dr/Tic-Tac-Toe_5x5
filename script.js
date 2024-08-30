"use strict";

// Global variables
let role = 0;
let nbOfMovements = 0;
let movements = Array.from({ length: 20 }, () => Array(20).fill(null));
const results = JSON.parse(localStorage.getItem("results")) || [0, 0, 0];
const board = document.getElementById("board");
const roleSpan = document.querySelector("#role span");
const playersResultsSpans = document.querySelectorAll(".players-results");

updateInterface();

// Fill the board with 20x20 divs
Array(400)
  .fill(0)
  .map((_, i) =>
    board.insertAdjacentHTML(
      "beforeend",
      `<div class="board__div" data-index=${i} data-empty=true>
        <i class="fa-solid fa-xmark hidden"></i>
        <i class="fa-regular fa-circle hidden"></i>
      </div>
    `
    )
  );

board.addEventListener("click", (e) => {
  if (
    e.target.dataset.empty === "false" ||
    !e.target.classList.contains("board__div")
  )
    return;

  e.target.dataset.empty = "true";
  nbOfMovements++;
  e.target.querySelectorAll("i")[role].classList.remove("hidden");
  updateResults(e.target.dataset.index);

  // Check for Win or Draw
  if (checkWin(e.target.dataset.index)) {
    results[role]++;
    localStorage.setItem("results", JSON.stringify(results));
    resetBoard();
  } else if (nbOfMovements == 400) {
    results[2]++;
    localStorage.setItem("results", JSON.stringify(results));
    resetBoard();
  }

  role = role === 0 ? 1 : 0;
  updateInterface();
});

// Functions :
function updateResults(i) {
  const pos = Math.floor(i / 20);
  movements[pos][i - pos * 20] = role;
}

function updateInterface() {
  roleSpan.textContent = "Player " + (role + 1);
  playersResultsSpans.forEach((el, i) => (el.textContent = results[i]));
}

function resetBoard() {
  nbOfMovements = 0;
  movements = Array.from({ length: 20 }, () => Array(20).fill(null));
  document
    .querySelectorAll(".board__div i")
    .forEach((el) => el.classList.add("hidden"));
}

function checkWin(i) {
  const rowNb = Math.floor(i / 20);
  const arrayIndex = i - rowNb * 20;

  // Check horizontal
  if (findMatch(movements[rowNb]) === 5) return true;

  // Check vertical
  const verticalItems = movements.map((row) => row[arrayIndex]);
  if (findMatch(verticalItems) === 5) return true;

  // Check right angle
  const rightAngleItems = [movements[rowNb][arrayIndex]];
  let currRow = rowNb + 1;
  for (let x = arrayIndex - 1; x >= 0; x--) {
    if (currRow > 19) break;
    rightAngleItems.unshift(movements[currRow][x]);
    currRow++;
  }
  currRow = rowNb - 1;
  for (let x = arrayIndex + 1; x < 20; x++) {
    if (currRow < 0) break;
    rightAngleItems.push(movements[currRow][x]);
    currRow--;
  }
  if (findMatch(rightAngleItems) === 5) return true;

  // Check left angle
  const leftAngleItems = [movements[rowNb][arrayIndex]];
  currRow = rowNb + 1;
  for (let x = arrayIndex + 1; x < 20; x++) {
    if (currRow > 19) break;
    leftAngleItems.push(movements[currRow][x]);
    currRow++;
  }
  currRow = rowNb - 1;
  for (let x = arrayIndex - 1; x > 0; x--) {
    if (currRow < 0) break;
    leftAngleItems.unshift(movements[currRow][x]);
    currRow--;
  }
  if (findMatch(leftAngleItems) === 5) return true;

  return false;
}

const findMatch = (arr) => {
  let count = 0;
  for (let j = 0; j < 20; j++) {
    if (j + 4 === 20 || count === 5) break;
    for (let x = j; x < j + 5; x++) {
      if (arr[x] === role) {
        count++;
      } else {
        count = 0;
        break;
      }
    }
  }
  return count;
};
