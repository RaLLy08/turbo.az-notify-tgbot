import { parseLinksFromPages } from "./parser";
import { getAllUserLinks, updateParsedLinks } from "../models/UserLinks"
import { compareArrays } from "./utils";


// separate 

export const userLinksUpdate = async (allUsersLinks, onCompare) => {
    const compare = async (index) => {

        const comparedResult = await compareLinks(allUsersLinks[index])
        await onCompare(comparedResult, index);
        // const parsedLinks = await parseLinksFromPages(userLinks.carsLink, 10);

        if (allUsersLinks[index + 1]) {
            return await compare(index + 1);
        }
    }

    return compare(0)
} 


// remove send messages from inside to outside
const compareLinks = async (userLinks) => {
    const parsedLinks = await parseLinksFromPages(userLinks.carsLink, 10);

    // await updateParsedLinks(userLinks._id, parsedLinks)
    // userLinks.parsedLinks -> dbDate links -> parced
    const compareResult = compareArrays(userLinks.parsedLinks, parsedLinks);

    return compareResult;
}


const autoParseAllLinks = async () => {
    // get all page links 

    const allUsersLinks = await getAllUserLinks();

    if (allUsersLinks.length) {
        await userLinksUpdate(allUsersLinks)
    }
}

// setTimeout(() => {
//     autoParseAllLinks()
// }, 5000);

////////////////////////
