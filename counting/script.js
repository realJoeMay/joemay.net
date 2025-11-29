const body = document.body;
const pageSelect = document.querySelector('.select-page');
const progressBar = document.querySelector('.progress-bar-done');

const maxBaseInput = document.getElementById('max-base');
const maxOffsetInput = document.getElementById('max-offset');
const start20Button = document.getElementById('start-20-btn');
const start40Button = document.getElementById('start-40-btn');
const start60Button = document.getElementById('start-60-btn');
const start80Button = document.getElementById('start-80-btn');
const start100Button = document.getElementById('start-100-btn');
const startAllButton = document.getElementById('start-all-btn');
const startErrorMessage = document.querySelector('.start-error-message');

const problemPrompt = document.querySelector('.problem-card .prompt');
const answerDisplay = document.querySelector('.answer-text');
const numberButtons = document.querySelectorAll('.number-btn');
const clearButton = document.getElementById('clear-btn');

const retryButton = document.getElementById('retry-btn');

// -------------------
// Utility functions
// -------------------

function loadPage(page) {
    body.classList.remove('active-page-select', 'active-page-quiz', 'active-page-congrats');
    body.classList.add(`active-page-${page}`);

    if (page === 'select') {
        progressBar.style.width = 0;
    } 
    // else if (page === 'congrats') {
    //     updateStats();
    // }
}

function isValidProblem(base, offset, max_base) {
    if (base + offset <= 0) {
        return false;
    }
    if (base + offset > max_base) {
        return false;
    }
    return true

}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function countSelectedProblems() {
    return document.querySelectorAll('#problem-select-table .selected').length;
}

function updateStartButtons() {
    const count = countSelectedProblems();
    startAllButton.innerHTML = `Start all ${count}<br>questions`;

    start20Button.style.display = 'none';
    if (count > 20) start20Button.style.display = '';

    start40Button.style.display = 'none';
    if (count > 40) start40Button.style.display = '';

    start60Button.style.display = 'none';
    if (count > 60) start60Button.style.display = '';

    start80Button.style.display = 'none';
    if (count > 80) start80Button.style.display = '';

    start100Button.style.display = 'none';
    if (count > 100) start100Button.style.display = '';
}
    

// -------------------
// Table generation
// -------------------

function generateTable() {
    const table = document.getElementById('problem-select-table');
    table.innerHTML = '';
    const tbody = document.createElement('tbody');
    const tableCells = [];

    const max_base = parseInt(maxBaseInput.value, 10);
    const max_offset = parseInt(maxOffsetInput.value, 10);

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const cornerCell = document.createElement('th');
    cornerCell.className = 'header-cell';
    headerRow.appendChild(cornerCell);

    for (let col = 0; col < 2 * max_offset; col++) {
        let offset = col - max_offset;
        if (offset >= 0) offset += 1; 

        const th = document.createElement('th');
        th.textContent = offset;
        th.textContent = offset.toString();
        if (offset>0) {
            th.textContent = '+' + offset.toString();
        }

        th.className = 'header-cell';
        th.addEventListener('click', function () {
            const columnCells = tableCells[col];
            const allSelected = columnCells.every(cell => cell.classList.contains('selected'));
            columnCells.forEach(cell => {
                cell.classList.toggle('selected', !allSelected);
            });
            updateStartButtons();
        });        
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);


    // for each row
    for (let base = 1; base <= max_base; base++) {
        const tr = document.createElement('tr');
        const rowCells = [];
        const th = document.createElement('th');
        th.textContent = base;
        th.className = 'header-cell';

        th.addEventListener('click', function () {
            const allSelected = rowCells.every(cell => cell.classList.contains('selected'));
            rowCells.forEach(cell => {
                cell.classList.toggle('selected', !allSelected);
            });
            updateStartButtons();
        });
        tr.appendChild(th);

        // for each column
        for (let col = 0; col < 2 * max_offset; col++) {
            let offset = col - max_offset;
            if (offset >= 0) offset += 1; 

            td = generateTableCell(base, offset, max_base);
            tr.appendChild(td);

            if (!tableCells[col]) tableCells[col] = [];
            if (isValidProblem(base, offset, max_base)) {
                rowCells.push(td);
                tableCells[col].push(td);
            }
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    updateStartButtons();
}


function generateTableCell(base, offset, max_base) {
    const td = document.createElement('td');
    
    // check valid answer
    if (!isValidProblem(base, offset, max_base)) {
        return td;
    }

    // set text
    td.textContent = offset.toString();
    if (offset > 0) {
        td.textContent = '+' + offset.toString();
    }

    // set dataset
    td.dataset.base = base;
    td.dataset.offset = offset;
    td.dataset.answer = base + offset;
    if (offset === 1) {
        td.dataset.prompt = `What number is after ${base}?`;
    } else if (offset > 0) {
        td.dataset.prompt = `What number is ${offset} after ${base}?`;
    } else if (offset === -1) {
        td.dataset.prompt = `What number is before ${base}?`;
    } else {
        td.dataset.prompt = `What number is ${-offset} before ${base}?`;
    }

    td.classList.add('problem', 'selected');
    td.addEventListener('click', function () {
        this.classList.toggle('selected');
        updateStartButtons();
    });
    return td
}


// -------------------
// Quiz Logic
// -------------------

function startQuiz(problemCount) {

    // load selected questions
    questions = [];
    const selectedCells = pageSelect.querySelectorAll('td.selected');
    selectedCells.forEach(cell => {
        questions.push({
            prompt: cell.dataset.prompt,
            answer: cell.dataset.answer
        });
    });

    if (questions.length === 0) {
        startErrorMessage.textContent = 'Nice Try!';
        return;
    }
    startErrorMessage.textContent = '';

    shuffle(questions);
    if (problemCount && problemCount > 0) {
        questions = questions.slice(0, problemCount);
    }

    // setup quiz
    currentQuestionIndex = 0;
    currentAnswer = '';
    isFeedbackVisible = false;
    document.querySelector('.progress-den').textContent = questions.length;
    loadPage('quiz');
    loadQuestion()
}


function loadQuestion() {
    const question = questions[currentQuestionIndex];
    problemPrompt.innerHTML = question.prompt;
    currentAnswer = '';
    answerDisplay.textContent = '';
    document.querySelector('.progress-num').textContent = currentQuestionIndex + 1;
}


function checkAnswer() {
    if (isFeedbackVisible) return;

    const correctAnswer = questions[currentQuestionIndex].answer;
    if (currentAnswer === correctAnswer) {
        answerCorrect();
    } else if (currentAnswer.length === correctAnswer.length) {
        answerIncorrect();
    }
}

function answerCorrect() {
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
}

function answerIncorrect() {
    questions[currentQuestionIndex].mistake = 1;
    answerDisplay.style.color = "red";
    isFeedbackVisible = true;
    setTimeout(() => {
        answerDisplay.style.color = "black";
        currentAnswer = '';
        answerDisplay.textContent = '';
        isFeedbackVisible = false;
    }, 1000);

}

function updateProgress() {
    const percentDone = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${percentDone}%`;
}


// -------------------
// Event bindings
// -------------------

maxBaseInput.addEventListener('click', () => {
    generateTable()
});

maxOffsetInput.addEventListener('click', () => {
    generateTable()
});

start20Button.addEventListener('click', () => {
    startQuiz(20);
});

start40Button.addEventListener('click', () => {
    startQuiz(40);
});

start60Button.addEventListener('click', () => {
    startQuiz(60);
});

start80Button.addEventListener('click', () => {
    startQuiz(80);
});

start100Button.addEventListener('click', () => {
    startQuiz(100);
});

startAllButton.addEventListener('click', () => {
    startQuiz(countSelectedProblems());
});

retryButton.addEventListener('click', () => {
    loadPage('select');
});


// Number buttons
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


// number keyboard support
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
    } 
});



// Initialize
loadPage('select');
maxBaseInput.value = 20;
maxOffsetInput.value = 1;
generateTable();