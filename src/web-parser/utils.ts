export interface ComparedResultInterface {
    readonly added: string[],
    readonly removed: string[],
}

export const compareArrays = (oldState: string[], newState: string[]): ComparedResultInterface => {
    const added = [];
    const removed = [];

    oldState.forEach(iEl => {
       
        const foundEl = newState.find(jEl => jEl === iEl);

        if (foundEl === undefined) {
            removed.push(iEl);
        }

    });

    newState.forEach(iEl => {
       
        const foundEl = oldState.find(jEl => jEl === iEl);

        if (foundEl === undefined) {
            added.push(iEl);
        }

    });


    return {
        added,
        removed
    }
} 

export const mergeArray = (oldState: string[], changes: ComparedResultInterface): string[] => {
    const { added, removed } = changes;

    const newState = oldState.filter(el => !removed.includes(el));

    newState.push(...added);

    return newState
}


 
