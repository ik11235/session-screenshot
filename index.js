const puppeteer = require('puppeteer');

async function readForFileAndSplitArray(filepath) {
    const fs = require('fs');
    const text = fs.readFileSync(filepath);
    let res = [];

    const lines = text.toString().split('\n');
    for (let idx in lines) {
        const line = lines[idx].trim();
        if (line !== "") {
            res.push(line);
        }
    }

    return res;
}

async function getCookieForFile(filepath, targetDomain) {
    let cookies = [];
    const lines = await readForFileAndSplitArray(filepath);

    for (let idx in lines) {
        const line = lines[idx];
        const cookieAry = line.split('=');
        const cookie = {
            'name': cookieAry[0], 'value': cookieAry[1], 'domain': targetDomain,
        }
        cookies.push(cookie);
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
    const url = require('url')

    const options = {
        headless: true, defaultViewport: null, args: ['--window-size=1980,800']
    };

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    const targetUrlList = await readForFileAndSplitArray('target_url_list.txt');

    for (let idx in targetUrlList) {
        const targetUrl = targetUrlList[idx]

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
