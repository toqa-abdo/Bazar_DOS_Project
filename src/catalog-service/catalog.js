const express = require('express');
const front = express();
const fs = require('fs'); // Import the fs module

front.get('/search/:topic', async (req, res) => {
    const topic = req.params.topic; // Access the topic parameter from the route

    try {
        const data = fs.readFileSync('./db.txt', 'utf8');
        const lines = data.split('\n');
        const books = [];

        lines.forEach(line => {
            const fields = line.split('/');
            console.log('Fields:', fields); // Log the fields array to inspect its contents
            const bookName = fields[0];
            const itemsInStock = parseInt(fields[1]);
            const cost = parseInt(fields[2]);
            const topicOfBook = fields[3];
            const itemId = parseInt(fields[4]);
        
            if (!topic || topicOfBook.toLowerCase() === topic.toLowerCase()) {
                const book = {
                    id: itemId,
                    name: bookName,
                    itemsInStock: itemsInStock,
                    cost: cost,
                    topic: topicOfBook
                };
                books.push(book);
            }
        })
        console.log('books:', books);
            

        res.json(books);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

front.get('/info/:id', async (req, res) => {
    const id = req.params.id; // Access the id parameter from the route

    try {
        const data = fs.readFileSync('./db.txt', 'utf8');
        const lines = data.split('\n');

        let bookInfo = null; // Initialize variable to store book information

        lines.forEach(line => {
            const fields = line.split('/');
            const itemId = parseInt(fields[4]);

            if (itemId === parseInt(id)) {
                const bookName = fields[0];
                const itemsInStock = parseInt(fields[1]);
                const cost = parseInt(fields[2]);

                bookInfo = {
                    name: bookName,
                    itemsInStock: itemsInStock,
                    cost: cost
                };
            }
        });

        if (bookInfo) {
            res.json(bookInfo); // Return book information if found
        } else {
            res.status(404).json({ error: 'Book not found' }); // Return 404 error if book with given id is not found
        }
    } catch (error) {
        res.status(500).send(error.message); // Return 500 error if there's an internal server error
    }
});

// purchase
function readDatabase() {
    const data = fs.readFileSync('db.txt', 'utf8');
    const lines = data.split('\n');
    const database = [];

    lines.forEach(line => {
        const fields = line.split('/');
        const bookId = parseInt(fields[4]);
        database.push({ name: fields[0], stock: parseInt(fields[1]), cost: parseFloat(fields[2]), topic: fields[3], bookId });
    });

    return database;
}

// Function to write to the database file
function writeDatabase(database) {
    const data = database.map(entry => `${entry.name}/${entry.stock}/${entry.cost}/${entry.topic}/${entry.bookId}`).join('\n');
    fs.writeFileSync('db.txt', data);
}

// Route to handle purchase requests
front.get('/purchase/:bookid', async (req, res) => {
    const bookId = parseInt(req.params.bookid);

    // Read the database
    const database = readDatabase();

    // Find the book in the database by bookid
    const bookIndex = database.findIndex(entry => entry.bookId === bookId);

    // If book not found or out of stock, return error
    if (bookIndex === -1 || database[bookIndex].stock <= 0) {
        res.status(400).json({ success: false, message: "Item is out of stock or not found" });
        return;
    }

    // Decrement the stock count
    database[bookIndex].stock--;

    // Write the updated database to the file
    writeDatabase(database);

    // Process the purchase (You can add your purchase logic here)

    res.status(200).json({ success: true, message: "Purchase successful" });
});

// handle updating the cost of a book
front.put('/updateCost/:bookid/:newCost', (req, res) => {
    const bookId = parseInt(req.params.bookid);
    const newCost = parseFloat(req.params.newCost);

    // Read the database
    const database = readDatabase();

    // Find the book in the database by bookid
    
    const bookIndex = database.findIndex(entry => entry.bookId === bookId);

    // If book not found, return error
    if (bookIndex === -1) {
        res.status(404).json({ success: false, message: "Book not found" });
        return;
    }

    // Update the cost of the book
    database[bookIndex].cost = newCost.toString(); // Assuming the cost is the third field (index 2)

    // Write the updated database to the file
    writeDatabase(database);

    res.status(200).json({ success: true, message: "Cost updated successfully" });
});


//  handle updating the number of items in stock
front.put('/update-stock/:bookid/:newstock', (req, res) => {
    const bookId = parseInt(req.params.bookid);
    const newStock = parseInt(req.params.newstock);

    // Read the database
    const database = readDatabase();

    // Find the book in the database by bookid
    const bookIndex = database.findIndex(entry => entry.bookId === bookId);

    // If book not found, return error
    if (bookIndex === -1) {
        res.status(400).json({ success: false, message: "Book not found" });
        return;
    }

    // Update the stock count
    database[bookIndex].stock = newStock;

    // Write the updated database to the file
    writeDatabase(database);

    res.status(200).json({ success: true, message: "Stock count updated successfully" });
});


const port=8001;
front.listen(port,() =>
{
    console.log("API server started at port 8001");
})

