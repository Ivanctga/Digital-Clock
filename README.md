# Cloaker Breaker - Detector de Cloakers

Um site moderno e eficiente para detectar e quebrar diferentes tipos de cloakers automaticamente.

## 🚀 Funcionalidades

- **Detecção Avançada**: Detecta cloakers baseados em User-Agent, IP, referrer, JavaScript e muito mais
- **Subdomínios**: Encontra e lista todos os subdomínios relacionados ao cloaker
- **Página Real**: Mostra a página verdadeira por trás do cloaker
- **Interface Moderna**: Design responsivo e intuitivo

## 🛠️ Como Usar

1. Abra o arquivo `index.html` em seu navegador
2. Digite a URL que você suspeita ter um cloaker
3. Clique em "Analisar" ou pressione Enter
4. Aguarde a análise completa
5. Veja os resultados detalhados

## 🔍 Técnicas de Detecção

O Cloaker Breaker utiliza múltiplas técnicas para detectar cloakers:

### 1. Redirecionamentos
- Verifica se a URL redireciona para outra página
- Detecta redirecionamentos HTTP e JavaScript

### 2. User-Agent Spoofing
- Testa diferentes User-Agents (navegador, mobile, bots)
- Detecta se o conteúdo muda baseado no User-Agent

### 3. Referrer Spoofing
- Testa diferentes referrers (Google, Facebook, etc.)
- Detecta se o conteúdo muda baseado no referrer

### 4. Geolocalização
- Testa diferentes localizações geográficas
- Detecta se o conteúdo muda baseado na localização

### 5. JavaScript Redirects
- Analisa scripts JavaScript que podem causar redirecionamentos
- Detecta manipulação dinâmica de conteúdo

## 📁 Estrutura do Projeto

```
├── index.html          # Interface principal
├── script.js           # Lógica de detecção
└── README.md          # Documentação
```

## 🎨 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design moderno e responsivo
- **JavaScript ES6+**: Lógica de detecção avançada
- **Font Awesome**: Ícones modernos

## ⚠️ Limitações

- Devido a restrições de CORS, algumas verificações são simuladas
- Para análise completa, considere usar um servidor proxy
- Alguns cloakers avançados podem não ser detectados

## 🔧 Melhorias Futuras

- [ ] Implementar servidor backend para análise completa
- [ ] Adicionar mais técnicas de detecção
- [ ] Suporte a análise em lote
- [ ] API para integração com outras ferramentas

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

**Desenvolvido com ❤️ para combater cloakers e proteger usuários**
