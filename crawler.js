const puppeteer = require('puppeteer');
const fs = require('fs');

let url = 'http://kenh14.vn/';

const crawler = () => {
    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        //await page.setViewport({ width: 1280, height: 720 });
        await page.goto(url);
        await page.screenshot({ path: 'kenh14.png' });

        let result = await page.evaluate(() => {
            let news = [];

            let newsElm = document.querySelectorAll('.knsw-list .knswli.need-get-value-facebook.clearfix.done-get-type.done-get-sticker');

            newsElm.forEach((newsItem) => {
                let newsObj = {};

                let leftObj = {};
                let rightObj = {};

                leftObj = newsItem.querySelector('.knswli-left.fl>a');
                rightObj = newsItem.querySelector('.knswli-right');

                if (leftObj != null && rightObj != null) {
                    newsObj.url = leftObj.href;
                    newsObj.title = rightObj.querySelector('h3.knswli-title>a').title;
                    newsObj.time = rightObj.querySelector('.knswli-meta').childNodes[3].title;
                    newsObj.category = rightObj.querySelector('.knswli-meta>a.knswli-category') != null
                        ? rightObj.querySelector('.knswli-meta>a.knswli-category').innerText : '';
                    newsObj.description = rightObj.querySelector('.knswli-sapo.sapo-need-trim') != null
                        ? rightObj.querySelector('.knswli-sapo.sapo-need-trim').innerText
                        : (rightObj.querySelector('.knswli-relate-wrap>a') != null ? rightObj.querySelector('.knswli-relate-wrap>a.knswli-relate').href : '');
                }

                news.push(newsObj);

            });

            return news;

        });

        console.log(result);

        // let newsJson = JSON.stringify(result);

        // fs.writeFile('news.json', newsJson, 'utf8', function (err) {
        // 	if(err) {
        // 		console.log('Error! Please check again');
        // 	} else {
        // 		console.log('Successfull!!');
        // 	}
        // });

        await browser.close();
    })()
};

module.exports = crawler;