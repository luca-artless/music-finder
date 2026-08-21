var ALLOWED_PREFIX = "https" + "://luca-artless.github.io/";
var VALID_COLORS = ["grey","blue","red","yellow","green","pink","purple","cyan","orange"];

function openGroup(msg, sendResponse) {
  var urls = Array.isArray(msg.urls) ? msg.urls : [];
  if (!urls.length) { sendResponse({ ok: false, error: "no urls" }); return; }

  var ids = [];
  var pending = urls.length;

  urls.forEach(function (u, i) {
    chrome.tabs.create({ url: u, active: false }, function (tab) {
      if (tab) { ids[i] = tab.id; }
      pending--;
      if (pending === 0) { finish(); }
    });
  });

  function finish() {
    var live = ids.filter(function (x) { return typeof x === "number"; });
    if (!live.length) { sendResponse({ ok: false, error: "no tabs" }); return; }

    chrome.tabs.group({ tabIds: live }, function (groupId) {
      var color = VALID_COLORS.indexOf(msg.color) >= 0
        ? msg.color
        : VALID_COLORS[Math.floor(Math.random() * VALID_COLORS.length)];

      chrome.tabGroups.update(groupId, {
        title: String(msg.title || "Music Finder").slice(0, 45),
        color: color,
        collapsed: false
      }, function () {
        chrome.tabs.update(live[0], { active: true }, function () {
          sendResponse({ ok: true, count: live.length });
        });
      });
    });
  }
}

chrome.runtime.onMessageExternal.addListener(function (msg, sender, sendResponse) {
  if (!sender || !sender.url || sender.url.indexOf(ALLOWED_PREFIX) !== 0) {
    sendResponse({ ok: false, error: "bad origin" });
    return;
  }
  if (msg && msg.type === "ping") {
    sendResponse({ ok: true, pong: true });
    return;
  }
  if (msg && msg.type === "openGroup") {
    openGroup(msg, sendResponse);
    return true;
  }
  sendResponse({ ok: false, error: "bad payload" });
});
