var ALLOWED_PREFIX = "https://luca-artless.github.io/";
var COLORS = ["cyan", "blue", "purple", "pink", "orange", "green", "yellow", "red"];

async function openGroup(msg) {
  var ids = [];
  for (var i = 0; i < msg.urls.length; i++) {
    var tab = await chrome.tabs.create({ url: msg.urls[i], active: false });
    ids.push(tab.id);
  }

  var groupId = await chrome.tabs.group({ tabIds: ids });

  await chrome.tabGroups.update(groupId, {
    title: (msg.title || "Music Finder").slice(0, 45),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    collapsed: false
  });

  await chrome.tabs.update(ids[0], { active: true });
  return { ok: true, count: ids.length };
}

chrome.runtime.onMessageExternal.addListener(function (msg, sender, sendResponse) {
  if (!sender || !sender.url || sender.url.indexOf(ALLOWED_PREFIX) !== 0) {
    sendResponse({ ok: false, error: "origin not allowed" });
    return;
  }

  // the page pings on load to detect whether the grouper is installed
  if (msg && msg.type === "ping") {
    sendResponse({ ok: true });
    return;
  }

  if (!msg || msg.type !== "openGroup" || !Array.isArray(msg.urls) || !msg.urls.length) {
    sendResponse({ ok: false, error: "bad payload" });
    return;
  }

  openGroup(msg).then(sendResponse).catch(function (e) {
    sendResponse({ ok: false, error: String(e) });
  });
  return true; // keeps the response channel open for async work
});
