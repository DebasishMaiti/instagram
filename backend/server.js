const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const instaRoutes = require("./routes.js/instagramRoutes")

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/instagram', instaRoutes)

app.get('/',(req,res)=>{
    res.json('Debasish Maiti')
})
 app.get('/Rampur',(req,res)=>{
    res.json('Debasish Maiti from Rampur')
 })
app.listen(5000, () => console.log('🚀 Backend running on http://localhost:5000'));
