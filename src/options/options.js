"use strict";

/* ################################################################################################## */
/* ################################################################################################## */

const optionsForm = {

  _cbCache: document.getElementById("cache"),
  _cbLocal: document.getElementById("localstorage"),
  _cbIndexed: document.getElementById("indexeddb"),
  _pageContainer: document.getElementById("page-container"),

  init: () => {

    browser.runtime.onMessage.addListener(   (request, sender, sendResponse) => { 

      if (request.options != null)
      {
        optionsForm._cbCache.checked = request.removeCache;
        optionsForm._cbLocal.checked = request.removeLocal;
        optionsForm._cbIndexed.checked = request.removeIndexed;
        optionsForm._pageContainer.style.display = "block";
      }
    });

    browser.runtime.sendMessage({getopts: true});
    document.getElementById("ce-form").addEventListener("click", (e) => {
      optionsForm.saveOptions();
    
    });
  },

  saveOptions: () => {

    let opts = {
      options: true,
      removeCache: optionsForm._cbCache.checked,
      removeLocal: optionsForm._cbLocal.checked,
      removeIndexed: optionsForm._cbIndexed.checked

    };

    browser.runtime.sendMessage(opts);
  }
}

/* ################################################################################################## */
/* ################################################################################################## */

optionsForm.init();

/* ################################################################################################## */
/* ################################################################################################## */