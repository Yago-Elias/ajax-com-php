window.onload = function() {
    var xhttp = new XMLHttpRequest();
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');


    btnUsers.onclick = function() {
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.response == 200) {
                console.log(this.response);
            }
        };

        xhttp.open('GET', 'ajax/user.php', true);
        xhttp.send();
    }
}