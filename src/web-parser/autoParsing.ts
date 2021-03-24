import { parseLinksFromPages } from "./parser";
import { getAllUserLinks, updateParsedLinks } from "../models/UserLinks"
import { compareArrays } from "./utils";
import { ComparedResultInterface, UserLinksInterface } from '../types'; 


// separate

type OnCompareType = (comparedResult: ComparedResultInterface, index: number) => Promise<void>;

export const userLinksUpdate = async (allUsersLinks: UserLinksInterface[], onCompare: OnCompareType) => {
    const compare = async (index: number) => {

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
const compareLinks = async (userLinks: UserLinksInterface) => {
    const parsedLinks: any = await parseLinksFromPages(userLinks.carsLink, 10);

    // await updateParsedLinks(userLinks._id, parsedLinks)
    // userLinks.parsedLinks -> dbDate links -> parced
    const compareResult: ComparedResultInterface = compareArrays(userLinks.parsedLinks, parsedLinks);

    return compareResult;
}


// const autoParseAllLinks = async () => {
//     // get all page links 

//     const allUsersLinks = await getAllUserLinks();

//     if (allUsersLinks.length) {
//         await userLinksUpdate(allUsersLinks)
//     }
// }

// setTimeout(() => {
//     autoParseAllLinks()
// }, 5000);

////////////////////////
