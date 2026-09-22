const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const toast = $('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
}

$$('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));

const menu = $('.menu-toggle');
const nav = $('.site-header nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
$$('.site-header nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

$$('[data-filter]').forEach(filter => filter.addEventListener('click', () => {
  $$('[data-filter]').forEach(item => item.classList.remove('active'));
  filter.classList.add('active');
  $$('.product-card').forEach(card => card.classList.toggle('hidden', filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter));
}));

const dialog = $('#product-dialog');
const customOptions = $('.custom-options');
function openProduct(product) {
  $('#dialog-title').textContent = product.name;
  customOptions.innerHTML = product.options.map((option, index) => `<button type="button" class="${index === 0 ? 'active' : ''}">${option}</button>`).join('');
  $$('.custom-options button').forEach(option => option.addEventListener('click', () => {
    $$('.custom-options button').forEach(item => item.classList.remove('active'));
    option.classList.add('active');
  }));
  dialog.showModal();
}
$$('.product-link').forEach(button => button.addEventListener('click', () => openProduct({ name: button.dataset.product, options: ['Colour palette', 'Monogram', 'Placement'] })));
$('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
$$('.swatch').forEach(swatch => swatch.addEventListener('click', () => {
  $$('.swatch').forEach(item => item.classList.remove('active'));
  swatch.classList.add('active');
  $('.dialog-art').style.background = getComputedStyle(swatch).backgroundColor;
}));

const featuredItems = [
  { name: 'The Day One Shoe', display: 'THE DAY<br />ONE SHOE', type: 'shoe', background: '#e9b34d', options: ['Sole colour', 'Lace finish', 'Heel monogram'] },
  { name: 'The Sunday Tee', display: 'THE SUNDAY<br />TEE', type: 'tee', background: '#e26b54', options: ['Neck detail', 'Chest mark', 'Sleeve monogram'] },
  { name: 'The Easy Pant', display: 'THE EASY<br />PANT', type: 'pants', background: '#b4c6e1', options: ['Waist finish', 'Stripe colour', 'Pocket detail'] },
  { name: 'The Off-Duty Lower', display: 'THE OFF-DUTY<br />LOWER', type: 'lowers', background: '#d9e1bd', options: ['Cuff finish', 'Drawcord', 'Leg embroidery'] },
  { name: 'The Elsewhere Charm', display: 'THE ELSEWHERE<br />CHARM', type: 'jewellery', background: '#4864a8', options: ['Symbol', 'Chain length', 'Back engraving'] },
  { name: 'The Field Cap', display: 'THE FIELD<br />CAP', type: 'headwear', background: '#7d9b5f', options: ['Front mark', 'Thread colour', 'Side initials'] },
  { name: 'The Full Look', display: 'THE FULL<br />LOOK', type: 'outfit', background: '#db927f', options: ['Top silhouette', 'Bottom fit', 'Personal details'] }
];
const featuredEdit = $('.featured-edit');
const featureCard = $('.feature-card');
const featureObject = $('.feature-object');
const featureStatus = $('.feature-status');
const featureCopy = $('.feature-copy');
const featureDots = $('.feature-dots');
let featuredIndex = 0;
let featureTimer;

function renderFeaturedItem(nextIndex, direction = 1) {
  featuredIndex = (nextIndex + featuredItems.length) % featuredItems.length;
  const item = featuredItems[featuredIndex];
  featureCard.classList.add('is-changing');
  window.setTimeout(() => {
    featuredEdit.style.background = item.background;
    featureObject.className = `feature-object type-${item.type}`;
    featureObject.innerHTML = '<i></i><b></b>';
    featureStatus.textContent = `${String(featuredIndex + 1).padStart(2, '0')} / 07 · OUT OF STOCK`;
    featureCopy.innerHTML = `<small>Featured custom piece</small><strong>${item.display}</strong><em>Choose your options →</em>`;
    featureCard.setAttribute('aria-label', `Open ${item.name} custom options`);
    featureDots.setAttribute('aria-label', `Featured item ${featuredIndex + 1} of 7`);
    featureDots.innerHTML = featuredItems.map((_, index) => `<i class="${index === featuredIndex ? 'active' : ''}"></i>`).join('');
    featureCard.classList.remove('is-changing');
    featureCard.classList.add('is-ready');
    window.setTimeout(() => featureCard.classList.remove('is-ready'), 450);
  }, direction === 0 ? 0 : 230);
}
function stepFeaturedItem(direction) { renderFeaturedItem(featuredIndex + direction, direction); }
$('.feature-next').addEventListener('click', () => stepFeaturedItem(1));
$('.feature-prev').addEventListener('click', () => stepFeaturedItem(-1));
featureCard.addEventListener('click', () => openProduct(featuredItems[featuredIndex]));
featuredEdit.addEventListener('mouseenter', () => clearInterval(featureTimer));
featuredEdit.addEventListener('mouseleave', () => startFeaturedAutoplay());
featuredEdit.addEventListener('focusin', () => clearInterval(featureTimer));
featuredEdit.addEventListener('focusout', () => startFeaturedAutoplay());
function startFeaturedAutoplay() {
  clearInterval(featureTimer);
  featureTimer = setInterval(() => { if (!dialog.open) stepFeaturedItem(1); }, 4700);
}
renderFeaturedItem(0, 0);
startFeaturedAutoplay();

$$('.campaign-tabs button').forEach(tab => tab.addEventListener('click', () => {
  $$('.campaign-tabs button').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  $$('.campaign-panel').forEach(panel => panel.classList.remove('active'));
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  $('#' + tab.dataset.panel).classList.add('active');
}));

$('#restock-form').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast('You’re on the list in spirit. This is a prototype, so no details were saved.');
});


// Interactive Style Studio: hover a body region to curate its edit.
const studioZones = {
  head: { label: 'Headwear', title: 'Top it\\nwith a point.', description: 'Caps, wraps and soft shapes that frame the whole look.', products: [['The Field Cap','Brushed twill'],['The Soft Wrap','Cotton voile'],['The Halo Clip','Recycled resin']], action: 'See headwear options' },
  torso: { label: 'Torso', title: 'Top it\\nyour way.', description: 'Easy shapes, clear colour and a detail that turns a basic into your own.', products: [['The Sunday Tee','Organic cotton'],['The Cloud Hoodie','Loopback fleece'],['The Daily Shirt','Crisp poplin']], action: 'See top options' },
  waist: { label: 'Waist + layers', title: 'Add the\\nfinishing layer.', description: 'Belts, overshirts and small details that pull a look together.', products: [['The Utility Belt','Vegetable leather'],['The Short Layer','Soft twill'],['The Charm Chain','Recycled silver']], action: 'See layer options' },
  legs: { label: 'Legs', title: 'Move in\\nyour shape.', description: 'Relaxed jeans, tailored pants and off-duty lowers built around real movement.', products: [['The Easy Pant','Brushed cotton'],['The Wide Jean','Recycled denim'],['The Off-Duty Lower','Soft jersey']], action: 'See bottom options' },
  feet: { label: 'Feet', title: 'Start from\\nthe ground up.', description: 'Custom colour, contrast soles and everyday pairs with a little more character.', products: [['The Day One Shoe','Canvas + rubber'],['The Low Key Sneaker','Recycled mesh'],['The Soft Step','Suede finish']], action: 'See footwear options' }
};
const studioPerson = $('.person');
const regionPanel = $('.region-panel');
const regionKicker = $('.region-kicker span');
const regionHeading = regionPanel?.querySelector('h3');
const regionDescription = $('.region-description');
const regionProducts = $('.region-products');
const regionAction = $('.region-action');
const zoneLabel = $('.zone-label');
const styleGroups = ['figure-woman','figure-man','figure-curve','figure-relaxed','figure-petite','figure-tall','tone-sand','tone-umber','tone-golden','tone-espresso','hair-curls','hair-coils','hair-wave'];
const styleClassGroups = { identity: ['figure-woman','figure-man'], height: ['figure-petite','figure-tall'], body: ['figure-curve','figure-relaxed'], skin: ['tone-sand','tone-umber','tone-golden','tone-espresso'], hair: ['hair-curls','hair-coils','hair-wave'] };
function regionProductClick(button, product) {
  button.addEventListener('click', () => openProduct({ name: product[0], options: ['Colour palette', 'Fit', 'Personal detail'] }));
}
function renderStudioRegion(zone) {
  const data = studioZones[zone] || studioZones.torso;
  regionKicker.textContent = data.label;
  regionHeading.innerHTML = data.title.replace('\\n','<br />');
  regionDescription.textContent = data.description;
  regionAction.innerHTML = data.action + ' <b>→</b>';
  regionAction.dataset.zone = zone;
  regionProducts.innerHTML = data.products.map(product => '<button class="region-product" type="button"><small>' + product[1] + '</small><strong>' + product[0] + '</strong><span>Out of stock</span></button>').join('');
  $$('.region-product').forEach((button, index) => regionProductClick(button, data.products[index]));
  if (zoneLabel) zoneLabel.textContent = data.label.toUpperCase();
  studioPerson?.setAttribute('data-active-zone', zone);
  if (studioPerson) {
    studioPerson.style.setProperty('--torso', zone === 'torso' ? '#e26b54' : '#4864a8');
    studioPerson.style.setProperty('--bottom', zone === 'legs' ? '#e9b34d' : '#f3efe6');
  }
  $$('.hotspot').forEach(item => item.classList.toggle('active', item.dataset.zone === zone));
}
regionAction?.addEventListener('click', () => {
  const data = studioZones[regionAction.dataset.zone || 'torso'];
  openProduct({ name: data.products[0][0], options: ['Colour palette', 'Fit', 'Personal detail'] });
});
$('.hotspot').forEach(hotspot => {
  hotspot.addEventListener('mouseenter', () => renderStudioRegion(hotspot.dataset.zone));
  hotspot.addEventListener('focus', () => renderStudioRegion(hotspot.dataset.zone));
  hotspot.addEventListener('click', () => renderStudioRegion(hotspot.dataset.zone));
});
$$('[data-style] button').forEach(button => button.addEventListener('click', () => {
  const group = button.parentElement.dataset.style;
  $$('.profile-options button, .skin-options button', button.parentElement).forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  if (!studioPerson) return;
  studioPerson.classList.remove(...(styleClassGroups[group] || []));
  const classMap = {
    identity: { Woman: 'figure-woman', Man: 'figure-man', 'Non-binary': 'figure-woman' },
    height: { Petite: 'figure-petite', Medium: '', Tall: 'figure-tall' },
    body: { Classic: '', Curve: 'figure-curve', Relaxed: 'figure-relaxed' },
    skin: { 'Warm sand': 'tone-sand', 'Deep umber': 'tone-umber', 'Golden brown': 'tone-golden', 'Rich espresso': 'tone-espresso' },
    hair: { 'Soft curls': 'hair-curls', Coils: 'hair-coils', Wave: 'hair-wave' }
  };
  const selectedClass = classMap[group]?.[button.dataset.value];
  if (selectedClass) studioPerson.classList.add(selectedClass);
  const current = ['identity','height','body'].map(key => $('[data-style="' + key + '"] button.active')?.dataset.value).filter(Boolean);
  $('.profile-readout strong').textContent = current.join(' · ');
}));
renderStudioRegion('torso');
