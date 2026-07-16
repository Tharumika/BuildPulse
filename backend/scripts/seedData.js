const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const BuildEvent = require('../src/models/BuildEvent');

const projects = ['api-gateway', 'auth-service', 'frontend-deploy'];
const branches = ['main', 'develop', 'feature/auth', 'hotfix/login'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEvents() {
  const events = [];
  const now = new Date();

  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();

    // fewer builds on weekends
    const buildsToday = (dayOfWeek === 0 || dayOfWeek === 6) ? randomInt(0, 1) : randomInt(2, 4);

    for (let i = 0; i < buildsToday; i++) {
      const hour = randomInt(9, 18);
      const minute = randomInt(0, 59);
      const timestamp = new Date(date);
      timestamp.setHours(hour, minute, 0, 0);

      // incident day: 4 days ago, auth-service had a bad day
      const isIncidentDay = daysAgo === 4;
      const project = isIncidentDay && i < 4
        ? 'auth-service'
        : projects[randomInt(0, projects.length - 1)];

      const status = isIncidentDay && i < 4
        ? 'failure'
        : Math.random() > 0.25 ? 'success' : 'failure';

      events.push({
        project,
        status,
        durationSeconds: randomInt(45, 300) + (Math.random() > 0.9 ? randomInt(100, 200) : 0),
        branch: branches[randomInt(0, branches.length - 1)],
        timestamp,
      });
    }
  }

  return events;
}

async function seed() {
  const clearFlag = process.argv.includes('--clear');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  if (clearFlag) {
    await BuildEvent.deleteMany({});
    console.log('Cleared existing events');
  }

  const events = generateEvents();
  await BuildEvent.insertMany(events);
  console.log(`Inserted ${events.length} events`);

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
