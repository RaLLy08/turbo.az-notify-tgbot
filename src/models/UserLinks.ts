import { ObjectId } from "bson";

let collection = null;

export const initUserLinks = (client) => {
    if (!collection) collection = client.db("userChatsLinks").collection("userLinks");
}

export const getUserLinksByChatId = async (chatId: number) => {
    const links = await collection.find({ chatId }).toArray();

    return links;
}
// getUserLink
export const getUserLinksById = async (_id: number) => {
    return await collection.findOne({ "_id" : ObjectId(_id) });
}
 
export const getAllUserLinks = async () => {
    const links = await collection.find().toArray();

    return links;
}


export const addUserLink = async (chatId: number, carsLink: string, name: string, parsedLinks: Array<string>) => {
    return await collection.insertOne({
        chatId,                         // const
        carsLink,                       // const
        name,                           // const
        updateParsedTime: Date.now(),   // variable
        parsedLinks,                    // variable
    });
}
// 
export const updateParsedLinks = async (_id: number, parsedLinks: Array<string>) => {
    return await collection.updateOne({ "_id" : ObjectId(_id) }, {
        $set: { 
            updateParsedTime: Date.now(),
            parsedLinks
        }
    })
}
// 

export const deleteManyUsersLinks = async (chatId: number) => {
    return await collection.deleteMany({
        chatId
    });
}

export const deleteOneUserLinkById = async (_id: number) => {
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