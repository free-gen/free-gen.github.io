<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404</title>

  <link rel="stylesheet" href="https://unpkg.com/@icon/themify-icons/themify-icons.css">
  <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

  <link rel="stylesheet" href="<?= $pagedot_dir ?>/css/pagedot.css?<?=time()?>">

  <style>
    .notFoundBlock {
      padding: 30px 40px;
    }
    .form-control {
      font-size: 20px;
      height: 60px;
    }
    .notFound {
      padding: 50px 0;
    }
    label {
      font-weight: bold;
    }
    .parseResult {
      padding: 30px 40px;
      margin-top: 0px;
      margin-left: 0px;
      padding-bottom: 300px;
      height: 100%;
      overflow-y: scroll;
    }
    .parseResultWrap {
      position: fixed;
      background-color: #fff;
      top: 0;
      right: 0;
      bottom: 0;
      width: 40%;
      box-shadow: 0 0 20px rgba(0 0 0 / 20%);
    }
    body, html {
      min-height: 100%;
    }
    .image404 {
      width: 60%;
      max-width: 900px;
      position: fixed;
      left: 0;
      bottom: -50px;
      opacity: .4;
    }
    @media(max-width: 800px) {
      .parseResultWrap {
        position: relative;
        width: 100%;
      }
    }
  </style>
</head>
<body>

<?
$config = include('pagedot-config.php');
$pagedot_dir = $config['dir'];
?>

  <div class="container h-100">
    <div class="row align-items-center justify-content-start">
      <div class="col-md-6 mt-5">
        
        <div class="notFound">
          <div><h1>Упс!</h1></div>
          <div class="mb-5"><h4>Страница <?=$page_name?> не найдена</h4></div>
          <div>
            <p>Вы зашли на несуществующую страницу, <br>чтобы воспользоваться админкой, залейте html шаблон на сайт или перейдите на существующую страницу</p>

            <p>А так же Вы можете <a href="admin.php?p=<?php echo $_GET['p'] ?? 'index.html'; ?>&action=parse">скачать какой-нибудь сайт</a> и управлять им как шаблоном</p>
          </div>
            <br>
          
        </div>

        <img class="image404" src="<?=$pagedot_dir?>/img/404.png" alt="">
        
      </div>
    </div>
  </div>


      <div class="parseResultWrap">

        <div class="notFoundBlock text-left">
          <div class="mb-5"><h4>Файлы шаблона</h4></div>
          <div class="pagedot-control-files-items"></div>
        </div>

      </div>

  <script>
    var pagedot_api_url = '';
    var pagedot_dir = '<?= $pagedot_dir ?>';
  </script>
  <script src="<?= $pagedot_dir ?>/js/jquery-1.5.min.js"></script>
  <script src="<?= $pagedot_dir ?>/js/pagedot.js?<?=time()?>"></script>

  <script>
    $(function(){
      loadFiles();
    })
  </script>

</body>
</html>