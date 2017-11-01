export type ScrollListener = (element: HTMLDivElement) => void;

export const scrollListeners = new Set<ScrollListener>();

export const fireScrollEvent = (element: HTMLDivElement) => {
    scrollListeners.forEach((listener) => listener(element));
}