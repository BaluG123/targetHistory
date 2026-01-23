
const { historicalEvents } = require('./src/data/historicalData');
console.log('Historical Events count:', historicalEvents.length);
if (historicalEvents.length > 0) {
    console.log('First event:', historicalEvents[0].title);
} else {
    console.log('Historical events array is empty!');
}
