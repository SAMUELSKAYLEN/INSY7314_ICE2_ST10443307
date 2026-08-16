const books = [
    {
        id: 'b1',
        title: 'The Great Gatsby',
        category: 'Classic',
        condition: 'New',
        description: 'A classic novel about wealth, love, and the American Dream.'
    },
    {
        id: 'b2',
        title: 'Atomic Habits',
        category: 'Self-Help',
        condition: 'Used',
        description: 'A practical guide to building good habits and breaking bad ones.'
    }
];

const getAllBooks = (req, res) => {
    const safeBooks = books.map(({ id, title, category, condition }) => ({
        id,
        title,
        category,
        condition
    }));

    res.status(200).json({
        count: safeBooks.length,
        data: safeBooks
    });
};

const getBookByID = (req, res) => {
    const { id } = req.params;

    if (!/^[a-zA-Z0-9-]+$/.test(id)) {
        return res.status(400).json({
            error: 'Invalid book ID format'
        });
    }

    const book = books.find((item) => item.id === id);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    res.status(200).json({
        data: book
    });
};

const createBook = (req, res) => {
    const { title, category, condition, description } = req.body;

    const newBook = {
        id: `b${books.length + 1}`,
        title,
        category,
        condition,
        description
    };

    books.push(newBook);

    res.status(201).json({
        message: 'Book created',
        data: newBook
    });
};

module.exports = {
    getAllBooks,
    getBookByID,
    createBook
};