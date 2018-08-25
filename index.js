const request = require('requestretry');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

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

const scrapeResults = []
async function scrapeJobHeader() {
    try{
        const htmlRequest = await request.get(url);
        // console.log(htmlRequest);
  
        const $ = await cheerio.load(htmlRequest);
        
        $(".result-info").each((index,element) => {
            
            const resultTitle = $(element).children(".result-title");
            const title = resultTitle.text();
            const url = resultTitle.attr('href');
            
            const resultDate= $(element).children("time");
            const date = new Date(resultDate.attr('datetime'));

            const resultHood = $(element).find(".result-hood");
            const hood = resultHood.text();

            const scrapeResult = {title, url, date, hood};
            scrapeResults.push(scrapeResult);

        });
        // console.log(scrapeResults);
        return scrapeResults;

    }catch(err){
        console.log(err);
    }   
}

async function scrapeDescriptions(jobsWithHeaders) {
    return Promise.all(
        jobsWithHeaders.map( async job => {
            try {
                const htmlResult = await request.get(job.url);
                const $ = await cheerio.load(htmlResult);
                
                $(".print-qrcode-container").remove();
                
                job.description = $("#postingbody").text();
                job.address = $("div.mapaddress").text();
    
                const compensationText = $(".attrgroup").children().first().text();
                job.compensation = compensationText.replace("compensation: ", "");
    
                return job;                
            } catch (error) {
                console.error(error)
            }

        }));
}

async function createCSVFile(data) {
    let csv = new ObjectsToCsv(data);

    //save to file
    await csv.toDisk('./JobScrappedData.csv');

    console.log( await csv.toString());
}

async function scrapeCraigslist() {
    const jobsWithHeaders = await scrapeJobHeader();
    const jobsFullData = await scrapeDescriptions(jobsWithHeaders);

    await createCSVFile(jobsFullData);
}
scrapeCraigslist();