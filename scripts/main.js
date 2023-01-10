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

function scrollToHash () {
  setTimeout(function () {
    let smoothScroll = new scrollToSmooth('a[href*="#"]', {
      targetAttribute: 'href',
      durationRelative: 500,
      durationMin: 500,
      durationMax: 5000,
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
      result = result.split(' id=').join(' class="has-id" id=')
      document.getElementById(name).innerHTML = result;
    });
}

async function loadData () {
  const promises = [];
  markdown.forEach(function (name) {
    promises.push(getAndInsertMarkdown(name));
  });
  await Promise.all(promises);
  return;
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
      smoothScroll.scrollTo(hash);
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
        scrollToHash();
      });
    }
  });
}

async function initializePage () {
  await loadData();
  applyHighlightJs();
  makeIdsClickable();
  handleNavigationClicks();
  scrollToHash();
}

initializePage();
