"use strict";

/* ################################################################################################## */
/* ################################################################################################## */
/* ################################################################################################## */
/* 

StoragErazor by gab.ai/miraculix

*/
/* ################################################################################################## */
/* ################################################################################################## */
/* ################################################################################################## */

const VERSION = browser.runtime.getManifest().version;
const ICON_DEFAULT = "icons/recycle.png";

var gDisplayNotifications = true;

/* ################################################################################################## */
/* ################################################################################################## */

const razorNotification = {
  _notificationIcon: browser.extension.getURL(ICON_DEFAULT),
  _notificationId: "srazor",

  display: (text, millis) => {

    if (!gDisplayNotifications) return;

    browser.notifications.create(razorNotification._notificationId, {
      "type": "basic",
      "iconUrl": razorNotification._notificationIcon,
      "title": "StoragErazor v" + VERSION,
      "message": text
    });

    window.setTimeout(() => {
      browser.notifications.clear(razorNotification._notificationId);
    }, millis);
  }
}

/* ################################################################################################## */
/* ################################################################################################## */

const storageRazor = {

  removeCache: false,
  removeLocal: true,
  removeIndexed: true,

  init: async () => {
    let result = await storageRazor.readSettings();
    if (result === true) {
      let opts = {
        cache: storageRazor.removeCache,
        local: storageRazor.removeLocal,
        indexed: storageRazor.removeIndexed
      };
      storageRazor.removeData(false, opts);
    }
    else {
      console.log("Running for the first time");
      razorNotification.display(
        "Running for the first time. Review the settings and change them if desired.", 11111)
      browser.runtime.openOptionsPage();
      storageRazor.writeSettings();
    }
    browser.runtime.onMessage.addListener(storageRazor.message);
  },

  removeData: (display_notification, options) => {
    browser.browsingData.remove({},
    {
        cache: options.cache, 
        localStorage: options.local, 
        indexedDB: options.indexed
    }).then( display_notification ? storageRazor.onSuccessRemove : null, storageRazor.onErrorRemove);
  },

  onSuccessRemove: () => {
    razorNotification.display("Data has been successfully removed", 3333);
  },

  onErrorRemove: (error) => {
    razorNotification.display("Error removing data: " + error, 11111);
  },

  message: (request, sender, sendResponse) => {

    if (request.getopts != null)
    {
      browser.runtime.sendMessage({
        options: true,
        removeCache: storageRazor.removeCache, 
        removeLocal: storageRazor.removeLocal, 
        removeIndexed: storageRazor.removeIndexed
      });

    } else 
    if (request.options != null)
    {
      storageRazor.removeCache = request.removeCache;
      storageRazor.removeLocal =  request.removeLocal;
      storageRazor.removeIndexed = request.removeIndexed;
      storageRazor.writeSettings();
    } else
    if (request.erase != null)
    {
      let opts = {
        local: false,
        indexed: false,
        cache: false
      }
      if (request.erase == "all") opts.local = opts.indexed = opts.cache = true;
      else if (request.erase == "cache") opts.cache = true;
      else if (request.erase == "local") opts.local = true;
      else if (request.erase == "indexed") opts.indexed = true;
      storageRazor.removeData(true, opts);
    }

  },

  readSettings: async () => {

    let settings = await browser.storage.local.get([
      'removeCache',
      'removeLocal',
      'firstRun',
      'removeIndexed'
    ]);

    if (settings.removeCache !== undefined) storageRazor.removeCache = settings.removeCache;
    if (settings.removeLocal !== undefined) storageRazor.removeLocal = settings.removeLocal;
    if (settings.removeIndexed !== undefined) storageRazor.removeIndexed = settings.removeIndexed;
    if (settings.firstRun !== undefined) return true;
    return false;

  },

  writeSettings: () => {
    browser.storage.local.set({
      removeCache: storageRazor.removeCache,
      removeLocal: storageRazor.removeLocal,
      removeIndexed: storageRazor.removeIndexed,
      firstRun: false
    });

  }

}

/* ################################################################################################## */
/* ################################################################################################## */

requestIdleCallback(() => { storageRazor.init(); }, { timeout: 10000 });

/* ################################################################################################## */
/* ################################################################################################## */
