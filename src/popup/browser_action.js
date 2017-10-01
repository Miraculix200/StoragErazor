"use strict";

/* ################################################################################################## */
/* ################################################################################################## */

const razorBrowserAction = {

  _menuList: document.getElementById("menu-list"),

  init: () => {
    razorBrowserAction.addListener();
  },

  addListener: () => {

    razorBrowserAction._menuList.addEventListener("click", (e) => {
      
      switch(e.target.id) {
        case "id-all":
          browser.runtime.sendMessage({ erase: "all" });
          break;
        case "id-local":
          browser.runtime.sendMessage({ erase: "local" });
          break;
        case "id-indexed":
          browser.runtime.sendMessage({ erase: "indexed" });
          break;
        case "id-cache":
          browser.runtime.sendMessage({ erase: "cache" });
          break;
        case "id-settings":
          browser.runtime.openOptionsPage();
          break;
        default:
          console.warn(e.target.parentNode.outerHTML);
      }
      window.setTimeout(() => { window.close(); }, 200 );

    });
  }
}

/* ################################################################################################## */
/* ################################################################################################## */

razorBrowserAction.init();

/* ################################################################################################## */
/* ################################################################################################## */

