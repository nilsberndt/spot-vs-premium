const HTMLParser = require('node-html-parser')
const fetch = require('node-fetch')

const spotSites = {
  kitcoSilver: {
    url: 'https://www.kitco.com/charts/livesilver.html',
    targetId: '#sp-bid',
  },
}

const silverEagleSites = {
  bullionExchanges: {
    url: 'https://bullionexchanges.com/1-oz-silver-american-eagle-bu-random-year',
    targetId: '#product-minimal-price-4108',
  }
}

const silverGenericSites = {
  bullionExchanges: {
    url: 'https://bullionexchanges.com/buffalo-design-rmc-1-oz-999-fine-silver-round',
    targetId: '#product-minimal-price-2359',
  }
}

const parseSite = async (siteText, siteTargetId) => {
  const root = HTMLParser.parse(siteText)
  return root.querySelector(siteTargetId).rawText
}

const scrapeItem = async site => {
  const siteText = await fetch(site.url).then(x => x.text())
  const rawParsedText = await parseSite(siteText, site.targetId)
  const cleanParsedText = rawParsedText.replace('$','')
  return cleanParsedText
}

const scrapeAllSpots = async () => { 
  const prices = {
    silverSpotPrice: await scrapeItem(spotSites.kitcoSilver),
  }
  return prices
}

const scrapeSilverEagles = async () => {
  const rawPrice = await scrapeItem(silverEagleSites.bullionExchanges)
  const finalPrice = (parseFloat(rawPrice) + 1.50).toFixed(2)
  return finalPrice
}

const scrapeSilverGenerics = async () => {
  const rawPrice = await scrapeItem(silverGenericSites.bullionExchanges)
  const finalPrice = (parseFloat(rawPrice) + 2.00).toFixed(2)
  return finalPrice
}

module.exports = {
  scrapeAllSpots,
  scrapeSilverEagles,
  scrapeSilverGenerics,
}


