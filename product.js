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
      } catch (err) {
        console.error('Copy failed', err);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', renderProductDetail);

