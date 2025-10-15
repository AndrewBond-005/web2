import { validateInput, parseNumber } from './validation.js';
import { clearTable, saveResults, addResults } from './table.js';
import { drawArea, drawPoint, getXYR, drawLabel, addPoint, clearPoints, redrawArea, clearArea } from './area.js';

const form = document.getElementById('inputForm');
const clearButton = document.getElementById('clearButton');
const errorTag = document.getElementById('errorMessage');
const errorCell = document.getElementById('errorCell');
const themeTag = document.getElementById('themeTag');
const ElemR=document.getElementById('r-hidden');
var R = null;
drawArea();
drawLabel("R");
//let prevResults = JSON.parse(localStorage.getItem('resultRow')) || [];
//addResults(prevResults);
/*
for(let x=-1;x<=1;x+=1){
    for(let y=-1;y<=1;y+=1){
        drawPoint(x,y,1,"попал");
    }
}
*/
//document.getElementById('r-hidden').value = Rnew;
    //const response = await fetch("/controller?" + params.toString());
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.r-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(otherButton => {
                otherButton.classList.remove('pressed');
            });
            button.classList.add('pressed');
            let Rnew = parseFloat(button.value);
            if (Rnew != R) {
                R=Rnew;
                ElemR.value = Rnew;
                redrawArea(R);
            }
        });
    });
});



canvas.addEventListener('click', function (event) {
    if (isNaN(Number(R)) || R == null) {
        showError("Нельзя ставить точку без точного R");
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [x0, y0, r0] = getXYR();
    const mathX = (x - x0) / r0;
    const mathY = (y0 - y) / r0;
    /*
     processPoint(mathX,mathY,R);
    */
    addPoint(mathX, mathY, "попал");
    drawPoint(mathX, mathY, "попал");
    //alert(x.toFixed(1)+", "+ y.toFixed(1) +" -> "+ mathX.toFixed(3)+", "+mathY.toFixed(3));
});
async function calculate(x, y, r) {
    try {
        const input = {
            x: x,
            y: y,
            r: r
        };
        if (validateInput(input)) {
            const params = new URLSearchParams(input);
            const response = await fetch("/controller?" + params.toString());

            if (response.status == 404) {
                throw new Error('Сервер не найден');
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Сервер вернул не JSON: " + contentType);
            }
            const answer = await response.json();
            if (response.ok) {
                return answer;
            } else {
                throw new Error('Сервер вернул ошибку: ' + answer.reason);
            }
        }
    }
    catch (error) {
        showError(error.message);
    }
    return null;
}
async function processPoint(x, y, r) {
    let answer = await calculate(x, y, r);
    some(answer);
}
function some(answer){
    if (answer != null) {
        addPoint(answer.x, answer.y, answer.result);
        drawPoint(answer.x, answer.y, answer.result);
        //saveResults(answer, prevResults);
        addResults(answer);
    }
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        if (R === null || isNaN(R)) {
            showError("Сначала выберите радиус R");
            return;
        }
        //*
        let ans = {
            x: 1,
            y: 1,
            r: 1,
            time: "23",
            executionTime: "234",
            result: "попал"
        };
        some(ans);
        //
        await processPoint(parseNumber(data.x), parseNumber(data.y), R);
    } catch (error) {
        showError(error.message);
    }
});
clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    clearTable();
    clearArea();
    //localStorage.setItem('resultRow', JSON.stringify([]));
    prevResults = [];
});
function showError(message) {
    errorTag.textContent = "Ошибка: " + message;
    errorTag.style.display = "inline";
    errorCell.style.display = "inline";
    setTimeout(() => {
        errorTag.textContent = "";
        errorTag.style.display = "none";
        errorCell.style.display = "none";
    }, 3000);
}
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateButtonText(savedTheme);
    }
});
themeTag.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButtonText(newTheme);
});
function updateButtonText(theme) {
    themeTag.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}
