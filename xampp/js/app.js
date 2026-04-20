// Estado da aplicação
const state = {
    isAuthenticated: false,
    currentPage: 'login',
    user: null
};

// Elementos DOM
const elements = {
    navbar: document.getElementById('navbar'),
    mainContent: document.getElementById('main-content'),
    loginForm: document.getElementById('login-form'),
    logoutBtn: document.getElementById('logout-btn'),
    pages: {
        login: document.getElementById('login-page'),
        home: document.getElementById('home-page'),
        about: document.getElementById('about-page')
    }
};

// Utilitários
const utils = {
    showPage(pageName) {
        // Esconder todas as páginas
        Object.keys(elements.pages).forEach(key => {
            elements.pages[key].classList.add('hidden');
        });
        
        // Mostrar página selecionada
        if (elements.pages[pageName]) {
            elements.pages[pageName].classList.remove('hidden');
            elements.pages[pageName].classList.add('fade-in');
            state.currentPage = pageName;
        }
    },
    
    updateNavbar() {
        if (state.isAuthenticated) {
            elements.navbar.classList.remove('hidden');
        } else {
            elements.navbar.classList.add('hidden');
        }
    },
    
    saveAuth(token, user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        state.isAuthenticated = true;
        state.user = user;
    },
    
    clearAuth() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        state.isAuthenticated = false;
        state.user = null;
    },
    
    loadAuth() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            state.isAuthenticated = true;
            state.user = JSON.parse(user);
            return true;
        }
        return false;
    }
};

// Autenticação
const auth = {
    async login(email, password) {
        try {
            // Simulação de API - substitua com sua API real
            if (email === 'admin@admin.com' && password === '123456') {
                const token = 'fake-jwt-token-' + Date.now();
                const user = { email, name: 'Administrador' };
                
                utils.saveAuth(token, user);
                utils.updateNavbar();
                utils.showPage('home');
                
                return { success: true };
            } else {
                return { success: false, error: 'Credenciais inválidas' };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: 'Erro ao fazer login' };
        }
    },
    
    logout() {
        utils.clearAuth();
        utils.updateNavbar();
        utils.showPage('login');
    }
};

// Navegação
const router = {
    init() {
        // Navegação por links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const pageName = href.replace('#', '');
                
                if (elements.pages[pageName]) {
                    utils.showPage(pageName);
                }
            });
        });
        
        // Navegação por hash
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && elements.pages[hash]) {
                utils.showPage(hash);
            }
        });
    }
};

// Event Listeners
function initEventListeners() {
    // Form de login
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const result = await auth.login(email, password);
        
        if (!result.success) {
            alert(result.error || 'Erro ao fazer login');
        }
    });
    
    // Botão de logout
    elements.logoutBtn.addEventListener('click', () => {
        auth.logout();
    });
}

// Inicialização
function init() {
    // Carregar autenticação do localStorage
    if (utils.loadAuth()) {
        utils.updateNavbar();
        utils.showPage('home');
        
        // Verificar hash na URL
        const hash = window.location.hash.replace('#', '');
        if (hash && elements.pages[hash]) {
            utils.showPage(hash);
        }
    }
    
    // Inicializar componentes
    router.init();
    initEventListeners();
}

// Iniciar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

// Exportar para uso global (opcional)
window.app = {
    state,
    auth,
    utils
};
