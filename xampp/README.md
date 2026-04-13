# Projeto Simplificado para XAMPP

Versão simplificada do projeto Vue.js convertida para HTML/CSS/JavaScript puro.

## Estrutura de Arquivos

```
xampp/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos CSS
├── js/
│   └── app.js          # Lógica JavaScript
└── README.md           # Este arquivo
```

## Como Usar no XAMPP

1. **Instale o XAMPP** se ainda não tiver
2. **Inicie o Apache** no painel de controle XAMPP
3. **Copie a pasta `xampp`** para `C:\xampp\htdocs\`
4. **Acesse no navegador**: `http://localhost/xampp/`

## Funcionalidades

- ✅ Sistema de login (simulado)
- ✅ Navegação entre páginas
- ✅ Armazenamento local de autenticação
- ✅ Interface responsiva com Tailwind CSS
- ✅ Transições suaves

## Credenciais de Teste

- **Email**: admin@admin.com
- **Senha**: 123456

## Personalização

### Adicionar Nova Página

1. **HTML**: Adicione nova `<div class="page hidden">` em `index.html`
2. **CSS**: Estilize em `css/styles.css`
3. **JS**: Adicione ao objeto `elements.pages` em `js/app.js`

### Conectar com Backend PHP

Substitua a função `auth.login()` em `js/app.js`:

```javascript
async login(email, password) {
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            utils.saveAuth(data.token, data.user);
            utils.updateNavbar();
            utils.showPage('home');
            return { success: true };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: 'Erro de conexão' };
    }
}
```

## Vantagens

- 🚀 **Rápido**: Sem build process
- 📦 **Leve**: Apenas HTML/CSS/JS
- 🔧 **Simples**: Fácil de modificar
- 🌐 **Compatível**: Funciona em qualquer servidor web
- 💾 **Offline**: Funciona sem internet (exceto CDN)

## Tecnologias

- HTML5
- CSS3 com Tailwind CSS (CDN)
- JavaScript Vanilla (ES6+)
- LocalStorage para persistência

## Próximos Passos

- [ ] Conectar com banco de dados MySQL
- [ ] Implementar API PHP
- [ ] Adicionar validação de formulários
- [ ] Criar painel administrativo
