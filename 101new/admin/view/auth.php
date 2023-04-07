<? if (! PAGEDOT ) exit; ?>
<!DOCTYPE html>
<html lang="en" id="PAGEDOT">
<head>
  
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGEDOT <?= $version ?></title>
  <link rel="stylesheet" href="<?= $pagedot_dir ?>/css/pagedot.css">
  <link rel="stylesheet" href="https://unpkg.com/@icon/themify-icons/themify-icons.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
  <style>
    body {
      background-color: #0C0008!important;
    }
    .login-form {
      background-color: rgba(255 255 255 / 2%);
      padding: 80px 100px;
      border-radius: 0 0 20px 20px;
    }
    input.form-control {
      height: 55px!important;
      border: 0!important;
      line-height: 1;
      font-size: 15px!important;
      color: #fff!important;
      background-color: rgba(255 255 255 / 5%)!important;
    }
    button.btn {
      width: 100%;
      margin-top: 20px;
      height: 60px;
      background-color: #A1CD45;
      color: #000;
      border: 0;
      font-weight: 600;
    }
    .form-group {
      margin-bottom: 10px;
    }
    .pagedot-logo {
      font-size: 40px;
      line-height: 1;
      margin-top: 20px;
    }
    label {
      color: #fff;
      font-size: 15px;
      margin-bottom: 5px;
      font-weight: 100;
    }
    .pagedot-logo-title {
      font-size: 15px;
      color: #fff;
      font-weight: 100;
    }
  </style>
</head>
<body>





<div class="container">
<div class="row">
<div class="col-md-6 offset-md-3">
  <div class="login-form">
    <form id="ajax-login-form">
      <div class="form-group">
        <label for="exampleInputEmail1">Логин</label>
        <input type="text" name="login" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Логин" autofocus required>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Пароль</label>
        <input type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Пароль" required>
      </div>
      <button type="submit" class="btn ajax-login-submit">Войти</button>
    </form>
  </div>
  <div class="text-center">
    <a class="pagedot-logo" href="https://pagedot.ru" target="_blank"><span>PAGEDOT</span> <?= $version ?></a></div>
  <div class="text-center pagedot-logo-title">Простое управление лэндингом</div>
</div>
</div>
</div>

  <script src="<?= $pagedot_dir ?>/js/jquery-1.5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>

  <script>
	var pagedot_api_url = '<?=Config('api_url');?>';
	var pagedot_dir = '<?=Config('dir');?>';
  </script>

  <script src="<?= $pagedot_dir ?>/js/pagedot.js"></script>

</body>
</html>