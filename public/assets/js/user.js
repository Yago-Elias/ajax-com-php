window.onload = function() {
    var editingUserId = null;
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');
    var formCadastrar = document.querySelector('#form-cadastrar');
    var divCreate = document.querySelector('#div-create');
    var formBuscar = document.querySelector('#form-buscar');
    var divBuscar = document.querySelector('#div-buscar');
    var titleMenu = document.getElementById('title-menu-signup');
    var inputName = null;
    var inputEmail = null;

    function userTable(users) {
        var table = `<table class="table table-striped">`;
        table += `<thead><tr><td>ID</td><td>Nome</td><td>Email</td><td>Ações</td></tr></thead>`;
        table += `<tbody>`;
        users.forEach(function(user) {
            table += `<tr>`;
            table += `<td>${user.id}</td>`;
            table += `<td>${user.name}</td>`;
            table += `<td>${user.email}</td>`;
            table += `<td>`;
            table += `<button type="button" class="btn btn-edit-user" data-id="${user.id}"><i class="fa fa-pencil fa-fw"></i></button>`;
            table += `<button type="button" class="btn btn-delete-user" data-id="${user.id}"><i class="fa fa-trash fa-fw"></i></button>`;
            table += `</td>`;
            table += `</tr>`;
        });
        table += `</tbody></table>`;

        return table;
    }

    // Buscar todos os usuários
    btnUsers.onclick = async function() {
        // Mostra o spinner de carregamento
        divUsers.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Agurde...</span>`;

        try {
            const response = await axios.get('ajax/user.php', null);

            divUsers.innerHTML = userTable(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            divUsers.innerHTML = 'Ocorreu um erro.';
        }
    };

    // Cadastrar/atualizar usuário
    formCadastrar.onsubmit = async function(event) {
        event.preventDefault();

        var payload = new URLSearchParams;
        payload.append('name', inputName.value);
        payload.append('email', inputEmail.value);
        
        divCreate.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Aguarde...</span>`;
        try {
            if (editingUserId) {
                payload.append('id', editingUserId);
                await axios.post('ajax/update.php', payload);
                divCreate.innerHTML = 'Usuário atualizado com sucesso!';
                editingUserId = null;
                titleMenu.innerHTML = 'Cadastrar';
            } else {
                await axios.post('ajax/create.php', payload);
                divCreate.innerHTML = 'Cadastro realizado com sucesso!';
            }

            formCadastrar.reset();
        } catch (error) {
            console.log('Erro: '+error);
            divCreate.innerHTML = 'Ocorreu um erro, tente novamente!';
        }
    };

    formBuscar.addEventListener('submit', async function(event) {
        event.preventDefault();

        var form = new FormData(formBuscar);
        divBuscar.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Aguarde...</span>`;

        try {
            const response = await axios.post('ajax/search.php', form);

            if (response.data == 'nouser') {
                divBuscar.innerHTML = 'Nenhum usuário encontrado';
            } else {
                divBuscar.innerHTML = userTable(response.data);
            }
        } catch (error) {
            console.log('Erro ao buscar: ', error);
            divBuscar.innerHTML = 'Ocorreu um erro ao buscar';
        }
    });

    divUsers.addEventListener('click', async function(event) {
        var editBtn = event.target.closest('.btn-edit-user');
        var deleteBtn = event.target.closest('.btn-delete-user');
        var btnUpdate = document.getElementById('btn-signup');

        var signupMenu = document.getElementById('signup-menu');
        var menu1 = document.getElementById('menu1');
        var home = document.getElementById('home');
        var homeMenu = document.getElementById('home-menu');
        
        if (editBtn) {
            var idUser = editBtn.dataset.id;
            inputName = document.querySelector('#input-name');
            inputEmail = document.querySelector('#input-email');
            
            try {
                const response = await axios.get('ajax/user.php', {params: {id: idUser}});
                var user = response.data;
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

            try {
                const response = await axios.delete('ajax/delete.php', {
                    params: {id: idUser}
                });
                console.log(response.data);
                if (response.data)
                    console.log('usuário deletado');
            } catch (error) {
                console.log('Ocorreu um erro: ' + error);
            }
        }
    });
}