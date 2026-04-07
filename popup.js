const DEFAULTS = {
  blurChatList: true,
  blurChatDetail: true,
  blurNames: true,
};

const ids = Object.keys(DEFAULTS);

function save() {
  const next = {};
  for (const id of ids) {
    next[id] = document.getElementById(id).checked;
  }
  chrome.storage.sync.set(next);
}

chrome.storage.sync.get(DEFAULTS, (values) => {
  for (const id of ids) {
    const el = document.getElementById(id);
    el.checked = values[id];
    el.addEventListener('change', save);
  }
});
