export default function pause(delay: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(_ => {
            resolve()
        }, delay)
    })
}