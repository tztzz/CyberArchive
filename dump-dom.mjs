#!/usr/bin/env node
import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs';
import https from 'node:https';
import crypto from 'node:crypto';

import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const url = process.argv[2];

try {
    new URL(url);
}
catch (err) {
    console.log('[!] Abording: Given argument is not a valid URL.');
    process.exit(0);
}

const currentPath = path.join(process.cwd());

const folderHash = crypto.createHash('sha256');
folderHash.update(url);

const blocker = PuppeteerBlocker.parse([
    fs.readFileSync(currentPath + '/ad-block-lists/fanboy-cookiemonster.txt', 'utf-8'),
    fs.readFileSync(currentPath + '/ad-block-lists/easylist.txt', 'utf-8')
].join('\n'));

const browser = await puppeteer.launch({
    headless: true,
    args: [
        '--no-sandbox',
        '--no-zygote',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--run-all-compositor-stages-before-draw',
        '--hide-scrollbars',
        '--autoplay-policy=no-user-gesture-required',
        '--disable-software-rasterizer',
        '--run-all-compositor-stages-before-draw',
        '--hide-scrollbars',
        '--autoplay-policy=no-user-gesture-required',
        '--no-first-run',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--disable-web-security',
        '--ignore-certificate-errors'
    ]
});

const hashPath = `${currentPath}/${folderHash.digest('hex')}/`;

if (!fs.existsSync(hashPath)) {
    fs.mkdirSync(hashPath);

    try {
        const page = await browser.newPage();
        await blocker.enableBlockingInPage(page);

        // https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: ['load', 'domcontentloaded'] });
        const source = await page.content();

        fs.writeFile(`${hashPath}/dom.html`, source, err => {
            if (err) {
                console.log(err);
            }
        });

        const domJS = new JSDOM(source, {url: url});

        fs.writeFile(`${hashPath}/readability.html`, new Readability(domJS.window.document).parse().content, err => {
            if (err) {
                console.log(err);
            }
        });

        const metadata = {
            'title': await page.title(),
            'time': Math.floor(Date.now() / 1000)
        };

        fs.writeFile(`${hashPath}/metadata.json`, JSON.stringify(metadata, null, 2), err => {
            if (err) {
                console.log(err);
            }
        });

        const faviconUrl = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`;
        const faviconDat = fs.createWriteStream(`${hashPath}/favicon.png`);

        https.get(faviconUrl, (res) => {
            res.pipe(faviconDat);
        });
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await browser.close();
    }

    console.log('[!] Success: URL cached under', hashPath);
}
else {
    console.log('[!] Abording: URL already in cached.');
    await browser.close();
}
