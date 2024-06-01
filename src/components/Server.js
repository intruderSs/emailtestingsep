// 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { simpleParser } = require('mailparser');
const { JSDOM } = require('jsdom');

const app = express();

// Use CORS middleware
app.use(cors({
  origin: '*',  // Allow all origins, adjust as needed
}));

app.use(bodyParser.json({ limit: '10mb' }));

app.post('/parse-file', async (req, res) => {
  try {
    const { fileContent, fileType } = req.body;

    if (fileType === 'eml') {
      const parsedEmail = await simpleParser(fileContent);
      console.log('Parsed email from eml file:');

      if (parsedEmail.html) {
        res.json({ htmlContent: parsedEmail.html });
      } else {
        res.status(400).json({ error: 'No HTML content found in the .eml file' });
      }
    } else if (fileType === 'html') {
      const dom = new JSDOM(fileContent);
      const htmlContent = dom.serialize();
      console.log('Parsed email from html file:');
      res.json({ htmlContent });
    } else {
      res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
