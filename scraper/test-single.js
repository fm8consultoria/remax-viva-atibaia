const { scrapeImoveis } = require('./imoveis-scraper');

// Testar com apenas um imóvel
const testImovel = {
  id: '690471003-100',
  url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/339-avenida-ipe-mc-donald/690471003-100',
  tipo: 'Apartamento'
};

async function testSingleImovel() {
  console.log('🧪 Testando extração de um único imóvel...\n');
  
  try {
    // Teste com Puppeteer
    console.log('📊 Testando com Puppeteer...');
    const puppeteerData = await testPuppeteer();
    
    // Mostrar resultados
    console.log('\n📋 Resultados Detalhados:');
    console.log('🏠 Título:', puppeteerData.titulo || 'N/A');
    console.log('💰 Preço:', puppeteerData.preco || 'N/A');
    console.log('📍 Endereço:', puppeteerData.endereco || 'N/A');
    console.log('📐 Área:', puppeteerData.area || 'N/A');
    console.log('🛏️ Quartos:', puppeteerData.quartos || 'N/A');
    console.log('🚿 Banheiros:', puppeteerData.banheiros || 'N/A');
    console.log('🚗 Vagas:', puppeteerData.vagas || 'N/A');
    console.log('📝 Descrição:', puppeteerData.descricao ? puppeteerData.descricao.substring(0, 100) + '...' : 'N/A');
    console.log('👤 Corretor:', puppeteerData.corretor || 'N/A');
    console.log('📞 Telefone:', puppeteerData.telefone || 'N/A');
    console.log('📧 Email:', puppeteerData.email || 'N/A');
    console.log('✨ Características:', puppeteerData.caracteristicas.length > 0 ? puppeteerData.caracteristicas.slice(0, 5).join(', ') : 'N/A');
    console.log('🖼️ Imagens encontradas:', puppeteerData.imagens.length);
    
    if (puppeteerData.todosTextos) {
      console.log('\n🔍 Primeiros 200 caracteres da página:');
      console.log(puppeteerData.todosTextos.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

async function testPuppeteer() {
  const puppeteer = require('puppeteer');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    await page.goto(testImovel.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const data = await page.evaluate(() => {
      // Função para extrair texto de um seletor
      const getText = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : 'N/A';
      };

      // Função para extrair todos os textos de múltiplos seletores
      const getTextFromSelectors = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent.trim()) {
            return element.textContent.trim();
          }
        }
        return 'N/A';
      };

      // Função para extrair todos os elementos de uma lista
      const getListTexts = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent.trim()).filter(text => text);
      };

      return {
        // Título
        titulo: getTextFromSelectors([
          'h1',
          '.property-title',
          '.listing-title',
          '[data-testid="property-title"]',
          '.title',
          '.property-name',
          '.property-header h1',
          '.listing-header h1'
        ]),

        // Preço
        preco: getTextFromSelectors([
          '.price',
          '.property-price',
          '[data-testid="price"]',
          '.listing-price',
          '.valor',
          '.property-value',
          '.price-value',
          '.listing-value',
          '[class*="price"]',
          '[class*="valor"]'
        ]),

        // Endereço
        endereco: getTextFromSelectors([
          '.address',
          '.property-address',
          '[data-testid="address"]',
          '.listing-address',
          '.endereco',
          '.location',
          '.property-location',
          '[class*="address"]',
          '[class*="endereco"]'
        ]),

        // Área - Buscar por padrões de texto
        area: (() => {
          const text = document.body.textContent;
          const areaMatch = text.match(/(\d+)\s*m²|(\d+)\s*metros|(\d+)\s*metros quadrados/i);
          return areaMatch ? areaMatch[0] : 'N/A';
        })(),

        // Quartos - Buscar por padrões de texto
        quartos: (() => {
          const text = document.body.textContent;
          const quartosMatch = text.match(/(\d+)\s*quarto|(\d+)\s*dormitório|(\d+)\s*bedroom/i);
          return quartosMatch ? quartosMatch[0] : 'N/A';
        })(),

        // Banheiros - Buscar por padrões de texto
        banheiros: (() => {
          const text = document.body.textContent;
          const banheirosMatch = text.match(/(\d+)\s*banheiro|(\d+)\s*bathroom/i);
          return banheirosMatch ? banheirosMatch[0] : 'N/A';
        })(),

        // Vagas - Buscar por padrões de texto
        vagas: (() => {
          const text = document.body.textContent;
          const vagasMatch = text.match(/(\d+)\s*vaga|(\d+)\s*garagem|(\d+)\s*parking/i);
          return vagasMatch ? vagasMatch[0] : 'N/A';
        })(),

        // Descrição
        descricao: getTextFromSelectors([
          '.description',
          '.property-description',
          '[data-testid="description"]',
          '.descricao',
          '.property-details',
          '.listing-description'
        ]),

        // Corretor - Buscar por padrões de texto
        corretor: (() => {
          const text = document.body.textContent;
          // Buscar por nomes de corretores conhecidos
          const corretorMatch = text.match(/(Lucia|Helena|Mazolini|Soto|RE\/MAX VIVA)/i);
          return corretorMatch ? corretorMatch[0] : 'N/A';
        })(),

        // Telefone - Buscar por padrões de texto
        telefone: (() => {
          const text = document.body.textContent;
          const telefoneMatch = text.match(/(\+55\s*11\s*9\d{8}|\(11\)\s*9\d{4}-\d{4}|\(11\)\s*9\d{8})/i);
          return telefoneMatch ? telefoneMatch[0] : 'N/A';
        })(),

        // Email
        email: getTextFromSelectors([
          '.email',
          '[data-testid="email"]',
          '.contato-email',
          '.contact-email',
          '[class*="email"]'
        ]),

        // Características (lista)
        caracteristicas: getListTexts([
          '.feature',
          '.property-feature',
          '.listing-feature',
          '[data-testid="feature"]',
          '.caracteristica',
          '.property-detail',
          '.amenity',
          '[class*="feature"]',
          '[class*="caracteristica"]'
        ]),

        // Imagens
        imagens: Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src),

        // Todos os textos da página (para debug)
        todosTextos: document.body.textContent.substring(0, 1000) + '...'
      };
    });
    
    console.log('✅ Puppeteer - Dados extraídos:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Erro no Puppeteer:', error.message);
    return { erro: error.message };
  } finally {
    await browser.close();
  }
}


// Executar teste
if (require.main === module) {
  testSingleImovel();
}

module.exports = { testSingleImovel };
