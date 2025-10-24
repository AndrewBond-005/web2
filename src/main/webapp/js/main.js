import {addResults, clearTable} from './table.js';
import {
    addPoint,
    clearArea,
    clearPoints,
    drawArea,
    drawLabel,
    drawPoint,
    getXYR,
    redrawArea,
    setTheme
} from './area.js';
import {validateX, validateY} from "./validation";

const form = document.getElementById('inputForm');
const clearButton = document.getElementById('clearButton');
const errorTag = document.getElementById('errorMessage');
const errorCell = document.getElementById('errorCell');
const themeTag = document.getElementById('themeTag');
const xInput = document.getElementById('x');
const yInput = document.getElementById('y');
const ElemR = document.getElementById('r-hidden');
const submitButton = document.querySelector('input[type="submit"]');
var R = null;
drawArea();
drawLabel("R");
updateSubmitButton(false);
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
                updateSubmitButton(true);
            }
        });
    });

});

function updateSubmitButton(ok) {
    submitButton.disabled = ok;
    submitButton.style.opacity = ok ? '1' : '0.5';
}

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
            const isHit = cells[3].textContent.trim() === 'попал';
            if (!isNaN(x) && !isNaN(y) && !isNaN(r)) {
                addPoint(x, y, r, isHit.toString());
            }
        }
    }
});
canvas.addEventListener('click', async function (event) {
    try {
        if (isNaN(Number(R)) || R == null) {
            Error("Нельзя ставить точку без точного R");
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
        Error(error.message);
    }
});

async function send(input) {
    try {


        xInput.value = input.x;
        yInput.value = input.y;
        ElemR.value = input.r;
        form.submit();

        /*
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

         */
    } catch (error) {
        Error(error.message);
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
    } else {
        Error("Сервер ответил пустой строкой");
    }
}


xInput.addEventListener('change', function () {
    try {
        const ok = validateX(xInput.value);
        if (ok) {
            hideError();
            updateSubmitButton(ok);
        }
    } catch (e) {
        showError(e.message);
    }
});
yInput.addEventListener('change', function () {
    try {
        const ok = validateY(yInput.value);
        if (ok) {
            hideError();
            updateSubmitButton(ok);
        }
    } catch (e) {
        showError(e.message);
    }
});


clearButton.addEventListener('click', function (event) {
    event.preventDefault();
    let input = {
        clear: "true"
    };
    send(input);
    clearTable();
    clearArea();
    drawArea();
    drawLabel("R");
    clearPoints();
});

function Error(message) {
    showError(message)
    setTimeout(() => {
        hideError()
    }, 3000);
}

function showError(message) {
    errorTag.textContent = "Ошибка: " + message;
    errorTag.style.display = "inline";
    errorCell.style.display = "inline";
}

function hideError() {
    errorTag.textContent = "";
    errorTag.style.display = "none";
    errorCell.style.display = "none";
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
