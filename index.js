const request = require('request-promise');
const cheerio = require('cheerio');

// url for the web to be scraped
const url = 'https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof' 
const scrapeResult = {
    titl: "Technical Autonomous Vehicle Trainer",
    description: "We're the driverless car company we're buidling.....",
    datePosted:new Date(2018-07-13),
    url: "https://sfbay.craigslist.org/sfc/sof/d/technical-autonomous-vehicle/6642626746.html",
    hood: '(SOMA / South Beach)',
    address: "1201 Brant St.",
    compensation: '23/hr'
}


// see if the jqeusry is enabled on the page by typing $ on the console.

// if ues then:
/* $(id/class).each((index,element) => {
    console..log($(element).children(id/class).text())
})*/
async function scrapeCragslist() {
    try{
        const htmlRequest = await request.get(url);
        // console.log(htmlRequest);
  
        const $ = await cheerio.load(htmlRequest);
        
        $(".result-info").each((index,element) => {
            console.log(
                $(element)
                    .children(".result-title")
                    .text()
            );
        });
    
    }catch(err){

    }   
}
scrapeCragslist();