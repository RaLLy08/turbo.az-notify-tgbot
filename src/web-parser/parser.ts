import axios, { AxiosResponse, AxiosError } from 'axios';

const parseLinksFromPage = (pageUrl: string): Promise<string[]> => new Promise((resolve, reject) => {
    axios.get(pageUrl).then((response: AxiosResponse) => {
        // matches from autos/ to "/"" or "
        const { data } = response;

        const matchAllAutoLinks: Array<string> | null = data.match(/(?<=autos\/)\d{7}.*?(?=("|\/))/g);

        const autoLinks: Array<string> = Array.from(new Set(matchAllAutoLinks));

        resolve(autoLinks);
    }).catch((error: AxiosError) => {
        reject(error);
    })
})

// 'q%5B | utf8= | page=2'
export const parseLinksFromPages = (link: string, pageLimit: number = Infinity) => new Promise((resolve, reject) => {
    const allLinks: Array<string> = [];
    let replaceValue: string | RegExp = '';
    
    if (link.search(/q%5B/g) === 23) replaceValue = 'q%5B';
    if (link.search(/utf8=/g) === 23) replaceValue = 'utf8=';

    const initPage = replaceValue ? link.replace(replaceValue, 'page=1') : link;

    const parsePage = (page: string) => {

        parseLinksFromPage(page).then((result) => {
            const currentPage = Number(page.match(/(page=\d*)/gi)[0].replace(/\D/g, ''));
            // console.log(currentPage, 'check', result.length)
            allLinks.push(...result)

            if (result.length && currentPage < pageLimit) {
                const nextPage = page.replace(`page=${currentPage}`, `page=${+currentPage + 1}`);
               // console.log(nextPage)
                parsePage(nextPage)
            } else {
                const resultLinks = Array.from(new Set(allLinks));

                resolve(resultLinks);
            }
        }).catch(err => reject(err));
    }

    
    parsePage(initPage);
}) 

// 
export const checkPageLimit = (link: string, pageLimit: number) => new Promise((resolve, reject) => {
    let replaceValue: string | RegExp = ''

    if (link.search(/q%5B/g) === 23) replaceValue = 'q%5B';
    if (link.search(/utf8=/g) === 23) replaceValue = 'utf8=';
    if (link.search(/page=/) === 23) replaceValue = /page=\d/;

    if (!replaceValue) reject('Wrong link');

    const pageAfterLimit = link.replace(replaceValue, `page=${pageLimit}`);

    console.log(pageAfterLimit)

    parseLinksFromPage(pageAfterLimit).then(parsedLinks => {
        if (parsedLinks.length) {
            reject('Page limit - 10 exceeded')
        } else {
            resolve('');
        }
    })
});

// autoParsePages(bmw, 3).then(e => console.log(e.length, "RESULT!@"))
