// Sistema de Busca e Filtros de Imóveis
class BuscaImoveis {
  constructor() {
    this.imoveis = [];
    this.imoveisFiltrados = [];
    this.imoveisExibidos = [];
    this.itensPorPagina = 9;
    this.paginaAtual = 1;
    
    this.init();
  }

  async init() {
    this.mostrarLoading();
    await this.carregarImoveis();
    this.configurarEventos();
    this.exibirTodosImoveis();
    this.esconderLoading();
  }

  mostrarLoading() {
    const container = document.getElementById('lista-imoveis');
    if (container) {
      container.innerHTML = `
        <div class="loading">
          <i class="fas fa-spinner"></i>
          <p>Carregando imóveis...</p>
        </div>
      `;
    }
  }

  esconderLoading() {
    // Loading removido
  }

  async carregarImoveis() {
    try {
      // Carregar dados do scraper
      const response = await fetch('data/imoveis-data.json');
      
      if (response.ok) {
        this.imoveis = await response.json();
        this.popularFiltros();
      } else {
        // Se não conseguir carregar, usar array vazio
        this.imoveis = [];
      }
    } catch (error) {
      // Se houver erro, usar array vazio
      this.imoveis = [];
    }
  }

  popularFiltros() {
    if (!this.imoveis || this.imoveis.length === 0) return;

    // Popular tipos de imóveis
    this.popularSelect('tipo-imovel', this.extrairValoresUnicos('tipo'));
    
    // Cidades já estão corretas no HTML - não popular dinamicamente
    
    // Popular preços (mínimo e máximo)
    this.popularPrecos();
    
    // Popular quartos
    this.popularQuartos();
    
    // Popular banheiros
    this.popularBanheiros();
    
    // Popular áreas
    this.popularAreas();
  }

  extrairValoresUnicos(campo) {
    const valores = [...new Set(this.imoveis.map(imovel => imovel[campo]).filter(valor => valor))];
    return valores.sort();
  }

  popularSelect(selectId, valores) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Manter a primeira opção (placeholder)
    const primeiraOpcao = select.querySelector('option');
    select.innerHTML = '';
    select.appendChild(primeiraOpcao);

    // Adicionar valores únicos
    valores.forEach(valor => {
      const option = document.createElement('option');
      option.value = valor;
      option.textContent = valor;
      select.appendChild(option);
    });
  }

  popularPrecos() {
    const precos = this.imoveis
      .map(imovel => this.extrairPreco(imovel.preco))
      .filter(preco => preco !== null && preco > 0)
      .sort((a, b) => a - b);

    if (precos.length === 0) return;

    // Garantir que o preço mínimo seja sempre maior que 0
    const precoMin = Math.max(100000, Math.floor(precos[0] / 100000) * 100000);
    const precoMax = Math.ceil(precos[precos.length - 1] / 100000) * 100000;

    // Popular preço mínimo
    this.popularSelectComOpcoes('preco-min', this.gerarFaixasPrecoComTexto(precoMin, precoMax));
    
    // Popular preço máximo
    this.popularSelectComOpcoes('preco-max', this.gerarFaixasPrecoComTexto(precoMin, precoMax));
  }

  gerarFaixasPrecoComTexto(min, max) {
    const faixas = [];
    const incremento = Math.max(100000, Math.floor((max - min) / 10));
    
    for (let i = min; i <= max; i += incremento) {
      // Garantir que não inclua R$ 0
      if (i > 0) {
        faixas.push({
          valor: i,
          texto: `R$ ${i.toLocaleString('pt-BR')}`
        });
      }
    }
    
    return faixas;
  }


  popularQuartos() {
    const quartos = [...new Set(this.imoveis
      .map(imovel => this.extrairNumero(imovel.quartos))
      .filter(num => num > 0)
      .sort((a, b) => a - b))];

    const opcoes = quartos.map(num => ({
      valor: num,
      texto: `Até ${num} quarto${num > 1 ? 's' : ''}`
    }));

    this.popularSelectComOpcoes('quartos', opcoes);
  }

  popularBanheiros() {
    const banheiros = [...new Set(this.imoveis
      .map(imovel => this.extrairNumero(imovel.banheiros))
      .filter(num => num > 0)
      .sort((a, b) => a - b))];

    const opcoes = banheiros.map(num => ({
      valor: num,
      texto: `Até ${num} banheiro${num > 1 ? 's' : ''}`
    }));

    this.popularSelectComOpcoes('banheiros', opcoes);
  }

  popularAreas() {
    const areas = this.imoveis
      .map(imovel => this.extrairNumeroArea(imovel.area))
      .filter(area => area > 0)
      .sort((a, b) => a - b);

    if (areas.length === 0) return;

    const areaMin = Math.floor(areas[0] / 50) * 50;
    const areaMax = Math.ceil(areas[areas.length - 1] / 100) * 100;

    const opcoes = [];
    const incrementos = [50, 100, 200, 500, 1000, 2000, 5000, 10000];
    
    for (const inc of incrementos) {
      if (inc >= areaMin && inc <= areaMax) {
        opcoes.push({
          valor: inc,
          texto: `Até ${inc.toLocaleString('pt-BR')}m²`
        });
      }
    }

    this.popularSelectComOpcoes('area', opcoes);
  }

  popularSelectComOpcoes(selectId, opcoes) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Manter a primeira opção (placeholder)
    const primeiraOpcao = select.querySelector('option');
    select.innerHTML = '';
    select.appendChild(primeiraOpcao);

    // Adicionar opções
    opcoes.forEach(opcao => {
      const option = document.createElement('option');
      option.value = opcao.valor;
      option.textContent = opcao.texto;
      select.appendChild(option);
    });
  }

  configurarEventos() {
    // Filtros
    document.getElementById('aplicar-filtros').addEventListener('click', () => {
      this.aplicarFiltros();
    });

    document.getElementById('limpar-filtros').addEventListener('click', () => {
      this.limparFiltros();
    });

    // Ordenação
    document.getElementById('ordenar-por').addEventListener('change', () => {
      this.ordenarImoveis();
    });

    // Carregar mais
    document.getElementById('carregar-mais').addEventListener('click', () => {
      this.carregarMaisImoveis();
    });

    // Enter nos filtros
    document.querySelectorAll('.filtro-select').forEach(select => {
      select.addEventListener('change', () => {
        this.aplicarFiltros();
      });
    });
  }

  aplicarFiltros() {
    const filtros = this.obterFiltros();
    this.imoveisFiltrados = this.imoveis.filter(imovel => {
      return this.filtrarImovel(imovel, filtros);
    });

    this.paginaAtual = 1;
    this.ordenarImoveis();
    this.exibirImoveis();
    this.atualizarContador();
  }

  obterFiltros() {
    return {
      tipo: document.getElementById('tipo-imovel').value,
      precoMin: parseInt(document.getElementById('preco-min').value) || 0,
      precoMax: parseInt(document.getElementById('preco-max').value) || Infinity,
      quartos: document.getElementById('quartos').value,
      banheiros: document.getElementById('banheiros').value,
      area: parseInt(document.getElementById('area').value) || Infinity,
      cidade: document.getElementById('cidade').value
    };
  }

  filtrarImovel(imovel, filtros) {
    // Tipo
    if (filtros.tipo && imovel.tipo !== filtros.tipo) {
      return false;
    }

    // Preço (filtro "até" - máximo)
    const preco = this.extrairPreco(imovel.preco);
    if (preco === null) {
      return false; // Excluir imóveis sem preço válido
    }
    if (filtros.precoMin && preco < filtros.precoMin) {
      return false;
    }
    if (filtros.precoMax && preco > filtros.precoMax) {
      return false;
    }

    // Quartos (filtro "até" - máximo)
    if (filtros.quartos) {
      const quartosImovel = this.extrairNumero(imovel.quartos);
      const quartosFiltro = parseInt(filtros.quartos);
      if (quartosImovel > quartosFiltro) {
        return false;
      }
    }

    // Banheiros (filtro "até" - máximo)
    if (filtros.banheiros) {
      const banheirosImovel = this.extrairNumero(imovel.banheiros);
      const banheirosFiltro = parseInt(filtros.banheiros);
      if (banheirosImovel > banheirosFiltro) {
        return false;
      }
    }

    // Área (filtro "até" - máximo)
    if (filtros.area && filtros.area !== Infinity) {
      const areaImovel = this.extrairNumeroArea(imovel.area);
      if (areaImovel > filtros.area) {
        return false;
      }
    }

    // Cidade
    if (filtros.cidade && imovel.cidade !== filtros.cidade) {
      return false;
    }

    return true;
  }

  extrairPreco(precoStr) {
    if (!precoStr || precoStr === 'Preço sob consulta') return null;
    const match = precoStr.match(/R\$\s*([\d.,]+)/);
    if (match) {
      const preco = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
      return preco > 0 ? preco : null;
    }
    return null;
  }

  extrairNumero(str) {
    if (!str) return 0;
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  extrairNumeroArea(str) {
    if (!str) return 0;
    // Extrair número da área removendo pontos e convertendo para número
    const match = str.match(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)/);
    if (match) {
      // Remove pontos de milhares e converte vírgula para ponto decimal
      const numeroLimpo = match[1].replace(/\./g, '').replace(',', '.');
      return parseFloat(numeroLimpo);
    }
    return 0;
  }

  extrairArea(str) {
    if (!str) return '';
    // Extrair área mantendo a unidade (m², metros, etc.) - suporta números com pontos
    const match = str.match(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*(m²|metros|m2)/i);
    return match ? match[0] : str;
  }

  limparPreco(precoStr) {
    if (!precoStr) return 'Sob consulta';
    // Remove a parte do dólar se existir (tudo após o primeiro $ que não seja R$)
    const precoLimpo = precoStr.replace(/\s+\$\s+[\d.,]+.*$/, '');
    return precoLimpo.trim();
  }

  ordenarImoveis() {
    const ordenacao = document.getElementById('ordenar-por').value;
    
    this.imoveisFiltrados.sort((a, b) => {
      switch (ordenacao) {
        case 'preco-asc':
          const precoA = this.extrairPreco(a.preco) || 0;
          const precoB = this.extrairPreco(b.preco) || 0;
          return precoA - precoB;
        case 'preco-desc':
          const precoA2 = this.extrairPreco(a.preco) || 0;
          const precoB2 = this.extrairPreco(b.preco) || 0;
          return precoB2 - precoA2;
        case 'area-desc':
          return this.extrairNumero(b.area) - this.extrairNumero(a.area);
        case 'recente':
          return new Date(b.id) - new Date(a.id);
        default:
          return 0;
      }
    });

    this.exibirImoveis();
  }

  exibirImoveis() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    
    this.imoveisExibidos = this.imoveisFiltrados.slice(0, fim);
    this.renderizarImoveis();
    this.atualizarBotaoCarregarMais();
  }

  exibirTodosImoveis() {
    this.imoveisFiltrados = [...this.imoveis];
    this.paginaAtual = 1;
    this.exibirImoveis();
    this.atualizarContador();
  }

  carregarMaisImoveis() {
    this.paginaAtual++;
    this.exibirImoveis();
  }

  renderizarImoveis() {
    const container = document.getElementById('lista-imoveis');
    
    if (this.imoveisExibidos.length === 0) {
      container.innerHTML = this.getHTMLListaVazia();
      return;
    }

    const html = this.imoveisExibidos.map(imovel => this.getHTMLImovel(imovel)).join('');
    container.innerHTML = html;
  }

  getHTMLImovel(imovel) {
    const imagem = imovel.imagens && imovel.imagens.length > 0 
      ? imovel.imagens[0] 
      : 'https://via.placeholder.com/300x200/95a5a6/ffffff?text=Sem+Imagem';

    return `
      <div class="imovel-item" data-id="${imovel.id}">
        <div class="imovel-item-image">
          <img src="${imagem}" alt="${imovel.titulo}" loading="lazy">
          <div class="imovel-item-tag">${imovel.tipo}</div>
        </div>
        <div class="imovel-item-details">
          <div class="imovel-item-price">
            <span class="imovel-item-price-main">${this.limparPreco(imovel.preco)}</span>
          </div>
          <div class="imovel-item-type">${imovel.titulo}</div>
          <div class="imovel-item-location">${imovel.endereco || imovel.cidade}</div>
          <div class="imovel-item-features">
            ${imovel.quartos ? `<span class="imovel-item-feature"><i class="fas fa-bed"></i> ${this.extrairNumero(imovel.quartos)}</span>` : ''}
            ${imovel.banheiros ? `<span class="imovel-item-feature"><i class="fas fa-bath"></i> ${this.extrairNumero(imovel.banheiros)}</span>` : ''}
            ${imovel.area ? `<span class="imovel-item-feature"><i class="fas fa-home"></i> ${this.extrairArea(imovel.area)}</span>` : ''}
            ${imovel.vagas ? `<span class="imovel-item-feature"><i class="fas fa-expand-arrows-alt"></i> ${this.extrairArea(imovel.vagas)}</span>` : ''}
          </div>
          <div class="imovel-item-actions-bottom">
            <a href="${imovel.url || '#'}" target="_blank" class="btn-ver-detalhes">
              Ver Detalhes
            </a>
            <a href="https://api.whatsapp.com/send?phone=5511975673838&text=Olá, tenho interesse no imóvel: ${encodeURIComponent(imovel.titulo)}" target="_blank" class="btn-contato">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  getHTMLListaVazia() {
    return `
      <div class="lista-vazia">
        <i class="fas fa-search"></i>
        <h3>Nenhum imóvel encontrado</h3>
        <p>Tente ajustar os filtros para encontrar mais opções.</p>
        <button class="btn-filtro btn-aplicar" onclick="buscaImoveis.limparFiltros()">
          Limpar Filtros
        </button>
      </div>
    `;
  }

  atualizarContador() {
    const total = this.imoveisFiltrados.length;
    const elemento = document.getElementById('total-resultados');
    elemento.textContent = `${total} ${total !== 1 ? 'imóveis' : 'imóvel'} encontrado${total !== 1 ? 's' : ''}`;
  }

  atualizarBotaoCarregarMais() {
    const container = document.getElementById('carregar-mais-container');
    const temMais = this.imoveisExibidos.length < this.imoveisFiltrados.length;
    container.style.display = temMais ? 'block' : 'none';
  }

  limparFiltros() {
    document.getElementById('tipo-imovel').value = '';
    document.getElementById('preco-min').value = '';
    document.getElementById('preco-max').value = '';
    document.getElementById('quartos').value = '';
    document.getElementById('banheiros').value = '';
    document.getElementById('area').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('ordenar-por').value = 'preco-asc';
    
    this.exibirTodosImoveis();
  }

}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const secaoBusca = document.getElementById('busca-imoveis');
  if (secaoBusca) {
    window.buscaImoveis = new BuscaImoveis();
  }
});
