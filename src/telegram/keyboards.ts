export type KeysType = {
    text: string
    callback_data: string
}

type InlineKeyboardType = Array<Array<KeysType>>

type ReplyInlineMarkupType = {
    reply_markup: {
        inline_keyboard: InlineKeyboardType
    }
}

type KeyboardType = Array<Array<string>>

type ReplyMarkupType = {
    reply_markup: {
        keyboard: KeyboardType 
    }
}

export const getInlineKeyboard = (inline_keyboard: InlineKeyboardType): ReplyInlineMarkupType => ({
    reply_markup:{
        inline_keyboard,
    }
})

export const getReplyKeyboard = (keyboard: KeyboardType): ReplyMarkupType => ({
    reply_markup: {
        keyboard,
    }
})