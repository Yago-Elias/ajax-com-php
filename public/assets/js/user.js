const api = axios.create({
    baseURL: 'ajax/users'
});

const ROUTE_CREATE = 'create.php';
const ROUTE_READ   = 'user.php';
const ROUTE_UPDATE = 'update.php';
const ROUTE_DELETE = 'delete.php';
const ROUTE_SEARCH = 'search.php';

function escapeHtml(text) {
    if (text == null) return '';

    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.onload = function() {
    axios.interceptors.response.use(
        function(response) {
            // qualquer resposta 2xx, apenas retorna
            return response;
        },
        function(error) {
            // erro de rede, timeout, outras respostas (status 404, 500, ...)
            if (error.response) {
                // resposta do servidor, mas com status de erro
                showMessage('danger', 'Erro no servidor: ' + error.response.status);
            } else if (error.request) {
                // requisição feita mas sem resposta
                showMessage('danger', 'Não foi possível conectar ao servidor.');
            } else {
                // erro ao montar a requisição
                showMessage('danger', 'Erro inesperado: ' + error.message);
            }

            // repassa o erro para o catch local
            return Promise.reject(error);
        }
    );

    var editingUserId = null;
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');
    var formSignup = document.querySelector('#form-signup');
    var divCreate = document.querySelector('#div-create');
    var formSearch = document.querySelector('#form-buscar');
    var divBuscar = document.querySelector('#div-buscar');
    var titleMenu = document.getElementById('title-menu-signup');
    var btnUpdate = null;
    var inputName = document.getElementById('input-name');
    var inputEmail = document.getElementById('input-email');

    function userTable(users) {
        var table = `<table class="table table-striped">`;
        table += `<thead><tr><td>ID</td><td>Nome</td><td>Email</td><td>Ações</td></tr></thead>`;
        table += `<tbody>`;
        users.forEach(function(user) {
            table += `<tr>`;
            table += `<td>${user.id}</td>`;
            table += `<td>${escapeHtml(user.name)}</td>`;
            table += `<td>${escapeHtml(user.email)}</td>`;
            table += `<td>`;
            table += `<button type="button" class="btn btn-edit-user" data-id="${user.id}"><i class="fa fa-pencil fa-fw"></i></button>`;
            table += `<button type="button" class="btn btn-delete-user" data-id="${user.id}"><i class="fa fa-trash fa-fw"></i></button>`;
            table += `</td>`;
            table += `</tr>`;
        });
        table += `</tbody></table>`;

        return table;
    }

    async function loadUsers() {
        showLoading(divUsers);

        try {
            const response = await api.get(ROUTE_READ, null);
            divUsers.innerHTML = userTable(response.data.data);
        } catch (error) {
            divUsers.innerHTML = '';
        }
    }

    // valida as informações do formulário de cadastro
    function validateForm(name, email) {
        var errors = {};

        if (!name.trim()) {
            errors.name = 'O nome é obrigatório.';
        }

        if (!email.trim()) {
            errors.email = 'O email é obrigatório.';
        } else {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = 'Informe um email válido.';
            }
        }

        return errors;
    }

    // mostra uma mensagem de erro de acordo com cada campo
    function showFieldError(groupId, errorId, message) {
        var group = document.getElementById(groupId);
        var errorEl = document.getElementById(errorId);

        if (message) {
            group.classList.add('has-error');
            errorEl.textContent = message;
        } else {
            group.classList.remove('has-error');
            errorEl.textContent = '';
        }
    }

    // limpa as mensagens de erro
    function clearFormError() {
        showFieldError('group-name', 'error-name', '');
        showFieldError('group-email', 'error-email', '');
    }

    // mostra o spinner de carregamnto
    function showLoading(el) {
        el.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Aguarde...</span>`;
    }

    var divMessage = document.getElementById('div-message');

    // mostra mensagems em qualquer página
    function showMessage(type, text, timeout) {
        timeout = timeout || 4000;

        var alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        var alertId = 'alert-' + Date.now();

        var html = `<div id="${alertId}" class="alert ${alertClass} alert-dismissible" role="alert">`;
        html += `<button type="button" class="close" data-dismiss="alert" aria-label="Fechar"><span aria-hidden="true">&times;</span></button>`;
        html += text;
        html += `</div>`;

        divMessage.insertAdjacentHTML('beforeend', html);

        setTimeout(function() {
            var el = document.getElementById(alertId);
            if (el) el.remove();
        }, timeout);
    }

    // mostra mensagens em uma página específica (inline)
    function showMessageInline(type, text, timeout) {
        timeout = timeout || 4000;

        var alertClass = type ==='success' ? 'alert-success' : 'alert-danger';
        var alertId = 'alert-' + Date.now();

        var html = `<div id="${alertId}" class="alert ${alertClass}" role="alert">`;
        html += text;
        html += `</div>`;

        setTimeout(function() {
            var el = document.getElementById(alertId);
            if (el) el.remove();
        }, timeout);

        return html;
    }

    // Buscar todos os usuários
    btnUsers.onclick = loadUsers;

    // Cadastrar/atualizar usuário
    formSignup.onsubmit = async function(event) {
        event.preventDefault();

        var btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        clearFormError();

        var error = validateForm(inputName.value, inputEmail.value);

        // se houver algum erro, mostra o erro e não envia para o backend
        if (Object.keys(error).length > 0) {
            if (error.name) showFieldError('group-name', 'error-name', error.name);
            if (error.email) showFieldError('group-email', 'error-email', error.email);
            btnSubmit.disabled = false;

            return;
        }

        var payload = new URLSearchParams;
        payload.append('name', inputName.value);
        payload.append('email', inputEmail.value);
        
        showLoading(divCreate);
        try {
            if (editingUserId) {
                payload.append('id', editingUserId);
                const response = await api.post(ROUTE_UPDATE, payload);
                let status = response.data.success ? 'success' : 'danger';
                divCreate.innerHTML = showMessageInline(status, response.data.message, 6000);
                editingUserId = null;
                titleMenu.innerHTML = 'Cadastrar';
                btnUpdate.innerHTML = 'Cadastrar';
            } else {
                const response = await api.post(ROUTE_CREATE, payload);
                let status = response.data.success ? 'success' : 'danger';
                divCreate.innerHTML = showMessageInline(status, response.data.message, 6000);
            }

            formSignup.reset();
            loadUsers();
        } catch (error) {
            divCreate.innerHTML = '';
        } finally {
            btnSubmit.disabled = false;
        }
    };

    // limpa as mensgagens de erro ao digitar
    inputName.addEventListener('input', function() {
        showFieldError('group-name', 'error-name', '');
    });
    inputEmail.addEventListener('input', function() {
        showFieldError('group-email', 'error-email', '');
    });

    formSearch.addEventListener('submit', async function(event) {
        event.preventDefault();

        var form = new FormData(formSearch);
        showLoading(divBuscar);

        try {
            const response = await api.post(ROUTE_SEARCH, form);

            if (!response.data.success) {
                divBuscar.innerHTML = response.data.message;
            } else {
                divBuscar.innerHTML = userTable(response.data.data);
            }
        } catch (error) {
            divBuscar.innerHTML = '';
        }
    });

    divUsers.addEventListener('click', async function(event) {
        var editBtn = event.target.closest('.btn-edit-user');
        var deleteBtn = event.target.closest('.btn-delete-user');
        btnUpdate = document.getElementById('btn-signup');

        var signupMenu = document.getElementById('signup-menu');
        var menu1 = document.getElementById('menu1');
        var home = document.getElementById('home');
        var homeMenu = document.getElementById('home-menu');
        
        if (editBtn) {
            var idUser = editBtn.dataset.id;
            inputName = document.getElementById('input-name');
            inputEmail = document.getElementById('input-email');
            
            try {
                const response = await api.get(ROUTE_READ, {params: {id: idUser}});
                var user = response.data.data;
                editingUserId = user.id;
                inputName.value = user.name;
                inputEmail.value = user.email;

                titleMenu.innerHTML = 'Atualizar';
                btnUpdate.innerHTML = 'Atualizar';
                home.classList.remove('in', 'active');
                homeMenu.classList.remove('active');
                menu1.classList.add('active', 'in');
                signupMenu.classList.add('active');
                inputName.focus();
                
            } catch (error) {
                console.log('Ocorreu um erro: ' + error);
            }
        }

        if (deleteBtn) {
            var idUser = deleteBtn.dataset.id;

            var confirmed = confirm('Deseja realmente excluir o usuário?');
            if (!confirmed) return;

            var payload = new URLSearchParams();
            payload.append('id', idUser);
            try {
                const response = await api.post(ROUTE_DELETE, payload);
                if (response.data.success) {
                    showMessage('success', response.data.message);
                    loadUsers();
                } else {
                    showMessage('danger', response.data.message);
                }
            } catch (error) {
                console.log('Erro ao excluir: ' + error);
            }
        }
    });
}