<? if (! PAGEDOT ) exit; ?>
<? $folders = explode('/',$_SERVER['REQUEST_URI']);
    $foldersa = array_pop($folders);
    $folder0 = implode('/', $folders); 
    $folder = explode('?', $folder0)[0]; 

    if ((isset($_SERVER['REQUEST_SCHEME']) AND $_SERVER['REQUEST_SCHEME'] === 'https') OR (isset($_SERVER['HTTPS']) AND $_SERVER['HTTPS'] === 'on')) { $protocol = 'https'; } else { $protocol = 'http'; }
  ?>
<? $PAGEDOTPATH = $protocol.'://'.$_SERVER['HTTP_HOST'].$folder; ?>
<!DOCTYPE html>
<html lang="en" id="PAGEDOT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAGEDOT</title>
  <link rel="stylesheet" href="<?= $pagedot_dir ?>/css/jquery.scrollbar.css">
  <link rel="stylesheet" href="<?= $pagedot_dir ?>/css/pagedot.css?<?=time()?>">
  <link rel="stylesheet" href="https://unpkg.com/@icon/themify-icons/themify-icons.css">
  <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

  <link href="<?= $pagedot_dir ?>/css/jqColor.css" media="all" rel="stylesheet" type="text/css" />
</head>
<body>


<div class="frameOverlay"></div>

  <input type="hidden" id="pagedot-setting-active-element-pdeid" value="">

    <div class="pagedot-container top">
      <div class="pagedot-row">

       <a class="pagedot-logo" href="https://pagedot.ru" target="_blank"><span style="color:#555">PAGEDOT</span> <span style="color:#ccc"><?= $version ?></span></a>

        <div class="pagedot-btns-min d-md-none d-block">
        <button type="button" class="pagedot-btn-min pagedot-control-btn-menuMobile" onclick="PagedotBtn(this, 'menuMobile')" title="Общие настройки"><i class="ti ti-menu"></i></button>
        </div>

        <div class="pagedot-btns-min d-none d-md-inline-flex">
          
          <a href="admin.php?p=<?php echo $_GET['p'] ?? 'index.html'; ?>&action=parse" class="pagedot-btn-min pagedot-control-btn-constructor" title="Копирование сайта по ссылке"><i class="ti ti-world"></i></a>

          <button type="button" class="pagedot-btn-min pagedot-control-btn-constructor d-none" onclick="PagedotBtn(this, 'constructor')" title="Шаблоны"><i class="ti ti-view-grid"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn-files" onclick="PagedotBtn(this, 'files')" title="Страницы сайта"><i class="ti ti-files"></i></button>
          <button type="button" class="pagedot-btn-min pagedot-control-btn-config" onclick="PagedotBtn(this, 'config')" title="Общие настройки"><i class="ti ti-settings"></i></button>
          <button type="button" class="pagedot-btn-min pagedot-control-btn-history d-none" onclick="PagedotBtn(this, 'history')" title="История"><i class="ti ti-loop"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-blockparse d-none" disabled="disabled" onclick="PagedotBtn(this, 'blockparse')" title="Разобрать блок"><i class="ti ti-wand"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn-controlclick" onclick="PagedotBtn(this, 'controlclick')" title="Отключить контроль элементами"><i class="ti ti-hand-open"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-eye" disabled="disabled" onclick="PagedotBtn(this, 'eye')" title="Временно спрятать блок"><i class="ti ti-eye"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-remove" disabled="disabled" onclick="PagedotBtn(this, 'remove')" title="Удалить элемент"><i class="ti ti-trash"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-duplicate" disabled="disabled" onclick="PagedotBtn(this, 'duplicate')" title="Дублировать элемент"><i class="ti ti-layers"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-up" disabled="disabled" onclick="PagedotBtn(this, 'up')" title="Переместить вверх по сетке"><i class="ti ti-angle-up"></i></button>
          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-down" disabled="disabled" onclick="PagedotBtn(this, 'down')" title="Переместить вниз по сетке"><i class="ti ti-angle-down"></i></button>
          
          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-style" disabled="disabled" onclick="PagedotBtn(this, 'style')" title="Стили элемента"><i class="ti ti-palette"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-image d-none" disabled="disabled" onclick="PagedotBtn(this, 'image')"><i class="ti ti-image"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-control-btn pagedot-control-btn-setting" disabled="disabled" onclick="PagedotBtn(this, 'setting')" title="Настройки элемента"><i class="ti ti-pencil"></i></button>

        </div>
        <div class="h-100" style="height: 100%;">
          <button class="pagedot-btn-size active" title="Десктоп" data-type="desktop" onclick="resizeFrame(this, 'desktop')"><i class="ti ti-desktop"></i></button>
          <button class="pagedot-btn-size" title="Планшет" data-type="tablet" onclick="resizeFrame(this, 'tablet')"><i class="ti ti-tablet"></i></button>
          <button class="pagedot-btn-size" title="Телефон" data-type="mobile" onclick="resizeFrame(this, 'mobile')"><i class="ti ti-mobile"></i></button>



        </div>
        <div><span class="pagedot-save-result"></span><button class="pagedot-editor-btn" data-page="<?=$page_name;?>" disabled="disabled">Сохранить</button>
        <a href="<?= $pagedot_dir ?>/logout.php" class="pagedot-btn-logout b-0" title="Выход тут"><i class="ti ti-power-off"></i></a>
        
        </div>

      </div>


      <div class="pagedot-control-panel-constructor">
      <div class="pagedot-control-constructor">



<div class="pagedot-control-constructor-item pagedot-rubric-components active" data-pderubric="1">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-cta-center"></i></div>
  <div>Блок</div>
  </div>
</div>
  
<div class="pagedot-control-constructor-item pagedot-rubric-components" data-pderubric="2">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-media-overlay"></i></div>
  <div>Форма</div><input type="hidden" name="pagedot-input-form-id" value="">
  </div>
</div>
  
<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-media-overlay-alt-2"></i></div>
  <div>Поля</div>
  </div>
</div>

<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-sidebar-none"></i></div>
  <div>Интервал</div>
  </div>
</div>

<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-cta-btn-right"></i></div>
    <div>Кнопка</div>
  </div>
</div>

<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-image"></i></div>
  <div>Изобр.</div>
  </div>
</div>

<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-accordion-merged"></i></div>
  <div>Аккорд.</div>
  </div>
</div>

<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-slider-alt"></i></div>
  <div>Слайдер</div>
  </div>
</div>

</div>


<div class="pagedot-control-constructor pagedot-control-components">

<?php $groupsTemplates = get_templates(); ?>
<?php $index = 0; ?>
<?php if(is_array($groupsTemplates) && isset($groupsTemplates['result']) && $groupsTemplates['result'] == 'ok' && isset($groupsTemplates['data']) && count($groupsTemplates['data']) > 0) { ?>
<?php foreach($groupsTemplates['data'] as $group_id => $groupTemplates) { ?>
  <div class="pagedot-control-component-items<?php echo ($index==0 ? ' active' : ''); ?>" data-pderubric="<?php echo $group_id; ?>">
    <div class="row">
      <?php if(count($groupTemplates) > 0) { ?>
      <?php foreach($groupTemplates as $template) { ?>
      <div class="col">
        <div class="pagedot-control-component-item pdedraggable">
          
          <img src="<?php echo $template['image_thumb']; ?>" alt="<?php echo $template['name']; ?>" title="<?php echo $template['name']; ?>">

        </div>
      </div>
      <?php } ?>
      <?php } ?>
    </div>
  </div>
<?php $index++; } ?>
<?php } ?>

</div>
</div>




    </div>

    <? if (Config('key') == '') { ?>
      <div class="pagedot-enter-key active" onclick="PagedotBtn(this, 'config')"><i class="ti ti-key"></i>&nbsp;&nbsp;Ввести ключ</div>
    <? } ?>

    <div class="pagedot-control-panel pagedot-control-panel-history">
      <div class="pagedot-control-panel-close" onclick="PagedotBtn(this, 'panel-close')"><i class="ti ti-close"></i> Закрыть</div>
      <div class="pagedot-control-panel-title">История</div>
        <div class="pagedot-control-history-wrapper">
         <div class="scrollbar-inner scrollbar-inner-history">
          <div class="pagedot-control-history-items">
          <script>
            setTimeout(function(){
              loadHistory('<?=$page_name;?>');
            }, 2000);
          </script>
         </div>
        </div>
      </div>
    </div>







<div class="pagedot-control-panel pagedot-control-panel-files">
      
      <div class="scrollbar-inner scrollbar-inner-style">
      <div>
      <div class="pagedot-control-panel-close" onclick="PagedotBtn(this, 'panel-close')"><i class="ti ti-close"></i> Закрыть</div>

  
<div class="tab-content" id="myTabContent2">

<div class="pagedot-control-files-items"></div>

</div>
</div>
</div>
</div>






    <div class="pagedot-control-panel pagedot-control-panel-setting">
      
      <div class="scrollbar-inner scrollbar-inner-style">
      <div>
      <div class="pagedot-control-panel-close" onclick="PagedotBtn(this, 'panel-close')"><i class="ti ti-close"></i> Закрыть</div>


<div class="pagedot-control-panel-items mb-3">
       <ul class="nav nav-tabs" id="myTabElementConfing" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="profile-tab" data-toggle="tab" href="#tab-settings" role="tab" aria-controls="profile" aria-selected="false">Основное</a>
      </li>
      <li class="nav-item pagedot-tab-form" role="presentation">
        <a class="nav-link" id="home-tab" data-toggle="tab" href="#tab-form" role="tab" aria-controls="home" aria-selected="true">Форма</a>
      </li>
    </ul>
</div>
  
    <div class="tab-content" id="myTabContent2">
      




<div class="tab-pane fade show active" id="tab-settings" role="tabpanel" aria-labelledby="tab-settings">

    <div class="pagedot-control-panel-items">
        <div class="pagedot-control-panel-title ml-0 mr-0 mb-0">Основные настройки</div>
      </div>
      <div class="pagedot-setting-panel pagedot-setting-panel-A pagedot-control-panel-protect">
      <div class="pagedot-control-panel-items">
        <div class="row pagedot-control-panel-item">
          <div class="col-12">
            <div class="pagedot-control-panel-label">Ссылка</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-A-value-href" class="form-control" value="" onblur="PagedotSettingChange(this, 'href')" onkeyup="PagedotSettingChange(this, 'href')">
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="pagedot-setting-panel pagedot-setting-panel-BUTTON pagedot-control-panel-protect">
      <div class="pagedot-control-panel-items">
        <div class="row pagedot-control-panel-item">
          <div class="col-6">
            <div class="pagedot-control-panel-label">Текст кнопки</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-BUTTON-value-button_text" class="form-control" value="" onblur="PagedotSettingChange(this, 'button_text')" onkeyup="PagedotSettingChange(this, 'button_text')">
            </div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Событие клика (onClick)</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-BUTTON-value-onclick" class="form-control" value="" onblur="PagedotSettingChange(this, 'onclick')" onkeyup="PagedotSettingChange(this, 'onclick')">
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="pagedot-setting-panel pagedot-setting-panel-INPUT pagedot-control-panel-protect">
      <div class="pagedot-control-panel-items">
        <div class="row pagedot-control-panel-item">
          <div class="col-6">
            <div class="pagedot-control-panel-label">Name (наименование поля. на англ.)</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-INPUT-value-name" class="form-control" value="" onblur="PagedotSettingChange(this, 'name')" onkeyup="PagedotSettingChange(this, 'name')">
            </div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Placeholder</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-INPUT-value-placeholder" class="form-control" value="" onblur="PagedotSettingChange(this, 'placeholder')" onkeyup="PagedotSettingChange(this, 'placeholder')">
            </div>
          </div>
        </div>
        <div class="row pagedot-control-panel-item">
          <div class="col-6">
            <div class="pagedot-control-panel-label">Значение по умолчанию</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-INPUT-value-value" class="form-control" value="" onblur="PagedotSettingChange(this, 'value')" onkeyup="PagedotSettingChange(this, 'value')">
            </div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Событие клика (onClick)</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-INPUT-value-onclick" class="form-control" value="" onblur="PagedotSettingChange(this, 'onclick')" onkeyup="PagedotSettingChange(this, 'onclick')">
            </div>
          </div>
        </div>
      </div>
      </div>


      <div class="pagedot-control-panel-items pagedot-control-panel-protect">
        <div class="row pagedot-control-panel-item">
          <div class="col-6 mt-2">
            <div class="pagedot-control-panel-label">ID</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-A-value-id" class="form-control" value="" onblur="PagedotSettingChange(this, 'id')" onkeyup="PagedotSettingChange(this, 'id')">
            </div>
          </div>
          <div class="col-6 mt-2">
            <div class="pagedot-control-panel-label">Класс</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-setting-A-value-class" class="form-control" value="" onblur="PagedotSettingChange(this, 'class')" onkeyup="PagedotSettingChange(this, 'class')">
            </div>
          </div>
          
        </div>
      </div>

      <div class="pagedot-control-panel-items">
        <div class="row pagedot-control-panel-item">
          <div class="col-12 mt-2">
            <div class="pagedot-control-panel-HTMLcode">
              <div class="pagedot-control-panel-label">HTML код (К сожалению, не с каждым кодом, это работает правильно. А так же допущенная ошибка в html, может привести к потери блока.)</div>
              <div class="pagedot-control-panel-input">
                <textarea type="text" id="pagedot-setting-A-value-code" class="form-control" rows="10" value=""></textarea>
                
                <div class="d-flex align-items-center justify-content-between">
                  <button class="pagedot-btn-default mt-2 mr-2" onclick="PagedotSettingChange(this, 'code')">Применить HTML код</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      </div>


      <div class="tab-pane fade" id="tab-form" role="tabpanel" aria-labelledby="tab-form">


      <div class="pagedot-control-form-ajax-content"></div>

      
</div>



      </div>
    </div>
    </div>
    </div>

    <div class="pagedot-control-menuMobile pagedot-control-panel-menuMobile">
      
      <div class="scrollbar-inner scrollbar-inner-menuMobile">
      <div>

      <div class="pagedot-control-panel-items d-flex flex-column">
          
          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn-config" onclick="PagedotBtn(this, 'config')" title="Настройки"><i class="ti ti-settings"></i></button>
          <button type="button" class="pagedot-btn-min pagedot-control-btn-history d-none" onclick="PagedotBtn(this, 'history')" title="История"><i class="ti ti-loop"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-remove" disabled="disabled" onclick="PagedotBtn(this, 'remove')" title="Удалить"><i class="ti ti-trash"></i></button>
          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-duplicate" disabled="disabled" onclick="PagedotBtn(this, 'duplicate')" title="Дублировать"><i class="ti ti-layers"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-up" disabled="disabled" onclick="PagedotBtn(this, 'up')" title="Поднять выше"><i class="ti ti-angle-up"></i></button>
          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-down" disabled="disabled" onclick="PagedotBtn(this, 'down')" title="Опустить ниже"><i class="ti ti-angle-down"></i></button>
          
          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-style d-none" disabled="disabled" onclick="PagedotBtn(this, 'style')" title="Стили"><i class="ti ti-palette"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-image d-none" disabled="disabled" onclick="PagedotBtn(this, 'image')"><i class="ti ti-image"></i></button>

          <button type="button" class="pagedot-btn-min pagedot-btn-min-mobile pagedot-control-btn pagedot-control-btn-setting" disabled="disabled" onclick="PagedotBtn(this, 'setting')" title="Управление элементом"><i class="ti ti-pencil"></i></button>

          <a href="<?= $pagedot_dir ?>/logout.php" class="pagedot-btn-min pagedot-btn-min-mobile" title="Выход тут"><i class="ti ti-power-off"></i></a>

      </div>

      </div>
      </div>
    </div>


    <div class="pagedot-control-panel pagedot-control-panel-config">
      
      <div class="scrollbar-inner scrollbar-inner-style">
      <div>
      <div class="pagedot-control-panel-close" onclick="PagedotBtn(this, 'panel-close')"><i class="ti ti-close"></i> Закрыть</div>

      <div class="pagedot-control-panel-items">


        <div class="row">
  <div class="col-12">


    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="profile-tab" data-toggle="tab" href="#form-t-system" role="tab" aria-controls="profile" aria-selected="true">Система</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="home-tab" data-toggle="tab" href="#form-t-meta" role="tab" aria-controls="home" aria-selected="false">Мета-теги</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="home-tab" data-toggle="tab" href="#form-t-scripts" role="tab" aria-controls="home" aria-selected="false">Скрипты</a>
      </li>
    </ul>

  
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade" id="form-t-scripts" role="tabpanel" aria-labelledby="form-t-scripts">
        <form action="">
          <div class="row pagedot-control-panel-item">
            <div class="col-12">
              <div class="pagedot-control-panel-title ml-0 mr-0">JS Скрипты</div>
                <small>Можете сюда вставить js скрипты аналитики. Вставляйте вместе с тегом <?=htmlspecialchars('<script></script>')?>. Код вставится сразу после тега <?=htmlspecialchars('<body>')?></small>
            </div>
            <div class="col-12">
              <div class="pagedot-control-panel-input">
                <textarea name="code-scripts" style="min-height:300px;" class="form-control" value="" onblur="PagedotCodeScriptsChange(this)"></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="tab-pane fade" id="form-t-meta" role="tabpanel" aria-labelledby="form-t-meta">

      <form action="">
        <div class="row pagedot-control-panel-item">
          <div class="col-12">
            <div class="pagedot-control-panel-title ml-0 mr-0">Основные мета-теги</div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">Title</div>
            <div class="pagedot-control-panel-input">
              <input type="text" name="meta-title" class="form-control" value="" onkeyup="PagedotMetaChange(this)" onblur="PagedotMetaChange(this)">
              <small>title</small>
            </div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">Description</div>
            <div class="pagedot-control-panel-input">
              <textarea name="meta-description" class="form-control" onkeyup="PagedotMetaChange(this)" onblur="PagedotMetaChange(this)"></textarea>
              <small>description</small>
            </div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">Keywords</div>
            <div class="pagedot-control-panel-input">
              <textarea name="meta-keywords" class="form-control" onkeyup="PagedotMetaChange(this)" onblur="PagedotMetaChange(this)"></textarea>
              <small>keywords</small>
            </div>
          </div>
        </div>

        <div class="row pagedot-control-panel-item">
          <div class="col-12">
            <div class="pagedot-control-panel-title ml-0 mr-0">Мета-теги для социальных сетей</div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">OG Title</div>
            <div class="pagedot-control-panel-input">
              <input type="text" name="meta-og-title" class="form-control" value="" onkeyup="PagedotMetaChange(this)" onblur="PagedotMetaChange(this)">
              <small>title</small>
            </div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">OG Description</div>
            <div class="pagedot-control-panel-input">
              <textarea name="meta-og-description" class="form-control" onkeyup="PagedotMetaChange(this)" onblur="PagedotMetaChange(this)"></textarea>
              <small>description</small>
            </div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">OG Image</div>

            <div class="pagedot-control-panel-input">
              <div class="pagedot-control-panel-img-ogImage"><img src="" alt="" class="pagedot-control-panel-ogImage w-100"></div>
              <input type="text" class="form-control d-none" id="pagedot-style-value-ogImage" name="meta-og-image" onkeyup="PagedotMetaChange(this)" onblur="PagedotMetaChange(this)">
              <button class="pagedot-control-panel-btn-upload pagedot-control-panel-btn-ogImage pagedot-mt-2">Загрузить изображение</button>
            </div>

          </div>
        </div>
      </form>


        </div>
      <div class="tab-pane fade show active" id="form-t-system" role="tabpanel" aria-labelledby="form-t-system">
        <form action="">
        <div class="row pagedot-control-panel-item">

          <div class="col-12">
            <div class="pagedot-control-panel-title ml-0 mr-0">Расширенный функционал</div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">Укажите КЛЮЧ</div>
            <div class="pagedot-control-panel-input">
              <input type="text" name="key" class="form-control" value="<?=Config('key');?>">
              <small>Ключ нужен для полного доступа ко всем функциям PageDot. Ключ можно получить <a href="https://pagedot.ru/cabinet" target="_blank">в личном кабинете</a></small>
            </div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-title ml-0 mr-0">Данные для входа</div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Логин</div>
            <div class="pagedot-control-panel-input">
              <input type="text" name="login" class="form-control" value="<?=Config('login');?>">
            </div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Пароль</div>
            <div class="pagedot-control-panel-input">
              <input type="text" name="password" class="form-control" value="<?=Config('password');?>">
            </div>
          </div>
          <div class="col-12 mt-4">
            <button type="button" class="btn btn-primary w-100" onclick="saveConfig(this)">Сохранить настройки</button>
            <div class="ajax-result"></div>
          </div>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>


        
      </div>




      </div>
      </div>
    </div>

    <div class="pagedot-control-panel pagedot-control-panel-style">
      
      <div class="scrollbar-inner scrollbar-inner-style">
      <div>
      <div class="pagedot-control-panel-close" onclick="PagedotBtn(this, 'panel-close')"><i class="ti ti-close"></i> Закрыть</div>

      <div class="pagedot-control-panel-type pagedot-control-panel-typeSize">
      <div class="pagedot-control-panel-title">Размер</div>
      <div class="pagedot-control-panel-items">

        <div class="row pagedot-control-panel-item">
          <div class="col-6">
            <div class="pagedot-control-panel-label">Ширина</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-style-value-width" class="form-control" value="" onblur="PagedotStyleChange(this, 'width')" onkeyup="PagedotStyleChange(this, 'width');" autocomplete="off">
            </div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Высота</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-style-value-height" class="form-control" value="" onblur="PagedotStyleChange(this, 'height')" onkeyup="PagedotStyleChange(this, 'height')">
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="pagedot-control-panel-type pagedot-control-panel-typeText">
      <div class="pagedot-control-panel-title">Текст</div>
      <div class="pagedot-control-panel-items">

        <div class="row pagedot-control-panel-item">
          <div class="col-6">
            <div class="pagedot-control-panel-label">Цвет текста</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-style-value-color" class="form-control color" value="" onblur="PagedotStyleChange(this, 'color')" onkeyup="PagedotStyleChange(this, 'color')" autocomplete="off">
            </div>
          </div>
          <div class="col-6">
            <div class="pagedot-control-panel-label">Размер шрифта</div>
            <div class="pagedot-control-panel-input">
              <input type="text" id="pagedot-style-value-fontSize" class="form-control" value="" onblur="PagedotStyleChange(this, 'fontSize')" onkeyup="PagedotStyleChange(this, 'fontSize')">
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="pagedot-control-panel-type pagedot-control-panel-typeBlock">
      <div class="pagedot-control-panel-title">Блок</div>
      <div class="pagedot-control-panel-items">

        <div class="row pagedot-control-panel-item">
          <div class="col-6">
            <div class="pagedot-control-panel-label">Цвет фона</div>
            <div class="pagedot-control-panel-input">
              <input type="text" class="form-control color" value="" id="pagedot-style-value-backgroundColor" onblur="PagedotStyleChange(this, 'backgroundColor')" onkeyup="PagedotStyleChange(this, 'backgroundColor')">
            </div>
          </div>
          <div class="col-6"></div>
          <div class="col-12 pt-3">
            <div class="pagedot-control-panel-label">Внешние отступы</div>
            <div class="pagedot-control-panel-input pagedot-control-panel-group pagedot-control-panel-margins">
              
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-up"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-marginTop" onblur="PagedotStyleChange(this, 'marginTop')" onkeyup="PagedotStyleChange(this, 'marginTop')">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-right"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-marginRight" onblur="PagedotStyleChange(this, 'marginRight')" onkeyup="PagedotStyleChange(this, 'marginRight')">
               <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-down"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-marginBottom" onblur="PagedotStyleChange(this, 'marginBottom')" onkeyup="PagedotStyleChange(this, 'marginBottom')">
               <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-left"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-marginLeft" onblur="PagedotStyleChange(this, 'marginLeft')" onkeyup="PagedotStyleChange(this, 'marginLeft')">
              </div>

            </div>
          </div>

          <div class="col-12">
            <div class="pagedot-control-panel-label">Внутренние отступы</div>
            <div class="pagedot-control-panel-input pagedot-control-panel-group pagedot-control-panel-margins">
              
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-up"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-paddingTop" onblur="PagedotStyleChange(this, 'paddingTop')" onkeyup="PagedotStyleChange(this, 'paddingTop')">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-right"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-paddingRight" onblur="PagedotStyleChange(this, 'paddingRight')" onkeyup="PagedotStyleChange(this, 'paddingRight')">
               <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-down"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-paddingBottom" onblur="PagedotStyleChange(this, 'paddingBottom')" onkeyup="PagedotStyleChange(this, 'paddingBottom')">
               <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-left"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-paddingLeft" onblur="PagedotStyleChange(this, 'paddingLeft')" onkeyup="PagedotStyleChange(this, 'paddingLeft')">
              </div>

            </div>
          </div>
          <div class="col-12">
            <div class="pagedot-control-panel-label">Закругление углов</div>
            <div class="pagedot-control-panel-input pagedot-control-panel-group pagedot-control-panel-margins">
              
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-top-left"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-borderTopLeftRadius" onblur="PagedotStyleChange(this, 'borderTopLeftRadius')" onkeyup="PagedotStyleChange(this, 'borderTopLeftRadius')">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-top-right"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-borderTopRightRadius" onblur="PagedotStyleChange(this, 'borderTopRightRadius')" onkeyup="PagedotStyleChange(this, 'borderTopRightRadius')">
               <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-top-left transform-v"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-borderBottomLeftRadius" onblur="PagedotStyleChange(this, 'borderBottomLeftRadius')" onkeyup="PagedotStyleChange(this, 'borderBottomLeftRadius')">
               <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon3"><i class="ti ti-arrow-top-right transform-v"></i></span>
                </div>
                <input type="text" class="form-control" id="pagedot-style-value-borderBottomRightRadius" onblur="PagedotStyleChange(this, 'borderBottomRightRadius')" onkeyup="PagedotStyleChange(this, 'borderBottomRightRadius')">
              </div>

            </div>
          </div>
        </div>
        <div class="pagedot-row pagedot-control-panel-item">
          <div class="pagedot-col-12">
            <div class="pagedot-control-panel-label d-flex align-items-center justify-content-between">Фоновое изображение <i class="ti ti-close" onclick="PagedotStyleBgImageClear(this);" title="Удалить фон"></i></div>
            <div class="pagedot-control-panel-input">
              <div class="pagedot-control-panel-img pagedot-control-panel-img-btn">
                  <img src="" alt="" class="pagedot-control-panel-backgroundImage w-100 d-none">
              </div>
              <input type="hidden" class="form-control" id="pagedot-style-value-backgroundImage" onblur="PagedotStyleChange(this, 'backgroundImage')" onkeyup="PagedotStyleChange(this, 'backgroundImage')">
              <button class="pagedot-control-panel-btn pagedot-mt-2 d-none">Загрузить изображение</button>
            </div>
          </div>
        </div>

      </div>
      </div>
      </div>
      </div>
    </div>

  <iframe src="admin.php?page=<?=$page_name?>&preload=true" id="PAGEDOT-CONTAINER" width="100%" frameborder="0" style="height: calc(100%)!important; width: 100% border: 0; margin-top: 0;">УПС... Ваш браузер не поддерживает плавающие фреймы!</iframe>

  <form action="" id="PAGEDOTFORM">
  <input type="hidden" name="page" value="<?=$page_name;?>">
  <textarea name="html" id="PAGEDOTCONTAINERTEMPLATE" style="display:none;width:100%" rows="40"><? echo my_file_get_contents($PAGEDOTPATH.'/admin.php?page='.$page_name); ?></textarea>

  </form>

  <div class="modal fade js--modal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="dot-loading">Загрузка...</div>
      </div>
    </div>
  </div>

  <div class="modal fade js--modal-upgrade" tabindex="-1" role="dialog" data-keyboard="false" data-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content dot-upgrade">
        <div class="dot-upgrade-num text-center"><span>0</span>%</div>
        <div class="dot-upgrade-text text-center">Пожалуйста подождите! Идет загрузка обновлений... И уже совсем скоро Вы получите свеженькое обновление системы PageDot ;)</div>

        <div class="dot-upgrade-message text-center d-none">
          <button type="button" class="btn btn-primary" onclick="window.location.reload();">Я понял</button>
        </div>
      </div>
    </div>
  </div>


<div class="pagedot-control-meta-images">
  <div class="pagedot-control-meta-image pagedot-control-meta-image-img">
    <div class="pagedot-control-meta-image-label"><i class="ti ti-pencil"></i> Картинка</div>
    <img src="/images/capabilities/3.png" alt="">
  </div>
  <div class="pagedot-control-meta-image pagedot-control-meta-image-bg">
    <div class="pagedot-control-meta-image-label"><i class="ti ti-pencil"></i> Фон</div>
    <img src="/images/capabilities/3.png" alt="">
  </div>
</div>

<div class="pagedot-blockparse">
  <div class="pagedot-blockparse-bg"></div>
  <div class="pagedot-blockparse-body">
    <div class="pagedot-blockparse-close"></div>
    <div class="pagedot-blockparse-items"></div>
  </div>
</div>


  <script src="<?= $pagedot_dir ?>/js/jquery-1.5.min.js"></script>
  <script>
    if(!navigator.onLine) {
      window.stop();
      document.execCommand("Stop", false);
        $('body').html('<div style="color: #555;display:flex;align-items:center;justify-content:center;height:100vh;font-size:30px;">Требуется подключение к интернету!');

    }
  </script>


<link rel="stylesheet" href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css">

  

  <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
  <script>
  $( function() {
 


function capaCargando(div, img, color){
                                if(div.length > 0){
                                    //div.find('.capaCargando').remove();
                                    //aLaConsola(div.find('.capaCargando').length);
                                    if(img == undefined){
                                        img = 'img/uispoty/loadBusqueda.gif';
                                    }

                                    if(color == undefined){
                                        color = '#666';
                                    }

                                    var w = div.width(),
                                    h = div.height(),
                                    html = "<div class='capaCargando'>"+
                                    "<div class='bgCapaCargando' style='background-color:"+color+"'></div>"+
                                    "<div class='iconoCapaCargando' style='background-image:url("+img+")'></div>"+
                                    "</div>";
                                    div.prepend(html);
                                    var capa = div.find(".capaCargando");
                                    capa.find(".bgCapaCargando, .iconoCapaCargando").width(w).height(h);
                                }
                           }

setTimeout(function() {

var $iframe = document.getElementsByTagName("iframe")[0].contentWindow;
var PageDot = $("#PAGEDOT-CONTAINER").contents();
$(".pdedraggable").draggable({
    connectToSortable: $(".frameOverlay").sortable({
      items: "> div",
      revert: true,
    iframeFix: true,
    }),
    helper: "clone",
    start: function() {
      $('.pagedot-control-constructor').fadeOut('fast');
      $('.pagedot-control-components').removeClass('active')
      $('.frameOverlay').fadeIn('fast');
      PageDot.find('.pdehelper').remove()
    },
    drag: function(e) {
      
      PageDot.find('.pdehelper').remove()
    var iFrameElement = $iframe.document.elementFromPoint(e.pageX, e.pageY);
    iFrameElement.click()

    PageDot.find('.pagedot-element-active').after('<div class="pdehelper" style="height:50px;width: 100%;background-color:#fff;border: 2px dashed #ccc;"></div>')

    if (pdeid > 0) {
      
    }
    //console.log(iFrameElement)
    //console.log($(iFrameElement).attr('data-pdeid'))

    
    },
    stop: function() {

        //var iframe = $(this).find("iframe");

        setTimeout(function(){
          $('.pagedot-control-constructor').fadeIn('fast');
        }, 1500)

        var html_code = '<div style="height:50px;background-color:#555;border: 2px dashed red;text-align:center;color: #fff;">Новый Блок</div>';

        PageDot.find('.pagedot-element-active').after(html_code)

        pdeid = PageDot.find('.pagedot-element-active').attr('data-pdeid')

        PageDot.find('.pdehelper').remove()

        $('.frameOverlay').fadeOut('fast');
        $('.pdehelper').remove();
        loadFunctions();
        var PDETEMPLATE = PageDotTemplateOpen();
        $(PDETEMPLATE).find('[data-pdeid="'+pdeid+'"]').after(html_code);
        PageDotTemplateClose(PDETEMPLATE);

    },
    iframeFix: true,
    helper: function(event) {
      return '<div class="pdehelper" style="height:50px;width: 300px;background-color:#fff;border: 2px dashed #ccc;text-align:center;">Блок</div>';
    },
    revert: "invalid"
  });
  $iframe.disableSelection();


}, 500)




  } );
  </script>

  
  <!-- JavaScript Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js" integrity="sha384-+YQ4JLhjyBLPDQt//I+STsc9iw4uQqACwlvpslubQzn4u2UU2UFM80nGisd026JF" crossorigin="anonymous"></script>


  <script src="//cdn.jsdelivr.net/npm/sweetalert2@10"></script>
  <script src="<?= $pagedot_dir ?>/js/jquery.scrollbar.js"></script>



<script type="text/javascript" src="<?= $pagedot_dir ?>/js/colors.js"></script>
<script type="text/javascript" src="<?= $pagedot_dir ?>/js/colorPicker.data.js"></script>
<script type="text/javascript" src="<?= $pagedot_dir ?>/js/colorPicker.js"></script>
<script type="text/javascript" src="<?= $pagedot_dir ?>/js/jsColor.js"></script>

<script>
  var pagedot_api_url = '<?=Config('api_url');?>';
  var pagedot_dir = '<?=Config('dir');?>';

</script>

<script src="<?= $pagedot_dir ?>/js/pagedot.js?<?=time()?>"></script>



<script>

  PageDotGetUpgrade();
  setTimeout(function(){
    PageDotStartUpgrade();
  },2000);

</script>

</body>
</html>