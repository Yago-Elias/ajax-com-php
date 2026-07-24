const apiUser = axios.create({
    baseURL: 'ajax/users'
});

const apiTask = axios.create({
    baseURL: 'ajax/tasks'
});

const ROUTE_CREATE = 'create.php';
const ROUTE_INDEX  = 'index.php';
const ROUTE_UPDATE = 'update.php';
const ROUTE_DELETE = 'delete.php';

const ROUTE_SEARCH = 'search.php';
const ROUTE_STATUS = 'status.php';

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
    var inputPassword = document.getElementById('input-password');

    var currentTaskUserId = null;
    var modalTasks = document.getElementById('modal-tasks');
    var divTasksList = document.getElementById('div-tasks-list');
    var formTaskCreate = document.getElementById('form-task-create');

    function taskTable(tasks) {
        if (!tasks.length) {
            return '<p class="text-muted">Nenhuma tarefa cadastrada.</p>';
        }

        var html = '<ul class="list-group">';
        tasks.forEach(function(task) {
            var done = task.status === 'done';
            html += `<li class="list-group-item" data-id="${task.id}">`;
            html += `<label style="cursor:pointer; ${done ? 'text-decoration: line-through; color: #999;' : ''}">`;
            html += `<input type="checkbox" class="chk-task-status" data-id="${task.id}" ${done ? 'checked' : ''}> `;
            html += `${escapeHtml(task.title)}`;
            html += `</label>`;
            if (task.description) {
                html += `<p class="text-muted" style="margin: 4px 0 0 22px; font-size: 0.9em;">${escapeHtml(task.description)}</p>`;
            }
            html += `<button type="button" class="btn btn-xs btn-delete-task pull-right" data-id="${task.id}"><i class="fa fa-trash"></i></button>`;
            html += `</li>`;
        });
        html += '</ul>';

        return html;
    }

    async function loadTasks() {
        showLoading(divTasksList);
        try {
            const response = await apiTask.get(ROUTE_INDEX, { params: { user_id: currentTaskUserId } });
            divTasksList.innerHTML = taskTable(response.data.data);
        } catch (error) {
            divTasksList.innerHTML = '';
        }
    }

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
            table += `<button type="button" class="btn btn-tasks-user" data-id="${user.id}" data-name="${escapeHtml(user.name)}"><i class="fa fa-tasks fa-fw"></i></button> `;
            table += `<button type="button" class="btn btn-edit-user" data-id="${user.id}"><i class="fa fa-pencil fa-fw"></i></button> `;
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
            const response = await apiUser.get(ROUTE_INDEX, null);
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
        payload.append('password', inputPassword.value);
        
        showLoading(divCreate);
        try {
            if (editingUserId) {
                payload.append('id', editingUserId);
                const response = await apiUser.post(ROUTE_UPDATE, payload);
                var status = response.data.success ? 'success' : 'danger';
                divCreate.innerHTML = showMessageInline(status, response.data.message, 6000);
                
                if (status === 'danger') {
                    inputPassword.value = '';
                } else {
                    editingUserId = null;
                    titleMenu.innerHTML = 'Cadastrar';
                    btnUpdate.innerHTML = 'Cadastrar';
                }
            } else {
                const response = await apiUser.post(ROUTE_CREATE, payload);
                let status = response.data.success ? 'success' : 'danger';
                divCreate.innerHTML = showMessageInline(status, response.data.message, 6000);
            }

            if (status === 'success') {
                formSignup.reset();
                loadUsers();
            }
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
            const response = await apiUser.post(ROUTE_SEARCH, form);

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
        var tasksBtn = event.target.closest('.btn-tasks-user');
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
                const response = await apiUser.get(ROUTE_INDEX, {params: {id: idUser}});
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
        } else if (deleteBtn) {
            var idUser = deleteBtn.dataset.id;

            var confirmed = confirm('Deseja realmente excluir o usuário?');
            if (!confirmed) return;

            var payload = new URLSearchParams();
            payload.append('id', idUser);
            try {
                const response = await apiUser.post(ROUTE_DELETE, payload);
                if (response.data.success) {
                    showMessage('success', response.data.message);
                    loadUsers();
                } else {
                    showMessage('danger', response.data.message);
                }
            } catch (error) {
                console.log('Erro ao excluir: ' + error);
            }
        } else if (tasksBtn) {
            currentTaskUserId = tasksBtn.dataset.id;
            document.getElementById('modal-tasks-username').textContent = tasksBtn.dataset.name;
            formTaskCreate.reset();
            $('#modal-tasks').modal('show');
            loadTasks();
        }
    });

    formTaskCreate.onsubmit = async function(event) {
        event.preventDefault();

        var title = document.getElementById('task-title').value;
        var description = document.getElementById('task-description').value;

        if (!title.trim()) {
            showMessage('danger', 'O título da tarefa é obrigatório.');
            return;
        }

        var payload = new URLSearchParams();
        payload.append('user_id', currentTaskUserId);
        payload.append('title', title);
        payload.append('description', description);

        try {
            const response = await apiTask.post(ROUTE_CREATE, payload);
            if (response.data.success) {
                formTaskCreate.reset();
                loadTasks();
            } else {
                showMessage('danger', response.data.message);
            }
        } catch (error) {
            console.log('Erro ao criar tarefa: ' + error);
        }
    };

    divTasksList.addEventListener('click', async function (event) {
        var checkbox = event.target.closest('.chk-task-status');
        if (checkbox) {
            var id = checkbox.dataset.id;
            var newStatus = checkbox.checked ? 'done' : 'pending';

            var payload = new URLSearchParams();
            payload.append('id', id);
            payload.append('status', newStatus);

            try {
                await apiTask.post(ROUTE_STATUS, payload);
                loadTasks();
            } catch (error) {
                console.log('Erro ao atualizar status: ' + error);
            }
        }
        
        var deleteTaskBtn = event.target.closest('.btn-delete-task');
        if (deleteTaskBtn) {
            console.log('deletar tarefa');
            var idTask = deleteTaskBtn.dataset.id;
            var confirmed = confirm('Excluir esta tarefa?');
            if (!confirmed) return;

            var payload = new URLSearchParams();
            payload.append('id', idTask);

            try {
                await apiTask.post(ROUTE_DELETE, payload);
                loadTasks();
            } catch (error) {
                console.log('Erro ao excluir tarefa: ' + error);
            }
        }
    });
}