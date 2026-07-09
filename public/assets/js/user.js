window.onload = function() {
    var xhttp = new XMLHttpRequest();
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');


    btnUsers.onclick = function() {
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                divUsers.innerHTML = `<i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Carregando...</span>`;
            }
            else if (this.readyState == 4 && this.status == 200) {
                let users = JSON.parse(this.response)

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
            }
            
        };

        xhttp.open('GET', 'ajax/user.php', true);
        xhttp.send();
    }
}