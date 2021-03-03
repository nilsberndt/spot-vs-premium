const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./firebase-adminsdk-key.json')
const scraper = require('./scraper/Scraper')


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://spot-vs-premium-default-rtdb.firebaseio.com'
})

const db = admin.database()

exports.changePrices = functions.pubsub.schedule('*/5 * * * *').onRun(async (context) => {
  
  const currentDateTime = new Date()
  const roundedDateTime = new Date(
    Math.round(currentDateTime.getTime() / 60000) * 60000
  ).toUTCString()

  const {
    silverSpotPrice,
  } = await scraper.scrapeAllSpots()

  const silverEaglePrice = await scraper.scrapeSilverEagles()
  const silverEaglePremium = (
    ((parseFloat(silverEaglePrice) / parseFloat(silverSpotPrice)) - 1) * 100
  ).toFixed(2)

  const silverGenericPrice = await scraper.scrapeSilverGenerics()
  const silverGenericPremium = (
    ((parseFloat(silverGenericPrice) / parseFloat(silverSpotPrice)) - 1) * 100
  ).toFixed(2)

  // Last Updated Time
  db.ref('lastUpdatedTime').set(roundedDateTime)

  // Silver Spot
  db.ref('silverSpotPrice/currentPrice').set(silverSpotPrice)
  db.ref(`silverSpotPrice/${roundedDateTime}`).set(silverSpotPrice)

  // Silver Eagles
  db.ref('silverEaglePrice/currentPrice').set(silverEaglePrice)
  db.ref(`silverEaglePrice/${roundedDateTime}`).set(silverEaglePrice)
  db.ref('silverEaglePremium/currentPrice').set(silverEaglePremium)
  db.ref(`silverEaglePremium/${roundedDateTime}`).set(silverEaglePremium)

  // Silver Generics
  db.ref('silverGenericPrice/currentPrice').set(silverGenericPrice)
  db.ref(`silverGenericPrice/${roundedDateTime}`).set(silverGenericPrice)
  db.ref('silverGenericPremium/currentPrice').set(silverGenericPremium)
  db.ref(`silverGenericPremium/${roundedDateTime}`).set(silverGenericPremium)

  return null
})
