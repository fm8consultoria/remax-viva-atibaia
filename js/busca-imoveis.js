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
      } else {
        // Se não conseguir carregar, usar array vazio
        this.imoveis = [];
      }
    } catch (error) {
      // Se houver erro, usar array vazio
      this.imoveis = [];
    }
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

    // Preço
    const preco = this.extrairPreco(imovel.preco);
    if (preco < filtros.precoMin || preco > filtros.precoMax) {
      return false;
    }

    // Quartos
    if (filtros.quartos) {
      const quartosImovel = this.extrairNumero(imovel.quartos);
      const quartosFiltro = parseInt(filtros.quartos);
      if (filtros.quartos === '5' && quartosImovel < 5) {
        return false;
      } else if (filtros.quartos !== '5' && quartosImovel !== quartosFiltro) {
        return false;
      }
    }

    // Banheiros
    if (filtros.banheiros) {
      const banheirosImovel = this.extrairNumero(imovel.banheiros);
      const banheirosFiltro = parseInt(filtros.banheiros);
      if (filtros.banheiros === '4' && banheirosImovel < 4) {
        return false;
      } else if (filtros.banheiros !== '4' && banheirosImovel !== banheirosFiltro) {
        return false;
      }
    }

    // Área
    if (filtros.area && filtros.area !== Infinity) {
      const areaImovel = this.extrairArea(imovel.area);
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
    if (!precoStr) return 0;
    const match = precoStr.match(/R\$\s*([\d.,]+)/);
    if (match) {
      return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    }
    return 0;
  }

  extrairNumero(str) {
    if (!str) return 0;
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  extrairArea(str) {
    if (!str) return '';
    // Extrair área mantendo a unidade (m², metros, etc.)
    const match = str.match(/(\d+)\s*(m²|metros|m2)/i);
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
          return this.extrairPreco(a.preco) - this.extrairPreco(b.preco);
        case 'preco-desc':
          return this.extrairPreco(b.preco) - this.extrairPreco(a.preco);
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
          <div class="imovel-item-actions">
            <button class="imovel-item-action" title="Favoritar">
              <i class="fas fa-heart"></i>
            </button>
            <button class="imovel-item-action" title="Compartilhar">
              <i class="fas fa-share"></i>
            </button>
          </div>
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
            <button class="btn-ver-detalhes" onclick="buscaImoveis.verDetalhes('${imovel.id}')">
              Ver Detalhes
            </button>
            <button class="btn-contato" onclick="buscaImoveis.contatar('${imovel.telefone}')">
              <i class="fas fa-phone"></i>
            </button>
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
    elemento.textContent = `${total} imóvel${total !== 1 ? 'is' : ''} encontrado${total !== 1 ? 's' : ''}`;
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

  verDetalhes(id) {
    const imovel = this.imoveis.find(i => i.id === id);
    if (imovel) {
      // Abrir modal ou redirecionar para página de detalhes
      alert(`Detalhes do imóvel: ${imovel.titulo}\nPreço: ${imovel.preco}\nEndereço: ${imovel.endereco}`);
    }
  }

  contatar(telefone) {
    if (telefone) {
      // Abrir WhatsApp ou fazer ligação
      const whatsappUrl = `https://wa.me/55${telefone.replace(/\D/g, '')}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Telefone não disponível');
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const secaoBusca = document.getElementById('busca-imoveis');
  if (secaoBusca) {
    window.buscaImoveis = new BuscaImoveis();
  }
});
