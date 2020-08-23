const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
require('dotenv').config()

const send = require('gmail-send')({
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
    to:   process.env.TO_ADDRESS_SUCCESS,
    subject: 'CHOKER VINYL AVAILABLE NOW',
});

try {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://shop.choker.cc/products/honeybloom-vinyl?variant=21625384829017');
      await page.waitForSelector('button#AddToCart')
      await page.waitFor(2000);
      const html = await page.content();
      const $ = cheerio.load(html)
      const button = $('button#AddToCart').eq(0)['0'].attribs
    
      if (Object.keys(button).includes('disabled')) {
          console.log('SOLD OUT')
          send({
            to:   [process.env.GMAIL_ADDRESS],
            subject: 'CHOKER VINYL UNAVAILABLE',
            text:    'STILL SOLD OUT\nhttps://shop.choker.cc/products/honeybloom-vinyl?variant=21625384829017',  
          }, (error, result, fullResult) => {
            if (error) console.error(error);
            console.log(result);
          })

      } else {
          console.log('AVAILABLE AGAIN')
          send({
            to:   [process.env.GMAIL_ADDRESS, process.env.TO_ADDRESS_SUCCESS],
            text:    'Link here:\nhttps://shop.choker.cc/products/honeybloom-vinyl?variant=21625384829017\nGood luck, man',  
          }, (error, result, fullResult) => {
            if (error) console.error(error);
            console.log(result);
          })
      }
    
      await browser.close();
    })();
} catch (e) {
    send({
        to:   process.env.TO_ADDRESS_ERROR,
        subject: 'CHOKER VINYL BOT ERROR',
        text:    e,  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
      })
}
