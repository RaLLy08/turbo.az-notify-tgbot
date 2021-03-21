import { sendMsgTo, sendPhoto } from "../Bot";
import { getCarsLinksByChatId } from "../models/UserLinks";
import { getInlineKeyboard } from "./keyboards";

class Commands {
    sendMsg = msg => {
        const sendMsg = sendMsgTo(msg.chat.id)

        switch (msg.text) {
            case '/start':
                return sendMsg('Hi this bot subscribes to the car links and notify you if new Car uploded or selled in Turbo.az, type /info for how get this link');
            case '/myCars':
                return getCarsLinksByChatId(msg.chat.id).then(userLinks => {
                    if (userLinks.length) {
                        let newMsg = ''
                        const keys = userLinks.map((el, i) => {
                            return [
                                {
                                    text: 'remove ' + (i + 1),
                                    callback_data: JSON.stringify({
                                        action: 'remove',
                                        data: el._id,
                                    })
                                },
                                {
                                    text: 'send link ' + (i + 1),
                                    callback_data: JSON.stringify({
                                        action: 'send',
                                        data: el._id
                                    })
                                },
                            ]
                        }) 

                        keys.push(
                            [
                                {
                                    text: 'Update all',
                                    callback_data: JSON.stringify({
                                        action: 'updateAll',
                                        data: '',
                                    })
                                }
                            ]
                        )

                        const keyboard = getInlineKeyboard(keys)

                       
                        userLinks.forEach((el, i) => {
                            newMsg += `${i + 1}) Name: ${el.name}\n\tLast update time: ${new Date(el.updateParsedTime).toLocaleString()}\n\tNumber of subscribed cars: ${el.parsedLinks.length}\n`
                        });

                        sendMsg(newMsg, keyboard);
                    } else {
                        sendMsg('There is no cars yet :(');
                    }

                });
            case '/info':
                sendMsg('Filtrate your cars and send link, link, link must be up to 10 pages')
                return sendPhoto(msg.chat.id, 'https://linkpicture.com/q/info.jpg');     
            default:
                return sendMsg('Unknown command');
        }
    }

    // addUserLinkDb = (msg) => this._db.addCarsLink(msg.chat.id, msg.text).then(e => this._bot.sendMsgTo(msg.chat.id, 'link subscribed! For see your cars list use /myCars command'))

};

export default Commands;
// module.exports = Commands;