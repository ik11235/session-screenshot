const puppeteer = require('puppeteer');
const fs = require("fs");
const url = require("url");


async function getCookieForFile(filepath, targetDomain) {
    const fs = require('fs');
    let text = fs.readFileSync(filepath);
    let cookies = [];

    let lines = text.toString().split('\n');

    for (let idx in lines) {
        let line = lines[idx].replaceAll("\n", "")
        let cookieAry = line.split('=');
        if (cookieAry[0] !== "") {
            const cookie = {
                'name': cookieAry[0],
                'value': cookieAry[1],
                'domain': targetDomain,
            }
            cookies.push(cookie);
        }
    }

    return cookies;
}

function convertUrlToFilename(uri) {
    if (uri.path === "/") {
        return uri.host
    } else {
        return uri.path.replaceAll("/", "_").slice(1)
    }
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
        let targetUrl = lines[idx].replaceAll("\n", "")
        if (targetUrl === "") {
            continue
        }

        const url = require('url')
        const uri = url.parse(targetUrl)

        const cookies = await getCookieForFile("cookie.txt", uri.host)

        await page.setCookie(...cookies);
        await page.goto(targetUrl);
        const date = new Date().toLocaleString('sv').replace(/\D/g, '');

        const filename = `screenshot/${convertUrlToFilename(uri)}_${date}.png`
        console.log(`save screenshot. filePath:${filename}, URL:${targetUrl}`)
        await page.screenshot({path: filename, fullPage: true});
    }

    await browser.close();
})();
