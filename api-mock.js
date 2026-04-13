// API Mock temporária para testes
import express from 'express';
import cors from 'cors';
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Mock users
const users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com',
    nif: '123456789',
    token: 'mock-token-123'
  },
  {
    id: 2,
    name: 'Maria',
    email: 'maria@exemplo.com',
    nif: '987654321',
    token: 'mock-token-456'
  }
];

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
    token: `mock-token-${Date.now()}`
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
      { id: 1, processo: 'PROC-001', alvara: 'ALV-001', validade: 'valido' },
      { id: 2, processo: 'PROC-002', alvara: 'ALV-002', validade: 'expirado' }
    ]
  });
});

app.get('/api/ruas', (req, res) => {
  res.json({
    data: [
      { id: 1, rua: 'Rua Principal', coordenada: '40.7128,-74.0060', freguesias_id: 1 },
      { id: 2, rua: 'Avenida Central', coordenada: '40.7589,-73.9851', freguesias_id: 1 }
    ]
  });
});

app.get('/api/freguesias', (req, res) => {
  res.json({
    data: [
      { id: 1, freguesia: 'São João' },
      { id: 2, freguesia: 'Santa Maria' }
    ]
  });
});

app.get('/api/tipopublicidade', (req, res) => {
  res.json({
    data: [
      { id: 1, publicidade: 'Outdoor' },
      { id: 2, publicidade: 'Painel' }
    ]
  });
});

app.listen(port, () => {
  console.log(`API Mock rodando em http://localhost:${port}`);
  console.log('Endpoints disponíveis:');
  console.log('- POST /api/login');
  console.log('- POST /api/register');
  console.log('- GET /api/stats');
  console.log('- GET /api/processos');
  console.log('- GET /api/ruas');
  console.log('- GET /api/freguesias');
  console.log('- GET /api/tipopublicidade');
});
