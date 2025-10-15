const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Lista de URLs dos imóveis
const imoveisUrls = [
  // Terrenos
  { id: '690471003-26', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/bueno-brandao/s-n-sitio-santo-antonio-proximo-a-cidade-de-bueno-brandao/690471003-26', tipo: 'Terreno' },
  { id: '690471003-97', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/bom-jesus-dos-perdoes/306-rua-leonildo-ramos-pinto-marf-ii/690471003-97', tipo: 'Terreno' },
  { id: '690471003-103', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rua-turmalina/690471003-103', tipo: 'Terreno' },
  { id: '690471003-112', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/2795-estr-mun-luciano-rocha-pecanha/690471003-112', tipo: 'Terreno' },
  { id: '690471013-5', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-14-rua-avare-avenida-paulista/690471013-5', tipo: 'Terreno' },
  { id: '690471013-6', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-17-rua-avare-avenida-paulista/690471013-6', tipo: 'Terreno' },
  { id: '690471013-7', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-01-rua-jundiai-avenida-paulista/690471013-7', tipo: 'Terreno' },
  { id: '690471013-8', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-04-rua-violeta-al-lucas-nogueira-garcez/690471013-8', tipo: 'Terreno' },
  { id: '690471013-11', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-16-rua-avare-av-paulista/690471013-11', tipo: 'Terreno' },
  { id: '690471013-13', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-13-rua-avare-avenida-paulista/690471013-13', tipo: 'Terreno' },
  { id: '690471013-15', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-02-rua-jundiai-avenida-paulista/690471013-15', tipo: 'Terreno' },
  { id: '690471013-16', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-18-rua-avare/690471013-16', tipo: 'Terreno' },
  { id: '690471013-17', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/lote-15-rua-avare-avenida-paulista/690471013-17', tipo: 'Terreno' },
  { id: '690471015-990', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/bom-jesus-dos-perdoes/168-rua-milao/690471015-990', tipo: 'Terreno' },
  { id: '690471017-59', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rua-serra-do-itapetinga-proximo-a-al-lucas-n-garcez/690471017-59', tipo: 'Terreno' },
  { id: '690471017-70', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rua-serra-do-itapetinga-proximo-a-al-lucas-n-garcez/690471017-70', tipo: 'Terreno' },
  { id: '690471017-76', url: 'https://www.remax.com.br/pt-br/imoveis/terreno/venda/atibaia/0-rodovia-municipal-engenharia-mackenzie-sublote-d-proximo-ao-frango-assado/690471017-76', tipo: 'Terreno' },

  // Apartamentos
  { id: '690471003-100', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/339-avenida-ipe-mc-donald/690471003-100', tipo: 'Apartamento' },
  { id: '690471003-109', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/198-avenida-atibaia/690471003-109', tipo: 'Apartamento' },
  { id: '690471003-117', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/149-rua-carmela-memolo/690471003-117', tipo: 'Apartamento' },
  { id: '690471003-123', url: 'https://www.remax.com.br/pt-br/imoveis/apartamento/venda/atibaia/6997-avenida-jeronimo-de-camargo/690471003-123', tipo: 'Apartamento' },

  // Casas
  { id: '690471003-84', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/13-rua-magnolia/690471003-84', tipo: 'Casa' },
  { id: '690471003-93', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/mairipora/89-avenida-flamboyant/690471003-93', tipo: 'Casa' },
  { id: '690471003-95', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/bom-jesus-dos-perdoes/390-rua-santa-rita/690471003-95', tipo: 'Casa' },
  { id: '690471003-102', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/703-rua-joao-soares-do-amaral/690471003-102', tipo: 'Casa' },
  { id: '690471003-105', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/57-rua-dos-alecrins-big-supermercado/690471003-105', tipo: 'Casa' },
  { id: '690471003-113', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/510-rua-10/690471003-113', tipo: 'Casa' },
  { id: '690471003-118', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/20-rua-sao-bernardo-jardim-paulista/690471003-118', tipo: 'Casa' },
  { id: '690471003-120', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/1060-rua-araraquara-jardim-paulista/690471003-120', tipo: 'Casa' },
  { id: '690471013-29', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/36-rua-deputado-emilio-justo-proximo-a-al-lucas-n-garcez/690471013-29', tipo: 'Casa' },
  { id: '690471015-987', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/260-avenida-atibaia-travessa-da-santana/690471015-987', tipo: 'Casa' },
  { id: '690471017-67', url: 'https://www.remax.com.br/pt-br/imoveis/casa/venda/atibaia/332-rua-brincos-de-princesa-proximo-ao-supermercado-uniao/690471017-67', tipo: 'Casa' },

  // Casas de Condomínio
  { id: '690471003-94', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/bom-jesus-dos-perdoes/80-rua-acacio-felix-da-costa/690471003-94', tipo: 'Casa de Condomínio' },
  { id: '690471003-104', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-condominio/venda/atibaia/115-rua-lantana/690471003-104', tipo: 'Casa de Condomínio' },
  { id: '690471003-107', url: 'https://www.remax.com.br/pt-br/imoveis/casa-de-vila/venda/atibaia/65-rua-cravinias/690471003-107', tipo: 'Casa de Condomínio' },

  // Chácaras/Sítios
  { id: '690471003-96', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/nazare-paulista/269-rua-jose-da-silva/690471003-96', tipo: 'Chácara/Sítio' },
  { id: '690471003-99', url: 'https://www.remax.com.br/pt-br/imoveis/chacara/-sitio/-fazenda/venda/atibaia/368-rua-das-margaridas-motel-tenesse/690471003-99', tipo: 'Chácara/Sítio' },

  // Comercial
  { id: '690471015-501', url: 'https://www.remax.com.br/pt-br/imoveis/restaurante/venda/atibaia/1-alameda-lucas-nogueira-garcez-vila-thais-atiba/690471015-501', tipo: 'Comercial' },

  // Fazenda
  { id: '690471017-68', url: 'https://www.remax.com.br/pt-br/imoveis/fazenda/venda/atibaia/00-estrada-municipal-epsuo-akai-bairro-do-tanque/690471017-68', tipo: 'Fazenda' }
];

// Função para extrair dados de um imóvel
async function extractImovelData(page, imovelInfo) {
  try {
    console.log(`Extraindo dados do imóvel: ${imovelInfo.id}`);
    
    await page.goto(imovelInfo.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Aguardar o carregamento da página
    await page.waitForTimeout(2000);

    // Extrair dados usando seletores CSS melhorados
    const imovelData = await page.evaluate(() => {
      // Função para extrair texto de múltiplos seletores
      const getTextFromSelectors = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent.trim()) {
            return element.textContent.trim();
          }
        }
        return '';
      };

      // Função para extrair todos os elementos de uma lista
      const getListTexts = (selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent.trim()).filter(text => text);
      };

      const data = {
        id: '',
        titulo: '',
        preco: '',
        precoDolar: '',
        endereco: '',
        cidade: '',
        estado: '',
        tipo: '',
        area: '',
        quartos: '',
        banheiros: '',
        vagas: '',
        descricao: '',
        imagens: [],
        caracteristicas: [],
        corretor: '',
        telefone: '',
        email: '',
        url: window.location.href
      };

      // Título
      data.titulo = getTextFromSelectors([
        'h1',
        '.property-title',
        '.listing-title',
        '[data-testid="property-title"]',
        '.title',
        '.property-name',
        '.property-header h1',
        '.listing-header h1'
      ]);

      // Preço
      data.preco = getTextFromSelectors([
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
      ]);

      // Endereço
      data.endereco = getTextFromSelectors([
        '.address',
        '.property-address',
        '[data-testid="address"]',
        '.listing-address',
        '.endereco',
        '.location',
        '.property-location',
        '[class*="address"]',
        '[class*="endereco"]'
      ]);

      // Área - Buscar por padrões de texto
      const text = document.body.textContent;
      const areaMatch = text.match(/(\d+)\s*m²|(\d+)\s*metros|(\d+)\s*metros quadrados/i);
      data.area = areaMatch ? areaMatch[0] : '';

      // Quartos - Buscar por padrões de texto
      const quartosMatch = text.match(/(\d+)\s*quarto|(\d+)\s*dormitório|(\d+)\s*bedroom/i);
      data.quartos = quartosMatch ? quartosMatch[0] : '';

      // Banheiros - Buscar por padrões de texto
      const banheirosMatch = text.match(/(\d+)\s*banheiro|(\d+)\s*bathroom/i);
      data.banheiros = banheirosMatch ? banheirosMatch[0] : '';

      // Vagas - Buscar por padrões de texto
      const vagasMatch = text.match(/(\d+)\s*vaga|(\d+)\s*garagem|(\d+)\s*parking/i);
      data.vagas = vagasMatch ? vagasMatch[0] : '';

      // Descrição
      data.descricao = getTextFromSelectors([
        '.description',
        '.property-description',
        '[data-testid="description"]',
        '.descricao',
        '.property-details',
        '.listing-description'
      ]);

      // Imagens - Buscar TODAS as imagens da página
      const allImages = Array.from(document.querySelectorAll('img'));
      data.imagens = allImages
        .map(img => img.src)
        .filter(src => src && !src.includes('data:') && !src.includes('icon-') && !src.includes('logo'))
        .filter(src => src.includes('remax.azureedge.net') || src.includes('userimages'));

      // Corretor - Buscar por padrões de texto
      const corretorMatch = text.match(/(Lucia|Helena|Mazolini|Soto|RE\/MAX VIVA)/i);
      data.corretor = corretorMatch ? corretorMatch[0] : '';

      // Telefone - Buscar por padrões de texto
      const telefoneMatch = text.match(/(\+55\s*11\s*9\d{8}|\(11\)\s*9\d{4}-\d{4}|\(11\)\s*9\d{8})/i);
      data.telefone = telefoneMatch ? telefoneMatch[0] : '';

      // Email
      data.email = getTextFromSelectors([
        '.email',
        '[data-testid="email"]',
        '.contato-email',
        '.contact-email',
        '[class*="email"]'
      ]);

      // Características
      caracteristicasSelectors = [
        '.feature',
        '.property-feature',
        '.listing-feature',
        '[data-testid="feature"]',
        '.caracteristica',
        '.property-detail',
        '.amenity',
        '[class*="feature"]',
        '[class*="caracteristica"]'
      ];
      
      caracteristicasSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent.trim();
          if (text && !data.caracteristicas.includes(text)) {
            data.caracteristicas.push(text);
          }
        });
      });

      return data;
    });

    // Adicionar informações básicas
    imovelData.id = imovelInfo.id;
    imovelData.tipo = imovelInfo.tipo;
    imovelData.url = imovelInfo.url;

    // Tentar extrair cidade e estado da URL
    const urlParts = imovelInfo.url.split('/');
    const cidadeIndex = urlParts.findIndex(part => part === 'venda') + 1;
    if (cidadeIndex < urlParts.length) {
      imovelData.cidade = urlParts[cidadeIndex].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    console.log(`✅ Dados extraídos: ${imovelData.titulo || 'Sem título'}`);
    return imovelData;

  } catch (error) {
    console.error(`❌ Erro ao extrair dados do imóvel ${imovelInfo.id}:`, error.message);
    return {
      id: imovelInfo.id,
      tipo: imovelInfo.tipo,
      url: imovelInfo.url,
      erro: error.message,
      titulo: 'Erro ao carregar',
      preco: 'N/A'
    };
  }
}

// Função principal
async function scrapeImoveis() {
  console.log('🚀 Iniciando scraping dos imóveis...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  // Configurar viewport
  await page.setViewport({ width: 1920, height: 1080 });

  const imoveisData = [];
  const totalImoveis = imoveisUrls.length;

  for (let i = 0; i < imoveisUrls.length; i++) {
    const imovelInfo = imoveisUrls[i];
    console.log(`\n📊 Progresso: ${i + 1}/${totalImoveis} - ${imovelInfo.id}`);
    
    try {
      const imovelData = await extractImovelData(page, imovelInfo);
      imoveisData.push(imovelData);
      
      // Aguardar entre requisições para não sobrecarregar o servidor
      await page.waitForTimeout(1000);
      
    } catch (error) {
      console.error(`❌ Erro geral no imóvel ${imovelInfo.id}:`, error.message);
      imoveisData.push({
        id: imovelInfo.id,
        tipo: imovelInfo.tipo,
        url: imovelInfo.url,
        erro: error.message,
        titulo: 'Erro ao carregar',
        preco: 'N/A'
      });
    }
  }

  await browser.close();

  // Salvar dados em JSON
  const outputDir = path.join(__dirname, 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'imoveis-data.json');
  fs.writeFileSync(outputFile, JSON.stringify(imoveisData, null, 2), 'utf8');

  // Salvar também um resumo
  const resumo = {
    totalImoveis: imoveisData.length,
    imoveisComErro: imoveisData.filter(imovel => imovel.erro).length,
    imoveisComSucesso: imoveisData.filter(imovel => !imovel.erro).length,
    dataExtracao: new Date().toISOString(),
    tipos: [...new Set(imoveisData.map(imovel => imovel.tipo))],
    cidades: [...new Set(imoveisData.map(imovel => imovel.cidade).filter(cidade => cidade))]
  };

  const resumoFile = path.join(outputDir, 'resumo-extracao.json');
  fs.writeFileSync(resumoFile, JSON.stringify(resumo, null, 2), 'utf8');

  console.log('\n🎉 Scraping concluído!');
  console.log(`📁 Dados salvos em: ${outputFile}`);
  console.log(`📊 Resumo salvo em: ${resumoFile}`);
  console.log(`✅ Imóveis processados: ${resumo.imoveisComSucesso}/${resumo.totalImoveis}`);
  console.log(`❌ Imóveis com erro: ${resumo.imoveisComErro}`);

  return imoveisData;
}

// Executar se chamado diretamente
if (require.main === module) {
  scrapeImoveis().catch(console.error);
}

module.exports = { scrapeImoveis, imoveisUrls };
