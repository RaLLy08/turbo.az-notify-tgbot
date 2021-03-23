export interface UserLinksInterface {
    readonly chatId: number,                     
    readonly name: string,                        
    readonly updateParsedTime: number,  
    readonly parsedLinks: string[],    
    readonly carsLink: string,
};

export interface ComparedResultInterface {
    readonly added: string[],
    readonly removed: string[],
}

