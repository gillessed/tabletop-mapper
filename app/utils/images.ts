import { command, Command } from './command';

export function resize(filename: string, destination: string, minWidth: number, minHeight: number): Promise<any> {
    let commandString = `gm convert "-geometry" "${minWidth}x${minHeight}^" "${filename}" "${destination}"`;
    return command(commandString);
}