const data = require('../data')
const fs = require('fs')

const initData = data.data
const {
  silverEaglePremium,
  silverEaglePrice,
  silverGenericPremium,
  silverGenericPrice,
} = initData
let modData = initData

const EAGLE_MOD_PREMIUM = 1.0937
const EAGLE_MOD_PRICE = 1.0256
const GENERIC_MOD_PRICE = 1.0049
const GENERIC_MOD_PREMIUM = 1.0245

//Fix Eagle Premiums
const silverEaglePremiumKeys = Object.keys(silverEaglePremium)
let modSilverEaglePremium = silverEaglePremium
silverEaglePremiumKeys.map(key => {
  modSilverEaglePremium[key] = (modSilverEaglePremium[key] * EAGLE_MOD_PREMIUM).toFixed(2)
})

//Fix Eagle Prices
const silverEaglePriceKeys = Object.keys(silverEaglePrice)
let modSilverEaglePrice = silverEaglePrice
silverEaglePriceKeys.map(key => {
  modSilverEaglePrice[key] = (modSilverEaglePrice[key] * EAGLE_MOD_PRICE).toFixed(2)
})

//Fix Generic Premiums
const silverGenericPremiumKeys = Object.keys(silverGenericPremium)
let modSilverGenericPremium = silverGenericPremium
silverGenericPremiumKeys.map(key => {
  modSilverGenericPremium[key] = (modSilverGenericPremium[key] * GENERIC_MOD_PREMIUM).toFixed(2)
})

//Fix Generic Prices
const silverGenericPriceKeys = Object.keys(silverGenericPrice)
let modSilverGenericPrice = silverGenericPrice
silverGenericPriceKeys.map(key => {
  modSilverGenericPrice[key] = (modSilverGenericPrice[key] * GENERIC_MOD_PRICE).toFixed(2)
})


modData.silverEaglePremium = modSilverEaglePremium
modData.silverEaglePrice = modSilverEaglePrice
modData.silverGenericPremium = modSilverGenericPremium
modData.silverGenericPrice = modSilverGenericPrice

fs.writeFile("test.json", JSON.stringify(modData), function(err) {
  if (err) throw err;
  console.log('complete')
})