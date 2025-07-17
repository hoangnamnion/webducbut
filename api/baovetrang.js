// Ngăn quay lại trang trước, chuyển về Google
window.history.replaceState({}, document.title, window.location.pathname);
window.addEventListener('popstate', function() {
  window.location.replace('https://www.google.com/');
});
// Bảo vệ trang khỏi DevTools trên desktop, không ảnh hưởng mobile
(function() {
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Chặn phím tắt DevTools và Ctrl+U trên desktop
  document.addEventListener('keydown', function(e) {
    if (isMobile()) return;
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      alert('Tính năng này đã bị vô hiệu hóa!');
    }
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j'))
    ) {
      window.location.replace('baovetrang.html');
    }
  });

  // Phát hiện DevTools mở bằng cách kiểm tra kích thước cửa sổ (chỉ desktop)
  if (!isMobile()) {
    let devtoolsOpen = false;
    const threshold = 160;
    setInterval(function() {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          window.location.replace('baovetrang.html');
        }
      } else {
        devtoolsOpen = false;
      }
    }, 500);
  }
})(); 