<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajax</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
    <div class="container">
        <div class="row">
            <ul class="nav nav-tabs">
                <li class="active"><a href="#home" data-toggle="tab">Usuários</a></li>
                <li><a href="#menu1" data-toggle="tab">Cadastrar</a></li>
                <li><a href="#menu2" data-toggle="tab">Buscar</a></li>
            </ul>

            <div class="tab-content">
                <div id="home" class="tab-pane fade in active">
                    <br>
                    <button id="btn-users" class="btn btn-default">Listar usuários</button>
                    <hr>
                    <div id="div-users"></div>
                </div>

                <div id="menu1" class="tab-pane fade">
                    <br>
                    <div id="create"></div>
                    <form action="" method="POST" role="form" id="form-cadastrar" enctype="multipart/formdata">
                        <div class="form-group">
                            <label for="">Nome</label>
                            <input type="text" class="form-control" name="name" placehoder="Nome">
                        </div>

                        <div class="form-group">
                            <label for="">Email</label>
                            <input type="text" class="form-control" name="email" placeholder="Email">
                        </div>

                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                    </form>
                </div>
                
                <div id="menu2" class="tab-pane fade">
                    <br>
                    <form action="" id="form-buscar">
                        <input type="text" name="user">
                        <button type="submit" id="btn-buscar">Buscar</button>
                        <hr>
                        <div id="div-busca"></div>
                    </form>
                </div>
            </div>
            <hr>
        </div>
    </div>

    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="assets/js/xhttp_request.js"></script>
    <script src="assets/js/user.js"></script>
</body>
</html>