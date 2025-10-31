function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderProductDetail() {
  const id = getQueryParam('id');
  const container = document.getElementById('product-detail');
  if (!container) return;

  const all = (window.ShopData && window.ShopData.products) || [];
  const product = all.find(p => p.id === id);

  if (!product) {
    container.innerHTML = '<p style="text-align:center;color:#64748b">Không tìm thấy sản phẩm.</p>';
    return;
  }

  const badge = product.badge ? `<div class="account-badge">${product.badge}</div>` : '';
  const features = (product.features || [])
    .map(f => `<li><i class="fas fa-check"></i> ${f}</li>`)
    .join('');
  const original = product.priceOriginal ? `<span class="price-original">${product.priceOriginal}</span>` : '';

  container.innerHTML = `
    <div class="account-card" style="display:grid;grid-template-columns: 1fr 1fr; gap:2rem; align-items:start;">
      <div style="position:relative;">
        ${badge}
        <img src="${product.image}" alt="${product.title}" class="account-image" style="height:300px;object-fit:cover;">
      </div>
      <div class="account-info">
        <div class="account-category">${product.category}</div>
        <h1 class="account-title" style="font-size:1.8rem;">${product.title}</h1>
        <p class="account-description" style="-webkit-line-clamp:unset;">${product.description}</p>
        <ul class="account-features">${features}</ul>
        <div class="account-price">
          <div class="price">${product.price} ${original}</div>
        </div>
        <div id="actions" style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem;"></div>
        <div style="margin-top:1rem;">
          <a href="index.html#accounts" class="btn btn-outline"><i class="fas fa-arrow-left"></i> Quay lại</a>
        </div>
      </div>
    </div>
  `;

  // Render actions from ShopData (config in shop.js) behind VIP code gate
  const actionsEl = document.getElementById('actions');
  if (actionsEl) {
    const actions = product.actions || { copies: [], links: [] };
    const copyBtns = (actions.copies || [])
      .map(c => `<button class="btn btn-primary copy-btn" data-copy="${(c.value || '').replace(/"/g, '&quot;')}" data-original="${c.label}">${c.label}</button>`) 
      .join('');
    const linkBtns = (actions.links || [])
      .map(l => `<a class="btn btn-outline" href="${l.href || '#'}" target="_blank" rel="noopener">${l.label}</a>`) 
      .join('');
    const actionsHtml = copyBtns + linkBtns;

    const gateHtml = `
      <div id="vip-gate" style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
        <input id="vip-input" type="password" placeholder="Nhập mã" 
               style="padding:0.65rem 0.9rem;border-radius:8px;border:1px solid #e2e8f0;" />
        <button id="vip-submit" class="btn btn-primary">Xác nhận</button>
        <small id="vip-error" style="color:#ef4444;display:none;">Mã không đúng</small>
      </div>`;
    actionsEl.innerHTML = gateHtml;

    actionsEl.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.id === 'vip-submit') {
        const input = document.getElementById('vip-input');
        const error = document.getElementById('vip-error');
        const val = (input && input.value) ? String(input.value).trim() : '';

        // Support multiple codes via window.MAVIP.codes and fallback to single window.MAVIP.code
        const vip = (window.MAVIP || {});
        const list = Array.isArray(vip.codes) ? vip.codes.map(c => String(c)) : [];
        const single = vip.code ? [String(vip.code)] : [];
        const allowed = [...new Set([...list, ...single])];

        if (val && allowed.includes(val)) {
          actionsEl.innerHTML = actionsHtml;
        } else {
          if (error) error.style.display = 'inline';
        }
      }
    });
  }

  // Copy handlers (event delegation)
  container.addEventListener('click', async (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('copy-btn')) {
      const text = target.getAttribute('data-copy') || '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        target.textContent = 'Đã sao chép!';
        setTimeout(() => (target.textContent = target.getAttribute('data-original') || 'Sao chép'), 1200);

        // Show toast notification on screen
        showCopyToast('Đã sao chép vào bộ nhớ tạm');
      } catch (err) {
        console.error('Copy failed', err);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', renderProductDetail);

// Lightweight toast (no CSS dependency)
function showCopyToast(message) {
  try {
    // Ensure keyframes for shake effect are available
    if (!document.getElementById('copy-toast-style')) {
      const style = document.createElement('style');
      style.id = 'copy-toast-style';
      style.textContent = `@keyframes copyToastShake { 0% { transform: translate(-50%, -50%) rotate(0deg); } 10% { transform: translate(calc(-50% - 2px), calc(-50% - 1px)) rotate(-0.6deg); } 20% { transform: translate(calc(-50% + 3px), calc(-50% + 2px)) rotate(0.6deg); } 30% { transform: translate(calc(-50% - 3px), calc(-50% + 1px)) rotate(-0.6deg); } 40% { transform: translate(calc(-50% + 2px), calc(-50% - 2px)) rotate(0.6deg); } 50% { transform: translate(calc(-50% - 2px), calc(-50% + 2px)) rotate(-0.6deg); } 60% { transform: translate(calc(-50% + 2px), calc(-50% - 1px)) rotate(0.6deg); } 70% { transform: translate(calc(-50% - 1px), calc(-50% + 1px)) rotate(-0.4deg); } 80% { transform: translate(calc(-50% + 1px), calc(-50% - 1px)) rotate(0.4deg); } 90% { transform: translate(calc(-50% - 1px), calc(-50% + 1px)) rotate(-0.2deg); } 100% { transform: translate(-50%, -50%) rotate(0deg); } }`;
      document.head.appendChild(style);
    }
    const existing = document.getElementById('copy-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.textContent = message || 'Đã sao chép';
    toast.style.position = 'fixed';
    toast.style.left = '50%';
    toast.style.top = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.background = '#10b981';
    toast.style.color = '#ffffff';
    toast.style.padding = '20px 28px';
    toast.style.borderRadius = '14px';
    toast.style.boxShadow = '0 12px 20px rgba(16, 185, 129, 0.35)';
    toast.style.fontSize = '28px';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '2000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    toast.style.willChange = 'transform, opacity';

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, -50%) scale(1.02)';
      toast.style.animation = 'copyToastShake 600ms ease';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -50%) scale(0.98)';
      setTimeout(() => toast.remove(), 300);
    }, 1400);
  } catch (_) {
    // ignore
  }
}

