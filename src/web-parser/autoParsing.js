import { parseLinksFromPages } from "./parser";
import { getAllUserLinks, updateParsedLinks } from "../models/UserLinks"
import { compareArrays } from "./utils";
import { sendMsgTo } from "../Bot";


// separate 
const runAllLinks1 = async (allUserLinks) => {
    
    const parse = async (allUserLinks, index) => {
        // gets all links from all pages
        const userLinks = allUserLinks[index];

        const parsedLinks = await parseLinksFromPages(userLinks.carsLink, 10);

        console.log(userLinks, parsedLinks)

        // if (!userLinks.parsedLinks.length) {
        //     // init links if there are no one
        //     await updateParsedLinks(userLinks._id, links)
        // }

        // userLinks.parsedLinks -> dbDate links -> parced
        const compareResult = compareArrays(userLinks.parsedLinks, parsedLinks);
        let msg = '';

        if (compareResult.added.length) {
            msg += '\nThis car(s) has been added:\n'
            compareResult.added.forEach(el => {
                msg += `\nhttps://turbo.az/${el}\n`
            })
            msg += `*${'-'.repeat(66)}*`
            
        }

        if (compareResult.removed.length) {
            msg += '\nThis car(s) has been removed:\n'
            compareResult.removed.forEach(el => {
                msg += `\nhttps://turbo.az/${el}\n`
            })
            msg += `*${'-'.repeat(66)}*`
            
        }

        if (msg) {
            sendMsgTo(userLinks.chatId)(msg)
        } else {
            // sendMsgTo(userLinks.chatId)('')
        };

        const nextLinkObj = allUserLinks[index + 1];

        if (nextLinkObj) {
            parse(nextLinkObj, index + 1);
        }
    }

    parse(allUserLinks, 0)
} 


export const userLinksUpdate = async (usersLinks) => {
    const compare = async (index) => {

        await compareLinks(usersLinks[index])

        // const parsedLinks = await parseLinksFromPages(userLinks.carsLink, 10);

        if (usersLinks[index + 1]) {
            return compare(index + 1);
        }
    }

    return compare(0)
} 


// remove send messages from inside to outside
const compareLinks = async (userLinks) => {
    // gets all links from all pages
    // const userLinks = allUserLinks[index];

    const parsedLinks = await parseLinksFromPages(userLinks.carsLink, 10);

    console.log(userLinks, parsedLinks)
    // await updateParsedLinks(userLinks._id, parsedLinks)
    // userLinks.parsedLinks -> dbDate links -> parced
    const compareResult = compareArrays(userLinks.parsedLinks, parsedLinks);
    let msg = '';
    console.log(compareResult)
    if (compareResult.added.length) {
        msg += '\nThis car(s) has been added:\n'
        compareResult.added.forEach(el => {
            msg += `\nhttps://turbo.az/autos/${el}\n`
        })
        msg += `*${'-'.repeat(66)}*`
    }

    if (compareResult.removed.length) {
        msg += '\nThis car(s) has been removed:\n'
        compareResult.removed.forEach(el => {
            msg += `\nhttps://turbo.az/autos/${el}\n`
        })
        msg += `*${'-'.repeat(66)}*`
    }

    if (msg) {
        await sendMsgTo(userLinks.chatId)(`From ${userLinks.name}:\n${msg}` )
    } else {
        // sendMsgTo(userLinks.chatId)('')
    };

    return;
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

export const parseCarsFromPages = async (pages) => {
    const compare = async (index) => {

        const parsedLinks = await parseLinksFromPages(userLinks.carsLink, 10);

        if (usersLinks[index + 1]) {
            return compare(index + 1);
        }
    }

    return compare(0)
} 