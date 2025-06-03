const express =  require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')


//import routes
const campaignRoutes = require('./routes/campaignRoutes')
const messageRoutes = require('./routes/messageRoutes')
const profileRoutes = require('./routes/profileRoutes')
const scraperRoutes = require('./routes/scraperRoutes')

//load environment variables
dotenv.config()




//initialize express app
const app = express()
const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/outflo'

//middleware to enable CORS
// Allow only your Vercel frontend URL
const allowedOrigins = [
  'https://outflo-assigment.vercel.app/', // Vercel frontend
  'http://localhost:5173', // local dev
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));



//middleware to parse JSON requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//define API routes
app.use('/api/campaigns', campaignRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/scraper', scraperRoutes)

//connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
