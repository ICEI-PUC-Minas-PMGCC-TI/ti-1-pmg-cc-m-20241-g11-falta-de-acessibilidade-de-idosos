function fetchAndDisplayAcceptedOrders() {
    fetch('/pedidos_aceitos')
        .then(response => response.json())
        .then(acceptedOrders => {
            const acceptedOrdersRow = document.getElementById('accepted-orders-row');
            acceptedOrdersRow.innerHTML = ''; // Limpa o conteúdo existente

            acceptedOrders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'col-md-4 mb-4';
                orderCard.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${order.titulo}</h5>
                            <p class="card-text">${order.descricao}</p>
                            <p class="card-text"><strong>Valor:</strong> R$ ${order.valor}</p>
                            <p class="card-text"><strong>Categoria:</strong> ${order.categoria}</p>
                            <p class="card-text"><strong>CEP:</strong> ${order.cep}</p>
                            <p class="card-text"><strong>Celular:</strong> ${order.celular}</p>
                            <button class="btn btn-danger btn-rejeitar" data-id="${order.id}">Rejeitar</button>
                        </div>
                    </div>
                `;
                acceptedOrdersRow.appendChild(orderCard);
            });

            // Adiciona evento de clique aos botões "Rejeitar"
            document.querySelectorAll('.btn-rejeitar').forEach(button => {
                button.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-id');
                    rejectOrder(orderId);
                });
            });
        })
        .catch(error => console.error('Erro ao buscar pedidos aceitos:', error));
}

function rejectOrder(orderId) {
    fetch(`/pedidos_aceitos/${orderId}`)
        .then(response => response.json())
        .then(order => {
            // Adiciona o pedido rejeitado ao db.json/servicos
            fetch('/servicos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            })
            .then(() => {
                // Remove o pedido de db.json/pedidos_aceitos
                fetch(`/pedidos_aceitos/${orderId}`, {
                    method: 'DELETE',
                })
                .then(() => {
                    // Atualiza a lista de pedidos aceitos exibidos
                    fetchAndDisplayAcceptedOrders();
                })
                .catch(error => console.error('Erro ao remover pedido aceito:', error));
            })
            .catch(error => console.error('Erro ao rejeitar pedido:', error));
        })
        .catch(error => console.error('Erro ao buscar pedido aceito:', error));
}

// Chama a função para buscar e exibir os pedidos aceitos quando a página é carregada
window.addEventListener('load', fetchAndDisplayAcceptedOrders);