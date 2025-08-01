const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const axios = require('axios');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-pix', async (req, res) => {
  const { name, email, amount } = req.body;

  try {
    const response = await axios.post('https://app.duckfy.com.br/api/v1/gateway/pix/receive', {
      identifier: 'pix-' + Date.now(),
      amount: parseFloat(amount),
      client: {
        name,
        email
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'public-key': 'iago-ruan0609_pwjpdypt6q8eg3fc',
        'private-key': 'c40aw13c47m4xz3294av56v5o5dilvjitrhci9orrh5uhoeklwiusvl1frful4xq'
      }
    });

    const { qrCode, payload } = response.data.pixInformation;
    res.json({ qrCode, payload });
  } catch (error) {
    res.status(500).send('Erro ao gerar Pix');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
