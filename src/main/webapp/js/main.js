import { validateInput, parseNumber, validatePoint } from './validation.js';
import { clearTable, saveResults, addResults } from './table.js';
import { drawArea, drawPoint, getXYR, drawLabel, addPoint, clearPoints, redrawArea, clearArea, setTheme } from './area.js';

const form = document.getElementById('inputForm');
const clearButton = document.getElementById('clearButton');
const errorTag = document.getElementById('errorMessage');
const errorCell = document.getElementById('errorCell');
const themeTag = document.getElementById('themeTag');
const ElemR = document.getElementById('r-hidden');
var R = null;
drawArea();
drawLabel("R");
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
                R = Rnew;
                ElemR.value = Rnew;
                redrawArea(R);
            }
        });
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById('resultTable');
    const tableBody = table.getElementsByTagName('tbody');
    if (tableBody.length > 0) {
        const rows = tableBody[0].getElementsByTagName('tr');
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            const x = parseFloat(cells[0].textContent);
            const y = parseFloat(cells[1].textContent);
            const r = parseInt(cells[2].textContent);
            const isHit = cells[5].textContent.trim() === 'попал';
            if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                addPoint(x, y, r, isHit.toString());
            }
        }
    }
});
canvas.addEventListener('click', async function (event) {
    try {
        if (isNaN(Number(R)) || R == null) {
            showError("Нельзя ставить точку без точного R");
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const [x0, y0, r0] = getXYR();
        const x1 = (x - x0) * R / r0;
        const y1 = (y0 - y) * R / r0;
        await processPoint(x1, y1, R);
    } catch (error) {
        showError(error.message);
    }
});
async function send(input) {
    try {
        const params = new URLSearchParams(input);
        const response = await fetch("/Web2/controller?" + params.toString());
        if (response.status === 404) {
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
    catch (error) {
        showError(error.message);
    }
    return null;
}
async function processPoint(x, y, r) {
    const input = {
        x: x,
        y: y,
        r: r
    };
    let answer = await send(input);
    processAnswer(answer);
}
function processAnswer(answer) {
    if (answer != null) {
        addPoint(answer.x, answer.y, answer.r, String(answer.isHit));
        drawPoint(answer.x, answer.y, answer.r, String(answer.isHit));
        addResults(answer);
    }
    else {
        showError("Сервер ответил пустой строкой");
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
        if (validatePoint(data.x, data.y, R));
        await processPoint(parseNumber(data.x), parseNumber(data.y), R);
    } catch (error) {
        showError(error.message);
    }
});
clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    let input={
        clear:"true"
    };
    send(input);
    clearTable();
    clearArea();
    drawArea();
    drawLabel("R");
    clearPoints();
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
        setTheme(savedTheme);
        redrawArea(R == null ? "R" : R);
    }
});
themeTag.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButtonText(newTheme);
    setTheme(newTheme);
    redrawArea(R == null ? "R" : R);
});
function updateButtonText(theme) {
    themeTag.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}
