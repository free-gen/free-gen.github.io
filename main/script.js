document.addEventListener('DOMContentLoaded',function(event){
  window.onload = function() {
  var dataText = [ 
		"Современные методы верстки ", 
		"Стильные визуальные решения ", 
		"Индивидуальный подход ", 
		"Решения на любой вкус и кошелек ", 
		"Стараюсь не оставлять вас равнодушным "
	];
  var caret = "|";
  function type(text, i, fnCallback) {
    if (i < (text.length)) {
      document.querySelector("#text").textContent = text.substring(0, i+1) + caret;
      setTimeout(function() {
        type(text, i + 1, fnCallback)
      }, 40);
    }
    else if (typeof fnCallback == 'function') {
      setTimeout(fnCallback, 1500);
    }
  }
   function StartAnimation(i) {
     if (typeof dataText[i] == 'undefined'){
        setTimeout(function() {
          StartAnimation(0);
        }, 32000);
     }
    if (i < dataText[i].length) {
      type(dataText[i], 0, function(){
      StartAnimation(i + 1);
     });
    }
  }
  StartAnimation(0);
  }
});