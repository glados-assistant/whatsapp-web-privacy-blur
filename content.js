const DEFAULTS = {
  blurChatList: true,
  blurChatDetail: true,
  blurNames: true,
};

const GROUPS = {
  blurChatList: [
    '#pane-side',
    '#pane-side [role="grid"]',
    '[data-testid="cell-frame-container"]'
  ],
  blurChatDetail: [
    '#main .copyable-area',
    '#main [role="row"]',
    '#main ._amjv',
    '#main footer'
  ],
  blurNames: [
    '#main header',
    '#main header span[dir="auto"]',
    '#pane-side span[dir="auto"]',
    'header [title]'
  ]
};

let settings = { ...DEFAULTS };

function setBlur(selector, enabled) {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.toggle('wwpb-blur', enabled);
    el.setAttribute('data-wwpb-managed', '1');
  });
}

function applySettings() {
  for (const [key, selectors] of Object.entries(GROUPS)) {
    const enabled = !!settings[key];
    selectors.forEach((selector) => setBlur(selector, enabled));
  }
}

function refresh() {
  chrome.storage.sync.get(DEFAULTS, (values) => {
    settings = values;
    applySettings();
  });
}

const observer = new MutationObserver(() => applySettings());

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  let touched = false;
  for (const key of Object.keys(DEFAULTS)) {
    if (changes[key]) {
      settings[key] = changes[key].newValue;
      touched = true;
    }
  }
  if (touched) applySettings();
});

function init() {
  refresh();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
