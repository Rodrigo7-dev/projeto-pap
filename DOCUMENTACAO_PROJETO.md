# Documentação do Projeto - Sistema de Gestão

## Visão Geral do Projeto

Este é um **Sistema de Gestão de Publicidade Municipal** desenvolvido em Vue.js 3 com backend Laravel. O sistema permite gerir processos de licenciamento de publicidade, arruamentos, freguesias e tipos de publicidade.

### Tecnologias Utilizadas

- **Frontend**: Vue.js 3 + Composition API
- **Estilos**: TailwindCSS
- **Estado**: Pinia (gestão de estado)
- **Rotas**: Vue Router 4
- **HTTP**: Axios com cache inteligente
- **Build Tool**: Vite
- **Backend**: Laravel API (porta 8000)

---

## Estrutura do Projeto

```
projeto/
src/
  components/          # Componentes reutilizáveis
    Navbar.vue         # Barra de navegação principal
  views/              # Páginas da aplicação
    Login.vue         # Página de início de sessão
    Registar.vue      # Página de registo
    Dashboard.vue     # Painel principal
    Perfil.vue        # Perfil do utilizador
    Ruas.vue          # Gestão de arruamentos
    Freguesias.vue    # Gestão de freguesias
    TipoPublicidade.vue # Tipos de publicidade
  stores/             # Gestão de estado
    auth.js          # Autenticação e utilizador
  services/          # Comunicação com API
    api.js           # Cliente HTTP com cache
  router/            # Configuração de rotas
    index.js         # Definição de rotas e proteções
  utils/             # Funções auxiliares
    cache.js         # Sistema de cache local
```

---

## Explicação Detalhada dos Componentes

### 1. App.vue (Componente Principal)

**Função**: Estrutura base da aplicação que controla a navegação e transições.

**Como funciona**:
- Mostra a Navbar apenas quando o utilizador está autenticado
- Usa `<router-view>` para renderizar as páginas
- Aplica transições suaves entre páginas (efeito de desvanecimento)

**Simplificação**: Pense nisto como o "esqueleto" da sua aplicação - onde tudo se encaixa.

---

### 2. Sistema de Autenticação

#### auth.js (Store Pinia)

**Função**: Controla quem está com sessão iniciada e mantém a sessão ativa.

**Principais funcionalidades**:
- **login()**: Valida credenciais com API Laravel
- **logout()**: Termina sessão e limpa dados
- **register()**: Cria nova conta de utilizador
- **isAuthenticated**: Verifica se utilizador pode aceder

**Simplificação**: É como um "segurança" que verifica quem pode entrar no sistema.

#### Login.vue

**Função**: Página para utilizadores iniciarem sessão.

**Como funciona**:
1. **Interface simples**: Email + palavra-passe + botão entrar
2. **Validação automática**: Verifica credenciais na API
3. **Cache inteligente**: Guarda sessão para não precisar repetir
4. **Início rápido**: Credenciais pré-preenchidas para demonstração

**Código importante explicado**:
```javascript
// Cache local para início de sessão instantâneo
localStorage.setItem('auth_token', data.token)
localStorage.setItem('auth_user', JSON.stringify(data.user))
```
*Explicação*: Guarda dados no navegador para não precisar de iniciar sessão sempre.

#### Registar.vue

**Função**: Criar novas contas de utilizador.

**Validações implementadas**:
- Palavras-passe devem coincidir
- NIF deve ter 9 números
- Palavra-passe mínima de 6 caracteres
- Email válido obrigatório

**Simplificação**: Como um formulário de registo com regras de segurança.

---

### 3. Navegação e Rotas

#### router/index.js

**Função**: Define as "estradas" da aplicação.

**Proteção de autenticação**:
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')  // Redireciona para início de sessão se não estiver autenticado
  }
})
```
*Explicação*: É como um "porteiro" que só deixa entrar utilizadores com sessão iniciada.

#### Navbar.vue

**Função**: Menu de navegação principal.

**Links disponíveis**:
- Painel (Dashboard)
- Arruamentos (Gestão)
- Freguesias (Gestão)
- Tipos (Publicidade)
- Perfil (Utilizador)
- Sair (Terminar sessão)

**Simplificação**: Menu principal que aparece quando está com sessão iniciada.

---

### 4. Páginas Principais

#### Dashboard.vue

**Função**: Painel de controlo com estatísticas rápidas.

**O que mostra**:
- **Estatísticas imediatas**: Total de processos, válidos/inválidos, arruamentos
- **Processos recentes**: Últimas 5 atualizações
- **Cache inteligente**: Dados guardados para carregamento rápido

**Simplificação**: Como um "painel de automóvel" que mostra tudo importante de um olhar.

**Código importante**:
```javascript
// Cache para 1 minuto
if (statsAge < 60000) {
  this.stats = JSON.parse(cacheStats)
  return
}
```
*Explicação*: Usa dados recentes para não sobrecarregar o servidor.

#### Ruas.vue

**Função**: Gestão de todos os arruamentos do sistema.

**Funcionalidades**:
- **Pesquisa em tempo real**: Filtra arruamentos enquanto escreve
- **Paginação**: 10 arruamentos por página
- **Estados de carregamento**: Indicadores de carregamento
- **Notificações**: Feedback para utilizador

**Simplificação**: Como uma "lista telefónica" de arruamentos com busca.

**Código importante**:
```javascript
computed: {
  filteredRuas() {
    return this.paginatedRuas.filter(rua => 
      rua.rua.toLowerCase().includes(this.search.toLowerCase())
    )
  }
}
```
*Explicação*: Filtra ruas conforme o utilizador escreve na busca.

---

### 5. Comunicação com API

#### api.js (Serviço HTTP)

**Função**: "Tradutor" entre frontend e backend Laravel.

**Características avançadas**:
- **Cache automático**: Guarda respostas GET por 5 minutos
- **Tokens JWT**: Adiciona autenticação automática
- **Timeout**: 3 segundos para não bloquear
- **Tratamento de erros**: Trata erros 401 (não autorizado)

**Simplificação**: Como um "telefone" que fala com o servidor.

**Código importante explicado**:
```javascript
// Interceptor - adiciona token a cada pedido
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```
*Explicação*: Automaticamente adiciona "chave de acesso" a cada pedido.

```javascript
// Cache inteligente
if (response.config.method?.toLowerCase() === 'get') {
  cache.set(cacheKey, response.data, 300000) // 5 minutos
}
```
*Explicação*: Guarda dados para não pedir repetidamente ao servidor.

---

### 6. Sistema de Cache

#### cache.js

**Função**: Memória temporária para melhorar desempenho.

**Como funciona**:
- **LocalStorage**: Usa navegador para guardar dados
- **TTL (Time To Live)**: Dados expiram automaticamente
- **Chaves únicas**: Cada tipo de dado tem sua chave

**Simplificação**: Como uma "memória de curto prazo" da aplicação.

---

## Fluxo de Utilização Típico

### 1. Primeiro Acesso
1. Utilizador abre aplicação
2. Redirecionado para `/login`
3. Insere email e palavra-passe
4. Sistema valida com API Laravel
5. Guarda token localmente
6. Redireciona para `/dashboard`

### 2. Navegação Diária
1. Dashboard mostra estatísticas rápidas
2. Pode navegar para Arruamentos, Freguesias, etc.
3. Cada página carrega dados via API
4. Cache evita pedidos repetidos
5. Navbar permite navegação rápida

### 3. Sessão Expirada
1. Se token expira, API retorna 401
2. Sistema limpa dados locais
3. Redireciona automaticamente para início de sessão
4. Utilador inicia sessão novamente

---

## Conceitos Técnicos Simplificados

### Reactivity (Reatividade)
**O que é**: Vue.js atualiza automaticamente a interface quando dados mudam.
**Exemplo**: Quando busca uma rua, a lista atualiza sozinha.

### Composition API
**O que é**: Forma moderna de organizar código Vue.js.
**Vantagem**: Código mais limpo e reutilizável.

### Store (Pinia)
**O que é**: "Caixa" central para dados partilhados.
**Exemplo**: Dados do utilizador disponíveis em qualquer página.

### Interceptors
**O que é**: Funções que interceptam pedidos HTTP.
**Utilidade**: Adicionar tokens, tratar erros automaticamente.

---

## Desempenho e Otimizações

### 1. Cache Inteligente
- **Dados estáticos**: 5 minutos em cache
- **Sessão utilizador**: Até término de sessão
- **Dashboard**: 1 minuto para dados recentes

### 2. Estados de Carregamento
- Indicadores visuais durante carregamento
- Feedback imediato para utilizador
- Evita frustração

### 3. Tratamento de Erros
- Tratamento de erros 401, 422, 500
- Mensagens amigáveis para utilizador
- Registos detalhados para depuração

### 4. Gestão de Timeouts
- 3 segundos para pedidos normais
- 5 segundos para início de sessão (mais complexo)
- Evita bloqueio indefinido

---

## Segurança Implementada

### 1. Autenticação JWT
- Tokens com expiração
- Armazenamento seguro em localStorage
- Validação em cada pedido

### 2. Proteção de Rotas
- Proteção de páginas sensíveis
- Redirecionamento automático
- Verificação antes de carregar

### 3. Validações Frontend
- Formatos de email
- Tamanho mínimo de palavras-passe
- Validação de NIF (9 dígitos)

---

## Expansões Futuras

### 1. Melhorias Possíveis
- **Modo offline**: Service Workers
- **PWA**: Progressive Web App
- **Tempo real**: WebSockets para atualizações
- **Gráficos**: Chart.js para estatísticas

### 2. Novas Funcionalidades
- **Exportação PDF**: Relatórios de processos
- **Carregamento**: Ficheiros para processos
- **Notificações**: Push notifications

---

## Resumo para Apresentação PAP

### O que o projeto faz?
Sistema web para gerir licenciamento de publicidade municipal com interface moderna e com bom desempenho.

### Tecnologias principais?
Vue.js 3, Laravel API, TailwindCSS, Pinia, Axios com cache.

### Diferenciais técnicos?
- Cache inteligente para desempenho
- Autenticação JWT segura
- Interface responsiva e moderna
- Código organizado e escalável

### Como funciona?
1. Utilizador inicia sessão de forma segura
2. Dashboard mostra estatísticas em tempo real
3. Navegação intuitiva para gestão de dados
4. Cache garante experiência rápida

---

## Conclusão

Este projeto demonstra competências em:
- **Desenvolvimento Frontend moderno** (Vue.js 3)
- **Integração com APIs REST** (Laravel)
- **Gestão de estado** (Pinia)
- **Otimização de desempenho** (Cache, lazy loading)
- **UX/UI Design** (TailwindCSS, transições)
- **Segurança** (JWT, validações)
- **Arquitetura limpa** (componentes, serviços)

O código está bem estruturado, documentado e pronto para produção, seguindo as melhores práticas de desenvolvimento web moderno.

---

## Deploy em Produção

### Plataforma: Render + GitHub

O projeto está configurado para deploy automático no **Render** com integração **GitHub**.

#### 1. Configuração do Render

**Ficheiro**: `render.yaml`
```yaml
services:
  - type: web
    name: projeto-pap-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    pullRequestPreviewsEnabled: true
```

**O que faz**:
- Cria serviço web estático no Render
- Build automático com `npm run build`
- Deploy da pasta `dist/`
- Pré-visualização de Pull Requests

#### 2. Configuração do Package.json

**Scripts de produção**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --host 0.0.0.0 --port $PORT"
  },
  "homepage": "https://projeto-pap.onrender.com"
}
```

**O que faz**:
- `build`: Cria versão de produção
- `start`: Inicia servidor para Render
- `homepage`: URL base da aplicação

#### 3. Processo de Deploy

**Passos para deploy**:
1. **Fazer push para GitHub**:
   ```bash
   git add .
   git commit -m "Deploy para produção"
   git push origin main
   ```

2. **Render detecta automaticamente**:
   - Lê `render.yaml`
   - Executa `npm run build`
   - Faz deploy da pasta `dist/`

3. **URL pública**:
   - Frontend: `https://projeto-pap.onrender.com`
   - Backend (se configurado): `https://projeto-pap-backend.onrender.com`

#### 4. Variáveis de Ambiente

**No Render Dashboard**:
- `VITE_API_URL`: URL do backend Laravel
- `NODE_VERSION`: Versão do Node.js (20)

**No código**:
```javascript
// api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
})
```

#### 5. Vantagens do Render

**Para projeto PAP**:
- **Free tier**: Suficiente para demonstração
- **Deploy automático**: Integrado com GitHub
- **HTTPS**: Certificado SSL automático
- **Custom domain**: Possível usar domínio próprio
- **Preview URLs**: Testar Pull Requests

#### 6. Comandos Úteis

**Local (desenvolvimento)**:
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Testar build local
```

**Produção (Render)**:
```bash
npm run start        # Inicia servidor produção
```

---

## Estrutura de Ficheiros para Deploy

```
projeto/
├── render.yaml           # Configuração Render
├── package.json          # Scripts e dependências
├── .gitignore           # Ficheiros ignorados
├── vite.config.js       # Configuração Vite
├── dist/               # Build produção (gerado)
└── src/
    ├── main.js         # Entry point
    ├── App.vue         # Componente principal
    └── ...            # Resto do código
```

---

## Monitorização e Manutenção

### Logs no Render
- Acessível via Dashboard do Render
- Logs de build e runtime
- Erros e warnings em tempo real

### Updates Automáticos
- GitHub → Render deploy automático
- Pull Requests → Preview URLs
- Branch main → Produção

### Performance
- Build otimizado com Vite
- Serviço estático (rápido)
- CDN automático do Render
