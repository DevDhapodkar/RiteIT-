const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'RiteIT Backend' });
});

// Mock Endpoints
app.post('/api/auth/register', (req, res) => {
  const { role, email } = req.body;
  // TODO: implement real registration
  res.json({ message: 'User registered', role, email });
});

app.listen(port, () => {
  console.log(`RiteIT backend listening on port ${port}`);
});
