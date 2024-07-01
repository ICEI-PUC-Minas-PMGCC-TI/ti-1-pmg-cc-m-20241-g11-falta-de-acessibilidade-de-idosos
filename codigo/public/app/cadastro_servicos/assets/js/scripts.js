function init() {
    formPerfil = document.getElementById("form-perfil");

    btnSave = document.getElementById("btnSalvar");
    btnSave.addEventListener('click', function() {
        if (!formPerfil.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Capturar os valores dos campos do formulário
        let campoTitulo = document.getElementById('inputTitulo').value;
        let campoDescricao = document.getElementById('inputText').value;
        let campoValor = document.getElementById('inputValor').value;
        let campoCelular = document.getElementById('inputCelular').value;
        let campoCategoria = document.getElementById('inputCategoria').value;
        let campoCEP = document.getElementById('inputCEP').value;

        // Criar um objeto JSON com os dados do formulário
        let perfil = {
            titulo: campoTitulo,
            descricao: campoDescricao,
            valor: campoValor,
            celular: campoCelular,
            categoria: campoCategoria,
            cep: campoCEP
        };

        // Converter o objeto para JSON
        let perfilJSON = JSON.stringify(perfil);

        // Exemplo de salvamento em um arquivo db.json
        // Aqui você pode enviar o JSON para um endpoint de API também

        // Simulação de salvamento em db.json (localmente)
        saveToDB(perfilJSON);
    });

    msg = document.getElementById('msg');
    msg.addEventListener("DOMSubtreeModified", function(e) {
        if (e.target.innerHTML == "") return;
        setTimeout(function() {
            alert = msg.getElementsByClassName("alert");
            alert[0].remove();
        }, 5000);
    });
}

function saveToDB(jsonData) {
    // Simulação de salvamento em db.json (localmente)
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/servicos", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displayMessage("Dados salvos com sucesso.");
            // Limpar formulário após salvar (opcional)
            formPerfil.reset();
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            displayMessage("Erro ao salvar os dados.");
        }
    };
    xhr.send(jsonData);
}
