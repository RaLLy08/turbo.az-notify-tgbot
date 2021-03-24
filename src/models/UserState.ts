let collection = null;


export const initUserState = (client) => {
    if (!collection) collection = client.db("userChatsLinks").collection("userState");
}

export const getUserState = async (chatId: number) => {
    const data = await collection.findOne({ chatId });

    return data;
}
 
export const addInitialUserState = async (chatId: number) => {
    return await collection.insertOne({
        chatId,
        name: '',
        data: null
    });
}

// export const updateStateData = async (chatId, data) => {
//     return await collection.updateOne({
//         chatId
//     }, {
//         $set: { data },
//     })
// }

export const updateStateStep = async (chatId: number, name: String, data) => {
    return await collection.updateOne({
        chatId
    }, {
        $set: { name, data }
    })
}

// export const replaceUserState = async (chatId: number, step) => {
//     return await collection.replaceOne({
//         chatId
//     }, {
//         chatId,
//         ...step
//     })
// }