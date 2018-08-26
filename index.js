// using requestretry for low connectivity
// using cheerio for loading html tags
// objects-to-csv
const request = require('requestretry').defaults({fullResponse: false});
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

// url for the web to be scraped
const url = 'https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof' 

// see if the jqeusry is enabled on the page by typing $ on the console.

// if ues then:
/* $(id/class).each((index,element) => {
    console..log($(element).children(id/class).text())
})*/

// final results of scrape
const scrapeResults = []
async function scrapeJobHeader() {
    try{
        // gets the html tags of the given url
        const htmlRequest = await request.get(url);
        
        
        // loads the tags of url into querying
        const $ = await cheerio.load(htmlRequest);
        
        // targets the parent node using class selector
        $(".result-info").each((index,element) => {
            
            //  gets the title of the job
            const resultTitle = $(element).children(".result-title");
            const title = resultTitle.text();

            // gets the url of the job
            const url = resultTitle.attr('href');
            
            // gets the date of the posted job
            const resultDate= $(element).children("time");
            const date = new Date(resultDate.attr('datetime'));

            // gets the near by hood of the place 
            const resultHood = $(element).find(".result-hood");
            const hood = resultHood.text();

            // aligns the details into the object notation
            const scrapeResult = {title, url, date, hood};
            
            // pushes the object to the array
            scrapeResults.push(scrapeResult);

        });
        // console.log(scrapeResults);
        return scrapeResults;

    }catch(err){
        console.log(err);
    }   
}

// function for scraping description of jobs
async function scrapeDescriptions(jobsWithHeaders) {
    // handles Promises of array of ojects
    return Promise.all(
        // handles each object of the array of job
        jobsWithHeaders.map( async job => {
            try {

                // goto the url of the job
                const htmlResult = await request.get(job.url);
                const $ = await cheerio.load(htmlResult);
                
                // removes the qr code of description
                $(".print-qrcode-container").remove();
                
                //  gets the description and address using selectors
                // id and tag with class
                job.description = $("#postingbody").text();
                job.address = $("div.mapaddress").text();
                
                // gets the compensation of money using selector class
                // then replacing the text with just money
                const compensationText = $(".attrgroup").children().first().text();
                job.compensation = compensationText.replace("compensation: ", "");
    

                // returns the job to the same array
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
    // calls the header scrapper
    const jobsWithHeaders = await scrapeJobHeader();

    // calls the remaining data scrapper
    const jobsFullData = await scrapeDescriptions(jobsWithHeaders);
    
    console.log(jobsFullData)
    await createCSVFile(jobsFullData);
}
scrapeCraigslist();