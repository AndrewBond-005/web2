const ACCEPTABLE_Y = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
const ACCEPTABLE_R = [1, 2, 3, 4, 5];
export function parseNumber(str) {
    const normalizedStr = str.toString().replace(',', '.');
    const numberRegex = /^-?\d+(\.\d+)?$/;
    if (!numberRegex.test(normalizedStr)) {
        throw new Error("Введено не число!");
    }
    const num = Number(normalizedStr);
    if (isNaN(num)) {
        throw new Error("Введено не число!");
    }
    return num;
}
export function validateInput(input) {
    if (isNaN(input.x)) throw new Error('Поле X должно быть числом от -5 до 5!');
    if (isNaN(input.y)) throw new Error('Поле Y должно быть числом!');
    if (isNaN(input.r)) throw new Error('Поле R должно быть числом!');
    if (!ACCEPTABLE_Y.includes(input.y)) throw new Error('Недопустимое значение Y!');
    if (input.x < -5 || input.x > 5) throw new Error('Поле X должно быть числом от -5 до 5!');
    if (!ACCEPTABLE_R.includes(input.r)) throw new Error('Недопустимое значение R!');
    return true;
}