const mongoose = require('mongoose');

const BuildEventSchema = new mongoose.Schema({
  project:         { type: String, required: true, trim: true },
  status:          { type: String, required: true, enum: ['success', 'failure'] },
  durationSeconds: { type: Number, required: true, min: 0 },
  branch:          { type: String, required: true, default: 'main' },
  timestamp:       { type: Date,   required: true, default: Date.now },
}, { timestamps: false });

// speeds up project filter + time-range queries
BuildEventSchema.index({ project: 1, timestamp: -1 });

module.exports = mongoose.model('BuildEvent', BuildEventSchema);
