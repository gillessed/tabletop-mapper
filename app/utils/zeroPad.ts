export function zeroPad(number: number, padChar: string, length: number): string {
    var pad = '';
    for (let i = 0; i < length; i++) {
        pad += padChar;
    }
    return (`${pad}${number}`).slice(-pad.length);
}