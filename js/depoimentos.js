// depoimentos.js - Slick Carousel
$(document).ready(function(){
  // Função para criar estrelas CSS e limitar texto
  function formatDepoimentos() {
    $('.depoimentos-slider .card p').each(function() {
      const $this = $(this);
      
      // Verificar se já foi formatado
      if ($this.data('formatted')) {
        return;
      }
      
      const originalText = $this.html();
      const maxLength = 200; // Limite de caracteres
      
      // Salvar texto original
      $this.data('original-text', originalText);
      
      // Separar estrelas do texto
      const starMatch = originalText.match(/^(⭐⭐⭐⭐⭐\s*<br\s*\/?>)/);
      let content = originalText;
      
      if (starMatch) {
        content = originalText.replace(/^(⭐⭐⭐⭐⭐\s*<br\s*\/?>)/, '');
      }
      
      // Truncar texto se necessário
      let isTruncated = false;
      if (content.length > maxLength) {
        content = content.substring(0, maxLength) + '...';
        isTruncated = true;
      }
      
      // Criar estrelas usando símbolo Unicode
      const starsHtml = '<div class="stars">' +
        '<span class="star">★</span>' +
        '<span class="star">★</span>' +
        '<span class="star">★</span>' +
        '<span class="star">★</span>' +
        '<span class="star">★</span>' +
        '</div>';
      
      // Adicionar botão "Leia mais" se truncado
      if (isTruncated) {
        const readMoreId = 'read-more-' + Math.random().toString(36).substr(2, 9);
        content += ' <span class="read-more" data-modal-id="' + readMoreId + '">Leia mais</span>';
        
        // Criar modal para este depoimento
        createModal(readMoreId, originalText, starMatch);
      }
      
      // Reconstruir HTML com estrelas e texto limitado
      const newHtml = starsHtml + content;
      $this.html(newHtml);
      
      // Marcar como formatado
      $this.data('formatted', true);
    });
  }
  
  // Função para criar modal
  function createModal(modalId, fullText, hasStars) {
    // Remover modal existente se houver
    $('#' + modalId).remove();
    
    // Criar HTML do modal
    let modalHtml = '<div id="' + modalId + '" class="depoimento-modal">';
    modalHtml += '<div class="modal-content">';
    modalHtml += '<span class="modal-close">&times;</span>';
    
    if (hasStars) {
      modalHtml += '<div class="stars">';
      for (let i = 0; i < 5; i++) {
        modalHtml += '<span class="star">★</span>';
      }
      modalHtml += '</div>';
    }
    
    modalHtml += '<p>' + fullText.replace(/^(⭐⭐⭐⭐⭐\s*<br\s*\/?>)/, '') + '</p>';
    modalHtml += '</div>';
    modalHtml += '</div>';
    
    // Adicionar modal ao body
    $('body').append(modalHtml);
  }
  
  // Event listeners para modais
  $(document).on('click', '.read-more', function() {
    const modalId = $(this).data('modal-id');
    $('#' + modalId).fadeIn(300);
  });
  
  // Fechar modal ao clicar no X
  $(document).on('click', '.modal-close', function() {
    $(this).closest('.depoimento-modal').fadeOut(300);
  });
  
  // Fechar modal ao clicar fora do conteúdo
  $(document).on('click', '.depoimento-modal', function(e) {
    if (e.target === this) {
      $(this).fadeOut(300);
    }
  });
  
  // Fechar modal com tecla ESC
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      $('.depoimento-modal:visible').fadeOut(300);
    }
  });
  
  // Executar formatação após carregar o slider
  $('.depoimentos-slider').slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: true,
    arrows: true,
    centerPadding: '0px',
    swipe: true,
    touchMove: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: false,
          swipe: true,
          touchMove: true,
          draggable: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          swipe: true,
          touchMove: true,
          draggable: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          swipe: true,
          touchMove: true,
          draggable: true,
        }
      }
    ]
  });
  
  // Executar formatação após inicializar o slider
  setTimeout(formatDepoimentos, 100);
  
  // Re-executar formatação quando o slider mudar
  $('.depoimentos-slider').on('afterChange', function(event, slick, currentSlide) {
    setTimeout(formatDepoimentos, 50);
  });
  
  // Re-executar formatação quando o slider for inicializado
  $('.depoimentos-slider').on('init', function(event, slick) {
    setTimeout(formatDepoimentos, 100);
  });
  
  // Re-executar formatação quando o slider for redimensionado
  $('.depoimentos-slider').on('setPosition', function(event, slick) {
    setTimeout(formatDepoimentos, 50);
  });
});