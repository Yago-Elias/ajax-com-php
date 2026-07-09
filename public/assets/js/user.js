window.onload = function() {
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');


    btnUsers.onclick = function() {
        xmlHttpGet('ajax/user', function() {
            beforeSend(function() {
                divUsers.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Carregando...</span>`;
            });

            success(function() {
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
        });
    }
}