// API Server para deploy no Railway
import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock users
const users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com',
    nif: '123456789',
    token: 'railway-token-123'
  },
  {
    id: 2,
    name: 'Maria',
    email: 'maria@exemplo.com',
    nif: '987654321',
    token: 'railway-token-456'
  }
];

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API a funcionar no Railway!  ' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  
  if (user && (password === '123456' || password === 'password123')) {
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: user.token
    });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { name, email, nif, password } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(422).json({ error: 'Email já existe' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    nif,
    token: `railway-token-${Date.now()}`
  };
  
  users.push(newUser);
  
  res.json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token: newUser.token
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    processos: 42,
    ruas: 15,
    freguesias: 8,
    tipos: 5
  });
});

// Mock CRUD endpoints
app.get('/api/processos', (req, res) => {
  res.json({
    data: [
      { id: 1, processo: 'PROC-001', alvara: 'ALV-001', validade: 'valido', alojamentoLocal: 'sim' },
      { id: 2, processo: 'PROC-002', alvara: 'ALV-002', validade: 'expirado', alojamentoLocal: 'nao' }
    ]
  });
});

app.post('/api/processos', (req, res) => {
  const { processo, alvara, validade, alojamentoLocal } = req.body;
  const newProcesso = {
    id: Date.now(),
    processo,
    alvara,
    validade,
    alojamentoLocal
  };
  res.json(newProcesso);
});

app.put('/api/processos/:id', (req, res) => {
  const { id } = req.params;
  const { processo, alvara, validade, alojamentoLocal } = req.body;
  res.json({ id, processo, alvara, validade, alojamentoLocal });
});

app.delete('/api/processos/:id', (req, res) => {
  res.json({ message: 'Processo deletado com sucesso' });
});

app.get('/api/ruas', (req, res) => {
  res.json({
    data: [
      { id: 1, rua: 'Rua Principal', coordenada: '40.7128,-74.0060', freguesias_id: 1 },
      { id: 2, rua: 'Avenida Central', coordenada: '40.7589,-73.9851', freguesias_id: 1 }
    ]
  });
});

app.post('/api/ruas', (req, res) => {
  const { rua, coordenada, freguesias_id } = req.body;
  const newRua = { id: Date.now(), rua, coordenada, freguesias_id };
  res.json(newRua);
});

app.put('/api/ruas/:id', (req, res) => {
  const { id } = req.params;
  const { rua, coordenada, freguesias_id } = req.body;
  res.json({ id, rua, coordenada, freguesias_id });
});

app.delete('/api/ruas/:id', (req, res) => {
  res.json({ message: 'Rua deletada com sucesso' });
});

app.get('/api/freguesias', (req, res) => {
  res.json({
    data: [
      { id: 1, freguesia: 'São João' },
      { id: 2, freguesia: 'Santa Maria' }
    ]
  });
});

app.post('/api/freguesias', (req, res) => {
  const { freguesia } = req.body;
  const newFreguesia = { id: Date.now(), freguesia };
  res.json(newFreguesia);
});

app.put('/api/freguesias/:id', (req, res) => {
  const { id } = req.params;
  const { freguesia } = req.body;
  res.json({ id, freguesia });
});

app.delete('/api/freguesias/:id', (req, res) => {
  res.json({ message: 'Freguesia deletada com sucesso' });
});

app.get('/api/tipopublicidade', (req, res) => {
  res.json({
    data: [
      { id: 1, publicidade: 'Outdoor' },
      { id: 2, publicidade: 'Painel' },
      { id: 3, publicidade: 'Banner' }
    ]
  });
});

app.post('/api/tipopublicidade', (req, res) => {
  const { publicidade } = req.body;
  const newTipo = { id: Date.now(), publicidade };
  res.json(newTipo);
});

app.put('/api/tipopublicidade/:id', (req, res) => {
  const { id } = req.params;
  const { publicidade } = req.body;
  res.json({ id, publicidade });
});

app.delete('/api/tipopublicidade/:id', (req, res) => {
  res.json({ message: 'Tipo deletado com sucesso' });
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
