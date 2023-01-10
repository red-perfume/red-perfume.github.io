const HIDDEN = 'hidden';
const OPACITY_0 = 'opacity-0';
const mobileNav = document.getElementById('mobile-nav');

const markdown = [
  'intro',
  'getting-started',
  'task-runner',
  'css',
  'html',
  'tutorials',
  'ecosystem',
  'about'
];

async function loadData () {
  const promises = [];
  markdown.forEach(function (name) {
    promises.push(getAndInsertMarkdown(name));
  });
  await Promise.all(promises);
  return;
}

function cloneSidebar () {
  const title = document.querySelector('.side-title').outerHTML;
  const nav = document.querySelector('aside nav').innerHTML;
  const footer = document.querySelector('aside footer').innerHTML;
  mobileNav.innerHTML = title + nav;
  document.getElementById('mobile-footer').innerHTML = footer;
}

function scrollToHash () {
  setTimeout(function () {
    let smoothScroll = new scrollToSmooth('a[href*="#"]', {
      targetAttribute: 'href',
      durationRelative: 250,
      durationMin: 150,
      durationMax: 2500,
      easing: 'easeOutCubic',
      offset: 15
    });
    smoothScroll.init();
    let hash = window.location.hash;
    if (hash) {
      smoothScroll.scrollTo(hash);
    }
  }, 350);
}

function getAndInsertMarkdown (name) {
  return fetch('/markdown/' + name + '.md')
    .then(function (response) {
      return response.text();
    })
    .then(function (result) {
      result = marked.parse(result);
      result = result.split(' id=').join(' class="has-id" id=');
      result = result.split('<table>').join('<div class="table-container"><table>');
      result = result.split('</table>').join('</table></div>');
      document.getElementById(name).innerHTML = result;
    });
}

function applyHighlightJs () {
  document.querySelectorAll('code[class^="language-"]').forEach(function (el) {
    hljs.highlightElement(el);
  });
}

function makeIdsClickable () {
  const elements = Array.from(document.querySelectorAll('.has-id'));
  elements.forEach(function (el) {
    const hash = '#' + el.id;
    el.setAttribute('data-scrollto', hash);
  });
  let smoothScroll = new scrollToSmooth('.has-id', {
    targetAttribute: 'data-scrollto',
    durationRelative: 500,
    durationMin: 500,
    durationMax: 5000,
    easing: 'easeOutCubic',
    offset: 15
  });
  smoothScroll.init();
  elements.forEach(function (el) {
    const hash = '#' + el.id;
    el.addEventListener('click', function () {
      if (hash) {
        smoothScroll.scrollTo(hash);
        history.pushState(null, null, hash);
      }
    });
  });
}

function handleNavigationClicks () {
  const links = Array.from(document.querySelectorAll('a'));
  links.forEach(function (link) {
    if (link.href.includes('#')) {
      link.addEventListener('click', function (evt) {
        evt.preventDefault();
        const hash = evt?.currentTarget?.hash;
        if (hash !== window.location.hash) {
          history.pushState({}, '', (hash || ' '));
        }
        hideMobileNav();
        scrollToHash();
      });
    }
  });
}

function fastScrollOnLoad () {
  window.location.hash = window.location.hash;
}

function hideMobileNav () {
  mobileNav.classList.add(OPACITY_0);
  setTimeout(function () {
    mobileNav.classList.add(HIDDEN)
  }, 510);
}

function showMobileNav () {
  mobileNav.classList.remove(HIDDEN);
  setTimeout(function () {
    mobileNav.classList.remove(OPACITY_0);
  }, 0);
}

function registerHamburgerMenu () {
  document
    .querySelector('.hamburger-menu')
    .addEventListener('click', function (evt) {
      evt.preventDefault();
      if (mobileNav.classList.contains(HIDDEN)) {
        showMobileNav()
      } else {
        hideMobileNav();
      }
    });
}

async function initializePage () {
  cloneSidebar();
  await loadData();
  applyHighlightJs();
  makeIdsClickable();
  handleNavigationClicks();
  fastScrollOnLoad();
  scrollToHash();
  registerHamburgerMenu();
}

initializePage();
