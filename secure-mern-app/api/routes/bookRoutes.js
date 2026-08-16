const express = require('express');
const router = express.Router();

const {
    getAllBooks,
    getBookByID,
    createBook
} = require('../controllers/bookController');

const validateBookInput = require('../middleware/validateBookInput');

router.get('/', getAllBooks);
router.get('/:id', getBookByID);
router.post('/', validateBookInput, createBook);

module.exports = router;