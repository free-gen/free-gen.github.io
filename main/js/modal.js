var modalWindow = new tingle.modal({
  footer: false,
  stickyFooter: false,
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: "",
});
var btn = document.getElementById("modalTrigger");
btn.addEventListener("click", function() {
  modalWindow.open();
});
modalWindow.setContent(
  document.querySelector(".modalWindow").innerHTML
);