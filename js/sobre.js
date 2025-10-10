// Função de revelar cards ao rolar a página
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 80; // distância do fundo da tela
  
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("show");
      }
    });
  }
  
  // Executa no scroll e no carregamento
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);  