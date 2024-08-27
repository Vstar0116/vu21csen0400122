const express = require('express');

const app = express();
const PORT = 8080;

// Utility function to generate the first N prime numbers
const generatePrimes = (n) => {
  const primes = [];
  let num = 2; // Start from the first prime number

  while (primes.length < n) {
    if (primes.every((p) => num % p !== 0)) {
      primes.push(num);
    }
    num++;
  }

  return primes;
};

// Utility function to generate the first N Fibonacci numbers
const generateFibonacci = (n) => {
  const fibonacci = [0, 1];
  for (let i = 2; i < n; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
  }
  return fibonacci.slice(0, n);
};

// Utility function to generate the first N even numbers
const generateEvenNumbers = (n) => {
  const evens = [];
  for (let i = 0; i < n; i++) {
    evens.push(i * 2);
  }
  return evens;
};

// Utility function to generate N random numbers
const generateRandomNumbers = (n) => {
  const randoms = [];
  for (let i = 0; i < n; i++) {
    randoms.push(Math.floor(Math.random() * 100)); // Random numbers between 0 and 99
  }
  return randoms;
};

// Route to handle /numbers/{numberType}
app.get('/numbers/:numberType', (req, res) => {
  const numberType = req.params.numberType;
  const count = 10; // Number of numbers to generate; adjust as needed
  let numbers;

  switch (numberType) {
    case 'p':
      numbers = generatePrimes(count);
      break;
    case 'f':
      numbers = generateFibonacci(count);
      break;
    case 'e':
      numbers = generateEvenNumbers(count);
      break;
    case 'r':
      numbers = generateRandomNumbers(count);
      break;
    default:
      return res.status(400).send('Invalid number type');
  }

  res.json({ numbers });
});

app.listen(PORT, () => {
  console.log(`Third-Party API is running on http://localhost:${PORT}`);
});
