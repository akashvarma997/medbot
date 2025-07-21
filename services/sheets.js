const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Path to the local CSV file
const csvFilePath = path.join(__dirname, '..', 'ACL Patient Database - Sheet1.csv');

// New: Function to get surgery-specific Q&A from the respective CSV file
async function getSurgicalQnA(surgeryType) {
  return new Promise((resolve, reject) => {
    const fileName = surgeryType.toLowerCase().replace(/[^a-z0-9]/gi, '_') + '.csv';
    const csvFilePath = path.join(__dirname, '..', fileName);

    if (!fs.existsSync(csvFilePath)) {
      resolve(null);
      return;
    }

    const qna = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row['Section'] && row['Question'] && row['Answer']) {
          qna.push(`Question tag: ${row['Section'].trim()}\nQ: ${row['Question'].trim()}\nA: ${row['Answer'].trim()}`);
        }
      })
      .on('end', () => {
        resolve(qna.join('\n\n'));
      })
      .on('error', (err) => {
        console.error('CSV Read Error:', err.message);
        reject(null);
      });
  });
}


// Function to fetch full patient record by phone number
async function getPatientData(phone) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        const patient = results.find(r => r["Contact no"] === phone);
        if (patient) {
          // Format the full row as key-value string
          const formattedData = Object.entries(patient)
            .map(([key, value]) => `${key} = ${value}`)
            .join('\n');
            // console.log("Formatted Data:", formattedData);
          resolve({
            fullRecord: formattedData,
            raw: patient
          });
        } else {
          resolve(null);
        }
      })
      .on('error', (err) => {
        console.error('CSV Read Error:', err.message);
        reject(null);
      });
  });
}

module.exports = { getPatientData, getSurgicalQnA };
