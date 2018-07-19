import { etn } from '../etn';

export function explorerDirectory(path: string) {
    etn.exec(`start "" ${path}`, () => {});
}
