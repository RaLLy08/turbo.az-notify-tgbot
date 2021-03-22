export const compareArrays = (oldState, newState) => {
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

export const mergeArray = (oldState, changes) => {
    const { added, removed } = changes;

    const newState = oldState.filter(el => !removed.includes(el));

    newState.push(...added);

    return newState
}


 
