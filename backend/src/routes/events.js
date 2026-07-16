const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getSummary } = require('../controllers/eventController');

// summary MUST come before /:id or Express treats "summary" as an id param
router.get('/summary', getSummary);
router.get('/', getEvents);
router.post('/', createEvent);

module.exports = router;
