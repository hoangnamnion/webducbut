function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

document.addEventListener('DOMContentLoaded', function() {
  if (isIOS()) {
    var emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      var path = window.location.pathname;
      console.log('Current path:', path); // Thêm debug
      if (path.endsWith('capcutpro.html')) {
        emailInput.value = "tkcapcutpro@gmail.com";
      } else if (path.endsWith('chatgpt.html')) {
        emailInput.value = "tkcanva@gmail.com";
      } else if (path.endsWith('canva.html')) {
        emailInput.value = "tkchatpgt@gmail.com";
      } else {
        emailInput.value = "emailkhac@gmail.com"; 
      }
    } else {
      console.log('Không tìm thấy input name="email"');
    }
  } else {
    console.log('Không phải thiết bị iOS');
  }
});
