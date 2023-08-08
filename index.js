const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Replace with your Supabase credentials
const supabaseUrl = 'https://qcmamloppghscunvukxc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbWFtbG9wcGdoc2N1bnZ1a3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA3OTU0OTYsImV4cCI6MjAwNjM3MTQ5Nn0.ijDUlw8KCYvr-C1_qyuizuqeEUaMamAmfw2BQizmrzk';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(cors());

// Define a function to create the table if it doesn't exist
async function createTableIfNotExists() {
  try {
    // Supabase handles table creation automatically when you insert data
    console.log('Table "MEMBERS" created (if not existed).');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create the table at application startup
createTableIfNotExists();

app.use(express.json());
// Use the cors middleware with specific options
app.use(cors({
  origin: '*', // Replace with your React app's domain or '*' for any origin
  methods: 'GET,POST',
}));

app.post('/members', async (req, res) => {
  try {
    const {
      memberName,
      memberEmail,
      contactNo,
      residence,
      microchurchId,
    } = req.body;

    const { data, error } = await supabase
      .from('MEMBERS')
      .insert({
        MEMBERNAME: memberName,
        MEMBEREMAIL: memberEmail,
        CONTACTNO: contactNo,
        RESIDENCE: residence,
        MICROID: microchurchId,
      });

    if (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed.' });
    } else {
      res.status(201).json({ message: 'Registration successful!', data });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});


app.get('/members', async (req, res) => {
  const { residence } = req.query;
  if (!residence) {
    return res.status(400).json({ error: 'Invalid residence provided.' });
  }

  try {
    const { data, error } = await supabase
      .from('MEMBERS')
      .select('*')
      .eq('RESIDENCE', residence);

    if (error) {
      console.error('Error retrieving members:', error);
      res.status(500).json({ error: 'Failed to retrieve members.' });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error retrieving members:', error);
    res.status(500).json({ error: 'Failed to retrieve members.' });
  }
});
// // Load microchurches and zones data from JSON files
// const microchurchesFilePath = path.join(__dirname, 'data', 'microchurches.json');
// const microchurchesData = JSON.parse(fs.readFileSync(microchurchesFilePath, 'utf8'));

// app.get('/microchurches', (req, res) => {
//   try {
//     res.json(microchurchesData);
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//     res.status(500).json({ error: 'Failed to retrieve data.' });
//   }
// });
// const zonesFilePath = path.join(__dirname, 'data', 'zones.json');
// const zonesData = JSON.parse(fs.readFileSync(zonesFilePath, 'utf8'));

// app.get('/zones', (req, res) => {
//   try {
//     res.json(zonesData);
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//     res.status(500).json({ error: 'Failed to retrieve data.' });
//   }
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
