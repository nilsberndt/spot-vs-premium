import app from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.db = app.database()
  }

  // Last Updated
  lastUpdatedTime = () => this.db.ref('lastUpdatedTime')

  // Silver Spot
  silverSpotPrice = () => this.db.ref('silverSpotPrice')
  
  // Silver Eagles
  silverEaglePrice = () => this.db.ref('silverEaglePrice')
  silverEaglePremium = () => this.db.ref('silverEaglePremium')

  // Silver Generics
  silverGenericPrice = () => this.db.ref('silverGenericPrice')
  silverGenericPremium = () => this.db.ref('silverGenericPremium')
}

export default Firebase