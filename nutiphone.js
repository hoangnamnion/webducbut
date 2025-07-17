function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

document.addEventListener('DOMContentLoaded', function() {
  if (isIOS()) {
    var emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      var path = window.location.pathname;
      if (path.endsWith('capcutpro.html')) {
        emailInput.value = "tkcapcutpro@gmail.com";
      } else if (path.endsWith('chatgpt.html')) {
        emailInput.value = "tkcanva@gmail.com";
      } else if (path.endsWith('canva.html')) {
        emailInput.value = "tkchatpgt@gmail.com";
      } else if (path.endsWith('chatgpt.html')) {
        emailInput.value = "emailkhac@gmail.com"; 
      }
    }
  }
});
