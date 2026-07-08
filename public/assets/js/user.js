window.onload = function() {
    var xhttp = new XMLHttpRequest();
    var btnUsers = document.querySelector('#btn-users');
    var divUsers = document.querySelector('#div-users');


    btnUsers.onclick = function() {
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log(xhttp.response);
            }
        };

        xhttp.open('GET', 'ajax/user.php', true);
        xhttp.send();
    }
}