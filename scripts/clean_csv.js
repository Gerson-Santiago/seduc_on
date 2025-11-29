import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const inputFile = 'csv/ALUNOS.csv';
const outputFile = 'csv/ALUNOS_clean.csv';

const students = new Map();

fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    const ra = row.ra;
    if (!ra) return;

    if (students.has(ra)) {
      const existing = students.get(ra);
      // Prioritize ATIVO
      if (existing.situacao !== 'ATIVO' && row.situacao === 'ATIVO') {
        students.set(ra, row);
      }
      // If both are ATIVO or neither, maybe keep the one with more info or just the first/last?
      // For now, let's stick to keeping the first one unless the new one is ATIVO and the old one isn't.
    } else {
      students.set(ra, row);
    }
  })
  .on('end', async () => {
    const records = Array.from(students.values());
    
    if (records.length === 0) {
        console.log("No records found.");
        return;
    }

    // Get headers from the first record
    const header = Object.keys(records[0]).map(id => ({ id, title: id }));

    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: header
    });

    await csvWriter.writeRecords(records);
    console.log(`Cleaned CSV written to ${outputFile}. Total unique records: ${records.length}`);
  });
