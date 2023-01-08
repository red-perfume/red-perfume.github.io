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
      document.getElementById(name).innerHTML = marked.parse(result);
    });
}

async function loadData () {
  const promises = [];
  const markdown = [
    'intro'
  ];
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

function handleSidebarClicks () {
  const links = Array.from(document.querySelectorAll('aside a'));
  links.forEach(function (link) {
    if (!link.href.includes('github.com')) {
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
  handleSidebarClicks();
  scrollToHash();
}

initializePage();
