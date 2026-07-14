<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajax</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/app.css">
</head>
<body>
    <div id="div-message" class="notification-container"></div>
    
    <div class="container">
        <div class="row">
            <ul class="nav nav-tabs">
                <li class="active" id="home-menu"><a href="#home" data-toggle="tab">Usuários</a></li>
                <li id="signup-menu"><a href="#menu1" id="title-menu-signup" data-toggle="tab">Cadastrar</a></li>
                <li><a href="#menu2" data-toggle="tab">Buscar</a></li>
            </ul>

            <div class="tab-content">
                <div id="home" class="tab-pane fade in active">
                    <br>
                    <button id="btn-users" class="btn btn-default">Listar usuários</button>
                    <hr>
                    <div id="div-message"></div>
                    <hr>
                    <div id="div-users"></div>
                </div>

                <div id="menu1" class="tab-pane fade">
                    <br>
                    <div id="div-create"></div>
                    <form action="" method="POST" role="form" id="form-cadastrar" enctype="multipart/formdata">
                        <div class="form-group">
                            <label for="">Nome</label>
                            <input type="text" id="input-name" class="form-control" name="name" placeholder="Nome">
                        </div>

                        <div class="form-group">
                            <label for="">Email</label>
                            <input type="text" id="input-email" class="form-control" name="email" placeholder="Email">
                        </div>

                        <button type="submit" id="btn-signup" class="btn btn-primary">Cadastrar</button>
                    </form>
                </div>
                
                <div id="menu2" class="tab-pane fade">
                    <br>
                    <form action="" id="form-buscar">
                        <input type="text" name="name">
                        <button type="submit">Buscar</button>
                        <hr>
                        <div id="div-buscar"></div>
                    </form>
                </div>
            </div>
            <hr>
        </div>
    </div>

    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/axios.min.js"></script>
    <script src="assets/js/user.js"></script>
</body>
</html>