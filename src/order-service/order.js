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
app.get('/purchase/:bookid', async (req, res) => {
    const id = req.params.bookid;
    try {
        const response = await fetch(`http://localhost:8001/purchase/${id}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error processing search request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
//  handle cost update requests
app.put('/updateCost/:bookid/:newCost', async (req, res) => {
    const bookId = parseInt(req.params.bookid);
    const newCost = parseFloat(req.params.newCost);

    try {
        // Make a PUT request to the catalog server to update the cost of the book
        const response = await fetch(`http://localhost:8001/updateCost/${bookId}/${newCost}`, {
            method: 'PUT'
        });

        // Check if the response is successful
        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
            res.status(200).json(data);
        } else {
            // Handle the case where the response is not successful
            console.error("Error updating cost:", response.statusText);
            res.status(response.status).json({ success: false, message: "Error updating cost" });
        }
    } catch (error) {
        console.error("Error updating cost:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// update stock
app.put('/update-stock/:bookid/:newstock', async (req, res) => {
    const bookId = req.params.bookid;
    const newStock = req.params.newstock;

    try {
        const response = await fetch(`http://localhost:8001/update-stock/${bookId}/${newStock}`, {
            method: 'PUT'
        });

        // Check if the response was successful
        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            throw new Error('Failed to update stock count');
        }
    } catch (error) {
        console.error("Error updating stock count:", error);
        res.status(500).json({ success: false, message: "Failed to update stock count" });
    }
});

const port=8002;
app.listen(port,() =>
{
    console.log("API server started at port 8002");
})