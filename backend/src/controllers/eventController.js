const BuildEvent = require('../models/BuildEvent');
const { validateEvent, computeSummary } = require('../services/eventService');

async function createEvent(req, res) {
  const { valid, error } = validateEvent(req.body);
  if (!valid) return res.status(400).json({ error });

  try {
    const event = await BuildEvent.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getEvents(req, res) {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;

    const limit = parseInt(req.query.limit) || 100;
    const events = await BuildEvent.find(filter).sort({ timestamp: -1 }).limit(limit);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getSummary(req, res) {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;

    const events = await BuildEvent.find(filter).sort({ timestamp: -1 });
    const summary = computeSummary(events);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createEvent, getEvents, getSummary };
