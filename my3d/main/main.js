let close = "─$ [ Закрыть (X) ]";
// Обьекты
let about = document.querySelector('.about');
let works = document.querySelector('.works');
let contacts = document.querySelector('.contacts');
// Кнопки
let aboutButton = document.querySelector('.aboutButton');
let worksButton = document.querySelector('.worksButton');
let contactsButton = document.querySelector('.contactsButton');
// Переменные исходного текста из HTML
let aboutContent = document.querySelector('.aboutButton');
let aboutText = aboutContent.textContent;
let worksContent = document.querySelector('.worksButton');
let worksText = worksContent.textContent;
let contactsContent = document.querySelector('.contactsButton');
let contactsText = contactsContent.textContent;
// ABOUT
$(aboutButton).click(function() {
  $(this).toggleClass("active");
  $('hide').toggleClass("aboutHide");
  $(works).toggleClass("worksHide");
  $(contacts).toggleClass("contactsHide");
  if ( $(this).hasClass( "active" ) ) {
    $(this).text( close );
  } else {
    $(this).text( aboutText );
  }
});
// WORKS
$(worksButton).click(function() {
  $(this).toggleClass("active");
  $('hide').toggleClass("worksHide");
  $(about).toggleClass("aboutHide");
  $(contacts).toggleClass("contactsHide");
  if ( $(this).hasClass( "active" ) ) {
    $(this).text( close );
  } else {
    $(this).text( worksText );
  }
});
// CONTACTS
$(contactsButton).click(function() {
  $(this).toggleClass("active");
  $('hide').toggleClass("contactsHide");
  $(about).toggleClass("aboutHide");
  $(works).toggleClass("worksHide");
  if ( $(this).hasClass( "active" ) ) {
    $(this).text( close );
  } else {
    $(this).text( contactsText );
  }
});
// AUTOTYPING TEXT
document.addEventListener('DOMContentLoaded',function(event){
  window.onload = function() {
  var dataText = [ 
		"Современные методы верстки ", 
		"Трендовые визуальные приемы ", 
		"Максимально индивидуальный подход ", 
		"Решения на любой вкус и кошелек ",
		"Choose your fate... "
	];
  var caret = "|";
  function type(text, i, fnCallback) {
    if (i < (text.length)) {
      document.querySelector(".console").textContent = text.substring(0, i+1) + caret;
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
        }, 30000);
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