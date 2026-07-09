window.onload = function() {
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');
    var formCadastrar = document.querySelector('#form-cadastrar');
    var divCreate = document.querySelector('#div-create');
    var formBuscar = document.querySelector('#form-buscar');
    var divBuscar = document.querySelector('#div-buscar');

    formBuscar.addEventListener('submit', function(event) {
        event.preventDefault();
        
        var form = new FormData(formBuscar);
        xmlHttpPost('ajax/buscar', function() {
            beforeSend(function() {
                divBuscar.innerHTML = `<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i> <span>Buscando resultados...</span>`;
            });

            success(function() {
                if (xhttp.responseText == 'nouser') {
                    divBuscar.innerHTML = 'Nenhum usuário encontrado';
                } else {
                    var users = JSON.parse(xhttp.responseText);
                    var table = `<table class="table table-striped">`;
                    table += `<thead><tr><td>ID</td><td>Nome</td><td>Email</td></tr></thead>`;
                    table += `<tbody>`
                    users.forEach(function(user) {
                        table += `<tr>`;
                        table += `<td>${user.id}</td>`;
                        table += `<td>${user.name}</td>`;
                        table += `<td>${user.email}</td>`;
                        table += `</tr>`;
                    });
                    table += `</tbody></table>`;
                    divBuscar.innerHTML = table;
                }
            });
        }, form);
    });

    formCadastrar.onsubmit = function(event) {
        event.preventDefault();

        var form = new FormData(formCadastrar);
        
        xmlHttpPost('ajax/create', function() {
            beforeSend(function() {
                divCreate.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Agurde...</span>`;
            });

            success(function() {
                var response = xhttp.responseText;

                if (response == 'cadastrado') {
                    divCreate.innerHTML = 'Cadastro realizado com sucesso!';
                }
                if (response == 'erro') {
                    divCreate.innerHTML = 'Ocorreu um erro, tente novamente!';
                }
            });
        }, form);
    };

    btnUsers.onclick = function() {
        xmlHttpGet('ajax/user', function() {
            beforeSend(function() {
                divUsers.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Carregando...</span>`;
            });

            success(function() {
                console.log(JSON.parse(xhttp.responseText));
                
                var users = JSON.parse(xhttp.response)
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
                table += `</tbody>`;
                table += `</table>`;
                
                divUsers.innerHTML = table;
            });

            error(function() {
                divUsers.innerHTML = 'Ocorreu um erro';
            });
        }, '?id=1');
    }
}