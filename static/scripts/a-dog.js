var num1;
var num2;
var score = 0;

var maxScore;
var minTimePerQuestion;
var maxQuestionsPerMin;

var startTime;

function displayMaxScore() {
    document.getElementById('max-score').innerHTML = maxScore;
}

function displayMinTimePerQuestion() {
    document.getElementById('min-time-per-question').innerHTML = minTimePerQuestion.toFixed(2);
}

function displayMaxQuestionsPerMin() {
    document.getElementById('max-questions-per-min').innerHTML = maxQuestionsPerMin.toFixed(2);
}

function getNextQuestion() {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 12) + 1;
    var question = `What is ${num1} x ${num2}?`;
    return question;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function processAnswer() {

    var userAnswer = document.getElementById('answer-input').value;
    var correctAnswer = num1 * num2;

    var outcomeElement = document.getElementById('outcome');
    
    if (parseInt(userAnswer) === correctAnswer) {

        outcomeElement.innerHTML = 'Correct!';
        outcomeElement.style.color = 'green';
        score++;

        var currentTime = new Date().getTime();
        var totalTime = (currentTime - startTime) / 1000; // time taken in seconds
        var averageTimePerQuestion = totalTime / score;
        var questionsPerMin = 60 / averageTimePerQuestion;

        document.getElementById('time-per-question').innerHTML = averageTimePerQuestion.toFixed(2);
        document.getElementById('questions-per-min').innerHTML = questionsPerMin.toFixed(2);

        if (score > maxScore) {
            maxScore = score;
            displayMaxScore();
            setCookie('maxScore', maxScore);
        }

        if (averageTimePerQuestion < minTimePerQuestion) {
            minTimePerQuestion = averageTimePerQuestion;
            displayMinTimePerQuestion();
            setCookie('minTimePerQuestion', minTimePerQuestion);
        }

        if (questionsPerMin > maxQuestionsPerMin) {
            maxQuestionsPerMin = questionsPerMin;
            displayMaxQuestionsPerMin();
            setCookie('maxQuestionsPerMin', maxQuestionsPerMin);
        }

    } else {
        outcomeElement.innerHTML = `Incorrect. The correct answer for ${num1} x ${num2} is ${correctAnswer}, but you entered ${userAnswer}.`;
        outcomeElement.style.color = 'red';

        score = 0;
        startTime = new Date().getTime();

        document.getElementById('time-per-question').innerHTML = '';
        document.getElementById('questions-per-min').innerHTML = '';
    }

    document.getElementById('score').innerHTML = score;

    document.getElementById('score-table').style.display = 'table';

    document.getElementById('question').innerHTML = getNextQuestion();
    document.getElementById('answer-input').value = '';

    document.getElementById('answer-input').focus();
}

function getMessage() {
    var name = document.getElementById('user-name').value;
    var url = `/api/getnumbers?name=${encodeURIComponent(name)}`;

    fetch(url)
        .then(response => {
            return response.text();
        })
        .then(data => {
            document.getElementById('message').innerText = data;
        })
        .catch(error => {
            console.error('Error fetching numbers:', error);
        });
}

document.getElementById('send-button').addEventListener('click', fetchNumbers);

window.onload = function() {

    var previousMaxScore = getCookie('maxScore');
    var previousMinTimePerQuestion = getCookie('minTimePerQuestion');
    var previousMaxQuestionsPerMin = getCookie('maxQuestionsPerMin');

    var cookieFound = (previousMaxScore || previousMinTimePerQuestion || previousMaxQuestionsPerMin);

    if (cookieFound) {
        document.getElementById('score-table').style.display = 'table';
        displayMaxScore();
        displayMinTimePerQuestion();
        displayMaxQuestionsPerMin();
    }

    maxScore = previousMaxScore ? parseInt(previousMaxScore) : 0;
    minTimePerQuestion = previousMinTimePerQuestion ? parseFloat(previousMinTimePerQuestion) : Infinity;
    maxQuestionsPerMin = previousMaxQuestionsPerMin ? parseFloat(previousMaxQuestionsPerMin) : 0;        
        
    document.getElementById('question').innerHTML = getNextQuestion();

    document.getElementById('answer-input').focus();

    document.getElementById('answer-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            processAnswer();
        }
    });

    document.getElementById('submit').addEventListener('click', function() {
        processAnswer();
    });

    startTime = new Date().getTime()
};

// todo
// - tidy up the JS
// - add bootstrap to make it responsive - see https://getbootstrap.com/docs/5.3/getting-started/introduction/
// - get rid of the inline styles
// - add a python api - see https://github.com/Azure-Samples/serverless-full-stack-apps-azure-sql/blob/main/azure-static-web-app/client/index.html
// - figure out how to get python function running locally