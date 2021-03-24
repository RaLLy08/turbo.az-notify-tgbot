export type KeysType = {
    text: string
    callback_data: string
}


type ReplyMarkupType = {
    reply_markup: {
        inline_keyboard:  Array<Array<KeysType>>
    }
}

export const getInlineKeyboard = (inline_keyboard: any): ReplyMarkupType => ({
    reply_markup:{
        inline_keyboard,
    }
})