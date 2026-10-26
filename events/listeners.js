const taskEvents = require('./taskEvents');

// P10: Asynchronous event handler for task-created event
taskEvents.on('task-created', (task) => {
  // Execute asynchronously to demonstrate non-blocking architecture
  setImmediate(() => {
    const timestamp = new Date().toISOString();
    console.log(`[EventEmitter Notification] [${timestamp}] New task registered: "${task.title}" (ID: ${task._id})`);
  });
});

console.log('Task event listeners registered.');
