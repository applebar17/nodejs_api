const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

const historyFilePath = '.\\history.json'
const defaultContent = {
  "content": [
  ],
  "opt": "Davide",
  "isPrivate": false,
  "personaID": "cff69d42-1841-41fa-a12a-72eeb92590bb"
};

fs.writeFileSync(historyFilePath, JSON.stringify(defaultContent, null, 2));
console.log('History file initialized with default content');


// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// API endpoint for receiving and echoing messages
app.post('/echo', (req, res) => {
  try {
    const input = req.body;

    updateHistory("user", input.content[0].content);
    // Check if the required properties are present in the input JSON
    /*
    if (!input.content || !input.opt || !input.isPrivate || !input.personaID) {
      throw new Error('Invalid input format: Missing required properties');
    }
    */
    // Process the input and create the output JSON
    const output = {
      content: {
        executionTime: `${Date.now() - req.startTime} ms`,
        timestamp: new Date().toString(),
        role: 'assistant',
        content: getSpecificOutput(input.content),
      },
    };

    // Update the history.json file
    updateHistory("assistant", output.content.content);

    res.json(output);
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Middleware to record the start time of the request
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Function to generate a specific output based on the content message
function getSpecificOutput(content) {
  const probability = Math.random();
  // Check if the content message is the specific input you're looking for
  if (probability <= 0.4 ) {
    // Return the specific output
    return 'Contatta operatore';
  }

  // Default output if the specific condition is not met
  return content[0].content;
}
// Function to update the history.json file
function updateHistory(user, content) {
  const historyFilePath = '.\\history.json';

  // Read existing history or initialize an empty array
  let history = [];
  try {
    const historyFile = fs.readFileSync(historyFilePath, 'utf8');
    history = JSON.parse(historyFile);
  } catch (error) {
    console.error('Error reading history file:', error.message);
  }
  console.log(history);
  // Add the current interaction to the history
  history.content.push({role: user, content });

  // Write the updated history back to the file
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
    console.log('History updated successfully');
  } catch (error) {
    console.error('Error writing history file:', error.message);
  }
}

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
