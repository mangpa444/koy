
const express = require('express');
const { Groq } = require('groq');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let apiUsage = 0;

app.post('/api/generate', async (req, res) => {
  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ error: 'Model and prompt are required' });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
    });

    apiUsage++;

    res.json({
      result: completion.choices[0].message.content,
      usage: apiUsage,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.get('/api/usage', (req, res) => {
  res.json({ usage: apiUsage });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});