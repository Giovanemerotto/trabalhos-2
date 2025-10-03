livraria-crud/
│
├── index.html
├── style.css
└── script.js
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Livraria - CRUD</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <h1>📚 Sistema de Livraria</h1>

  <section id="form-section">
    <h2 id="form-title">Cadastrar Livro</h2>
    <form id="book-form">
      <input type="hidden" id="book-id" />
      <label>Título: <input type="text" id="titulo" required></label>
      <label>Autor: <input type="text" id="autor" required></label>
      <label>Ano: <input type="number" id="ano" required></label>
      <label>Gênero: <input type="text" id="genero" required></label>
      <label>Idioma: <input type="text" id="idioma" required></label>
      <label>Preço (R$): <input type="number" step="0.01" id="preco" required></label>
      <button type="submit">Salvar</button>
      <button type="button" id="cancel-edit" style="display:none">Cancelar</button>
    </form>
  </section>

  <section id="list-section">
    <h2>Livros Cadastrados</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Título</th><th>Autor</th><th>Ano</th><th>Ações</th>
        </tr>
      </thead>
      <tbody id="book-list"></tbody>
    </table>
  </section>

  <section id="details-section" style="display:none">
    <h2>📖 Detalhes do Livro</h2>
    <div id="book-details"></div>
    <button onclick="fecharDetalhes()">Fechar</button>
  </section>

  <script src="script.js"></script>
</body>
</html>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
  background: #f8f9fa;
}

h1, h2 {
  color: #343a40;
}

form label {
  display: block;
  margin: 10px 0;
}

input {
  padding: 5px;
  width: 100%;
  max-width: 400px;
}

button {
  margin: 10px 5px 0 0;
  padding: 8px 12px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 8px;
  border: 1px solid #dee2e6;
  text-align: left;
}

#book-details {
  background: #fff;
  border: 1px solid #ced4da;
  padding: 15px;
  max-width: 400px;
}
let livros = JSON.parse(localStorage.getItem("livros")) || [];
let editando = false;

// Referências DOM
const form = document.getElementById("book-form");
const lista = document.getElementById("book-list");
const detalhes = document.getElementById("book-details");
const secaoDetalhes = document.getElementById("details-section");

function salvarLivros() {
  localStorage.setItem("livros", JSON.stringify(livros));
}

function resetarFormulario() {
  form.reset();
  document.getElementById("book-id").value = "";
  document.getElementById("form-title").textContent = "Cadastrar Livro";
  document.getElementById("cancel-edit").style.display = "none";
  editando = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const id = document.getElementById("book-id").value;
  const livro = {
    id: id || Date.now(),
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    ano: document.getElementById("ano").value,
    genero: document.getElementById("genero").value,
    idioma: document.getElementById("idioma").value,
    preco: parseFloat(document.getElementById("preco").value).toFixed(2),
  };

  if (editando) {
    const index = livros.findIndex(l => l.id == id);
    livros[index] = livro;
  } else {
    livros.push(livro);
  }

  salvarLivros();
  listarLivros();
  resetarFormulario();
});

document.getElementById("cancel-edit").addEventListener("click", () => {
  resetarFormulario();
});

function listarLivros() {
  lista.innerHTML = "";

  livros.forEach((livro) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${livro.id}</td>
      <td>${livro.titulo}</td>
      <td>${livro.autor}</td>
      <td>${livro.ano}</td>
      <td>
        <button onclick="verLivro(${livro.id})">Ver</button>
        <button onclick="editarLivro(${livro.id})">Editar</button>
        <button onclick="excluirLivro(${livro.id})">Excluir</button>
      </td>
    `;
    lista.appendChild(tr);
  });
}

function verLivro(id) {
  const livro = livros.find(l => l.id == id);
  if (!livro) return;

  detalhes.innerHTML = `
    <p><strong>ID:</strong> ${livro.id}</p>
    <p><strong>Título:</strong> ${livro.titulo}</p>
    <p><strong>Autor:</strong> ${livro.autor}</p>
    <p><strong>Ano:</strong> ${livro.ano}</p>
    <p><strong>Gênero:</strong> ${livro.genero}</p>
    <p><strong>Idioma:</strong> ${livro.idioma}</p>
    <p><strong>Preço:</strong> R$ ${livro.preco}</p>
  `;
  secaoDetalhes.style.display = "block";
}

function fecharDetalhes() {
  secaoDetalhes.style.display = "none";
}

function editarLivro(id) {
  const livro = livros.find(l => l.id == id);
  if (!livro) return;

  document.getElementById("book-id").value = livro.id;
  document.getElementById("titulo").value = livro.titulo;
  document.getElementById("autor").value = livro.autor;
  document.getElementById("ano").value = livro.ano;
  document.getElementById("genero").value = livro.genero;
  document.getElementById("idioma").value = livro.idioma;
  document.getElementById("preco").value = livro.preco;

  document.getElementById("form-title").textContent = "Editar Livro";
  document.getElementById("cancel-edit").style.display = "inline";
  editando = true;
}

function excluirLivro(id) {
  if (confirm("Deseja realmente excluir este livro?")) {
    livros = livros.filter(l => l.id != id);
    salvarLivros();
    listarLivros();
  }
}

listarLivros();
