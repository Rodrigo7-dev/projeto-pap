# Configurações para Deploy em Produção

## 🚀 Sistema Online - Configurações

### 📋 Pré-requisitos

#### 1. **Servidor Web (Apache/Nginx)**
- Configurar para servir o frontend Vue.js
- Configurar proxy reverso para API Laravel
- Configurar HTTPS (recomendado)

#### 2. **Laravel API**
- Configurar CORS para domínio externo
- Configurar variáveis de ambiente
- Configurar cache para produção

#### 3. **Banco de Dados**
- Configurar para produção
- Otimizar queries
- Configurar backups

---

### 🔧 Arquivos de Configuração

#### **Frontend Vue.js**
```bash
# Build para produção
npm run build

# Arquivos gerados em: dist/
# Servir com servidor web estático
```

#### **Laravel .env**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://seu-dominio.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=nome_database
DB_USERNAME=usuario_db
DB_PASSWORD=senha_db

SANCTUM_STATEFUL_DOMAINS=seu-dominio.com
```

#### **Apache (.htaccess)**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### **Nginx**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /path/to/laravel/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

### 🌐 Configuração de Domínio

#### **DNS**
```
A Record: seu-dominio.com -> IP_DO_SERVIDOR
AAAA Record: seu-dominio.com -> IPv6_DO_SERVIDOR
```

#### **SSL/HTTPS**
```bash
# Usar Let's Encrypt (grátis)
certbot --nginx -d seu-dominio.com

# Ou certificado comercial
```

---

### 🔐 Segurança

#### **Firewall**
```bash
# Abrir portas necessárias
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 22/tcp    # SSH
ufw enable
```

#### **Laravel Security**
```bash
# Gerar chave de aplicação
php artisan key:generate

# Otimizar para produção
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### 📊 Monitoramento

#### **Logs Laravel**
```bash
# Logs de erro
tail -f storage/logs/laravel.log

# Logs de acesso
tail -f storage/logs/access.log
```

#### **Performance**
```bash
# Cache Laravel
php artisan cache:clear

# Otimizar Composer
composer dump-autoload --optimize
```

---

### 🚀 Deploy Automatizado

#### **Script de Deploy**
```bash
#!/bin/bash
# deploy.sh

echo "Iniciando deploy..."

# Pull do código
git pull origin main

# Instalar dependências
composer install --no-dev --optimize-autoloader
npm install && npm run build

# Otimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Reiniciar serviços
sudo systemctl restart nginx
sudo systemctl restart php8.1-fpm

echo "Deploy concluído!"
```

---

### 🌍 Acessibilidade

#### **URLs Finais**
- **Frontend**: https://seu-dominio.com
- **API**: https://seu-dominio.com/api
- **Admin**: https://seu-dominio.com/dashboard

#### **Redirecionamentos**
- **HTTP → HTTPS**: Automático
- **www → não-www**: Configurado
- **Subdomínios**: Configurados

---

### 📱 Teste Final

#### **Checklist**
- [ ] Frontend build funciona
- [ ] API responde corretamente
- [ ] Login funciona
- [ ] Dashboard carrega dados
- [ ] CORS configurado
- [ ] SSL funcionando
- [ ] Logs monitorados

---

### 🎯 Suporte Técnico

#### **Contato**
- **Email**: suporte@seu-dominio.com
- **Telefone**: +55 XX XXXXX-XXXX
- **Horário**: 24/7

#### **Emergência**
- **Rollback**: Git revert para versão anterior
- **Manutenção**: Modo manutenção ativado
- **Backup**: Restaurar backup mais recente

---

## 🏆 Sistema Pronto para Produção!

O sistema agora está configurado para:
- ✅ **Acesso externo** via domínio
- ✅ **HTTPS** seguro
- ✅ **Performance** otimizada
- ✅ **Segurança** reforçada
- ✅ **Monitoramento** ativo
