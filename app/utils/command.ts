import { etn } from '../etn';
export interface Command {
    stdout: string;
    stderr: string;
}

export function command(command: string): Promise<Command> {
    return new Promise((resolve: (command: Command) => void, reject: (reason: any) => void) => {
        etn.exec(command, (error: any, stdout: string, stderr: string) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    stdout,
                    stderr,
                });
            }
        });
    });
}