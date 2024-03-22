const fs = require('fs').promises;
const axios = require('axios');
const express = require('express');
const app = express();
import('node-fetch').then(({ default: fetch }) => {
    // Your code that uses fetch goes here
}).catch(error => {
    console.error("Error importing node-fetch:", error);
});


// Route to handle search requests
app.get('/search/:topic', async (req, res) => {
    const topic = req.params.topic;
    try {
        const response = await fetch(`http://localhost:8001/search/${topic}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error processing search request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// // Route to search books by topic
app.get('/info/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await fetch(`http://localhost:8001/info/${id}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error processing search request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


const port=8000;
app.listen(port,() =>
{
    console.log("API server started at port 8000");
}) 

