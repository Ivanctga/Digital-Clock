# 📋 Instruções de Instalação - Cloaker Breaker

## 🚀 Instalação Rápida

### Opção 1: Apenas Frontend (Mais Simples)
1. Baixe todos os arquivos
2. Abra o arquivo `index.html` no seu navegador
3. Pronto! O site já está funcionando

### Opção 2: Com Servidor Backend (Mais Poderoso)
1. Instale o Node.js (versão 14 ou superior)
2. Abra o terminal na pasta do projeto
3. Execute os comandos:

```bash
npm install
npm start
```

4. Acesse `http://localhost:3000` no seu navegador

## 🔧 Requisitos do Sistema

### Para Frontend Apenas:
- Qualquer navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet

### Para Servidor Backend:
- Node.js 14+ 
- npm ou yarn
- Conexão com internet

## 📦 Dependências

O projeto usa as seguintes dependências:

```json
{
  "express": "^4.18.2",    // Servidor web
  "axios": "^1.6.0",       // Requisições HTTP
  "cors": "^2.8.5"         // Cross-origin requests
}
```

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev

# Parar servidor
Ctrl + C
```

## 🌐 Acessando o Site

- **Frontend apenas**: Abra `index.html` diretamente
- **Com servidor**: Acesse `http://localhost:3000`

## 🔍 Como Usar

1. **Digite a URL**: Cole a URL que você suspeita ter um cloaker
2. **Clique em Analisar**: O sistema fará uma análise completa
3. **Veja os Resultados**: 
   - ✅ Verde = Nenhum cloaker detectado
   - ⚠️ Amarelo = Possível cloaker
   - ❌ Vermelho = Cloaker detectado

## 🚨 Solução de Problemas

### Erro: "Servidor não disponível"
- **Causa**: Servidor backend não está rodando
- **Solução**: Execute `npm start` ou use apenas o frontend

### Erro: "URL inválida"
- **Causa**: URL mal formatada
- **Solução**: Use URLs completas (ex: `https://exemplo.com`)

### Erro: "Erro ao analisar"
- **Causa**: Problemas de rede ou CORS
- **Solução**: Use o servidor backend para análise completa

### Erro: "npm não encontrado"
- **Causa**: Node.js não instalado
- **Solução**: Instale Node.js de https://nodejs.org

## 🔧 Configuração Avançada

### Alterar Porta do Servidor
Edite o arquivo `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Mude 3000 para outra porta
```

### Adicionar Mais User-Agents
Edite o arquivo `server.js` na função `checkUserAgentSpoofing`:
```javascript
const userAgents = [
    // Adicione seus User-Agents aqui
    'Seu User-Agent Personalizado'
];
```

### Personalizar Subdomínios
Edite o arquivo `server.js` na função `findSubdomains`:
```javascript
const commonSubdomains = [
    // Adicione seus subdomínios aqui
    'seu-subdominio'
];
```

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 🔒 Segurança

- O site não armazena URLs analisadas
- Todas as análises são feitas em tempo real
- Não há coleta de dados pessoais
- Código aberto e auditável

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme que a URL está no formato correto
3. Teste com URLs conhecidas primeiro
4. Verifique o console do navegador para erros

---

**🎯 Dica**: Para melhor precisão, use sempre o servidor backend!