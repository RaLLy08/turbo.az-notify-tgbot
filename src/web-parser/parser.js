const needle = require('needle');

const parseLinksFromPage = pageUrl => new Promise((resolve, reject) => {
    needle.get(pageUrl, (error, response) => {
        if (!error && response.statusCode == 200) {
            var { body } = response;
            // matches from autos/ to "/"" or "
            var matchAllAutoLinks = body.match(/(?<=autos\/)\d{7}.*?(?=("|\/))/g);
            var autoLinks = [...new Set(matchAllAutoLinks)];

            resolve(autoLinks);
        } else {
            reject(error);
        }
      });
})

// 'q%5B | utf8= | page=2'
export const parseLinksFromPages = (link, pageLimit = Infinity) => new Promise((resolve, reject) => {
    const allLinks = [];
    let replaceValue;
    
    if (link.search(/q%5B/g) === 23) replaceValue = 'q%5B';
    if (link.search(/utf8=/g) === 23) replaceValue = 'utf8=';

    const initPage = replaceValue ? link.replace(replaceValue, 'page=1') : link;

    const parsePage = (page) => {

        parseLinksFromPage(page).then(result => {
            const currentPage = page.match(/(page=\d*)/gi)[0].replace(/\D/g, '');
           // console.log(currentPage, 'check', result.length)
            allLinks.push(...result)

            if (result.length && currentPage < pageLimit) {
                const nextPage = page.replace(`page=${currentPage}`, `page=${+currentPage + 1}`);
               // console.log(nextPage)
                parsePage(nextPage)
            } else {
                resolve(allLinks);
            }
        }).catch(err => reject(err));
    }

    
    parsePage(initPage);
}) 

// 
export const checkPageLimit = (link, pageLimit) => new Promise((resolve, reject) => {
    let replaceValue = ''

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
            resolve();
        }
    })
});

// autoParsePages(bmw, 3).then(e => console.log(e.length, "RESULT!@"))
