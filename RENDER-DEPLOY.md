# Deploy no Render - Frontend Vue.js

## Configuração Automática

O projeto está configurado para deploy automático no Render com o arquivo `render.yaml`.

## Passos para Deploy

### 1. Preparar Repositório
```bash
git add .
git commit -m "Configurar para deploy no Render"
git push origin main
```

### 2. Configurar no Render
1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub/GitLab
3. Render detectará automaticamente o `render.yaml`
4. Confirme as configurações e clique "Deploy"

### 3. Variáveis de Ambiente
O `render.yaml` já configura:
- `NODE_VERSION=20`
- `VITE_API_URL=https://myapp-api-production-a4fa.up.railway.app/`
- `VITE_APP_NAME=Sistema de Gestão`
- `VITE_APP_ENV=production`

## URLs Após Deploy
- **Frontend**: `https://seu-app.onrender.com`
- **API**: `https://myapp-api-production-a4fa.up.railway.app/`

## Verificação
Após o deploy, teste:
1. Login na aplicação
2. Registro de usuários
3. Operações CRUD

## Troubleshooting
- Se ocorrer erro de CORS, verifique se a API permite requisições do domínio do Render
- Se o build falhar, verifique se todas as dependências estão corretas
- Logs disponíveis no dashboard do Render
