function onOff() {
  document
    .querySelector("#modal")
    .classList
    .toggle("hide")

  document
    .querySelector("body")
    .classList
    .toggle("hideScroll")

  document
    .querySelector("#modal")
    .classList
    .toggle("addScroll")
}

function removerPrimeiraOpcao() {
  const selectElement = document.getElementById('categoriaEsporte');
  // Verifica se a primeira opção ainda existe e é a que queremos remover
  if (selectElement.options.length > 0 && selectElement.options[0].value === "") {
    selectElement.remove(0); // Remove a primeira opção (índice 0)
  }
}

function checarCampos(event) {
  const camposParaChecar = [
    "titulo",
    "categoria",
    "descricao",
    "imagem",
  ]

  const estaVazia = camposParaChecar.find(function (campo) {
    const checarString = typeof event.target[campo].value === "string"
    const checarVazio = !event.target[campo].value.trim()
    if (checarString && checarVazio){
      return true
    }
  })

  if(estaVazia) {
    event.preventDefault()
    alert("Preencha todos os campos para prosseguir")
  }
}

// Adicione este código em um arquivo JS que seja carregado no frontend
// Por exemplo, você pode criar um arquivo 'public/js/delete.js'
// e incluí-lo no seu HTML com <script src="/js/delete.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões com a classe 'botao-apagar'
    const deleteButtons = document.querySelectorAll('.botaoExcluir');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Previne o comportamento padrão do botão (se for um submit em um form, por exemplo)
            event.preventDefault();

            // Pega o ID do esporte do atributo data-id
            const esporteId = event.target.dataset.id;
            const tituloEsporte = event.target.closest('.ideia').querySelector('h3').innerText;

            // Exibe a mensagem de confirmação
            const confirmacao = confirm(`Tem certeza que deseja excluir o esporte "${tituloEsporte}"?`);

            if (confirmacao) {
                // Se o usuário confirmar, envie uma requisição POST para o backend
                // Usaremos um formulário oculto para enviar o ID
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/esporte/delete`; // Rota que vamos criar no server.js

                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'id';
                input.value = esporteId;

                form.appendChild(input);
                document.body.appendChild(form); // Anexa o formulário ao corpo do documento
                form.submit(); // Envia o formulário
            }
        });
    });
});