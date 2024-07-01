document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contact-modal');
    const btn = document.querySelector('.add-contact-btn');
    const span = document.getElementsByClassName('close-btn')[0];
    const contactForm = document.getElementById('contact-form');

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const isEditing = contactForm.getAttribute('data-editing-index');
        if (isEditing !== null) {
            updateContact(isEditing);
        } else {
            addNewContact();
        }
    });

    function displayContacts() {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        let contactsList = document.querySelector('.contact-list');
        contactsList.innerHTML = '';
        contacts.forEach((contact, index) => {
            contactsList.innerHTML += `
                <div class="contact">
                    <div class="contact-info">
                        <img src="${contact.avatarUrl || 'assets/images/icon.png'}" alt="Avatar" class="avatar" id="avatar-${index}">
                        <span class="contact-name">${contact.name}</span>
                    </div>
                    <div class="contact-bar">
                        <input type="text" class="message-input" placeholder="Digite sua mensagem aqui..." id="message-${index}">
                        <button class="send-message-btn" onclick="sendMessage(${index})">
                            <img src="assets/images/send-icon.png" alt="Enviar">
                        </button>
                    </div>
                    <div class="contact-actions">
                        <img src="assets/images/chat-icon.png" alt="Chat" class="icon" onclick="redirectToWhatsApp(${index})">
                        <img src="assets/images/call-icon.png" alt="Call" class="icon call-icon" onclick="callContact(${index})">
                        <button class="edit-btn" data-contact-id="${index}">Editar</button>
                        <button onclick="deleteContact(${index})" class="delete-btn">Excluir</button>
                    </div>
                </div>`;
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-contact-id');
                editContact(index);
            });
        });
    }

    window.redirectToWhatsApp = function(index) {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        let phone = contacts[index].phone.replace(/\D/g, '');
        let brazilPhone = `+55${phone}`;
        let whatsappUrl = `https://wa.me/${brazilPhone}?app_absent=1`;
        window.open(whatsappUrl, '_blank');
    }

    window.sendMessage = function(index) {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        let message = document.getElementById(`message-${index}`).value;
        let phone = contacts[index].phone.replace(/\D/g, '');
        let brazilPhone = `+55${phone}`;
        console.log("Sending message to:", brazilPhone, "Message:", message);

        if (message.trim() === '') {
            alert('Por favor, digite uma mensagem.');
            return;
        }

        let whatsappUrl = `https://wa.me/${brazilPhone}?text=${encodeURIComponent(message)}&app_absent=1`;
        window.open(whatsappUrl, '_blank');
    }

    window.deleteContact = function(index) {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.splice(index, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContacts();
    }

    window.callContact = function(index) {
        console.log("Chamando a função callContact com índice:", index);

        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        console.log("Contatos carregados:", contacts);

        if (index >= 0 && index < contacts.length) {
            let phone = contacts[index].phone.replace(/\D/g, '');
            let brazilPhone = `+55${phone}`;
            console.log("Número de telefone processado:", brazilPhone);

            if (brazilPhone) {
                console.log("Redirecionando para:", `tel:${brazilPhone}`);
                window.location.href = `tel:${brazilPhone}`;
            } else {
                console.error('Número de telefone não disponível.');
                alert('Número de telefone não disponível.');
            }
        } else {
            alert('Índice de contato inválido.');
        }
    };

    displayContacts();

    function editContact(index) {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        const contact = contacts[index];
        if (contact) {
            document.getElementById('name').value = contact.name;
            let formattedPhone = formatBrazilianPhone(contact.phone);
            document.getElementById('phone').value = formattedPhone;
            document.getElementById('contact-modal').style.display = 'block';
            document.getElementById('contact-form').setAttribute('data-editing-index', index);
        } else {
            alert('Contato não encontrado!');
        }
    }

    function formatBrazilianPhone(phone) {
        phone = phone.replace(/\D/g, '');
        if (phone.length === 11) {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (phone.length === 10) {
            return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            return phone;
        }
    }

    function updateContact(index) {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        let contact = contacts[index];
        contact.name = document.getElementById('name').value;
        contact.phone = document.getElementById('phone').value;
        let avatarInput = document.getElementById('avatar');
        let avatar = avatarInput.files[0];
        if (avatar) {
            let reader = new FileReader();
            reader.onload = function(e) {
                contact.avatarUrl = e.target.result;
                localStorage.setItem('contacts', JSON.stringify(contacts));
                displayContacts();
                closeModal();
            };
            reader.readAsDataURL(avatar);
        } else {
            localStorage.setItem('contacts', JSON.stringify(contacts));
            displayContacts();
            closeModal();
        }
    }

    function addNewContact() {
        let name = document.getElementById('name').value;
        let phone = document.getElementById('phone').value;
        let avatarInput = document.getElementById('avatar');
        let avatar = avatarInput.files[0];
        let avatarUrl = '';

        phone = phone.replace(/\D/g, '');
        if (phone.length == 10) {
            phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (phone.length == 11) {
            phone = phone.replace(/(\d{1})(\d{2})(\d{4})(\d{4})/, '($1$2) $3-$4');
        }
        if (avatar) {
            let reader = new FileReader();
            reader.onload = function(e) {
                avatarUrl = e.target.result;
                saveContact(name, phone, avatarUrl);
            };
            reader.readAsDataURL(avatar);
        } else {
            saveContact(name, phone, avatarUrl);
        }
    }

    function saveContact(name, phone, avatarUrl) {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.push({ name, phone, avatarUrl });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContacts();
        closeModal();
    }

    function closeModal() {
        document.getElementById('contact-modal').style.display = 'none';
        document.getElementById('contact-form').reset();
        document.getElementById('contact-form').removeAttribute('data-editing-index');
    }
});