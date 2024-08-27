const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const THIRD_PARTY_API_BASE_URL = 'http://localhost:8080'; // Replace with actual third-party API

// Array to store numbers
let numbersStore = [];

const fetchNumbers = async (numberType) => {
  try {
    const response = await axios.get(`${THIRD_PARTY_API_BASE_URL}/numbers/${numberType}`, {
      timeout: 500 // 500 ms timeout
    });
    return response.data.numbers; // Assuming the response format is { numbers: [] }
  } catch (error) {
    console.error(`Error fetching numbers: ${error.message}`);
    return [];
  }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return '0.00';
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return (sum / numbers.length).toFixed(2);
};

// Express route handler for /numbers/:numberid

app.get('/numbers/:numberid', async (req, res) => {
  const numberId = req.params.numberid;

  // Validate numberId
  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  // Store the previous state of the window
  const windowPrevState = [...numbersStore];

  // Fetch new numbers from the third-party API
  const fetchedNumbers = await fetchNumbers(numberId);

  // Add unique numbers to the store
  fetchedNumbers.forEach((num) => {
    if (!numbersStore.includes(num)) {
      numbersStore.push(num);
    }
  });

  // Ensure the numbersStore does not exceed WINDOW_SIZE
  if (numbersStore.length > WINDOW_SIZE) {
    numbersStore = numbersStore.slice(-WINDOW_SIZE);
  }

  // Calculate the average of the stored numbers
  const avg = calculateAverage(numbersStore);

  // Construct the response object
  const response = {
    windowPrevState,
    windowCurrState: numbersStore,
    numbers: fetchedNumbers,
    avg: parseFloat(avg)
  };

  // Send the response
  res.json(response);
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Average Calculator Microservice is running on http://localhost:${PORT}`);
});
