# 🏠 Tutorial de Uso - Scraper RE/MAX

## 🎯 O que é o Scraper?

O scraper é um sistema que **extrai automaticamente** dados de imóveis do site da RE/MAX e salva em formato JSON para usar na landing page.

## 📋 O que ele faz?

- ✅ **Acessa 35+ páginas** de imóveis da RE/MAX
- ✅ **Extrai dados** como preços, características, imagens
- ✅ **Salva em JSON** para usar na landing page
- ✅ **Gera relatório** do que foi extraído

## 🚀 Como Usar (Passo a Passo)

### **Passo 1: Instalar Node.js**
```bash
# 1. Baixe o Node.js em: https://nodejs.org/
# 2. Instale normalmente
# 3. Abra o terminal/prompt e digite:
node --version
# Deve aparecer algo como: v18.17.0
```

### **Passo 2: Instalar Dependências**
```bash
# 1. Abra o terminal/prompt
# 2. Navegue até a pasta scraper:
cd scraper

# 3. Instale as dependências:
npm install

# Aguarde terminar (pode demorar alguns minutos)
```

### **Passo 3: Executar o Scraper**

#### **Opção A: Windows (Mais Fácil)**
```bash
# 1. Duplo clique em: install.bat
# 2. Aguarde instalar
# 3. Duplo clique em: run-scraper.bat
# 4. Escolha a opção 1 (Puppeteer)
```

#### **Opção B: Terminal**
```bash
# 1. Abra terminal na pasta scraper
# 2. Execute:
npm run scrape

# Ou:
node imoveis-scraper.js
```

### **Passo 4: Aguardar Processamento**
```bash
# O scraper vai mostrar:
🚀 Iniciando scraping dos imóveis...
📊 Progresso: 1/35 - 690471003-26
✅ Dados extraídos: Apartamento Moderno
📊 Progresso: 2/35 - 690471003-97
...

# ⏳ Isso pode levar 5-10 minutos
```

### **Passo 5: Verificar Resultados**
```bash
# Após terminar, verifique a pasta:
scraper/data/
├── imoveis-data.json        # Dados completos
└── resumo-extracao.json     # Relatório
```

## 📊 O que é Extraído?

Para cada imóvel, o scraper pega:

```json
{
  "id": "690471003-100",
  "tipo": "Apartamento",
  "titulo": "Apartamento 2 dormitórios Atibaia",
  "preco": "R$ 350.000",
  "endereco": "339 Avenida Ipe, Atibaia - SP",
  "cidade": "Atibaia",
  "area": "65m²",
  "quartos": "2",
  "banheiros": "1",
  "imagens": ["url1.jpg", "url2.jpg"],
  "corretor": "João Silva",
  "telefone": "(11) 99999-9999"
}
```

## 🔧 Dois Métodos Disponíveis

### **Método 1: Puppeteer (Recomendado)**
```bash
# Mais completo, funciona melhor
node imoveis-scraper.js
```

### **Método 2: Axios (Mais Rápido)**
```bash
# Mais rápido, mas pode não pegar tudo
node imoveis-scraper-axios.js
```

## 🧪 Testar com Um Imóvel

```bash
# Teste primeiro com apenas 1 imóvel:
node test-single.js

# Isso testa se está funcionando antes de processar todos
```

## 📁 Onde Ficam os Dados?

```
scraper/
└── data/
    ├── imoveis-data.json        # ← Dados para usar na landing page
    └── resumo-extracao.json     # ← Relatório do que foi extraído
```

## 🚨 Problemas Comuns

### **Erro: "node não é reconhecido"**
```bash
# Solução: Instalar Node.js
# Baixe em: https://nodejs.org/
```

### **Erro: "npm não é reconhecido"**
```bash
# Solução: Reinstalar Node.js
# Ou reiniciar o terminal
```

### **Erro: "Cannot find module"**
```bash
# Solução: Instalar dependências
cd scraper
npm install
```

### **Scraper trava ou demora muito**
```bash
# Solução: Aguardar ou reiniciar
# Pode demorar 5-10 minutos
```

### **Alguns imóveis não são extraídos**
```bash
# Normal: Alguns podem dar erro
# Verifique o resumo-extracao.json
```

## 📊 Como Usar os Dados na Landing Page

### **1. Copiar Arquivo JSON**
```bash
# Copie o arquivo:
scraper/data/imoveis-data.json

# Para a pasta da landing page:
data/imoveis-data.json
```

### **2. Carregar no JavaScript**
```javascript
// No arquivo js/imoveis.js
fetch('data/imoveis-data.json')
  .then(response => response.json())
  .then(imoveis => {
    // Usar os dados dos imóveis
    console.log(imoveis);
  });
```

## 🔄 Executar Novamente

```bash
# Para atualizar os dados:
# 1. Execute o scraper novamente
# 2. Copie o novo JSON
# 3. Substitua na landing page
```

## ⚠️ Importante

- **Respeite o site**: Não execute muito frequentemente
- **Use com moderação**: 1-2 vezes por semana é suficiente
- **Verifique os dados**: Sempre confira se os dados estão corretos
- **Backup**: Mantenha backup dos dados antigos

## 📞 Precisa de Ajuda?

### **Problemas Técnicos**
1. Verifique se Node.js está instalado
2. Execute `npm install` na pasta scraper
3. Teste com `node test-single.js` primeiro

### **Dados Incorretos**
1. Verifique se o site da RE/MAX mudou
2. Execute o scraper novamente
3. Compare com dados anteriores

---

**💡 Dica**: Execute o scraper uma vez por semana para manter os dados atualizados!
