let questions = [];
let currentQuestionIndex = 0;
let currentAnswer = '';
let isFeedbackVisible = false;

const body = document.body;
const pageSelect = document.querySelector('.select-page');

const startAdditionButton = document.getElementById('start-addition-btn');
const startSubtractionButton = document.getElementById('start-subtraction-btn');
const startMultiplicationButton = document.getElementById('start-multiplication-btn');
const startDivisionButton = document.getElementById('start-division-btn');
const startAllButton = document.getElementById('start-all-btn');
const customButton = document.getElementById('custom-btn');
const customTables = document.getElementById('select-custom');
const startCustomButton = document.getElementById('start-custom-btn');
const startCustomError = document.querySelector('.start-custom-error');

const progressBar = document.querySelector('.progress-bar-done');
const number1Element = document.getElementById('number1');
const number2Element = document.getElementById('number2');
const operatorElement = document.querySelector('.operator');
const answerDisplay = document.getElementById('answer-display');
const numberButtons = document.querySelectorAll('.number-btn');
const clearButton = document.getElementById('clear-btn');
const retryButton = document.getElementById('retry-btn');

// -------------------
// SVG icons
// -------------------

const svgIcons = {
    addition: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32
            14.3-32 32l0 144L48 224c-17.7 0-32
            14.3-32 32s14.3 32 32 32l144 0 0
            144c0 17.7 14.3 32 32 32s32-14.3
            32-32l0-144 144 0c17.7 0 32-14.3
            32-32s-14.3-32-32-32l-144 0 0-144z"/>
        </svg>`,
    subtraction: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M432 256c0 17.7-14.3 32-32
            32L48 288c-17.7 0-32-14.3-32-32s14.3-32
            32-32l352 0c17.7 0 32 14.3 32 32z"/>
        </svg>`,
    multiplication: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5
            12.5-32.8 0-45.3s-32.8-12.5-45.3
            0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3
            0s-12.5 32.8 0 45.3L146.7 256 41.4
            361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8
            12.5 45.3 0L192 301.3 297.4 406.6c12.5
            12.5 32.8 12.5 45.3 0s12.5-32.8
            0-45.3L237.3 256 342.6 150.6z"/>
        </svg>`,
    division: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M272 96a48 48 0 1 0 -96
            0 48 48 0 1 0 96 0zm0 320a48 48
            0 1 0 -96 0 48 48 0 1 0 96
            0zM400 288c17.7 0 32-14.3
            32-32s-14.3-32-32-32L48
            224c-17.7 0-32 14.3-32
            32s14.3 32 32 32l352 0z"/>
        </svg>`
};


// -------------------
// Utility functions
// -------------------

function loadPage(page) {
    body.classList.remove('active-page-select', 'active-page-quiz', 'active-page-congrats');
    body.classList.add(`active-page-${page}`);

    if (page === 'select') {
        progressBar.style.width = 0;
    }
}

function selectCells(cells) {
    // const oCells = getOperationCells();
    operationCells().all.forEach(cell => cell.classList.remove('selected'));
    cells.forEach(cell => cell.classList.add('selected'));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    const percentDone = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${percentDone}%`;
}

function countDigits(num) {
    if (num === 0) return 1;
    return Math.floor(Math.log10(Math.abs(num))) + 1;
}


// -------------------
// Insert operator SVGs into matching elements on load
// -------------------
function injectOperatorIcons() {
    Object.keys(svgIcons).forEach(op => {
        const elements = document.querySelectorAll(`.sign-${op}`);
        elements.forEach(el => {
            el.innerHTML = svgIcons[op];
        });
    });
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', injectOperatorIcons);


// -------------------
// Table generation
// -------------------

function generateTable(tableId, operation) {
    const table = document.getElementById(tableId);
    const tbody = document.createElement('tbody');
    const tableCells = [];
    const max = 10;

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const cornerCell = document.createElement('th');
    cornerCell.className = 'header-cell';
    headerRow.appendChild(cornerCell);

    let start_row = 0;
    if (operation === 'division') start_row = 1;

    for (let i = 0; i <= max; i++) {
        const th = document.createElement('th');
        th.textContent = i;
        th.className = 'header-cell';
        th.addEventListener('click', function () {
            const columnCells = tableCells[i];
            const allSelected = columnCells.every(cell => cell.classList.contains('selected'));
            columnCells.forEach(cell => {
                cell.classList.toggle('selected', !allSelected);
            });
        });
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    for (let row = start_row; row <= max; row++) {
        const tr = document.createElement('tr');
        const rowCells = [];
        const th = document.createElement('th');
        th.textContent = row;
        th.className = 'header-cell';
        th.addEventListener('click', function () {
            const allSelected = rowCells.every(cell => cell.classList.contains('selected'));
            rowCells.forEach(cell => {
                cell.classList.toggle('selected', !allSelected);
            });
        });
        tr.appendChild(th);

        for (let col = 0; col <= max; col++) {
            const td = document.createElement('td');
            td.className = 'selected';

            if (operation === 'addition') {
                td.dataset.n1 = row;
                td.dataset.n2 = col;
                td.dataset.answer = row + col;
                td.dataset.operation = 'addition';
                // td.dataset.display = `${row} + ${col} = ${row + col}`;
                td.textContent = row + col;
            } else if (operation === 'subtraction') {
                td.dataset.n1 = row + col;
                td.dataset.n2 = row;
                td.dataset.answer = col;
                td.dataset.operation = 'subtraction';
                // td.dataset.display = `${row + col} - ${row} = ${col}`;
                td.textContent = row + col;
            } else if (operation === 'multiplication') {
                td.dataset.n1 = row;
                td.dataset.n2 = col;
                td.dataset.answer = row * col;
                td.dataset.operation = 'multiplication';
                // td.dataset.display = `${row} x ${col} = ${row * col}`;
                td.textContent = row * col;
            } else if (operation === 'division') {
                td.dataset.n1 = row * col;
                td.dataset.n2 = row;
                td.dataset.answer = col;
                td.dataset.operation = 'division';
                // td.dataset.display = `${row * col} / ${row} = ${col}`;
                td.textContent = row * col;
            }

            td.dataset.digits = countDigits(td.dataset.answer);
            td.addEventListener('click', function () {
                this.classList.toggle('selected');
            });

            tr.appendChild(td);
            rowCells.push(td);
            if (!tableCells[col]) tableCells[col] = [];
            tableCells[col].push(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    // Add event listener for table title
    const title = document.querySelector(`#${tableId.replace('table', 'title')}`);
    title.addEventListener('click', function () {
        const allCells = table.querySelectorAll('td');
        const allSelected = Array.from(allCells).every(cell => cell.classList.contains('selected'));
        allCells.forEach(cell => {
            cell.classList.toggle('selected', !allSelected);
        });
    });
}


// -------------------
// Quiz logic
// -------------------

function startQuiz() {
    questions = [];
    const selectedCells = pageSelect.querySelectorAll('td.selected');
    selectedCells.forEach(cell => {
        questions.push({
            num1: cell.dataset.n1,
            num2: cell.dataset.n2,
            answer: cell.dataset.answer,
            operation: cell.dataset.operation,
            digits: cell.dataset.digits
        });
    });

    if (questions.length === 0) {
        startCustomError.textContent = 'Nice Try!';
        return;
    }
    startCustomError.textContent = '';

    shuffle(questions);

    currentQuestionIndex = 0;
    currentAnswer = '';
    isFeedbackVisible = false;

    customTables.style.display = 'none';
    loadPage('quiz');

    document.querySelector('.progress-den').textContent = questions.length;
    loadQuestion();
}

function operationCells() {
    const addition = document.querySelectorAll('#addition-table td');
    const subtraction = document.querySelectorAll('#subtraction-table td');
    const multiplication = document.querySelectorAll('#multiplication-table td');
    const division = document.querySelectorAll('#division-table td');
    const all = [
        ...addition,
        ...subtraction,
        ...multiplication,
        ...division
    ];
    return { addition, subtraction, multiplication, division, all };
}


function startDemo() {
    selectCells([]); // clear selections

    const cells = operationCells();

    const getRandomCell = nodelist => {
        const arr = Array.from(nodelist);
        return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
    };

    const chosenCells = [
        getRandomCell(cells.addition),
        getRandomCell(cells.subtraction),
        getRandomCell(cells.multiplication),
        getRandomCell(cells.division)
    ].filter(Boolean);

    chosenCells.forEach(cell => cell.classList.add('selected'));

    if (chosenCells.length > 0) {
        startQuiz();
    } else {
        console.warn("No cells available for demo");
    }
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    number1Element.textContent = question.num1;
    number2Element.textContent = question.num2;
    answerDisplay.style.width = question.digits * 5 + 'rem';
    currentAnswer = '';
    answerDisplay.textContent = '';
    document.querySelector('.progress-num').textContent = currentQuestionIndex + 1;
    operatorElement.innerHTML = svgIcons[question.operation];
}

function checkAnswer() {
    if (isFeedbackVisible) return;

    const correctAnswer = questions[currentQuestionIndex].answer;
    if (currentAnswer === correctAnswer) {
        answerDisplay.style.color = "green";
        isFeedbackVisible = true;

        currentQuestionIndex++;
        updateProgress();

        setTimeout(() => {
            answerDisplay.style.color = "black";
            isFeedbackVisible = false;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                loadPage('congrats');
            }
        }, 1000);

    } else if (currentAnswer.length === correctAnswer.length) {
        answerDisplay.style.color = "red";
        isFeedbackVisible = true;
        setTimeout(() => {
            answerDisplay.style.color = "black";
            currentAnswer = '';
            answerDisplay.textContent = '';
            isFeedbackVisible = false;
        }, 1000);
    }
}

// -------------------
// Event bindings
// -------------------

startAdditionButton.addEventListener('click', () => {
    selectCells(operationCells().addition);
    startQuiz();
});

startSubtractionButton.addEventListener('click', () => {
    selectCells(operationCells().subtraction);
    startQuiz();
});

startMultiplicationButton.addEventListener('click', () => {
    selectCells(operationCells().multiplication);
    startQuiz();
});

startDivisionButton.addEventListener('click', () => {
    selectCells(operationCells().division);
    startQuiz();
});

startAllButton.addEventListener('click', () => {
    operationCells().all.forEach(cell => cell.classList.add('selected'));
    startQuiz();
});

customButton.addEventListener('click', () => {
    selectCells([]);
    customTables.style.display = 'flex';
});

startCustomButton.addEventListener('click', startQuiz);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isFeedbackVisible) return;

        if (currentAnswer === '0') currentAnswer = '';
        currentAnswer += button.getAttribute('data-number');
        answerDisplay.textContent = currentAnswer;
        checkAnswer();
    });
});

clearButton.addEventListener('click', () => {
    if (isFeedbackVisible) return;
    currentAnswer = '';
    answerDisplay.textContent = '';
});

retryButton.addEventListener('click', () => {
    loadPage('select');
});

// start demo from touchscreen long press
let pressTimer;
document.addEventListener('touchstart', () => {
    if (!document.body.classList.contains('active-page-select')) return;
    pressTimer = setTimeout(() => {
        startDemo();
    }, 1500);
});
document.addEventListener('touchend', () => clearTimeout(pressTimer));

// keyboard support
document.addEventListener('keydown', (event) => {
    if (isFeedbackVisible) return;

    if (event.key >= '0' && event.key <= '9') {
        if (currentAnswer === '0') currentAnswer = '';
        currentAnswer += event.key;
        answerDisplay.textContent = currentAnswer;
        checkAnswer();
    } else if (event.key === 'Backspace') {
        currentAnswer = '';
        answerDisplay.textContent = '';
    } else if (event.key.toLowerCase() === 'd' && document.body.classList.contains('active-page-select')) {
        startDemo();
    }
});

// Initialize  page
loadPage('select');
generateTable('addition-table', 'addition');
generateTable('subtraction-table', 'subtraction');
generateTable('multiplication-table', 'multiplication');
generateTable('division-table', 'division');
