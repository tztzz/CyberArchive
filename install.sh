#!/usr/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
node -v
npm -v
npm i puppeteer
npm i --save @cliqz/adblocker-puppeteer
npm audit fix