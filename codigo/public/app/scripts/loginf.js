// Página inicial de Login para Funcionários
const LOGIN_URL = "login.html";
const apiUrl = '/funcionarios';

// Objeto para o banco de dados de funcionários baseado em JSON
var db_funcionarios = {};

// Objeto para o funcionário corrente
var funcionarioCorrente = {};

// função para gerar códigos randômicos a serem utilizados como código de funcionário
// Fonte: https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Dados de funcionários para serem utilizados como carga inicial
const dadosIniciais = {
    funcionarios: [
        { "id": generateUUID(), "login": "admin", "senha": "123", "nome": "Administrador do Sistema", "email": "admin@abc.com"},
        { "id": generateUUID(), "login": "funcionario", "senha": "123", "nome": "Funcionário Comum", "email": "funcionario@abc.com"},
    ]
};

// Inicializa o funcionarioCorrente e banco de dados de funcionários da aplicação de Login
function initLoginApp() {
    // PARTE 1 - INICIALIZA FUNCIONARIOCORRENTE A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
    funcionarioCorrenteJSON = sessionStorage.getItem('funcionarioCorrente');
    if (funcionarioCorrenteJSON) {
        funcionarioCorrente = JSON.parse(funcionarioCorrenteJSON);
    }

    // PARTE 2 - INICIALIZA BANCO DE DADOS DE FUNCIONÁRIOS
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            db_funcionarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler funcionários via API JSONServer:', error);
            displayMessage("Erro ao ler funcionários");
        });
}

// Verifica se o login do funcionário está ok e, se positivo, direciona para a página inicial
function loginUser(login, senha) {
    // Verifica todos os itens do banco de dados de funcionários 
    // para localizar o funcionário informado no formulario de login
    for (var i = 0; i < db_funcionarios.length; i++) {
        var funcionario = db_funcionarios[i];

        // Se encontrou login, carrega funcionário corrente e salva no Session Storage
        if (login == funcionario.login && senha == funcionario.senha) {
            funcionarioCorrente.id = funcionario.id;
            funcionarioCorrente.login = funcionario.login;
            funcionarioCorrente.email = funcionario.email;
            funcionarioCorrente.nome = funcionario.nome;

            // Salva os dados do funcionário corrente no Session Storage, mas antes converte para string
            sessionStorage.setItem('funcionarioCorrente', JSON.stringify(funcionarioCorrente));

            // Retorna true para funcionário encontrado
            return true;
        }
    }

    // Se chegou até aqui é por que não encontrou o funcionário e retorna falso
    return false;
}

// Apaga os dados do funcionário corrente no sessionStorage
function logoutUser() {
    funcionarioCorrente = {};
    sessionStorage.setItem('funcionarioCorrente', JSON.stringify(funcionarioCorrente));
    window.location = LOGIN_URL;
}

function addUser(nome, login, senha, email) {
    // Cria um objeto de funcionario para o novo funcionario 
    let newId = generateUUID();
    let funcionario = { "id": newId, "login": login, "senha": senha, "nome": nome, "email": email };

    // Envia dados do novo funcionário para ser inserido no JSON Server
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionario),
    })
        .then(response => response.json())
        .then(data => {
            // Adiciona o novo funcionário na variável db_funcionarios em memória
            db_funcionarios.push(funcionario);
            displayMessage("Funcionário inserido com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir funcionário via API JSONServer:', error);
            displayMessage("Erro ao inserir funcionário");
        });
}

// Função para buscar e exibir os serviços
function fetchAndDisplayServices() {
    fetch('/servicos')
        .then(response => response.json())
        .then(services => {
            const servicesRow = document.getElementById('services-row');
            servicesRow.innerHTML = ''; // Limpa o conteúdo existente

            services.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'col-md-4 mb-4';
                serviceCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${service.titulo}</h5>
                            <p class="card-text">${service.descricao}</p>
                            <p class="card-text"><strong>Valor:</strong> R$ ${service.valor}</p>
                            <p class="card-text"><strong>Categoria:</strong> ${service.categoria}</p>
                            <p class="card-text"><strong>CEP:</strong> ${service.cep}</p>
                            <p class="card-text"><strong>Celular:</strong> ${service.celular}</p>
                            <button class="btn btn-success btn-aceitar" data-id="${service.id}">Aceitar</button>
                        </div>
                    </div>
                `;
                servicesRow.appendChild(serviceCard);
            });

            // Adiciona evento de clique aos botões "Aceitar"
            document.querySelectorAll('.btn-aceitar').forEach(button => {
                button.addEventListener('click', function() {
                    const serviceId = this.getAttribute('data-id');
                    acceptService(serviceId);
                });
            });
        })
        .catch(error => console.error('Erro ao buscar serviços:', error));
}

function acceptService(serviceId) {
    fetch(`/servicos/${serviceId}`)
        .then(response => response.json())
        .then(service => {
            // Adiciona o serviço aceito ao db.json/pedidos_aceitos
            fetch('/pedidos_aceitos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(service),
            })
            .then(() => {
                // Remove o serviço de db.json/servicos
                fetch(`/servicos/${serviceId}`, {
                    method: 'DELETE',
                })
                .then(() => {
                    // Atualiza a lista de serviços exibidos
                    fetchAndDisplayServices();
                })
                .catch(error => console.error('Erro ao remover serviço:', error));
            })
            .catch(error => console.error('Erro ao aceitar serviço:', error));
        })
        .catch(error => console.error('Erro ao buscar serviço:', error));
}

// Chama a função para buscar e exibir os serviços quando a página é carregada
window.addEventListener('load', fetchAndDisplayServices);

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp();
