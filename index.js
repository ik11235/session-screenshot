const puppeteer = require('puppeteer');
const fs = require("fs");


async function getCookieForFile(filepath, domainurl) {
    const fs = require('fs');
    const url = require('url')

    const uri = url.parse(domainurl)
    //console.log(uri)

    let text = fs.readFileSync(filepath);
    let cookies = [];
    //console.log(text)

    let lines = text.toString().split('\n');

    for (let idx in lines) {
        let line = lines[idx].replaceAll("\n", "")
        let cookieAry = line.split('=');
        if (cookieAry[0] !== "") {
            const cookie = {
                'name': cookieAry[0],
                'value': cookieAry[1],
                'domain': uri.host,
                //'domain': 'www.example.com', // ドメイン（省略可）
                //'path': '/' // パス（省略可）
            }
            cookies.push(cookie);
        }

        //   console.log(line);
    }

    /*
        const stream = fs.createReadStream(filepath);

        const rl = readline.createInterface({
            input: stream,
            output: process.stdout,
            terminal: false,
        });

        await rl.on("line", (line) => {
            let cookieAry = line.split('=');
            const cookie = {
                'name': cookieAry[0],
                'value': cookieAry[1],
                'domain': 'www.example.com', // ドメイン（省略可）
                'path': '/' // パス（省略可）
            }
            cookies.push(cookie);
        });
    */
    return cookies;
}


(async () => {
    const fs = require('fs');
    let text = fs.readFileSync('target_url_list.txt');

    let lines = text.toString().split('\n');

    const options = {
        headless: true,
        defaultViewport: null,
        args: [
            '--window-size=1980,800'
        ]
    };


    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    for (let idx in lines) {
        let targeturl = lines[idx].replaceAll("\n", "")
        if (targeturl === "") {
            continue
        }

        const cookies = await getCookieForFile("cookie.txt", targeturl)

        await page.setCookie(...cookies);
        await page.goto(targeturl);
        const date = new Date().toLocaleString('sv').replace(/\D/g, '');
        const filename = `puppeteer_ss_${date}.png`
        console.log(`save screenshot. filePath:${filename}, URL:${targeturl}`)
        await page.screenshot({path: filename, fullPage: true});


    }


    await browser.close();

})();
