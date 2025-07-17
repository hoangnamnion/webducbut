function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.nice-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    if (isIOS()) {
      // Xử lý riêng cho iPhone/iOS
      // Ví dụ: Gửi form theo cách truyền thống
      // hoặc hiển thị thông báo hướng dẫn
      // e.preventDefault(); // hoặc không preventDefault để gửi bình thường
      alert('Bạn đang dùng iPhone, vui lòng kiểm tra lại email sau khi gửi!');
      // Có thể bỏ e.preventDefault() để form gửi truyền thống nếu fetch không ổn định trên iOS
    } else {
      // Xử lý như cũ cho các thiết bị khác
      e.preventDefault();
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        showToast();
        form.reset();
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  });
});
