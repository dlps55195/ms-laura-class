// =====================================================
// Ms. Laura's 2nd Grade — wordsearch.js
// Interactive Word Search Game 🍎
// =====================================================

// =====================================================
// 🍎 TEACHER CUSTOMIZATION ZONE
//    Edit the words in WORD_BANK below!
//    Each inner array is a "theme" of words.
//    The game picks 8 random words for each puzzle.
//    Words must be ALL CAPS and have NO spaces.
// =====================================================
const WORD_BANK = [
  // School & classroom words
  "APPLE", "PENCIL", "BOOK", "CLASS", "LEARN",
  "SMART", "HAPPY", "LUNCH", "CHAIR", "DESK",
  // Animals
  "CAT", "DOG", "BIRD", "FISH", "FROG",
  "BEAR", "DUCK", "LION", "WOLF", "DEER",
  // Colors
  "RED", "BLUE", "GREEN", "PINK", "GOLD",
  // Nature
  "SUN", "MOON", "STAR", "RAIN", "TREE",
  "LEAF", "FLOWER", "CLOUD", "SNOW", "WIND",
  // Fun words
  "FUN", "PLAY", "JUMP", "RUN", "SING",
  "DANCE", "SMILE", "LAUGH", "DREAM", "MAGIC"
];

// =====================================================
// GAME SETTINGS — feel free to adjust!
// =====================================================
const GRID_SIZE  = 12;   // grid is 12×12
const NUM_WORDS  = 8;    // words shown per puzzle
const DIRECTIONS = [
  [ 0,  1],  // →  right
  [ 1,  0],  // ↓  down
  [ 1,  1],  // ↘  diagonal down-right
  [ 0, -1],  // ←  left
  [-1,  0],  // ↑  up
  [-1, -1],  // ↖  diagonal up-left
  [ 1, -1],  // ↙  diagonal down-left
  [-1,  1],  // ↗  diagonal up-right
];

// =====================================================
// GAME STATE
// =====================================================
let grid        = [];          // 2D array of letters
let words       = [];          // words in this puzzle
let wordCells   = {};          // word → [{r,c}, …] positions
let foundWords  = new Set();   // words player has found
let startCell   = null;        // first cell clicked {r, c}

// =====================================================
// PUZZLE GENERATION
// =====================================================

/** Fill grid with empty strings */
function initGrid() {
  grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''));
}

/** Pick NUM_WORDS random unique words from the bank */
function pickWords() {
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
  // Pick only words that can fit in the grid
  return shuffled.filter(w => w.length <= GRID_SIZE).slice(0, NUM_WORDS);
}

/** Try to place a single word randomly in the grid. Returns true on success. */
function placeWord(word) {
  const dirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

  for (let attempt = 0; attempt < 200; attempt++) {
    const [dr, dc] = dirs[attempt % dirs.length];
    const r = Math.floor(Math.random() * GRID_SIZE);
    const c = Math.floor(Math.random() * GRID_SIZE);
    const cells = [];
    let fits = true;

    for (let i = 0; i < word.length; i++) {
      const nr = r + dr * i;
      const nc = c + dc * i;
      if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) {
        fits = false;
        break;
      }
      // Cell must be empty OR already have this letter (overlap is fine!)
      if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) {
        fits = false;
        break;
      }
      cells.push({ r: nr, c: nc });
    }

    if (fits) {
      cells.forEach(({ r, c }, i) => { grid[r][c] = word[i]; });
      wordCells[word] = cells;
      return true;
    }
  }
  return false; // couldn't place this word
}

/** Fill any remaining empty cells with random capital letters */
function fillRandom() {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alpha[Math.floor(Math.random() * alpha.length)];
      }
    }
  }
}

/** Generate a brand new puzzle */
function generatePuzzle() {
  foundWords = new Set();
  wordCells  = {};
  startCell  = null;

  // Try up to 30 times to place all words
  let success = false;
  for (let attempt = 0; attempt < 30 && !success; attempt++) {
    words = pickWords();
    initGrid();
    success = words.every(w => placeWord(w));
  }
  fillRandom();
}

// =====================================================
// RENDERING
// =====================================================

/** Build the letter grid in the DOM */
function renderGrid() {
  const gridEl = document.getElementById('ws-grid');
  gridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, auto)`;
  gridEl.innerHTML = '';

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement('div');
      cell.classList.add('ws-cell');
      cell.textContent = grid[r][c];
      cell.dataset.r = r;
      cell.dataset.c = c;

      // Restore "found" highlighting if this cell belongs to a found word
      if (isCellFound(r, c)) cell.classList.add('found');

      cell.addEventListener('click', () => onCellClick(r, c));
      gridEl.appendChild(cell);
    }
  }
}

/** Build the word list in the sidebar */
function renderWordList() {
  const listEl = document.getElementById('word-list');
  listEl.innerHTML = '';
  words.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    li.id = `word-${word}`;
    if (foundWords.has(word)) li.classList.add('found');
    listEl.appendChild(li);
  });
  updateScore();
}

/** Update the "Found X / Y" counter */
function updateScore() {
  const el = document.getElementById('score-display');
  if (el) el.textContent = `Found: ${foundWords.size} / ${words.length}`;
}

// =====================================================
// INTERACTION
// =====================================================

/** Returns true if any found word occupies cell (r, c) */
function isCellFound(r, c) {
  return [...foundWords].some(w =>
    wordCells[w]?.some(pos => pos.r === r && pos.c === c)
  );
}

/** Given two clicked cells, return all cells in the straight/diagonal line between them */
function getCellsBetween(r1, c1, r2, c2) {
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  const lenR = Math.abs(r2 - r1);
  const lenC = Math.abs(c2 - c1);

  // Must be horizontal, vertical, or true diagonal
  if (r1 !== r2 && c1 !== c2 && lenR !== lenC) return [];

  const len = Math.max(lenR, lenC);
  const cells = [];
  for (let i = 0; i <= len; i++) {
    cells.push({ r: r1 + dr * i, c: c1 + dc * i });
  }
  return cells;
}

/** Check if two cell arrays are identical */
function cellsMatch(a, b) {
  if (a.length !== b.length) return false;
  return a.every((cell, i) => cell.r === b[i].r && cell.c === b[i].c);
}

/** Get the DOM element for a cell at (r, c) */
function getCellEl(r, c) {
  return document.querySelector(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
}

/** Remove start/selected highlights (keeps "found" green cells intact) */
function clearHighlights() {
  document.querySelectorAll('.ws-cell.start').forEach(el => el.classList.remove('start'));
}

/** Called when a player clicks a cell */
function onCellClick(r, c) {
  const status = document.getElementById('ws-status');

  // Don't allow clicking on already-found cells
  if (isCellFound(r, c)) return;

  // — — — FIRST CLICK: set the starting cell — — —
  if (startCell === null) {
    startCell = { r, c };
    clearHighlights();
    const el = getCellEl(r, c);
    if (el) el.classList.add('start');
    status.textContent = '👆 Now click the last letter!';
    return;
  }

  // — — — CLICKED THE SAME CELL AGAIN: cancel — — —
  if (startCell.r === r && startCell.c === c) {
    startCell = null;
    clearHighlights();
    status.textContent = '🔍 Click the first letter of a word!';
    return;
  }

  // — — — SECOND CLICK: check if selection matches a word — — —
  const selected = getCellsBetween(startCell.r, startCell.c, r, c);

  if (selected.length === 0) {
    // Not a valid straight line
    status.textContent = '↗️ Pick letters in a straight line!';
    startCell = null;
    clearHighlights();
    return;
  }

  // Check each unfound word
  let matched = null;
  for (const word of words) {
    if (foundWords.has(word)) continue;
    const positions = wordCells[word];
    if (!positions) continue;
    // Forward or backward match
    if (cellsMatch(selected, positions) || cellsMatch([...selected].reverse(), positions)) {
      matched = word;
      break;
    }
  }

  if (matched) {
    // ✅ Correct word found!
    foundWords.add(matched);
    status.textContent = `🎉 You found "${matched}"! Great job!`;

    // Highlight cells green
    wordCells[matched].forEach(({ r, c }) => {
      const el = getCellEl(r, c);
      if (el) {
        el.classList.remove('start');
        el.classList.add('found');
      }
    });

    // Strike through in word list
    const li = document.getElementById(`word-${matched}`);
    if (li) li.classList.add('found');

    updateScore();

    // Check for win!
    if (foundWords.size === words.length) {
      setTimeout(() => {
        status.textContent = '🌟⭐ WOW! You found ALL the words! Amazing! 🍎🎉';
      }, 400);
    }

  } else {
    // ❌ Not a match
    status.textContent = '❌ Not a word there — try again!';
  }

  startCell = null;
  clearHighlights();
}

// =====================================================
// NEW PUZZLE
// =====================================================
function newPuzzle() {
  generatePuzzle();
  renderGrid();
  renderWordList();
  document.getElementById('ws-status').textContent =
    '🔍 Click the first letter of a word to start!';
}

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('new-puzzle-btn');
  if (btn) btn.addEventListener('click', newPuzzle);
  newPuzzle();
});
