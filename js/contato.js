const form = document.getElementById('contatoForm');
const telefone = document.getElementById('telefone');

// Máscara de telefone
telefone.addEventListener('input', () => {
  let v = telefone.value.replace(/\D/g, ''); // remove tudo que não é número
  if (v.length > 11) v = v.slice(0, 11); // limita a 11 dígitos
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); // adiciona parênteses no DDD
  v = v.replace(/(\d{5})(\d{4})$/, '$1-$2'); // adiciona traço
  telefone.value = v;
});

// Envio para WhatsApp
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const conv = document.getElementById('convenio').value;
  const msg = document.getElementById('mensagem').value.trim();
  const tel = telefone.value.trim();

  if (!nome || !email || !tel || !conv) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Número do WhatsApp da imobiliária (formato internacional sem espaços ou símbolos)
  const whatsappNumber = "5511975673838";

  // Monta a mensagem
  const text = `Olá! Venho através do site e gostaria de mais informações.%0A%0ANome: ${encodeURIComponent(nome)}%0AEmail: ${encodeURIComponent(email)}%0ATelefone: ${encodeURIComponent(tel)}%0AConvênio: ${encodeURIComponent(conv)}%0AMensagem: ${encodeURIComponent(msg)}`;

  // Link do WhatsApp
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${text}`;

  // Abre o WhatsApp
  window.open(whatsappLink, "_blank");
});