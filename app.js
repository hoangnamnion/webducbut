const servicesData = (window.ShopData && window.ShopData.services) || [];
const accountsData = (window.ShopData && window.ShopData.products) || [];

function renderServices() {
  const container = document.getElementById('services');
  if (!container) return;
  container.innerHTML = servicesData
    .map(service => {
      const badge = service.featured && service.badge ? `<div class="featured-badge">${service.badge}</div>` : '';
      const featuredClass = service.featured ? ' featured' : '';
      const features = service.features
        .map(f => `<li><i class="fas fa-check"></i> ${f}</li>`)
        .join('');
      return `
        <div class="service-card${featuredClass}">
          ${badge}
          <div class="service-icon"><i class="fas ${service.icon}"></i></div>
          <h3 class="service-title">${service.title}</h3>
          <ul class="service-features">${features}</ul>
          <div class="service-price">${service.price} <span>${service.unit}</span></div>
        </div>
      `;
    })
    .join('');
}

function renderAccounts() {
  const container = document.getElementById('accounts-grid');
  if (!container) return;
  container.innerHTML = accountsData
    .map(acc => {
      const badge = acc.badge ? `<div class="account-badge">${acc.badge}</div>` : '';
      const featureItems = (acc.features || [])
        .map(f => `<li><i class="fas fa-check"></i> ${f}</li>`)
        .join('');
      const original = acc.priceOriginal ? `<span class="price-original">${acc.priceOriginal}</span>` : '';
      return `
        <a class="account-card" href="product.html?id=${encodeURIComponent(acc.id)}">
          ${badge}
          <img src="${acc.image}" alt="${acc.title}" class="account-image">
          <div class="account-info">
            <div class="account-category">${acc.category}</div>
            <h3 class="account-title">${acc.title}</h3>
            <p class="account-description">${acc.description}</p>
            <ul class="account-features">${featureItems}</ul>
            <div class="account-price">
              <div class="price">${acc.price} ${original}</div>
            </div>
          </div>
        </a>
      `;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderServices();
  renderAccounts();
});


