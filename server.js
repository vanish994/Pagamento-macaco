const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const PUBLIC_KEY = 'iago-ruan0609_pwjpdypt6q8eg3fc';
const SECRET_KEY = 'c40aw13c47m4xz3294av56v5o5dilvjitrhci9orrh5uhoeklwiusvl1frful4xq';

app.post('/api/pix', async (req, res) => {
  const { name, email, value } = req.body;

  try {
    const response = await axios.post(
      'https://app.duckfy.com.br/api/v1/gateway/pix/receive',
      {
        identifier: 'pix-' + Date.now(),
        amount: parseFloat(value),
        client: {
          name,
          email
        }
      },
      {
        headers: {
          'x-public-key': PUBLIC_KEY,
          'x-secret-key': SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const pixInfo = response.data?.pixInformation;
    res.json({
      pixCopyPaste: pixInfo?.emv,
      qrCode: pixInfo?.qrCodeUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar Pix', details: error.response?.data || error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Servidor rodando na porta ' + port);
});
