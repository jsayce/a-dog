window.onload = function() {
    var question = getNextQuestion();
    document.getElementById('question').innerHTML = question;

    document.getElementById('answer-input').focus();

    document.getElementById('answer-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('submit').click();
        }
    });
};

var num1;
var num2;

function getNextQuestion() {
    num1 = Math.floor(Math.random() * 12) + 1;
    num2 = Math.floor(Math.random() * 12) + 1;
    var question = `What is ${num1} x ${num2}?`;
    return question;
}

document.getElementById('submit').onclick = function() {

    var userAnswer = document.getElementById('answer-input').value;
    var correctAnswer = num1 * num2;

    var outcomeElement = document.getElementById('outcome');

    userAnswer = userAnswer.toLowerCase();
    if (userAnswer === 'skip') {
        outcomeElement.innerHTML = 'Skipped that question';
        outcomeElement.style.color = 'orange';
    } else if (parseInt(userAnswer) === correctAnswer) {
        outcomeElement.innerHTML = 'Correct!';
        outcomeElement.style.color = 'green';
    } else {
        outcomeElement.innerHTML = 'Incorrect. The correct answer is ' + correctAnswer;
        outcomeElement.style.color = 'red';
    }
    document.getElementById('question').innerHTML = getNextQuestion();
    document.getElementById('answer-input').value = '';

    document.getElementById('answer-input').focus();
};