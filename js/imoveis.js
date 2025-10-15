// Inicialização do Slider de Imóveis
$(document).ready(function() {
    // Configuração do Slick Carousel para Imóveis
    $('.imoveis-slider').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: true,
        dots: true,
        swipe: true,
        touchMove: true,
        draggable: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: true
                }
            }
        ]
    });

    // Funcionalidade dos botões de ação (coração e bookmark)
    $('.action-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $btn = $(this);
        const $icon = $btn.find('i');
        
        // Toggle da classe ativa
        $btn.toggleClass('active');
        
        if ($btn.hasClass('active')) {
            // Adicionar animação de "favoritado"
            $icon.css('color', '#e74c3c');
            $btn.css('background', 'rgba(231, 76, 60, 0.1)');
            
            // Animação de pulso
            $btn.css('transform', 'scale(1.2)');
            setTimeout(() => {
                $btn.css('transform', 'scale(1)');
            }, 200);
            
            // Feedback visual
            showNotification('Adicionado aos favoritos!', 'success');
        } else {
            // Remover dos favoritos
            $icon.css('color', '#2c3e50');
            $btn.css('background', 'rgba(255, 255, 255, 0.9)');
            
            showNotification('Removido dos favoritos!', 'info');
        }
    });

    // Funcionalidade de clique no card (abrir detalhes)
    $('.imovel-card').on('click', function(e) {
        // Não abrir se clicou nos botões de ação
        if ($(e.target).closest('.action-btn').length > 0) {
            return;
        }
        
        const $card = $(this);
        const imovelId = $card.data('imovel-id') || 'imovel-' + Math.random().toString(36).substr(2, 9);
        
        // Aqui você pode implementar a lógica para abrir uma página de detalhes
        // ou um modal com mais informações do imóvel
        console.log('Abrir detalhes do imóvel:', imovelId);
        
        // Exemplo: redirecionar para página de detalhes
        // window.location.href = '/imovel/' + imovelId;
        
        // Ou abrir modal (implementar se necessário)
        showImovelModal($card);
    });

    // Efeito de hover nos cards
    $('.imovel-card').hover(
        function() {
            $(this).find('.imovel-image img').css('transform', 'scale(1.05)');
        },
        function() {
            $(this).find('.imovel-image img').css('transform', 'scale(1)');
        }
    );

    // Lazy loading das imagens (se necessário)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('.imovel-image img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = $(`
        <div class="notification notification-${type}">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `);
    
    // Adicionar estilos se não existirem
    if (!$('#notification-styles').length) {
        $('head').append(`
            <style id="notification-styles">
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 250px;
                    animation: slideIn 0.3s ease;
                }
                .notification-success {
                    border-left: 4px solid #27ae60;
                }
                .notification-info {
                    border-left: 4px solid #3498db;
                }
                .notification-error {
                    border-left: 4px solid #e74c3c;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #7f8c8d;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-close:hover {
                    color: #2c3e50;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            </style>
        `);
    }
    
    // Adicionar ao DOM
    $('body').append(notification);
    
    // Auto-remover após 3 segundos
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
    
    // Remover ao clicar no X
    notification.find('.notification-close').on('click', function() {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    });
}

// Função para mostrar modal de detalhes do imóvel
function showImovelModal($card) {
    // Aqui você pode implementar um modal com mais detalhes
    // Por enquanto, apenas um console.log
    console.log('Mostrar modal para:', $card.find('.imovel-type').text());
    
    // Exemplo de implementação de modal:
    /*
    const modal = $(`
        <div class="imovel-modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3>Detalhes do Imóvel</h3>
                <p>Mais informações sobre este imóvel...</p>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    modal.fadeIn(300);
    
    // Fechar modal
    modal.find('.modal-close, .imovel-modal').on('click', function(e) {
        if (e.target === this) {
            modal.fadeOut(300, function() {
                $(this).remove();
            });
        }
    });
    */
}

// Função para filtrar imóveis (se necessário)
function filterImoveis(filter) {
    // Implementar filtros se necessário
    console.log('Filtrar imóveis por:', filter);
}

// Função para ordenar imóveis (se necessário)
function sortImoveis(sortBy) {
    // Implementar ordenação se necessário
    console.log('Ordenar imóveis por:', sortBy);
}
