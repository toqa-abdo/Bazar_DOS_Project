const express = require('express');
const fs = require('fs');

const front=express();
front.use(express.json());


front.get('/books/:topic', async (req, res) => {
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


front.get('/books/info/:id', async (req, res) => {
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


const port=4000;
front.listen(port,() =>
{
    console.log("API server started at port 5000");
})


