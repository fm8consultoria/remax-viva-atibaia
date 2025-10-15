document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "<span></span><span></span><span></span>";

    const nav = document.querySelector("nav.primary");
    nav.parentNode.insertBefore(hamburger, nav);

    const menu = nav.querySelector("ul");
    const header = document.querySelector(".header");

    // Abrir/fechar menu ao clicar no hamburger
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      menu.classList.toggle("show");
    });

    // Smooth scroll para âncoras
    const navLinks = menu.querySelectorAll("a[href^='#']");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 30;
          
          console.log('Scrolling to:', targetId, 'Position:', targetPosition);
          
          // Usar scrollTo com fallback para navegadores mais antigos
          if (window.scrollTo) {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          } else {
            // Fallback para navegadores que não suportam smooth scroll
            window.scrollTo(0, targetPosition);
          }
        } else {
          console.log('Section not found:', targetId);
        }
        
        // Fechar menu mobile
        menu.classList.remove("show");
        hamburger.classList.remove("active");
      });
    });

    // Ativar link ativo baseado na seção visível
    const sections = document.querySelectorAll("section[id]");
    
    function updateActiveLink() {
      const scrollPos = window.scrollY + header.offsetHeight + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          // Remover classe ativa de todos os links
          navLinks.forEach(link => link.classList.remove("active"));
          
          // Adicionar classe ativa ao link correspondente
          const activeLink = document.querySelector(`nav.primary a[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      });
    }

    // Atualizar link ativo no scroll
    window.addEventListener("scroll", updateActiveLink);
    
    // Atualizar link ativo no carregamento da página
    updateActiveLink();
  });