<div class="pagedot-control-constructor">

<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-cta-center"></i></div>
  <div>Блок</div>
  </div>
</div>
  
<div class="pagedot-control-constructor-item">
  <div>
    <div class="pagedot-control-constructor-item-i"><i class="ti ti-layout-media-overlay"></i></div>
  <div>Форма</div>
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






  <link rel="stylesheet" href="//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css">

  

  <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
  <script src="https://code.jquery.com/ui/1.13.1/jquery-ui.js"></script>
  <script>
  $( function() {
 




setTimeout(function() {

var $iframe = $("#PAGEDOT-CONTAINER");

$("#draggable").draggable({
    connectToSortable: $iframe.contents().find("#sortable333").sortable({
      items: "> div",
      revert: true,
    iframeFix: true,
    }),
    helper: "clone",
    
    iframeFix: true,
    helper: function(event) {
      return "<div class='custom-helper'>I move this</div>";
    },
    revert: "invalid"
  });
  $iframe.contents().find("#sortable333").disableSelection();


}, 1000)




  } );
  </script>



<div id="draggable" class="ui-state-highlight">Drag Me</div>

  <div>текст</div>
</div>




    </div>