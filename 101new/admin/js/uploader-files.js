function loadMore(e,t,o){var r=$(e),t=r.attr("data-offset"),o=r.attr("data-take"),e=$("form#pagedot-upload-image");$.ajax({type:"GET",url:"/admin/fileload/"+t+"/"+o,data:e.serialize(),success:function(e){var a=JSON.parse(e);"ok"==a.result&&($(".pagedot-file-items").append(a.message),e=parseFloat(t)+parseFloat(o),""!=a.message?r.attr("data-offset",e):r.html("Больше файлов нет..."))},error:function(e){console.log(e)}})}function PageDotFileRemove(a,e){res=confirm("Удалить?"),res&&$.ajax({type:"POST",url:pagedot_dir+"/app/Route.php",data:{route:"delete-file",id:a,path:e},success:function(e){"ok"==JSON.parse(e).result&&$("#pagedot-file-item-"+a).remove()},error:function(e){console.log(e)}})}function PageDotFileChoose(e,a,t=!1){if(t=t||$(".PageDotFileType").val(),$(".js--modal").modal("hide"),"backgroundImage"==t){var o=global_pagedot_element,r=$(o)[0].tagName;return $(o).css("backgroundImage","url("+a+")"),$("#pagedot-style-value-backgroundImage").val(a),$(".pagedot-control-meta-image-bg img").attr("src",a),$(".pagedot-control-panel-img").html('<img src="'+a+'" alt="" class="pagedot-control-panel-backgroundImage w-100">'),$("#pagedot-style-value-backgroundImage").trigger("blur"),!1}if("ogImage"==t)return $("#pagedot-style-value-ogImage").val(a),$(".pagedot-control-panel-img-ogImage").html('<img src="'+a+'" alt="" class="pagedot-control-panel-ogImage w-100">'),$("#pagedot-style-value-ogImage").trigger("blur"),!1;"image"==t&&(o=global_pagedot_element,"IMG"!=(r=$(o)[0].tagName)&&(o=o.find("img"),r=$(o)[0].tagName),"IMG"==r&&($(o).attr("src",a),$(".pagedot-control-meta-image-img img").attr("src",a),PagedotInit($(o),"src",a)))}$(document).ready(function(){var r=$("#pagedot-dropZone");void 0===window.FileReader&&(r.text("Не поддерживается браузером!"),r.addClass("error")),r[0].ondragover=function(){return r.addClass("hover"),!1},r[0].ondragleave=function(){return r.removeClass("hover"),!1},r[0].ondrop=function(e){e.preventDefault(),r.removeClass("hover"),r.addClass("drop"),document.getElementById("pagedot-image").files=e.dataTransfer.files;for(var a=0;a<1;a++){var t=e.dataTransfer.files.item(a),o=new FileReader;o.readAsDataURL(t),o.onload=function(e){$("#pagedot-upload-image").trigger("submit")}}},$("#pagedot-upload-image").unbind("submit"),$(".btn-dot-files-upload").unbind("click"),$("#pagedot-image").unbind("change"),$(".btn-dot-files-upload").click(function(){$("#pagedot-image").trigger("click")}),$("#pagedot-image").change(function(){$("#pagedot-upload-image").trigger("submit")}),$("#pagedot-upload-image").on("submit",function(e){e.preventDefault();e=new FormData(this);$.ajax({type:"POST",url:pagedot_dir+"/app/Route.php",data:e,cache:!1,contentType:!1,processData:!1,success:function(e){$(".pagedot-images-error").remove(),$(".pagedot-file-items").prepend(e)},error:function(e){console.log(e)}})})});