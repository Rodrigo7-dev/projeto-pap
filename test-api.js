// Test script for API functionality
import axios from 'axios';

const API_URL = 'http://myapp-api-production-a4fa.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

let authToken = null;

// Test functions
async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const response = await api.post('/login', {
      email: 'test2@example.com',
      password: 'password123'
    });
    authToken = response.data.token;
    console.log('✅ Login successful');
    console.log('Token:', authToken);
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testRegister() {
  console.log('\n=== Testing Register ===');
  try {
    const response = await api.post('/register', {
      name: 'Test User',
      email: 'test2@example.com',
      nif: '123456789',
      password: 'password123',
      password_confirmation: 'password123'
    });
    console.log('✅ Register successful');
    console.log('User:', response.data.user);
    return true;
  } catch (error) {
    console.log('❌ Register failed:', error.response?.data || error.message);
    return false;
  }
}

async function testStats() {
  console.log('\n=== Testing Stats ===');
  try {
    const response = await api.get('/stats', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Stats successful');
    console.log('Stats:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Stats failed:', error.response?.data || error.message);
    return false;
  }
}

async function testProcessos() {
  console.log('\n=== Testing Processos CRUD ===');
  
  // Test GET
  try {
    const response = await api.get('/processos', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get processos successful');
    console.log('Processos count:', response.data.data?.length || 0);
  } catch (error) {
    console.log('❌ Get processos failed:', error.response?.data || error.message);
    return false;
  }

  // Test POST
  try {
    const response = await api.post('/processos', {
      processo: 'TEST-001',
      alvara: 'ALV-001',
      validade: 'valido',
      alojamentoLocal: 'sim'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create processo successful');
    const processoId = response.data.id;
    
    // Test PUT
    await api.put(`/processos/${processoId}`, {
      processo: 'TEST-001-UPDATED',
      alvara: 'ALV-001',
      validade: 'valido',
      alojamentoLocal: 'nao'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update processo successful');
    
    // Test DELETE
    await api.delete(`/processos/${processoId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete processo successful');
    
    return true;
  } catch (error) {
    console.log('❌ Processos CRUD failed:', error.response?.data || error.message);
    return false;
  }
}

async function testRuas() {
  console.log('\n=== Testing Ruas CRUD ===');
  
  try {
    // Test GET
    const response = await api.get('/ruas', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get ruas successful');
    console.log('Ruas count:', response.data.data?.length || 0);
    
    // Test POST with correct fields
    const createResponse = await api.post('/ruas', {
      rua: 'Rua Teste API',
      coordenada: '40.7128,-74.0060',
      freguesias_id: 1
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create rua successful');
    const ruaId = createResponse.data.id;
    
    // Test PUT
    await api.put(`/ruas/${ruaId}`, {
      rua: 'Rua Teste API Updated',
      coordenada: '40.7128,-74.0060',
      freguesias_id: 1
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update rua successful');
    
    // Test DELETE
    await api.delete(`/ruas/${ruaId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete rua successful');
    
    return true;
  } catch (error) {
    console.log('❌ Ruas CRUD failed:', error.response?.data || error.message);
    return false;
  }
}

async function testFreguesias() {
  console.log('\n=== Testing Freguesias CRUD ===');
  
  try {
    // Test GET
    const response = await api.get('/freguesias', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get freguesias successful');
    console.log('Freguesias count:', response.data.data?.length || 0);
    
    // Test POST with correct fields
    const createResponse = await api.post('/freguesias', {
      freguesia: 'Freguesia Teste API'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create freguesia successful');
    const freguesiaId = createResponse.data.id;
    
    // Test PUT
    await api.put(`/freguesias/${freguesiaId}`, {
      freguesia: 'Freguesia Teste API Updated'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update freguesia successful');
    
    // Test DELETE
    await api.delete(`/freguesias/${freguesiaId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete freguesia successful');
    
    return true;
  } catch (error) {
    console.log('❌ Freguesias CRUD failed:', error.response?.data || error.message);
    return false;
  }
}

async function testTiposPublicidade() {
  console.log('\n=== Testing Tipos Publicidade CRUD ===');
  
  try {
    // Test GET
    const response = await api.get('/tipopublicidade', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get tipos successful');
    console.log('Tipos count:', response.data.data?.length || 0);
    
    // Test POST with correct fields
    const createResponse = await api.post('/tipopublicidade', {
      publicidade: 'Tipo Teste API'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create tipo successful');
    const tipoId = createResponse.data.id;
    
    // Test PUT
    await api.put(`/tipopublicidade/${tipoId}`, {
      publicidade: 'Tipo Teste API Updated'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update tipo successful');
    
    // Test DELETE
    await api.delete(`/tipopublicidade/${tipoId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete tipo successful');
    
    return true;
  } catch (error) {
    console.log('❌ Tipos CRUD failed:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Tests...');
  
  const results = {
    register: await testRegister(),
    login: await testLogin(),
    stats: await testStats(),
    processos: await testProcessos(),
    ruas: await testRuas(),
    freguesias: await testFreguesias(),
    tipos: await testTiposPublicidade()
  };
  
  console.log('\n=== Test Results Summary ===');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  console.log(`\n📊 Total: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }
}

// Run tests
runAllTests().catch(console.error);
