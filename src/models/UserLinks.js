import { ObjectId } from "bson";

let collection = null;

export const initUserLinks = (client) => {
    if (!collection) collection = client.db("userChatsLinks").collection("userLinks");
}

export const getUserLinksByChatId = async (chatId) => {
    const links = await collection.find({ chatId }).toArray();

    return links;
}
// getUserLink
export const getUserLinksById = async (_id) => {
    return await collection.findOne({ "_id" : ObjectId(_id) });
}
 
export const getAllUserLinks = async () => {
    const links = await collection.find().toArray();

    return links;
}


export const addUserLink = async (chatId, carsLink, name, parsedLinks) => {
    return await collection.insertOne({
        chatId,                         // const
        carsLink,                       // const
        name,                           // const
        updateParsedTime: Date.now(),   // variable
        parsedLinks,                    // variable
    });
}
// 
export const updateParsedLinks = async (_id, parsedLinks) => {
    return await collection.updateOne({ "_id" : ObjectId(_id) }, {
        $set: { 
            updateParsedTime: Date.now(),
            parsedLinks
        }
    })
}
// 

export const deleteManyUsersLinks = async (chatId) => {
    return await collection.deleteMany({
        chatId
    });
}

export const deleteOneUserLinkById = async (_id) => {
    return await collection.deleteOne({ "_id" : ObjectId(_id) });
}

// export const updateCarLink = async (chatId, step) => {
//     return await collection.replaceOne({
//         chatId
//     }, {
//         $set: { name: },
//         ...step
//     })
// }