const https = require('https');
const fs = require('fs');
const path = require('path');

const companySlugs = {
  'google': 'Google',
  'amazon': 'Amazon',
  'microsoft': 'Microsoft',
  'jpmorgan': 'JPMorganChase',
  'tcs': 'TCS',
  'infosys': 'Infosys',
  'accenture': 'Accenture',
  'cognizant': 'Cognizant',
  'capgemini': 'Capgemini',
  'wipro': 'Wipro',
  'apple': 'Apple',
  'meta': 'Meta',
  'netflix': 'Netflix',
  'uber': 'Uber',
  'goldman-sachs': 'Goldman Sachs',
  'adobe': 'Adobe',
  'salesforce': 'Salesforce',
  'oracle': 'Oracle',
  'cisco': 'Cisco',
  'bloomberg': 'Bloomberg'
};

function fetchCsv(slug) {
  return new Promise((resolve) => {
    const url = 'https://raw.githubusercontent.com/snehasishroy/leetcode-companywise-interview-questions/master/' + slug + '/all.csv';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function parseCsv(csvText, companyName, companySlug) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  const questions = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    parts.push(cur.trim());
    
    if (parts.length >= 4) {
      const id = parts[0];
      const url = parts[1];
      const title = parts[2];
      const difficulty = parts[3] || 'Medium';
      const acceptance = parts[4] || '';
      const frequency = parts[5] || '';
      
      let topic = 'Algorithms';
      const lt = title.toLowerCase();
      if (lt.includes('tree') || lt.includes('bst')) topic = 'Trees';
      else if (lt.includes('graph') || lt.includes('island') || lt.includes('course')) topic = 'Graphs';
      else if (lt.includes('list')) topic = 'Linked Lists';
      else if (lt.includes('matrix') || lt.includes('grid')) topic = 'Matrix';
      else if (lt.includes('string') || lt.includes('palindrome') || lt.includes('anagram') || lt.includes('word')) topic = 'Strings';
      else if (lt.includes('sum') || lt.includes('array') || lt.includes('subarray') || lt.includes('numbers')) topic = 'Arrays';
      else if (lt.includes('dp') || lt.includes('jump') || lt.includes('stock') || lt.includes('path')) topic = 'Dynamic Programming';
      else if (lt.includes('search') || lt.includes('binary')) topic = 'Searching';
      else if (lt.includes('stack') || lt.includes('parentheses')) topic = 'Stacks';
      
      questions.push({
        id: companySlug + '_' + id,
        problemId: id,
        title,
        url,
        difficulty,
        acceptance,
        frequency,
        company: companyName,
        companySlug,
        topic,
        recency: 'All Time'
      });
    }
  }
  return questions;
}

(async () => {
  const dataset = {};
  for (const [slug, name] of Object.entries(companySlugs)) {
    const csv = await fetchCsv(slug);
    const parsed = parseCsv(csv, name, slug);
    console.log(slug + ': ' + parsed.length + ' questions');
    dataset[slug] = {
      name,
      slug,
      questionCount: parsed.length,
      questions: parsed
    };
  }
  
  const totalQuestions = Object.values(dataset).reduce((s, c) => s + c.questionCount, 0);
  const outputCode = `export const COMPANY_QUESTIONS_DATASET_META = {
  source: "https://github.com/snehasishroy/leetcode-companywise-interview-questions",
  snapshotDate: "2026-10-21",
  totalCompanies: ${Object.keys(dataset).length},
  totalQuestions: ${totalQuestions}
};

export const COMPANY_QUESTIONS_DATA = ${JSON.stringify(dataset, null, 2)};
`;
    
  const targetPath = path.resolve(__dirname, '..', 'src', 'data', 'companyQuestionsData.js');
  fs.writeFileSync(targetPath, outputCode, 'utf8');
  console.log('Saved to ' + targetPath + ' with ' + totalQuestions + ' questions across ' + Object.keys(dataset).length + ' companies!');
})();
