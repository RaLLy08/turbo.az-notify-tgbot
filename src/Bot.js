import TelegramBot from 'node-telegram-bot-api';
// const TelegramBot = require('node-telegram-bot-api');

process.env.NTBA_FIX_319 = 1;
let bot = null;

export const initBot = token => {
    if (!bot) bot = new TelegramBot("1615620662:AAGcnGLyfVl6f80f8wpC5bZ918-nEkuDP4c", { polling: true })
}

export const onMessage = cb => {     
    bot.on('message', (msg, match) => {
        cb(msg, match);
    }); 
}

export const sendMsgTo = chatId => (text, inline_keyboard) => bot.sendMessage(chatId, text, inline_keyboard);

export const sendPhoto = (chatId, photo) => bot.sendPhoto(chatId, photo)

export const onQuery = cb => {
    bot.on('callback_query', query => {
        cb(query);
    }); 
}

export const deleteMessage = (chatId, messageId) => {
    bot.deleteMessage(chatId, messageId);
}

export const editMsg = (chat_id, message_id, text, inline_keyboard) => {
    bot.editMessageText(text, {
        chat_id,
        message_id,
        // reply_markup: {
        //     inline_keyboard
        // }
    })
}

export const sendTag = (chatId, taggedMsg) => {
    bot.sendMessage(chatId, taggedMsg, {parse_mode : "markdown"});
}