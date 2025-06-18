// services/sheets.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Path to your local CSV file
const csvFilePath = path.join(__dirname, '..', 'demo_patient_data_extended.csv');

// Helper function to read data from local CSV
async function getPatientData(phone) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        const patient = results.find(r => r["Phone Number"] === phone);
        if (patient) {
          resolve({
            prescription: patient["Prescription"] || '',
            history: patient["Medical History"] || ''
          });
        } else {
          resolve(null); // not found
        }
      })
      .on('error', (err) => {
        console.error('CSV Read Error:', err.message);
        reject(null);
      });
  });
}

module.exports = { getPatientData };
