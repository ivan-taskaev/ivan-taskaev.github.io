// Loaded in <head> without defer: the language is set before the first paint.
(function () {
  var LANGS = ['ru', 'en'];
  var root = document.documentElement;

  function save(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) { /* private mode */ }
  }

  // ?lang= in a shared link → saved choice → browser language.
  function pickLang() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(fromUrl) !== -1) {
      save(fromUrl); // so case pages opened from this link keep the language
      return fromUrl;
    }
    try {
      var saved = localStorage.getItem('lang');
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* private mode */ }
    var browser = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^(ru|be|uk|kk)\b/i.test(browser) ? 'ru' : 'en';
  }

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === lang));
    }
  }

  function switchLang(lang) {
    applyLang(lang);
    save(lang);
    var url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  }

  // Accepts a bare video id or any common YouTube link.
  function youtubeId(value) {
    var m = String(value).trim().match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(value.trim()) ? value.trim() : null;
  }

  function mountVideos() {
    var boxes = document.querySelectorAll('.video[data-youtube]');
    for (var i = 0; i < boxes.length; i++) {
      var id = youtubeId(boxes[i].getAttribute('data-youtube'));
      if (!id) continue; // keeps the placeholder
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0';
      frame.title = boxes[i].getAttribute('data-title') || 'Video';
      frame.loading = 'lazy';
      frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      boxes[i].innerHTML = '';
      boxes[i].appendChild(frame);
    }
  }

  // A screenshot that is not uploaded yet shows its placeholder instead of a broken image.
  // Gallery images are not lazy: a deferred image can report complete with zero width.
  function markMissing() {
    this.closest('.shot').classList.add('shot--missing');
  }

  function watchScreenshots() {
    var images = document.querySelectorAll('.shot img');
    for (var i = 0; i < images.length; i++) {
      if (images[i].complete && images[i].naturalWidth === 0) markMissing.call(images[i]);
      else images[i].addEventListener('error', markMissing);
    }
  }

  // Each screenshot opens at full size in a new tab.
  function linkScreenshots() {
    var images = document.querySelectorAll('.shot img');
    for (var i = 0; i < images.length; i++) {
      var link = document.createElement('a');
      link.href = images[i].getAttribute('src');
      link.target = '_blank';
      link.rel = 'noopener';
      images[i].parentNode.insertBefore(link, images[i]);
      link.appendChild(images[i]);
    }
  }

  // PDF language menus (<details class="pdf-menu">) close on an outside click, after a choice and on Escape.
  function closePdfMenus(except) {
    var menus = document.querySelectorAll('details.pdf-menu[open]');
    for (var i = 0; i < menus.length; i++) {
      if (menus[i] !== except) menus[i].open = false;
    }
  }

  function wirePdfMenus() {
    document.addEventListener('click', function (e) {
      var menu = e.target.closest('details.pdf-menu');
      closePdfMenus(menu);
      if (menu && e.target.closest('.pdf-menu__list a')) menu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePdfMenus(null);
    });
  }

  applyLang(pickLang());

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(root.getAttribute('data-lang')); // the buttons exist only now
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-set-lang]');
      if (btn) switchLang(btn.getAttribute('data-set-lang'));
    });
    mountVideos();
    watchScreenshots();
    linkScreenshots();
    wirePdfMenus();
  });
})();
