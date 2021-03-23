let collection = null;

export const initUserState = (client) => {
    if (!collection) collection = client.db("userChatsLinks").collection("userState");
}

export const getUserState = async (chatId) => {
    const data = await collection.findOne({ chatId });

    return data;
}
 
export const addInitialUserState = async (chatId) => {
    return await collection.insertOne({
        chatId,
        name: '',
        count: 0,
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

export const updateStateStep = async (chatId, name, count, data) => {
    return await collection.updateOne({
        chatId
    }, {
        $set: { name, count, data }
    })
}

export const replaceUserState = async (chatId, step) => {
    return await collection.replaceOne({
        chatId
    }, {
        chatId,
        ...step
    })
}