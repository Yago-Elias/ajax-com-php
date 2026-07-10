window.onload = function() {
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');
    var formCadastrar = document.querySelector('#form-cadastrar');
    var divCreate = document.querySelector('#div-create');
    var formBuscar = document.querySelector('#form-buscar');
    var divBuscar = document.querySelector('#div-buscar');

    function userTable(users) {
        var table = `<table class="table table-striped">`;
        table += `<thead><tr><td>ID</td><td>Nome</td><td>Email</td></tr></thead>`;
        table += `<tbody>`;
        users.forEach(function(user) {
            table += `<tr>`;
            table += `<td>${user.id}</td>`;
            table += `<td>${user.name}</td>`;
            table += `<td>${user.email}</td>`;
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
            const response = await axios.get('ajax/user.php', {
                params: {id: 1}
            });

            divUsers.innerHTML = userTable(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            divUsers.innerHTML = 'Ocorreu um erro.';
        }
    };

    // Cadastrar usuário
    formCadastrar.onsubmit = async function(event) {
        event.preventDefault();

        var form = new FormData(formCadastrar);
        divCreate.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Aguarde...</span>`;

        try {
            const response = await axios.post('ajax/create.php', form);
            if (response.data == 'cadastrado') {
                divCreate.innerHTML = 'Cadastro realizado com sucesso!';
                formCadastrar.reset();
            } else {
                divCreate.innerHTML = 'Ocorreu um erro, tente novamente';
            }
        } catch (error) {
            console.log('Erro ao cadastrar: ', error);
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
}