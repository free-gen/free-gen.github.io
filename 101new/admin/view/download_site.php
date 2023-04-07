<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Копирование сайтов</title>

  <link rel="stylesheet" href="https://unpkg.com/@icon/themify-icons/themify-icons.css">
  <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

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
      <div class="col-md-6 mt-2">
        
        <div class="notFound">
          <div class="mb-4"><h1>Копирование сайтов</h1></div>
          <div>Вы должны понимать, что копируете не полностью сайт, а только страницу. Вы не можете скачать например, интернет-магазин или блог. А вот отдельную страницу или лендинг, без проблем.
                
                <br><br>

                После скачивания страницы, в админке PageDot, Вы сможете настроить формы без знаний программирования. При копировании сайта, существующие файлы будут перезаписаны.

                <br><br>
                <div class="alert alert-primary">Всю ответственность за копирование любого сайта, Вы берёте на себя! Не забывайте про авторские права.<br><br>Копирование возможно только тех сайтов, которые технически не заблокировали эту возможность!</div>
          </div>
            <br>
          
        </div>


        
      </div>
    </div>
  </div>


      <div class="parseResultWrap">

        <form class="downloadWebsiteForm" action="" method="post">
            <input type="hidden" name="route" value="site-parse">
            <input type="hidden" name="url_active" value="<?php echo $_GET['p'] ?? 'index.html'; ?>">
          <div class="notFoundBlock text-left">
            <div class="mb-5"><h2>Скачаем сайт?</h2></div>
            <div>
              <label class="mb-3">Введите адрес сайта или страницы</label>
              <input type="text" class="form-control" name="url" placeholder="https://site.ru" required="required" />
            </div>
            <div class="mt-3 text-left">
              <button type="submit" class="btn btn-primary btn-lg downloadWebsiteBtn">Скачать страницу сайта</button>
            </div>
            <div class="mt-3">
              
              


            </div>
          </div>
        </form>

        <div class="parseResult" id="parseResult"></div>
      </div>

  <script src="<?= $pagedot_dir ?>/js/jquery-1.5.min.js"></script>
  <script>
    $('.downloadWebsiteForm').on('submit', function (e) {
      let processDown = microtime(true);
      let processDownLast = 0;
      e.preventDefault();
      const form = $(this).serialize();
      const url = $('[name="url"]').val();
      let btn = $(this).find('button')
      btn.attr('disabled', 'disabled').text('Подождите...')
      $('.parseResult').html('')
      $('.parseResult').append('<div><span style="font-weight:bold;color:red;">Соединяюсь...</span></div>');

      $('.downloadWebsiteForm').hide()

      setTimeout(function() {

        // отправляем форму
        $.ajax({
          type: 'POST',
          url: "<?= $pagedot_dir ?>/app/Route.php",
          data: form,
          success: function(result) {
            var data = JSON.parse(result);
            if (data.result == 'ok') {

              $('.parseResult').append('<div><span style="font-weight:bold;color:red;">Подождите, качаю страницу...</span></div>');

              data.images.forEach(function(path) {

                processDown = microtime(true);
                $.ajax({
                  type: 'POST',
                  url: "<?= $pagedot_dir ?>/app/Route.php",
                  data: {
                    route: 'site-parse-image',
                    url: url,
                    path: path
                  },
                  success: function(result) {
                    processDown = microtime(true);
                    $('.parseResult').append('<div>'+result+'</div>');
                    scrollTopScroll();
                    return false;
                  }

                });

              })

              data.tilda.forEach(function(path) {

                processDown = microtime(true);
                $.ajax({
                  type: 'POST',
                  url: "<?= $pagedot_dir ?>/app/Route.php",
                  data: {
                    route: 'site-parse-tilda',
                    url: url,
                    path: path
                  },
                  success: function(result) {
                    processDown = microtime(true);
                    $('.parseResult').append('<div>'+result+'</div>');
                    scrollTopScroll();
                    return false;
                  }

                });

              })

              data.styles.forEach(function(path) {
                processDown = microtime(true);
                $.ajax({
                  type: 'POST',
                  url: "<?= $pagedot_dir ?>/app/Route.php",
                  data: {
                    route: 'site-parse-css',
                    url: url,
                    path: path
                  },
                  success: function(json) {
                    var data = JSON.parse(json);
                    $('.parseResult').append('<div>'+data.result+'</div>');

                    if (data.imagesAndFonts) {
                      data.imagesAndFonts.forEach(function(path) {
                        processDown = microtime(true);
                        $.ajax({
                          type: 'POST',
                          url: "<?= $pagedot_dir ?>/app/Route.php",
                          data: {
                            route: 'site-parse-image-font',
                            url: url,
                            path: path
                          },
                          success: function(result) {
                            processDown = microtime(true);
                            $('.parseResult').append('<div>'+result+'</div>');
                            scrollTopScroll();
                            return false;
                          }

                        });
                        
                      })

                    }

                    return false;

                  }

                });

              })

              data.scripts.forEach(function(path) {

                processDown = microtime(true);
                $.ajax({
                  type: 'POST',
                  url: "<?= $pagedot_dir ?>/app/Route.php",
                  data: {
                    route: 'site-parse-js',
                    url: url,
                    path: path
                  },
                  success: function(json) {
                    var data = JSON.parse(json);
                    processDown = microtime(true);
                    $('.parseResult').append('<div>'+data.result+'</div>');

                    return false;

                  }

                });

              })
            } else {

              $('.parseResult').hide();
              $('.downloadWebsiteForm').fadeIn().html('<div class="notFoundBlock text-left"><div class="mb-5"><h2>'+data.message+'</h2></div></div>')

            }

            return false;
          }

        });

      }, 1000)

      $('.parseResultWrap').removeClass('col-md-12').addClass('col-md-6')

      let timerId2 = setInterval(() => {
        if (processDown === processDownLast) {
          clearInterval(timerId2);
          $('.parseResult').append('<div><span style="font-weight:bold;color:red;">Осталось еще не много...</span></div>');
        }
      }, 6000);
      let timerId3 = setInterval(() => {
        if (processDown === processDownLast) {
          clearInterval(timerId3);
          $('.parseResult').append('<div><span style="font-weight:bold;color:red;">Собираю все файлы...</span></div>');
        }
      }, 13000);

      let timerId = setInterval(() => {
        if (processDown === processDownLast) {
          clearInterval(timerId);
          $('.parseResult').append('<div><br><b>Скачивание страницы завершено!</b><Br><br><a href="'+window.location.href.replace('&action=parse', '')+'" class="btn btn-primary">Редактировать скаченную страницу</a></div>');
        }
        processDownLast = processDown;
      }, 15000);

    });


function scrollTopScroll() { 
  var objDiv = document.getElementById("parseResult");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function microtime(get_as_float) { 
    var now = new Date().getTime() / 1000;
    var s = parseInt(now);
  
    return (get_as_float) ? now : Math.ceil(Math.round((now - s) * 1000) / 1000) + '' + s;
}
  </script>

</body>
</html>