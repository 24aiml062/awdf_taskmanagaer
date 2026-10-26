const EventEmitter = require('events');

class TaskEventsEmitter extends EventEmitter {}

const taskEvents = new TaskEventsEmitter();

module.exports = taskEvents;
