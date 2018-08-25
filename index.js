const request = require('request-promise');
const cheerio = require('cheerio');

// url for the web to be scraped
const url = 'https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof' 

async function scrapeCragslist() {
    try{
        const htmlRequest = await request.get(url);
        console.log(htmlRequest);
    }catch(err){

    }   
}

scrapeCraglist()