function exibeContatos() {
    tablePerfis = document.getElementById("table-perfis");

    tablePerfis.innerHTML = "";

    readContato(dados => {
        for (i = 0; i < dados.length; i++) {
            let contato = dados[i];
            tablePerfis.innerHTML += `<tr><td scope="row">${contato.id}</td>
                                            <td>${contato.nome}</td>
                                            <td>${contato.telefone}</td>
                                            <td>${contato.email}</td>
                                            <td>${contato.cidade}</td>
                                            <td>${contato.categoria}</td>
                                        </tr>`;
        }
    })
}

function displayMessage(message) {
    msg.innerHTML = `<div class="alert alert-warning">${message}</div>`;
}

function downloadJSON(data, filename) {
    var element = document.createElement('a');
    var blob = new Blob([data], { type: 'text/json' });
    element.href = window.URL.createObjectURL(blob);
    element.download = filename;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function init() {
    formPerfil = document.getElementById("form-perfil");

    btnSave = document.getElementById("btnSalvar");
    btnSave.addEventListener('click', function() {
        if (!formPerfil.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        let campoNome = document.getElementById('inputNome').value;
        let campoTelefone = document.getElementById('inputTelefone').value;
        let campoEmail = document.getElementById('inputEmail').value;
        let campoCidade = document.getElementById('inputCidade').value;
        let campoCategoria = document.getElementById('inputCategoria').value;

        let perfil = {
            nome: campoNome,
            telefone: campoTelefone,
            email: campoEmail,
            cidade: campoCidade,
            categoria: campoCategoria
        };

        let perfilJSON = JSON.stringify(perfil);

        let filename = 'perfil.json';

        downloadJSON(perfilJSON, filename);

        formPerfil.reset();
        function exibeContatos() {
    tablePerfis = document.getElementById("table-perfis");

    tablePerfis.innerHTML = "";

    readContato(dados => {
        for (i = 0; i < dados.length; i++) {
            let contato = dados[i];
            tablePerfis.innerHTML += `<tr><td scope="row">${contato.id}</td>
                                            <td>${contato.nome}</td>
                                            <td>${contato.telefone}</td>
                                            <td>${contato.email}</td>
                                            <td>${contato.cidade}</td>
                                            <td>${contato.categoria}</td>
                                        </tr>`;
        }
    })
}

function displayMessage(message) {
    msg.innerHTML = `<div class="alert alert-warning">${message}</div>`;
}

function downloadJSON(data, filename) {
    var element = document.createElement('a');
    var blob = new Blob([data], { type: 'text/json' });
    element.href = window.URL.createObjectURL(blob);
    element.download = filename;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function init() {
    formPerfil = document.getElementById("form-perfil");

    btnSave = document.getElementById("btnSalvar");
    btnSave.addEventListener('click', function() {
        if (!formPerfil.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        let campoNome = document.getElementById('inputNome').value;
        let campoTelefone = document.getElementById('inputTelefone').value;
        let campoEmail = document.getElementById('inputEmail').value;
        let campoCidade = document.getElementById('inputCidade').value;
        let campoCategoria = document.getElementById('inputCategoria').value;

        let perfil = {
            nome: campoNome,
            telefone: campoTelefone,
            email: campoEmail,
            cidade: campoCidade,
            categoria: campoCategoria
        };

        let perfilJSON = JSON.stringify(perfil);

        let filename = 'perfil.json';

        downloadJSON(perfilJSON, filename);

        formPerfil.reset();

        window.location.href = "index.html";
    });

    msg = document.getElementById('msg');
    msg.addEventListener("DOMSubtreeModified", function(e) {
        if (e.target.innerHTML == "") return;
        setTimeout(function() {
            alert = msg.getElementsByClassName("alert");
            alert[0].remove();
        }, 5000);
    });

    gridPerfis = document.getElementById("grid-perfis");
    gridPerfis.addEventListener('click', function(e) {
        if (e.target.tagName == "TD") {
            let linhaPerfil = e.target.parentNode;
            colunas = linhaPerfil.querySelectorAll("td");

            document.getElementById('inputId').value = colunas[0].innerText;
            document.getElementById('inputNome').value = colunas[1].innerText;
            document.getElementById('inputTelefone').value = colunas[2].innerText;
            document.getElementById('inputEmail').value = colunas[3].innerText;
            document.getElementById('inputCidade').value = colunas[4].innerText;
            document.getElementById('inputCategoria').value = colunas[5].innerText;
        }
    });

    exibeContatos();
}

    });

    msg = document.getElementById('msg');
    msg.addEventListener("DOMSubtreeModified", function(e) {
        if (e.target.innerHTML == "") return;
        setTimeout(function() {
            alert = msg.getElementsByClassName("alert");
            alert[0].remove();
        }, 5000);
    });

    gridPerfis = document.getElementById("grid-perfis");
    gridPerfis.addEventListener('click', function(e) {
        if (e.target.tagName == "TD") {
            let linhaPerfil = e.target.parentNode;
            colunas = linhaPerfil.querySelectorAll("td");

            document.getElementById('inputId').value = colunas[0].innerText;
            document.getElementById('inputNome').value = colunas[1].innerText;
            document.getElementById('inputTelefone').value = colunas[2].innerText;
            document.getElementById('inputEmail').value = colunas[3].innerText;
            document.getElementById('inputCidade').value = colunas[4].innerText;
            document.getElementById('inputCategoria').value = colunas[5].innerText;
        }
    });

    exibeContatos();
}
