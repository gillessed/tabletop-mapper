export function generateRandomString(): string {
    return Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
}