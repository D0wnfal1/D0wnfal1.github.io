(() => {
    "use strict";
    const modules_flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) {
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    tabsTitles[index].setAttribute("data-tabs-title", "");
                    tabsContentItem.setAttribute("data-tabs-item", "");
                    if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                    tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
                }));
            }
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
                if (document.documentElement.classList.contains("catalog-open")) document.documentElement.classList.remove("catalog-open");
                if (document.documentElement.classList.contains("sub-menu-open")) document.documentElement.classList.remove("sub-menu-open");
            }
        }));
    }
    function showMore() {
        window.addEventListener("load", (function(e) {
            const showMoreBlocks = document.querySelectorAll("[data-showmore]");
            let showMoreBlocksRegular;
            let mdQueriesArray;
            if (showMoreBlocks.length) {
                showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
                    return !item.dataset.showmoreMedia;
                }));
                showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                document.addEventListener("click", showMoreActions);
                window.addEventListener("resize", showMoreActions);
                mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
                if (mdQueriesArray && mdQueriesArray.length) {
                    mdQueriesArray.forEach((mdQueriesItem => {
                        mdQueriesItem.matchMedia.addEventListener("change", (function() {
                            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                        }));
                    }));
                    initItemsMedia(mdQueriesArray);
                }
            }
            function initItemsMedia(mdQueriesArray) {
                mdQueriesArray.forEach((mdQueriesItem => {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
            }
            function initItems(showMoreBlocks, matchMedia) {
                showMoreBlocks.forEach((showMoreBlock => {
                    initItem(showMoreBlock, matchMedia);
                }));
            }
            function initItem(showMoreBlock, matchMedia = false) {
                showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
                let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
                let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
                showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                    _slideUp(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = false;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                }
            }
            function getHeight(showMoreBlock, showMoreContent) {
                let hiddenHeight = 0;
                const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
                if (showMoreType === "items") {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
                    const showMoreItems = showMoreContent.children;
                    for (let index = 1; index < showMoreItems.length; index++) {
                        const showMoreItem = showMoreItems[index - 1];
                        hiddenHeight += showMoreItem.offsetHeight;
                        if (index == showMoreTypeValue) break;
                    }
                } else {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
                    hiddenHeight = showMoreTypeValue;
                }
                return hiddenHeight;
            }
            function getOriginalHeight(showMoreContent) {
                let parentHidden;
                let hiddenHeight = showMoreContent.offsetHeight;
                showMoreContent.style.removeProperty("height");
                if (showMoreContent.closest(`[hidden]`)) {
                    parentHidden = showMoreContent.closest(`[hidden]`);
                    parentHidden.hidden = false;
                }
                let originalHeight = showMoreContent.offsetHeight;
                parentHidden ? parentHidden.hidden = true : null;
                showMoreContent.style.height = `${hiddenHeight}px`;
                return originalHeight;
            }
            function showMoreActions(e) {
                const targetEvent = e.target;
                const targetType = e.type;
                if (targetType === "click") {
                    if (targetEvent.closest("[data-showmore-button]")) {
                        const showMoreButton = targetEvent.closest("[data-showmore-button]");
                        const showMoreBlock = showMoreButton.closest("[data-showmore]");
                        const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                        if (!showMoreContent.classList.contains("_slide")) {
                            showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                            showMoreBlock.classList.toggle("_showmore-active");
                        }
                    }
                } else if (targetType === "resize") {
                    showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                    mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
                }
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                }
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
    }
    modules_flsModules.popup = new Popup({});
    function formFieldsInit(options = {
        viewPass: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) this.selectsInit(selectItems);
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if (targetType === "click") {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if (targetType === "focusin" || targetType === "focusout") {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) targetType === "focusin" ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if (targetType === "keydown" && e.code === "Escape") this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                _slideToggle(selectOptions, originalSelect.dataset.speed);
            }
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заполните атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            let selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : "";
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">` : "";
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            if (originalSelect.multiple) {
                optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                    originalSelectSelectedItem.removeAttribute("selected");
                }));
                const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                selectSelectedItems.forEach((selectSelectedItems => {
                    originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                }));
            } else {
                if (!originalSelect.hasAttribute("data-show-selected")) {
                    if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                    optionItem.hidden = true;
                }
                originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                this.selectAction(selectItem);
            }
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setSelectChange(originalSelect);
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().indexOf(selectInput.value.toUpperCase()) >= 0) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message}`) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    function isObject(obj) {
        return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target, src) {
        if (target === void 0) target = {};
        if (src === void 0) src = {};
        Object.keys(src).forEach((function(key) {
            if (typeof target[key] === "undefined") target[key] = src[key]; else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    var ssrDocument = {
        body: {},
        addEventListener: function() {},
        removeEventListener: function() {},
        activeElement: {
            blur: function() {},
            nodeName: ""
        },
        querySelector: function() {
            return null;
        },
        querySelectorAll: function() {
            return [];
        },
        getElementById: function() {
            return null;
        },
        createEvent: function() {
            return {
                initEvent: function() {}
            };
        },
        createElement: function() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute: function() {},
                getElementsByTagName: function() {
                    return [];
                }
            };
        },
        createElementNS: function() {
            return {};
        },
        importNode: function() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function getDocument() {
        var doc = typeof document !== "undefined" ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    var ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState: function() {},
            pushState: function() {},
            go: function() {},
            back: function() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener: function() {},
        removeEventListener: function() {},
        getComputedStyle: function() {
            return {
                getPropertyValue: function() {
                    return "";
                }
            };
        },
        Image: function() {},
        Date: function() {},
        screen: {},
        setTimeout: function() {},
        clearTimeout: function() {},
        matchMedia: function() {
            return {};
        },
        requestAnimationFrame: function(callback) {
            if (typeof setTimeout === "undefined") {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame: function(id) {
            if (typeof setTimeout === "undefined") return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        var win = typeof window !== "undefined" ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
    }
    function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
    }
    function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
            o.__proto__ = p;
            return o;
        };
        return _setPrototypeOf(o, p);
    }
    function _isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct) return false;
        if (Reflect.construct.sham) return false;
        if (typeof Proxy === "function") return true;
        try {
            Date.prototype.toString.call(Reflect.construct(Date, [], (function() {})));
            return true;
        } catch (e) {
            return false;
        }
    }
    function _construct(Parent, args, Class) {
        if (_isNativeReflectConstruct()) _construct = Reflect.construct; else _construct = function _construct(Parent, args, Class) {
            var a = [ null ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor;
            if (Class) _setPrototypeOf(instance, Class.prototype);
            return instance;
        };
        return _construct.apply(null, arguments);
    }
    function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? new Map : void 0;
        _wrapNativeSuper = function _wrapNativeSuper(Class) {
            if (Class === null || !_isNativeFunction(Class)) return Class;
            if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
            if (typeof _cache !== "undefined") {
                if (_cache.has(Class)) return _cache.get(Class);
                _cache.set(Class, Wrapper);
            }
            function Wrapper() {
                return _construct(Class, arguments, _getPrototypeOf(this).constructor);
            }
            Wrapper.prototype = Object.create(Class.prototype, {
                constructor: {
                    value: Wrapper,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            return _setPrototypeOf(Wrapper, Class);
        };
        return _wrapNativeSuper(Class);
    }
    function _assertThisInitialized(self) {
        if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    }
    function makeReactive(obj) {
        var proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get: function get() {
                return proto;
            },
            set: function set(value) {
                proto.__proto__ = value;
            }
        });
    }
    var Dom7 = function(_Array) {
        _inheritsLoose(Dom7, _Array);
        function Dom7(items) {
            var _this;
            _this = _Array.call.apply(_Array, [ this ].concat(items)) || this;
            makeReactive(_assertThisInitialized(_this));
            return _this;
        }
        return Dom7;
    }(_wrapNativeSuper(Array));
    function arrayFlat(arr) {
        if (arr === void 0) arr = [];
        var res = [];
        arr.forEach((function(el) {
            if (Array.isArray(el)) res.push.apply(res, arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        var uniqueArray = [];
        for (var i = 0; i < arr.length; i += 1) if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if (typeof selector !== "string") return [ selector ];
        var a = [];
        var res = context.querySelectorAll(selector);
        for (var i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function $(selector, context) {
        var window = ssr_window_esm_getWindow();
        var document = getDocument();
        var arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if (typeof selector === "string") {
            var html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                var toCreate = "div";
                if (html.indexOf("<li") === 0) toCreate = "ul";
                if (html.indexOf("<tr") === 0) toCreate = "tbody";
                if (html.indexOf("<td") === 0 || html.indexOf("<th") === 0) toCreate = "tr";
                if (html.indexOf("<tbody") === 0) toCreate = "table";
                if (html.indexOf("<option") === 0) toCreate = "select";
                var tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (var i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    $.fn = Dom7.prototype;
    function addClass() {
        for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) classes[_key] = arguments[_key];
        var classNames = arrayFlat(classes.map((function(c) {
            return c.split(" ");
        })));
        this.forEach((function(el) {
            var _el$classList;
            (_el$classList = el.classList).add.apply(_el$classList, classNames);
        }));
        return this;
    }
    function removeClass() {
        for (var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) classes[_key2] = arguments[_key2];
        var classNames = arrayFlat(classes.map((function(c) {
            return c.split(" ");
        })));
        this.forEach((function(el) {
            var _el$classList2;
            (_el$classList2 = el.classList).remove.apply(_el$classList2, classNames);
        }));
        return this;
    }
    function toggleClass() {
        for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) classes[_key3] = arguments[_key3];
        var classNames = arrayFlat(classes.map((function(c) {
            return c.split(" ");
        })));
        this.forEach((function(el) {
            classNames.forEach((function(className) {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass() {
        for (var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) classes[_key4] = arguments[_key4];
        var classNames = arrayFlat(classes.map((function(c) {
            return c.split(" ");
        })));
        return arrayFilter(this, (function(el) {
            return classNames.filter((function(className) {
                return el.classList.contains(className);
            })).length > 0;
        })).length > 0;
    }
    function attr(attrs, value) {
        if (arguments.length === 1 && typeof attrs === "string") {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (var i = 0; i < this.length; i += 1) if (arguments.length === 2) this[i].setAttribute(attrs, value); else for (var attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (var i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (var i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (var i = 0; i < this.length; i += 1) this[i].style.transitionDuration = typeof duration !== "string" ? duration + "ms" : duration;
        return this;
    }
    function on() {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) args[_key5] = arguments[_key5];
        var eventType = args[0], targetSelector = args[1], listener = args[2], capture = args[3];
        if (typeof args[1] === "function") {
            eventType = args[0];
            listener = args[1];
            capture = args[2];
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            var target = e.target;
            if (!target) return;
            var eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if ($(target).is(targetSelector)) listener.apply(target, eventData); else {
                var _parents = $(target).parents();
                for (var k = 0; k < _parents.length; k += 1) if ($(_parents[k]).is(targetSelector)) listener.apply(_parents[k], eventData);
            }
        }
        function handleEvent(e) {
            var eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        var events = eventType.split(" ");
        var j;
        for (var i = 0; i < this.length; i += 1) {
            var el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                var event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                var _event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[_event]) el.dom7LiveListeners[_event] = [];
                el.dom7LiveListeners[_event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(_event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off() {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) args[_key6] = arguments[_key6];
        var eventType = args[0], targetSelector = args[1], listener = args[2], capture = args[3];
        if (typeof args[1] === "function") {
            eventType = args[0];
            listener = args[1];
            capture = args[2];
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        var events = eventType.split(" ");
        for (var i = 0; i < events.length; i += 1) {
            var event = events[i];
            for (var j = 0; j < this.length; j += 1) {
                var el = this[j];
                var handlers = void 0;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (var k = handlers.length - 1; k >= 0; k -= 1) {
                    var handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger() {
        var window = ssr_window_esm_getWindow();
        for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) args[_key9] = arguments[_key9];
        var events = args[0].split(" ");
        var eventData = args[1];
        for (var i = 0; i < events.length; i += 1) {
            var event = events[i];
            for (var j = 0; j < this.length; j += 1) {
                var el = this[j];
                if (window.CustomEvent) {
                    var evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter((function(data, dataIndex) {
                        return dataIndex > 0;
                    }));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        var dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var _styles = this.styles();
                return this[0].offsetWidth + parseFloat(_styles.getPropertyValue("margin-right")) + parseFloat(_styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var _styles2 = this.styles();
                return this[0].offsetHeight + parseFloat(_styles2.getPropertyValue("margin-top")) + parseFloat(_styles2.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            var window = ssr_window_esm_getWindow();
            var document = getDocument();
            var el = this[0];
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop = el.clientTop || body.clientTop || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop = el === window ? window.scrollY : el.scrollTop;
            var scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        var window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        var window = ssr_window_esm_getWindow();
        var i;
        if (arguments.length === 1) if (typeof props === "string") {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (var _prop in props) this[i].style[_prop] = props[_prop];
            return this;
        }
        if (arguments.length === 2 && typeof props === "string") {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach((function(el, index) {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        var result = arrayFilter(this, callback);
        return $(result);
    }
    function html(html) {
        if (typeof html === "undefined") return this[0] ? this[0].innerHTML : null;
        for (var i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if (typeof text === "undefined") return this[0] ? this[0].textContent.trim() : null;
        for (var i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        var window = ssr_window_esm_getWindow();
        var document = getDocument();
        var el = this[0];
        var compareWith;
        var i;
        if (!el || typeof selector === "undefined") return false;
        if (typeof selector === "string") {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = $(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        var child = this[0];
        var i;
        if (child) {
            i = 0;
            while ((child = child.previousSibling) !== null) if (child.nodeType === 1) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if (typeof index === "undefined") return this;
        var length = this.length;
        if (index > length - 1) return $([]);
        if (index < 0) {
            var returnIndex = length + index;
            if (returnIndex < 0) return $([]);
            return $([ this[returnIndex] ]);
        }
        return $([ this[index] ]);
    }
    function append() {
        var newChild;
        var document = getDocument();
        for (var k = 0; k < arguments.length; k += 1) {
            newChild = k < 0 || arguments.length <= k ? void 0 : arguments[k];
            for (var i = 0; i < this.length; i += 1) if (typeof newChild === "string") {
                var tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (var j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        var document = getDocument();
        var i;
        var j;
        for (i = 0; i < this.length; i += 1) if (typeof newChild === "string") {
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return $([ this[0].nextElementSibling ]);
                return $([]);
            }
            if (this[0].nextElementSibling) return $([ this[0].nextElementSibling ]);
            return $([]);
        }
        return $([]);
    }
    function nextAll(selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var _next = el.nextElementSibling;
            if (selector) {
                if ($(_next).is(selector)) nextEls.push(_next);
            } else nextEls.push(_next);
            el = _next;
        }
        return $(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            var el = this[0];
            if (selector) {
                if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) return $([ el.previousElementSibling ]);
                return $([]);
            }
            if (el.previousElementSibling) return $([ el.previousElementSibling ]);
            return $([]);
        }
        return $([]);
    }
    function prevAll(selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.previousElementSibling) {
            var _prev = el.previousElementSibling;
            if (selector) {
                if ($(_prev).is(selector)) prevEls.push(_prev);
            } else prevEls.push(_prev);
            el = _prev;
        }
        return $(prevEls);
    }
    function dom7_esm_parent(selector) {
        var parents = [];
        for (var i = 0; i < this.length; i += 1) if (this[i].parentNode !== null) if (selector) {
            if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return $(parents);
    }
    function parents(selector) {
        var parents = [];
        for (var i = 0; i < this.length; i += 1) {
            var _parent = this[i].parentNode;
            while (_parent) {
                if (selector) {
                    if ($(_parent).is(selector)) parents.push(_parent);
                } else parents.push(_parent);
                _parent = _parent.parentNode;
            }
        }
        return $(parents);
    }
    function closest(selector) {
        var closest = this;
        if (typeof selector === "undefined") return $([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        var foundElements = [];
        for (var i = 0; i < this.length; i += 1) {
            var found = this[i].querySelectorAll(selector);
            for (var j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return $(foundElements);
    }
    function children(selector) {
        var children = [];
        for (var i = 0; i < this.length; i += 1) {
            var childNodes = this[i].children;
            for (var j = 0; j < childNodes.length; j += 1) if (!selector || $(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return $(children);
    }
    function remove() {
        for (var i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    var noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (typeof args[0] === "undefined") {
                for (var i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else $(this[i]).trigger(name);
                return this;
            }
            return this.on.apply(this, [ name ].concat(args));
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    var Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((function(methodName) {
        Object.defineProperty($.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = $;
    function deleteProps(obj) {
        var object = obj;
        Object.keys(object).forEach((function(key) {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function nextTick(callback, delay) {
        if (delay === void 0) delay = 0;
        return setTimeout(callback, delay);
    }
    function now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        var window = ssr_window_esm_getWindow();
        var style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function getTranslate(el, axis) {
        if (axis === void 0) axis = "x";
        var window = ssr_window_esm_getWindow();
        var matrix;
        var curTransform;
        var transformMatrix;
        var curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((function(a) {
                return a.replace(",", ".");
            })).join(", ");
            transformMatrix = new window.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if (axis === "x") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if (axis === "y") if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
    }
    function isNode(node) {
        if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") return node instanceof HTMLElement;
        return node && (node.nodeType === 1 || node.nodeType === 11);
    }
    function utils_extend() {
        var to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
        var noExtend = [ "__proto__", "constructor", "prototype" ];
        for (var i = 1; i < arguments.length; i += 1) {
            var nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
                var keysArray = Object.keys(Object(nextSource)).filter((function(key) {
                    return noExtend.indexOf(key) < 0;
                }));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== void 0 && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function bindModuleMethods(instance, obj) {
        Object.keys(obj).forEach((function(key) {
            if (utils_isObject(obj[key])) Object.keys(obj[key]).forEach((function(subKey) {
                if (typeof obj[key][subKey] === "function") obj[key][subKey] = obj[key][subKey].bind(instance);
            }));
            instance[key] = obj[key];
        }));
    }
    function classesToSelector(classes) {
        if (classes === void 0) classes = "";
        return "." + classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".");
    }
    function createElementIfNotDefined($container, params, createElements, checkProps) {
        var document = getDocument();
        if (createElements) Object.keys(checkProps).forEach((function(key) {
            if (!params[key] && params.auto === true) {
                var element = document.createElement("div");
                element.className = checkProps[key];
                $container.append(element);
                params[key] = element;
            }
        }));
        return params;
    }
    var support;
    function calcSupport() {
        var window = ssr_window_esm_getWindow();
        var document = getDocument();
        return {
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            pointerEvents: !!window.PointerEvent && "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints >= 0,
            observer: function checkObserver() {
                return "MutationObserver" in window || "WebkitMutationObserver" in window;
            }(),
            passiveListener: function checkPassiveListener() {
                var supportsPassive = false;
                try {
                    var opts = Object.defineProperty({}, "passive", {
                        get: function get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    var device;
    function calcDevice(_temp) {
        var _ref = _temp === void 0 ? {} : _temp, userAgent = _ref.userAgent;
        var support = getSupport();
        var window = ssr_window_esm_getWindow();
        var platform = window.navigator.platform;
        var ua = userAgent || window.navigator.userAgent;
        var device = {
            ios: false,
            android: false
        };
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        var windows = platform === "Win32";
        var macos = platform === "MacIntel";
        var iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(screenWidth + "x" + screenHeight) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides) {
        if (overrides === void 0) overrides = {};
        if (!device) device = calcDevice(overrides);
        return device;
    }
    var browser;
    function calcBrowser() {
        var window = ssr_window_esm_getWindow();
        function isSafari() {
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isEdge: !!window.navigator.userAgent.match(/Edge/g),
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    var supportsResizeObserver = function supportsResizeObserver() {
        var window = ssr_window_esm_getWindow();
        return typeof window.ResizeObserver !== "undefined";
    };
    const resize_resize = {
        name: "resize",
        create: function create() {
            var swiper = this;
            utils_extend(swiper, {
                resize: {
                    observer: null,
                    createObserver: function createObserver() {
                        if (!swiper || swiper.destroyed || !swiper.initialized) return;
                        swiper.resize.observer = new ResizeObserver((function(entries) {
                            var width = swiper.width, height = swiper.height;
                            var newWidth = width;
                            var newHeight = height;
                            entries.forEach((function(_ref) {
                                var contentBoxSize = _ref.contentBoxSize, contentRect = _ref.contentRect, target = _ref.target;
                                if (target && target !== swiper.el) return;
                                newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                                newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                            }));
                            if (newWidth !== width || newHeight !== height) swiper.resize.resizeHandler();
                        }));
                        swiper.resize.observer.observe(swiper.el);
                    },
                    removeObserver: function removeObserver() {
                        if (swiper.resize.observer && swiper.resize.observer.unobserve && swiper.el) {
                            swiper.resize.observer.unobserve(swiper.el);
                            swiper.resize.observer = null;
                        }
                    },
                    resizeHandler: function resizeHandler() {
                        if (!swiper || swiper.destroyed || !swiper.initialized) return;
                        swiper.emit("beforeResize");
                        swiper.emit("resize");
                    },
                    orientationChangeHandler: function orientationChangeHandler() {
                        if (!swiper || swiper.destroyed || !swiper.initialized) return;
                        swiper.emit("orientationchange");
                    }
                }
            });
        },
        on: {
            init: function init(swiper) {
                var window = ssr_window_esm_getWindow();
                if (swiper.params.resizeObserver && supportsResizeObserver()) {
                    swiper.resize.createObserver();
                    return;
                }
                window.addEventListener("resize", swiper.resize.resizeHandler);
                window.addEventListener("orientationchange", swiper.resize.orientationChangeHandler);
            },
            destroy: function destroy(swiper) {
                var window = ssr_window_esm_getWindow();
                swiper.resize.removeObserver();
                window.removeEventListener("resize", swiper.resize.resizeHandler);
                window.removeEventListener("orientationchange", swiper.resize.orientationChangeHandler);
            }
        }
    };
    function _extends() {
        _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
            }
            return target;
        };
        return _extends.apply(this, arguments);
    }
    var Observer = {
        attach: function attach(target, options) {
            if (options === void 0) options = {};
            var window = ssr_window_esm_getWindow();
            var swiper = this;
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            var observer = new ObserverFunc((function(mutations) {
                if (mutations.length === 1) {
                    swiper.emit("observerUpdate", mutations[0]);
                    return;
                }
                var observerUpdate = function observerUpdate() {
                    swiper.emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: typeof options.attributes === "undefined" ? true : options.attributes,
                childList: typeof options.childList === "undefined" ? true : options.childList,
                characterData: typeof options.characterData === "undefined" ? true : options.characterData
            });
            swiper.observer.observers.push(observer);
        },
        init: function init() {
            var swiper = this;
            if (!swiper.support.observer || !swiper.params.observer) return;
            if (swiper.params.observeParents) {
                var containerParents = swiper.$el.parents();
                for (var i = 0; i < containerParents.length; i += 1) swiper.observer.attach(containerParents[i]);
            }
            swiper.observer.attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            swiper.observer.attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        },
        destroy: function destroy() {
            var swiper = this;
            swiper.observer.observers.forEach((function(observer) {
                observer.disconnect();
            }));
            swiper.observer.observers = [];
        }
    };
    const observer = {
        name: "observer",
        params: {
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        },
        create: function create() {
            var swiper = this;
            bindModuleMethods(swiper, {
                observer: _extends({}, Observer, {
                    observers: []
                })
            });
        },
        on: {
            init: function init(swiper) {
                swiper.observer.init();
            },
            destroy: function destroy(swiper) {
                swiper.observer.destroy();
            }
        }
    };
    const modular = {
        useParams: function useParams(instanceParams) {
            var instance = this;
            if (!instance.modules) return;
            Object.keys(instance.modules).forEach((function(moduleName) {
                var module = instance.modules[moduleName];
                if (module.params) utils_extend(instanceParams, module.params);
            }));
        },
        useModules: function useModules(modulesParams) {
            if (modulesParams === void 0) modulesParams = {};
            var instance = this;
            if (!instance.modules) return;
            Object.keys(instance.modules).forEach((function(moduleName) {
                var module = instance.modules[moduleName];
                var moduleParams = modulesParams[moduleName] || {};
                if (module.on && instance.on) Object.keys(module.on).forEach((function(moduleEventName) {
                    instance.on(moduleEventName, module.on[moduleEventName]);
                }));
                if (module.create) module.create.bind(instance)(moduleParams);
            }));
        }
    };
    const events_emitter = {
        on: function on(events, handler, priority) {
            var self = this;
            if (typeof handler !== "function") return self;
            var method = priority ? "unshift" : "push";
            events.split(" ").forEach((function(event) {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once: function once(events, handler, priority) {
            var self = this;
            if (typeof handler !== "function") return self;
            function onceHandler() {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny: function onAny(handler, priority) {
            var self = this;
            if (typeof handler !== "function") return self;
            var method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny: function offAny(handler) {
            var self = this;
            if (!self.eventsAnyListeners) return self;
            var index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off: function off(events, handler) {
            var self = this;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((function(event) {
                if (typeof handler === "undefined") self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach((function(eventHandler, index) {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit: function emit() {
            var self = this;
            if (!self.eventsListeners) return self;
            var events;
            var data;
            var context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            if (typeof args[0] === "string" || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            var eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((function(event) {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((function(eventHandler) {
                    eventHandler.apply(context, [ event ].concat(data));
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((function(eventHandler) {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        var swiper = this;
        var width;
        var height;
        var $el = swiper.$el;
        if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) width = swiper.params.width; else width = $el[0].clientWidth;
        if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) height = swiper.params.height; else height = $el[0].clientHeight;
        if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        utils_extend(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        var swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        var params = swiper.params;
        var $wrapperEl = swiper.$wrapperEl, swiperSize = swiper.size, rtl = swiper.rtlTranslate, wrongRTL = swiper.wrongRTL;
        var isVirtual = swiper.virtual && params.virtual.enabled;
        var previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        var slides = $wrapperEl.children("." + swiper.params.slideClass);
        var slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        var snapGrid = [];
        var slidesGrid = [];
        var slidesSizesGrid = [];
        var offsetBefore = params.slidesOffsetBefore;
        if (typeof offsetBefore === "function") offsetBefore = params.slidesOffsetBefore.call(swiper);
        var offsetAfter = params.slidesOffsetAfter;
        if (typeof offsetAfter === "function") offsetAfter = params.slidesOffsetAfter.call(swiper);
        var previousSnapGridLength = swiper.snapGrid.length;
        var previousSlidesGridLength = swiper.slidesGrid.length;
        var spaceBetween = params.spaceBetween;
        var slidePosition = -offsetBefore;
        var prevSlideSize = 0;
        var index = 0;
        if (typeof swiperSize === "undefined") return;
        if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        var slidesNumberEvenToRows;
        if (params.slidesPerColumn > 1) {
            if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) slidesNumberEvenToRows = slidesLength; else slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
            if (params.slidesPerView !== "auto" && params.slidesPerColumnFill === "row") slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
        }
        var slideSize;
        var slidesPerColumn = params.slidesPerColumn;
        var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
        var numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);
        for (var i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            var slide = slides.eq(i);
            if (params.slidesPerColumn > 1) {
                var newSlideOrderIndex = void 0;
                var column = void 0;
                var row = void 0;
                if (params.slidesPerColumnFill === "row" && params.slidesPerGroup > 1) {
                    var groupIndex = Math.floor(i / (params.slidesPerGroup * params.slidesPerColumn));
                    var slideIndexInGroup = i - params.slidesPerColumn * params.slidesPerGroup * groupIndex;
                    var columnsInGroup = groupIndex === 0 ? params.slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * slidesPerColumn * params.slidesPerGroup) / slidesPerColumn), params.slidesPerGroup);
                    row = Math.floor(slideIndexInGroup / columnsInGroup);
                    column = slideIndexInGroup - row * columnsInGroup + groupIndex * params.slidesPerGroup;
                    newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                    slide.css({
                        "-webkit-box-ordinal-group": newSlideOrderIndex,
                        "-moz-box-ordinal-group": newSlideOrderIndex,
                        "-ms-flex-order": newSlideOrderIndex,
                        "-webkit-order": newSlideOrderIndex,
                        order: newSlideOrderIndex
                    });
                } else if (params.slidesPerColumnFill === "column") {
                    column = Math.floor(i / slidesPerColumn);
                    row = i - column * slidesPerColumn;
                    if (column > numFullColumns || column === numFullColumns && row === slidesPerColumn - 1) {
                        row += 1;
                        if (row >= slidesPerColumn) {
                            row = 0;
                            column += 1;
                        }
                    }
                } else {
                    row = Math.floor(i / slidesPerRow);
                    column = i - row * slidesPerRow;
                }
                slide.css(getDirectionLabel("margin-top"), row !== 0 ? params.spaceBetween && params.spaceBetween + "px" : "");
            }
            if (slide.css("display") === "none") continue;
            if (params.slidesPerView === "auto") {
                var slideStyles = getComputedStyle(slide[0]);
                var currentTransform = slide[0].style.transform;
                var currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    var width = getDirectionPropertyValue(slideStyles, "width");
                    var paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    var paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    var marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    var marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    var boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && boxSizing === "border-box") slideSize = width + marginLeft + marginRight; else {
                        var _slide$ = slide[0], clientWidth = _slide$.clientWidth, offsetWidth = _slide$.offsetWidth;
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = slideSize + "px";
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        var newSlidesGrid;
        if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) $wrapperEl.css({
            width: swiper.virtualSize + params.spaceBetween + "px"
        });
        if (params.setWrapperSize) {
            var _$wrapperEl$css;
            $wrapperEl.css((_$wrapperEl$css = {}, _$wrapperEl$css[getDirectionLabel("width")] = swiper.virtualSize + params.spaceBetween + "px", 
            _$wrapperEl$css));
        }
        if (params.slidesPerColumn > 1) {
            var _$wrapperEl$css2;
            swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
            swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
            $wrapperEl.css((_$wrapperEl$css2 = {}, _$wrapperEl$css2[getDirectionLabel("width")] = swiper.virtualSize + params.spaceBetween + "px", 
            _$wrapperEl$css2));
            if (params.centeredSlides) {
                newSlidesGrid = [];
                for (var _i = 0; _i < snapGrid.length; _i += 1) {
                    var slidesGridItem = snapGrid[_i];
                    if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                    if (snapGrid[_i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
                }
                snapGrid = newSlidesGrid;
            }
        }
        if (!params.centeredSlides) {
            newSlidesGrid = [];
            for (var _i2 = 0; _i2 < snapGrid.length; _i2 += 1) {
                var _slidesGridItem = snapGrid[_i2];
                if (params.roundLengths) _slidesGridItem = Math.floor(_slidesGridItem);
                if (snapGrid[_i2] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(_slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (snapGrid.length === 0) snapGrid = [ 0 ];
        if (params.spaceBetween !== 0) {
            var _slides$filter$css;
            var key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter((function(_, slideIndex) {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css((_slides$filter$css = {}, _slides$filter$css[key] = spaceBetween + "px", 
            _slides$filter$css));
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            var allSlidesSize = 0;
            slidesSizesGrid.forEach((function(slideSizeValue) {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            var maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((function(snap) {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            var _allSlidesSize = 0;
            slidesSizesGrid.forEach((function(slideSizeValue) {
                _allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            _allSlidesSize -= params.spaceBetween;
            if (_allSlidesSize < swiperSize) {
                var allSlidesOffset = (swiperSize - _allSlidesSize) / 2;
                snapGrid.forEach((function(snap, snapIndex) {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach((function(snap, snapIndex) {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        utils_extend(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress || params.watchSlidesVisibility) swiper.updateSlidesOffset();
    }
    function updateAutoHeight(speed) {
        var swiper = this;
        var activeSlides = [];
        var isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        var newHeight = 0;
        var i;
        if (typeof speed === "number") swiper.setTransition(speed); else if (speed === true) swiper.setTransition(swiper.params.speed);
        var getSlideByIndex = function getSlideByIndex(index) {
            if (isVirtual) return swiper.slides.filter((function(el) {
                return parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index;
            }))[0];
            return swiper.slides.eq(index)[0];
        };
        if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) swiper.visibleSlides.each((function(slide) {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            var index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if (typeof activeSlides[i] !== "undefined") {
            var height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight) swiper.$wrapperEl.css("height", newHeight + "px");
    }
    function updateSlidesOffset() {
        var swiper = this;
        var slides = swiper.slides;
        for (var i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate) {
        if (translate === void 0) translate = this && this.translate || 0;
        var swiper = this;
        var params = swiper.params;
        var slides = swiper.slides, rtl = swiper.rtlTranslate;
        if (slides.length === 0) return;
        if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
        var offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (var i = 0; i < slides.length; i += 1) {
            var slide = slides[i];
            var slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            if (params.watchSlidesVisibility || params.centeredSlides && params.autoHeight) {
                var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                var slideAfter = slideBefore + swiper.slidesSizesGrid[i];
                var isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
                if (isVisible) {
                    swiper.visibleSlides.push(slide);
                    swiper.visibleSlidesIndexes.push(i);
                    slides.eq(i).addClass(params.slideVisibleClass);
                }
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        var swiper = this;
        if (typeof translate === "undefined") {
            var multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        var params = swiper.params;
        var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        var progress = swiper.progress, isBeginning = swiper.isBeginning, isEnd = swiper.isEnd;
        var wasBeginning = isBeginning;
        var wasEnd = isEnd;
        if (translatesDiff === 0) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        utils_extend(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.watchSlidesVisibility || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        var swiper = this;
        var slides = swiper.slides, params = swiper.params, $wrapperEl = swiper.$wrapperEl, activeIndex = swiper.activeIndex, realIndex = swiper.realIndex;
        var isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(params.slideActiveClass + " " + params.slideNextClass + " " + params.slidePrevClass + " " + params.slideDuplicateActiveClass + " " + params.slideDuplicateNextClass + " " + params.slideDuplicatePrevClass);
        var activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find("." + params.slideClass + '[data-swiper-slide-index="' + activeIndex + '"]'); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ')[data-swiper-slide-index="' + realIndex + '"]').addClass(params.slideDuplicateActiveClass); else $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + '[data-swiper-slide-index="' + realIndex + '"]').addClass(params.slideDuplicateActiveClass);
        var nextSlide = activeSlide.nextAll("." + params.slideClass).eq(0).addClass(params.slideNextClass);
        if (params.loop && nextSlide.length === 0) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        var prevSlide = activeSlide.prevAll("." + params.slideClass).eq(0).addClass(params.slidePrevClass);
        if (params.loop && prevSlide.length === 0) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ')[data-swiper-slide-index="' + nextSlide.attr("data-swiper-slide-index") + '"]').addClass(params.slideDuplicateNextClass); else $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + '[data-swiper-slide-index="' + nextSlide.attr("data-swiper-slide-index") + '"]').addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ')[data-swiper-slide-index="' + prevSlide.attr("data-swiper-slide-index") + '"]').addClass(params.slideDuplicatePrevClass); else $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + '[data-swiper-slide-index="' + prevSlide.attr("data-swiper-slide-index") + '"]').addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        var swiper = this;
        var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        var slidesGrid = swiper.slidesGrid, snapGrid = swiper.snapGrid, params = swiper.params, previousIndex = swiper.activeIndex, previousRealIndex = swiper.realIndex, previousSnapIndex = swiper.snapIndex;
        var activeIndex = newActiveIndex;
        var snapIndex;
        if (typeof activeIndex === "undefined") {
            for (var i = 0; i < slidesGrid.length; i += 1) if (typeof slidesGrid[i + 1] !== "undefined") {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            var skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        var realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        utils_extend(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        var swiper = this;
        var params = swiper.params;
        var slide = dom(e.target).closest("." + params.slideClass)[0];
        var slideFound = false;
        var slideIndex;
        if (slide) for (var i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis) {
        if (axis === void 0) axis = this.isHorizontal() ? "x" : "y";
        var swiper = this;
        var params = swiper.params, rtl = swiper.rtlTranslate, translate = swiper.translate, $wrapperEl = swiper.$wrapperEl;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        var currentTranslate = getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        var swiper = this;
        var rtl = swiper.rtlTranslate, params = swiper.params, $wrapperEl = swiper.$wrapperEl, wrapperEl = swiper.wrapperEl, progress = swiper.progress;
        var x = 0;
        var y = 0;
        var z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform("translate3d(" + x + "px, " + y + "px, " + z + "px)");
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        var newProgress;
        var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
        if (translate === void 0) translate = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (translateBounds === void 0) translateBounds = true;
        var swiper = this;
        var params = swiper.params, wrapperEl = swiper.wrapperEl;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        var minTranslate = swiper.minTranslate();
        var maxTranslate = swiper.maxTranslate();
        var newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            var isH = swiper.isHorizontal();
            if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else if (wrapperEl.scrollTo) {
                var _wrapperEl$scrollTo;
                wrapperEl.scrollTo((_wrapperEl$scrollTo = {}, _wrapperEl$scrollTo[isH ? "left" : "top"] = -newTranslate, 
                _wrapperEl$scrollTo.behavior = "smooth", _wrapperEl$scrollTo));
            } else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
            return true;
        }
        if (speed === 0) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        var swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionStart(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        var swiper = this;
        var activeIndex = swiper.activeIndex, params = swiper.params, previousIndex = swiper.previousIndex;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        var dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit("transitionStart");
        if (runCallbacks && activeIndex !== previousIndex) {
            if (dir === "reset") {
                swiper.emit("slideResetTransitionStart");
                return;
            }
            swiper.emit("slideChangeTransitionStart");
            if (dir === "next") swiper.emit("slideNextTransitionStart"); else swiper.emit("slidePrevTransitionStart");
        }
    }
    function transitionEnd_transitionEnd(runCallbacks, direction) {
        if (runCallbacks === void 0) runCallbacks = true;
        var swiper = this;
        var activeIndex = swiper.activeIndex, previousIndex = swiper.previousIndex, params = swiper.params;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        var dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit("transitionEnd");
        if (runCallbacks && activeIndex !== previousIndex) {
            if (dir === "reset") {
                swiper.emit("slideResetTransitionEnd");
                return;
            }
            swiper.emit("slideChangeTransitionEnd");
            if (dir === "next") swiper.emit("slideNextTransitionEnd"); else swiper.emit("slidePrevTransitionEnd");
        }
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index, speed, runCallbacks, internal, initial) {
        if (index === void 0) index = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (typeof index !== "number" && typeof index !== "string") throw new Error("The 'index' argument cannot have type other than 'number' or 'string'. [" + typeof index + "] given.");
        if (typeof index === "string") {
            var indexAsNumber = parseInt(index, 10);
            var isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error("The passed-in 'index' (string) couldn't be converted to 'number'. [" + index + "] given.");
            index = indexAsNumber;
        }
        var swiper = this;
        var slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        var params = swiper.params, snapGrid = swiper.snapGrid, slidesGrid = swiper.slidesGrid, previousIndex = swiper.previousIndex, activeIndex = swiper.activeIndex, rtl = swiper.rtlTranslate, wrapperEl = swiper.wrapperEl, enabled = swiper.enabled;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        var skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        var snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        var translate = -snapGrid[snapIndex];
        swiper.updateProgress(translate);
        if (params.normalizeSlideIndex) for (var i = 0; i < slidesGrid.length; i += 1) {
            var normalizedTranslate = -Math.floor(translate * 100);
            var normalizedGird = Math.floor(slidesGrid[i] * 100);
            var normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
            if (typeof slidesGrid[i + 1] !== "undefined") {
                if (normalizedTranslate >= normalizedGird && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGird) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGird && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGird) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        var direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if (params.effect !== "slide") swiper.setTranslate(translate);
            if (direction !== "reset") {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            var isH = swiper.isHorizontal();
            var t = -translate;
            if (rtl) t = wrapperEl.scrollWidth - wrapperEl.offsetWidth - t;
            if (speed === 0) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t; else if (wrapperEl.scrollTo) {
                var _wrapperEl$scrollTo;
                wrapperEl.scrollTo((_wrapperEl$scrollTo = {}, _wrapperEl$scrollTo[isH ? "left" : "top"] = t, 
                _wrapperEl$scrollTo.behavior = "smooth", _wrapperEl$scrollTo));
            } else wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
            return true;
        }
        if (speed === 0) {
            swiper.setTransition(0);
            swiper.setTranslate(translate);
            swiper.updateActiveIndex(slideIndex);
            swiper.updateSlidesClasses();
            swiper.emit("beforeTransitionStart", speed, internal);
            swiper.transitionStart(runCallbacks, direction);
            swiper.transitionEnd(runCallbacks, direction);
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(translate);
            swiper.updateActiveIndex(slideIndex);
            swiper.updateSlidesClasses();
            swiper.emit("beforeTransitionStart", speed, internal);
            swiper.transitionStart(runCallbacks, direction);
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                    swiper.onSlideToWrapperTransitionEnd = null;
                    delete swiper.onSlideToWrapperTransitionEnd;
                    swiper.transitionEnd(runCallbacks, direction);
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
            }
        }
        return true;
    }
    function slideToLoop(index, speed, runCallbacks, internal) {
        if (index === void 0) index = 0;
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        var swiper = this;
        var newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed, runCallbacks, internal) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        var swiper = this;
        var params = swiper.params, animating = swiper.animating, enabled = swiper.enabled;
        if (!enabled) return swiper;
        var increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed, runCallbacks, internal) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        var swiper = this;
        var params = swiper.params, animating = swiper.animating, snapGrid = swiper.snapGrid, slidesGrid = swiper.slidesGrid, rtlTranslate = swiper.rtlTranslate, enabled = swiper.enabled;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        var translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        var normalizedTranslate = normalize(translate);
        var normalizedSnapGrid = snapGrid.map((function(val) {
            return normalize(val);
        }));
        var prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if (typeof prevSnap === "undefined" && params.cssMode) snapGrid.forEach((function(snap) {
            if (!prevSnap && normalizedTranslate >= snap) prevSnap = snap;
        }));
        var prevIndex;
        if (typeof prevSnap !== "undefined") {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed, runCallbacks, internal) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        var swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed, runCallbacks, internal, threshold) {
        if (speed === void 0) speed = this.params.speed;
        if (runCallbacks === void 0) runCallbacks = true;
        if (threshold === void 0) threshold = .5;
        var swiper = this;
        var index = swiper.activeIndex;
        var skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        var snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            var currentSnap = swiper.snapGrid[snapIndex];
            var nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            var prevSnap = swiper.snapGrid[snapIndex - 1];
            var _currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (_currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        var swiper = this;
        var params = swiper.params, $wrapperEl = swiper.$wrapperEl;
        var slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        var slideToIndex = swiper.clickedIndex;
        var realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children("." + params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + params.slideDuplicateClass + ")").eq(0).index();
                nextTick((function() {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children("." + params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.' + params.slideDuplicateClass + ")").eq(0).index();
                nextTick((function() {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        var swiper = this;
        var document = getDocument();
        var params = swiper.params, $wrapperEl = swiper.$wrapperEl;
        $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass).remove();
        var slides = $wrapperEl.children("." + params.slideClass);
        if (params.loopFillGroupWithBlank) {
            var blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (var i = 0; i < blankSlidesNum; i += 1) {
                    var blankNode = dom(document.createElement("div")).addClass(params.slideClass + " " + params.slideBlankClass);
                    $wrapperEl.append(blankNode);
                }
                slides = $wrapperEl.children("." + params.slideClass);
            }
        }
        if (params.slidesPerView === "auto" && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length) swiper.loopedSlides = slides.length;
        var prependSlides = [];
        var appendSlides = [];
        slides.each((function(el, index) {
            var slide = dom(el);
            if (index < swiper.loopedSlides) appendSlides.push(el);
            if (index < slides.length && index >= slides.length - swiper.loopedSlides) prependSlides.push(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (var _i = 0; _i < appendSlides.length; _i += 1) $wrapperEl.append(dom(appendSlides[_i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (var _i2 = prependSlides.length - 1; _i2 >= 0; _i2 -= 1) $wrapperEl.prepend(dom(prependSlides[_i2].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        var swiper = this;
        swiper.emit("beforeLoopFix");
        var activeIndex = swiper.activeIndex, slides = swiper.slides, loopedSlides = swiper.loopedSlides, allowSlidePrev = swiper.allowSlidePrev, allowSlideNext = swiper.allowSlideNext, snapGrid = swiper.snapGrid, rtl = swiper.rtlTranslate;
        var newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        var snapTranslate = -snapGrid[activeIndex];
        var diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - loopedSlides * 3 + activeIndex;
            newIndex += loopedSlides;
            var slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && diff !== 0) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            var _slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (_slideChanged && diff !== 0) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        var swiper = this;
        var $wrapperEl = swiper.$wrapperEl, params = swiper.params, slides = swiper.slides;
        $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + ",." + params.slideClass + "." + params.slideBlankClass).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        var swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        var el = swiper.el;
        el.style.cursor = "move";
        el.style.cursor = moving ? "-webkit-grabbing" : "-webkit-grab";
        el.style.cursor = moving ? "-moz-grabbin" : "-moz-grab";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        var swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper.el.style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function appendSlide(slides) {
        var swiper = this;
        var $wrapperEl = swiper.$wrapperEl, params = swiper.params;
        if (params.loop) swiper.loopDestroy();
        if (typeof slides === "object" && "length" in slides) {
            for (var i = 0; i < slides.length; i += 1) if (slides[i]) $wrapperEl.append(slides[i]);
        } else $wrapperEl.append(slides);
        if (params.loop) swiper.loopCreate();
        if (!(params.observer && swiper.support.observer)) swiper.update();
    }
    function prependSlide(slides) {
        var swiper = this;
        var params = swiper.params, $wrapperEl = swiper.$wrapperEl, activeIndex = swiper.activeIndex;
        if (params.loop) swiper.loopDestroy();
        var newActiveIndex = activeIndex + 1;
        if (typeof slides === "object" && "length" in slides) {
            for (var i = 0; i < slides.length; i += 1) if (slides[i]) $wrapperEl.prepend(slides[i]);
            newActiveIndex = activeIndex + slides.length;
        } else $wrapperEl.prepend(slides);
        if (params.loop) swiper.loopCreate();
        if (!(params.observer && swiper.support.observer)) swiper.update();
        swiper.slideTo(newActiveIndex, 0, false);
    }
    function addSlide(index, slides) {
        var swiper = this;
        var $wrapperEl = swiper.$wrapperEl, params = swiper.params, activeIndex = swiper.activeIndex;
        var activeIndexBuffer = activeIndex;
        if (params.loop) {
            activeIndexBuffer -= swiper.loopedSlides;
            swiper.loopDestroy();
            swiper.slides = $wrapperEl.children("." + params.slideClass);
        }
        var baseLength = swiper.slides.length;
        if (index <= 0) {
            swiper.prependSlide(slides);
            return;
        }
        if (index >= baseLength) {
            swiper.appendSlide(slides);
            return;
        }
        var newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
        var slidesBuffer = [];
        for (var i = baseLength - 1; i >= index; i -= 1) {
            var currentSlide = swiper.slides.eq(i);
            currentSlide.remove();
            slidesBuffer.unshift(currentSlide);
        }
        if (typeof slides === "object" && "length" in slides) {
            for (var _i = 0; _i < slides.length; _i += 1) if (slides[_i]) $wrapperEl.append(slides[_i]);
            newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
        } else $wrapperEl.append(slides);
        for (var _i2 = 0; _i2 < slidesBuffer.length; _i2 += 1) $wrapperEl.append(slidesBuffer[_i2]);
        if (params.loop) swiper.loopCreate();
        if (!(params.observer && swiper.support.observer)) swiper.update();
        if (params.loop) swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false); else swiper.slideTo(newActiveIndex, 0, false);
    }
    function removeSlide(slidesIndexes) {
        var swiper = this;
        var params = swiper.params, $wrapperEl = swiper.$wrapperEl, activeIndex = swiper.activeIndex;
        var activeIndexBuffer = activeIndex;
        if (params.loop) {
            activeIndexBuffer -= swiper.loopedSlides;
            swiper.loopDestroy();
            swiper.slides = $wrapperEl.children("." + params.slideClass);
        }
        var newActiveIndex = activeIndexBuffer;
        var indexToRemove;
        if (typeof slidesIndexes === "object" && "length" in slidesIndexes) {
            for (var i = 0; i < slidesIndexes.length; i += 1) {
                indexToRemove = slidesIndexes[i];
                if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
            }
            newActiveIndex = Math.max(newActiveIndex, 0);
        } else {
            indexToRemove = slidesIndexes;
            if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
            if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
            newActiveIndex = Math.max(newActiveIndex, 0);
        }
        if (params.loop) swiper.loopCreate();
        if (!(params.observer && swiper.support.observer)) swiper.update();
        if (params.loop) swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false); else swiper.slideTo(newActiveIndex, 0, false);
    }
    function removeAllSlides() {
        var swiper = this;
        var slidesIndexes = [];
        for (var i = 0; i < swiper.slides.length; i += 1) slidesIndexes.push(i);
        swiper.removeSlide(slidesIndexes);
    }
    const manipulation = {
        appendSlide,
        prependSlide,
        addSlide,
        removeSlide,
        removeAllSlides
    };
    function closestElement(selector, base) {
        if (base === void 0) base = this;
        function __closestFrom(el) {
            if (!el || el === getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            var found = el.closest(selector);
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        var swiper = this;
        var document = getDocument();
        var window = ssr_window_esm_getWindow();
        var data = swiper.touchEventsData;
        var params = swiper.params, touches = swiper.touches, enabled = swiper.enabled;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        var e = event;
        if (e.originalEvent) e = e.originalEvent;
        var $targetEl = dom(e.target);
        if (params.touchEventsTarget === "wrapper") if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = e.type === "touchstart";
        if (!data.isTouchEvent && "which" in e && e.which === 3) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        var swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
        if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) $targetEl = dom(event.path[0]);
        var noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : "." + params.noSwipingClass;
        var isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
        var startX = touches.currentX;
        var startY = touches.currentY;
        var edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        var edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if (edgeSwipeDetection === "prevent") event.preventDefault(); else return;
        utils_extend(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if (e.type !== "touchstart") {
            var preventDefault = true;
            if ($targetEl.is(data.focusableElements)) preventDefault = false;
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            var shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        var document = getDocument();
        var swiper = this;
        var data = swiper.touchEventsData;
        var params = swiper.params, touches = swiper.touches, rtl = swiper.rtlTranslate, enabled = swiper.enabled;
        if (!enabled) return;
        var e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && e.type !== "touchmove") return;
        var targetTouch = e.type === "touchmove" && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        var pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
        var pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            swiper.allowClick = false;
            if (data.isTouched) {
                utils_extend(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        var diffX = touches.currentX - touches.startX;
        var diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) < swiper.params.threshold) return;
        if (typeof data.isScrolling === "undefined") {
            var touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if (typeof data.startMoving === "undefined") if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        var diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        var disableParentSwiper = true;
        var resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + Math.pow(-swiper.minTranslate() + data.startTranslate + diff, resistanceRatio);
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - Math.pow(swiper.maxTranslate() - data.startTranslate - diff, resistanceRatio);
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (params.freeMode) {
            if (data.velocities.length === 0) data.velocities.push({
                position: touches[swiper.isHorizontal() ? "startX" : "startY"],
                time: data.touchStartTime
            });
            data.velocities.push({
                position: touches[swiper.isHorizontal() ? "currentX" : "currentY"],
                time: now()
            });
        }
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        var swiper = this;
        var data = swiper.touchEventsData;
        var params = swiper.params, touches = swiper.touches, rtl = swiper.rtlTranslate, $wrapperEl = swiper.$wrapperEl, slidesGrid = swiper.slidesGrid, snapGrid = swiper.snapGrid, enabled = swiper.enabled;
        if (!enabled) return;
        var e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) swiper.setGrabCursor(false);
        var touchEndTime = now();
        var timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            swiper.updateClickedSlide(e);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = now();
        nextTick((function() {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        var currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (params.freeMode) {
            if (currentPos < -swiper.minTranslate()) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if (currentPos > -swiper.maxTranslate()) {
                if (swiper.slides.length < snapGrid.length) swiper.slideTo(snapGrid.length - 1); else swiper.slideTo(swiper.slides.length - 1);
                return;
            }
            if (params.freeModeMomentum) {
                if (data.velocities.length > 1) {
                    var lastMoveEvent = data.velocities.pop();
                    var velocityEvent = data.velocities.pop();
                    var distance = lastMoveEvent.position - velocityEvent.position;
                    var time = lastMoveEvent.time - velocityEvent.time;
                    swiper.velocity = distance / time;
                    swiper.velocity /= 2;
                    if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) swiper.velocity = 0;
                    if (time > 150 || now() - lastMoveEvent.time > 300) swiper.velocity = 0;
                } else swiper.velocity = 0;
                swiper.velocity *= params.freeModeMomentumVelocityRatio;
                data.velocities.length = 0;
                var momentumDuration = 1e3 * params.freeModeMomentumRatio;
                var momentumDistance = swiper.velocity * momentumDuration;
                var newPosition = swiper.translate + momentumDistance;
                if (rtl) newPosition = -newPosition;
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
                var needsLoopFix;
                if (newPosition < swiper.maxTranslate()) {
                    if (params.freeModeMomentumBounce) {
                        if (newPosition + swiper.maxTranslate() < -bounceAmount) newPosition = swiper.maxTranslate() - bounceAmount;
                        afterBouncePosition = swiper.maxTranslate();
                        doBounce = true;
                        data.allowMomentumBounce = true;
                    } else newPosition = swiper.maxTranslate();
                    if (params.loop && params.centeredSlides) needsLoopFix = true;
                } else if (newPosition > swiper.minTranslate()) {
                    if (params.freeModeMomentumBounce) {
                        if (newPosition - swiper.minTranslate() > bounceAmount) newPosition = swiper.minTranslate() + bounceAmount;
                        afterBouncePosition = swiper.minTranslate();
                        doBounce = true;
                        data.allowMomentumBounce = true;
                    } else newPosition = swiper.minTranslate();
                    if (params.loop && params.centeredSlides) needsLoopFix = true;
                } else if (params.freeModeSticky) {
                    var nextSlide;
                    for (var j = 0; j < snapGrid.length; j += 1) if (snapGrid[j] > -newPosition) {
                        nextSlide = j;
                        break;
                    }
                    if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === "next") newPosition = snapGrid[nextSlide]; else newPosition = snapGrid[nextSlide - 1];
                    newPosition = -newPosition;
                }
                if (needsLoopFix) swiper.once("transitionEnd", (function() {
                    swiper.loopFix();
                }));
                if (swiper.velocity !== 0) {
                    if (rtl) momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity); else momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
                    if (params.freeModeSticky) {
                        var moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
                        var currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
                        if (moveDistance < currentSlideSize) momentumDuration = params.speed; else if (moveDistance < 2 * currentSlideSize) momentumDuration = params.speed * 1.5; else momentumDuration = params.speed * 2.5;
                    }
                } else if (params.freeModeSticky) {
                    swiper.slideToClosest();
                    return;
                }
                if (params.freeModeMomentumBounce && doBounce) {
                    swiper.updateProgress(afterBouncePosition);
                    swiper.setTransition(momentumDuration);
                    swiper.setTranslate(newPosition);
                    swiper.transitionStart(true, swiper.swipeDirection);
                    swiper.animating = true;
                    $wrapperEl.transitionEnd((function() {
                        if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
                        swiper.emit("momentumBounce");
                        swiper.setTransition(params.speed);
                        setTimeout((function() {
                            swiper.setTranslate(afterBouncePosition);
                            $wrapperEl.transitionEnd((function() {
                                if (!swiper || swiper.destroyed) return;
                                swiper.transitionEnd();
                            }));
                        }), 0);
                    }));
                } else if (swiper.velocity) {
                    swiper.updateProgress(newPosition);
                    swiper.setTransition(momentumDuration);
                    swiper.setTranslate(newPosition);
                    swiper.transitionStart(true, swiper.swipeDirection);
                    if (!swiper.animating) {
                        swiper.animating = true;
                        $wrapperEl.transitionEnd((function() {
                            if (!swiper || swiper.destroyed) return;
                            swiper.transitionEnd();
                        }));
                    }
                } else {
                    swiper.emit("_freeModeNoMomentumRelease");
                    swiper.updateProgress(newPosition);
                }
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            } else if (params.freeModeSticky) {
                swiper.slideToClosest();
                return;
            } else if (params.freeMode) swiper.emit("_freeModeNoMomentumRelease");
            if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
                swiper.updateProgress();
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            return;
        }
        var stopIndex = 0;
        var groupSize = swiper.slidesSizesGrid[0];
        for (var i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            var _increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if (typeof slidesGrid[i + _increment] !== "undefined") {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + _increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + _increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        var ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        var increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if (swiper.swipeDirection === "next") if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
            if (swiper.swipeDirection === "prev") if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            var isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if (swiper.swipeDirection === "next") swiper.slideTo(stopIndex + increment);
                if (swiper.swipeDirection === "prev") swiper.slideTo(stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        var swiper = this;
        var params = swiper.params, el = swiper.el;
        if (el && el.offsetWidth === 0) return;
        if (params.breakpoints) swiper.setBreakpoint();
        var allowSlideNext = swiper.allowSlideNext, allowSlidePrev = swiper.allowSlidePrev, snapGrid = swiper.snapGrid;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        var swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        var swiper = this;
        var wrapperEl = swiper.wrapperEl, rtlTranslate = swiper.rtlTranslate, enabled = swiper.enabled;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) if (rtlTranslate) swiper.translate = wrapperEl.scrollWidth - wrapperEl.offsetWidth - wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (swiper.translate === -0) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        var newProgress;
        var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (translatesDiff === 0) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    var dummyEventAttached = false;
    function dummyEventListener() {}
    function attachEvents() {
        var swiper = this;
        var document = getDocument();
        var params = swiper.params, touchEvents = swiper.touchEvents, el = swiper.el, wrapperEl = swiper.wrapperEl, device = swiper.device, support = swiper.support;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        var capture = !!params.nested;
        if (!support.touch && support.pointerEvents) {
            el.addEventListener(touchEvents.start, swiper.onTouchStart, false);
            document.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
            document.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
        } else {
            if (support.touch) {
                var passiveListener = touchEvents.start === "touchstart" && support.passiveListener && params.passiveListeners ? {
                    passive: true,
                    capture: false
                } : false;
                el.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
                el.addEventListener(touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                    passive: false,
                    capture
                } : capture);
                el.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
                if (touchEvents.cancel) el.addEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
                if (!dummyEventAttached) {
                    document.addEventListener("touchstart", dummyEventListener);
                    dummyEventAttached = true;
                }
            }
            if (params.simulateTouch && !device.ios && !device.android || params.simulateTouch && !support.touch && device.ios) {
                el.addEventListener("mousedown", swiper.onTouchStart, false);
                document.addEventListener("mousemove", swiper.onTouchMove, capture);
                document.addEventListener("mouseup", swiper.onTouchEnd, false);
            }
        }
        if (params.preventClicks || params.preventClicksPropagation) el.addEventListener("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl.addEventListener("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper.on(device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper.on("observerUpdate", onResize, true);
    }
    function detachEvents() {
        var swiper = this;
        var document = getDocument();
        var params = swiper.params, touchEvents = swiper.touchEvents, el = swiper.el, wrapperEl = swiper.wrapperEl, device = swiper.device, support = swiper.support;
        var capture = !!params.nested;
        if (!support.touch && support.pointerEvents) {
            el.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
            document.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
            document.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
        } else {
            if (support.touch) {
                var passiveListener = touchEvents.start === "onTouchStart" && support.passiveListener && params.passiveListeners ? {
                    passive: true,
                    capture: false
                } : false;
                el.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
                el.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
                el.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);
                if (touchEvents.cancel) el.removeEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
            }
            if (params.simulateTouch && !device.ios && !device.android || params.simulateTouch && !support.touch && device.ios) {
                el.removeEventListener("mousedown", swiper.onTouchStart, false);
                document.removeEventListener("mousemove", swiper.onTouchMove, capture);
                document.removeEventListener("mouseup", swiper.onTouchEnd, false);
            }
        }
        if (params.preventClicks || params.preventClicksPropagation) el.removeEventListener("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl.removeEventListener("scroll", swiper.onScroll);
        swiper.off(device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize);
    }
    const events = {
        attachEvents,
        detachEvents
    };
    function setBreakpoint() {
        var swiper = this;
        var activeIndex = swiper.activeIndex, initialized = swiper.initialized, _swiper$loopedSlides = swiper.loopedSlides, loopedSlides = _swiper$loopedSlides === void 0 ? 0 : _swiper$loopedSlides, params = swiper.params, $el = swiper.$el;
        var breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
        var breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        var breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        if (breakpointOnlyParams) [ "slidesPerView", "spaceBetween", "slidesPerGroup", "slidesPerGroupSkip", "slidesPerColumn" ].forEach((function(param) {
            var paramValue = breakpointOnlyParams[param];
            if (typeof paramValue === "undefined") return;
            if (param === "slidesPerView" && (paramValue === "AUTO" || paramValue === "auto")) breakpointOnlyParams[param] = "auto"; else if (param === "slidesPerView") breakpointOnlyParams[param] = parseFloat(paramValue); else breakpointOnlyParams[param] = parseInt(paramValue, 10);
        }));
        var breakpointParams = breakpointOnlyParams || swiper.originalParams;
        var wasMultiRow = params.slidesPerColumn > 1;
        var isMultiRow = breakpointParams.slidesPerColumn > 1;
        var wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(params.containerModifierClass + "multirow " + params.containerModifierClass + "multirow-column");
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(params.containerModifierClass + "multirow");
            if (breakpointParams.slidesPerColumnFill && breakpointParams.slidesPerColumnFill === "column" || !breakpointParams.slidesPerColumnFill && params.slidesPerColumnFill === "column") $el.addClass(params.containerModifierClass + "multirow-column");
            swiper.emitContainerClasses();
        }
        var directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        var needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        var isEnabled = swiper.params.enabled;
        utils_extend(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base, containerEl) {
        if (base === void 0) base = "window";
        if (!breakpoints || base === "container" && !containerEl) return;
        var breakpoint = false;
        var window = ssr_window_esm_getWindow();
        var currentHeight = base === "window" ? window.innerHeight : containerEl.clientHeight;
        var points = Object.keys(breakpoints).map((function(point) {
            if (typeof point === "string" && point.indexOf("@") === 0) {
                var minRatio = parseFloat(point.substr(1));
                var value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort((function(a, b) {
            return parseInt(a.value, 10) - parseInt(b.value, 10);
        }));
        for (var i = 0; i < points.length; i += 1) {
            var _points$i = points[i], point = _points$i.point, value = _points$i.value;
            if (base === "window") {
                if (window.matchMedia("(min-width: " + value + "px)").matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        var resultClasses = [];
        entries.forEach((function(item) {
            if (typeof item === "object") Object.keys(item).forEach((function(classNames) {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if (typeof item === "string") resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        var swiper = this;
        var classNames = swiper.classNames, params = swiper.params, rtl = swiper.rtl, $el = swiper.$el, device = swiper.device, support = swiper.support;
        var suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": support.pointerEvents && !support.touch
        }, {
            "free-mode": params.freeMode
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            multirow: params.slidesPerColumn > 1
        }, {
            "multirow-column": params.slidesPerColumn > 1 && params.slidesPerColumnFill === "column"
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        } ], params.containerModifierClass);
        classNames.push.apply(classNames, suffixes);
        $el.addClass([].concat(classNames).join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        var swiper = this;
        var $el = swiper.$el, classNames = swiper.classNames;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        var window = ssr_window_esm_getWindow();
        var image;
        function onReady() {
            if (callback) callback();
        }
        var isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        var swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if (typeof swiper === "undefined" || swiper === null || !swiper || swiper.destroyed) return;
            if (swiper.imagesLoaded !== void 0) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (var i = 0; i < swiper.imagesToLoad.length; i += 1) {
            var imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        var swiper = this;
        var params = swiper.params;
        var wasLocked = swiper.isLocked;
        var lastSlidePosition = swiper.slides.length > 0 && params.slidesOffsetBefore + params.spaceBetween * (swiper.slides.length - 1) + swiper.slides[0].offsetWidth * swiper.slides.length;
        if (params.slidesOffsetBefore && params.slidesOffsetAfter && lastSlidePosition) swiper.isLocked = lastSlidePosition <= swiper.size; else swiper.isLocked = swiper.snapGrid.length === 1;
        swiper.allowSlideNext = !swiper.isLocked;
        swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
        if (wasLocked && wasLocked !== swiper.isLocked) {
            swiper.isEnd = false;
            if (swiper.navigation) swiper.navigation.update();
        }
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "container",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: false,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        freeMode: false,
        freeModeMomentum: true,
        freeModeMomentumRatio: 1,
        freeModeMomentumBounce: true,
        freeModeMomentumBounceRatio: 1,
        freeModeMomentumVelocityRatio: 1,
        freeModeSticky: false,
        freeModeMinimumVelocity: .02,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerColumnFill: "column",
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: false,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        watchSlidesVisibility: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        containerModifierClass: "swiper-container-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }
    var prototypes = {
        modular,
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        manipulation,
        events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    var extendedDefaults = {};
    var Swiper = function() {
        function Swiper() {
            var el;
            var params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") params = args[0]; else {
                el = args[0];
                params = args[1];
            }
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                var swipers = [];
                dom(params.el).each((function(containerEl) {
                    var newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new Swiper(newParams));
                }));
                return swipers;
            }
            var swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            if (typeof swiper.modules === "undefined") swiper.modules = {};
            Object.keys(swiper.modules).forEach((function(moduleName) {
                var module = swiper.modules[moduleName];
                if (module.params) {
                    var moduleParamName = Object.keys(module.params)[0];
                    var moduleParams = module.params[moduleParamName];
                    if (typeof moduleParams !== "object" || moduleParams === null) return;
                    if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) params[moduleParamName] = {
                        auto: true
                    };
                    if (!(moduleParamName in params && "enabled" in moduleParams)) return;
                    if (params[moduleParamName] === true) params[moduleParamName] = {
                        enabled: true
                    };
                    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
                    if (!params[moduleParamName]) params[moduleParamName] = {
                        enabled: false
                    };
                }
            }));
            var swiperParams = utils_extend({}, defaults);
            swiper.useParams(swiperParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((function(eventName) {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            utils_extend(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal: function isHorizontal() {
                    return swiper.params.direction === "horizontal";
                },
                isVertical: function isVertical() {
                    return swiper.params.direction === "vertical";
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    var touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    var desktop = [ "mousedown", "mousemove", "mouseup" ];
                    if (swiper.support.pointerEvents) desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.useModules();
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        var _proto = Swiper.prototype;
        _proto.enable = function enable() {
            var swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        };
        _proto.disable = function disable() {
            var swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        };
        _proto.setProgress = function setProgress(progress, speed) {
            var swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            var min = swiper.minTranslate();
            var max = swiper.maxTranslate();
            var current = (max - min) * progress + min;
            swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        };
        _proto.emitContainerClasses = function emitContainerClasses() {
            var swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            var classes = swiper.el.className.split(" ").filter((function(className) {
                return className.indexOf("swiper-container") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
            }));
            swiper.emit("_containerClasses", classes.join(" "));
        };
        _proto.getSlideClasses = function getSlideClasses(slideEl) {
            var swiper = this;
            return slideEl.className.split(" ").filter((function(className) {
                return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
            })).join(" ");
        };
        _proto.emitSlidesClasses = function emitSlidesClasses() {
            var swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            var updates = [];
            swiper.slides.each((function(slideEl) {
                var classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        };
        _proto.slidesPerViewDynamic = function slidesPerViewDynamic() {
            var swiper = this;
            var params = swiper.params, slides = swiper.slides, slidesGrid = swiper.slidesGrid, swiperSize = swiper.size, activeIndex = swiper.activeIndex;
            var spv = 1;
            if (params.centeredSlides) {
                var slideSize = slides[activeIndex].swiperSlideSize;
                var breakLoop;
                for (var i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (var _i = activeIndex - 1; _i >= 0; _i -= 1) if (slides[_i] && !breakLoop) {
                    slideSize += slides[_i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else for (var _i2 = activeIndex + 1; _i2 < slides.length; _i2 += 1) if (slidesGrid[_i2] - slidesGrid[activeIndex] < swiperSize) spv += 1;
            return spv;
        };
        _proto.update = function update() {
            var swiper = this;
            if (!swiper || swiper.destroyed) return;
            var snapGrid = swiper.snapGrid, params = swiper.params;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                var translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
                var newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            var translated;
            if (swiper.params.freeMode) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if ((swiper.params.slidesPerView === "auto" || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        };
        _proto.changeDirection = function changeDirection(newDirection, needUpdate) {
            if (needUpdate === void 0) needUpdate = true;
            var swiper = this;
            var currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
            if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") return swiper;
            swiper.$el.removeClass("" + swiper.params.containerModifierClass + currentDirection).addClass("" + swiper.params.containerModifierClass + newDirection);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((function(slideEl) {
                if (newDirection === "vertical") slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        };
        _proto.mount = function mount(el) {
            var swiper = this;
            if (swiper.mounted) return true;
            var $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            var getWrapperSelector = function getWrapperSelector() {
                return "." + (swiper.params.wrapperClass || "").trim().split(" ").join(".");
            };
            var getWrapper = function getWrapper() {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    var res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = function(options) {
                        return $el.children(options);
                    };
                    return res;
                }
                return $el.children(getWrapperSelector());
            };
            var $wrapperEl = getWrapper();
            if ($wrapperEl.length === 0 && swiper.params.createElements) {
                var document = getDocument();
                var wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children("." + swiper.params.slideClass).each((function(slideEl) {
                    $wrapperEl.append(slideEl);
                }));
            }
            utils_extend(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
                rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
                wrongRTL: $wrapperEl.css("display") === "-webkit-box"
            });
            return true;
        };
        _proto.init = function init(el) {
            var swiper = this;
            if (swiper.initialized) return swiper;
            var mounted = swiper.mount(el);
            if (mounted === false) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        };
        _proto.destroy = function destroy(deleteInstance, cleanStyles) {
            if (deleteInstance === void 0) deleteInstance = true;
            if (cleanStyles === void 0) cleanStyles = true;
            var swiper = this;
            var params = swiper.params, $el = swiper.$el, $wrapperEl = swiper.$wrapperEl, slides = swiper.slides;
            if (typeof swiper.params === "undefined" || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((function(eventName) {
                swiper.off(eventName);
            }));
            if (deleteInstance !== false) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        };
        Swiper.extendDefaults = function extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        };
        Swiper.installModule = function installModule(module) {
            if (!Swiper.prototype.modules) Swiper.prototype.modules = {};
            var name = module.name || Object.keys(Swiper.prototype.modules).length + "_" + now();
            Swiper.prototype.modules[name] = module;
        };
        Swiper.use = function use(module) {
            if (Array.isArray(module)) {
                module.forEach((function(m) {
                    return Swiper.installModule(m);
                }));
                return Swiper;
            }
            Swiper.installModule(module);
            return Swiper;
        };
        _createClass(Swiper, null, [ {
            key: "extendedDefaults",
            get: function get() {
                return extendedDefaults;
            }
        }, {
            key: "defaults",
            get: function get() {
                return defaults;
            }
        } ]);
        return Swiper;
    }();
    Object.keys(prototypes).forEach((function(prototypeGroup) {
        Object.keys(prototypes[prototypeGroup]).forEach((function(protoMethod) {
            Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    Swiper.use([ resize_resize, observer ]);
    const core_class = Swiper;
    function autoplay_extends() {
        autoplay_extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
            }
            return target;
        };
        return autoplay_extends.apply(this, arguments);
    }
    var Autoplay = {
        run: function run() {
            var swiper = this;
            var $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
            var delay = swiper.params.autoplay.delay;
            if ($activeSlideEl.attr("data-swiper-autoplay")) delay = $activeSlideEl.attr("data-swiper-autoplay") || swiper.params.autoplay.delay;
            clearTimeout(swiper.autoplay.timeout);
            swiper.autoplay.timeout = nextTick((function() {
                var autoplayResult;
                if (swiper.params.autoplay.reverseDirection) if (swiper.params.loop) {
                    swiper.loopFix();
                    autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                    swiper.emit("autoplay");
                } else if (!swiper.isBeginning) {
                    autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                    swiper.emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
                    swiper.emit("autoplay");
                } else swiper.autoplay.stop(); else if (swiper.params.loop) {
                    swiper.loopFix();
                    autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
                    swiper.emit("autoplay");
                } else if (!swiper.isEnd) {
                    autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
                    swiper.emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
                    swiper.emit("autoplay");
                } else swiper.autoplay.stop();
                if (swiper.params.cssMode && swiper.autoplay.running) swiper.autoplay.run(); else if (autoplayResult === false) swiper.autoplay.run();
            }), delay);
        },
        start: function start() {
            var swiper = this;
            if (typeof swiper.autoplay.timeout !== "undefined") return false;
            if (swiper.autoplay.running) return false;
            swiper.autoplay.running = true;
            swiper.emit("autoplayStart");
            swiper.autoplay.run();
            return true;
        },
        stop: function stop() {
            var swiper = this;
            if (!swiper.autoplay.running) return false;
            if (typeof swiper.autoplay.timeout === "undefined") return false;
            if (swiper.autoplay.timeout) {
                clearTimeout(swiper.autoplay.timeout);
                swiper.autoplay.timeout = void 0;
            }
            swiper.autoplay.running = false;
            swiper.emit("autoplayStop");
            return true;
        },
        pause: function pause(speed) {
            var swiper = this;
            if (!swiper.autoplay.running) return;
            if (swiper.autoplay.paused) return;
            if (swiper.autoplay.timeout) clearTimeout(swiper.autoplay.timeout);
            swiper.autoplay.paused = true;
            if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
                swiper.autoplay.paused = false;
                swiper.autoplay.run();
            } else [ "transitionend", "webkitTransitionEnd" ].forEach((function(event) {
                swiper.$wrapperEl[0].addEventListener(event, swiper.autoplay.onTransitionEnd);
            }));
        },
        onVisibilityChange: function onVisibilityChange() {
            var swiper = this;
            var document = getDocument();
            if (document.visibilityState === "hidden" && swiper.autoplay.running) swiper.autoplay.pause();
            if (document.visibilityState === "visible" && swiper.autoplay.paused) {
                swiper.autoplay.run();
                swiper.autoplay.paused = false;
            }
        },
        onTransitionEnd: function onTransitionEnd(e) {
            var swiper = this;
            if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
            if (e.target !== swiper.$wrapperEl[0]) return;
            [ "transitionend", "webkitTransitionEnd" ].forEach((function(event) {
                swiper.$wrapperEl[0].removeEventListener(event, swiper.autoplay.onTransitionEnd);
            }));
            swiper.autoplay.paused = false;
            if (!swiper.autoplay.running) swiper.autoplay.stop(); else swiper.autoplay.run();
        },
        onMouseEnter: function onMouseEnter() {
            var swiper = this;
            if (swiper.params.autoplay.disableOnInteraction) swiper.autoplay.stop(); else swiper.autoplay.pause();
            [ "transitionend", "webkitTransitionEnd" ].forEach((function(event) {
                swiper.$wrapperEl[0].removeEventListener(event, swiper.autoplay.onTransitionEnd);
            }));
        },
        onMouseLeave: function onMouseLeave() {
            var swiper = this;
            if (swiper.params.autoplay.disableOnInteraction) return;
            swiper.autoplay.paused = false;
            swiper.autoplay.run();
        },
        attachMouseEvents: function attachMouseEvents() {
            var swiper = this;
            if (swiper.params.autoplay.pauseOnMouseEnter) {
                swiper.$el.on("mouseenter", swiper.autoplay.onMouseEnter);
                swiper.$el.on("mouseleave", swiper.autoplay.onMouseLeave);
            }
        },
        detachMouseEvents: function detachMouseEvents() {
            var swiper = this;
            swiper.$el.off("mouseenter", swiper.autoplay.onMouseEnter);
            swiper.$el.off("mouseleave", swiper.autoplay.onMouseLeave);
        }
    };
    const autoplay = {
        name: "autoplay",
        params: {
            autoplay: {
                enabled: false,
                delay: 3e3,
                waitForTransition: true,
                disableOnInteraction: true,
                stopOnLastSlide: false,
                reverseDirection: false,
                pauseOnMouseEnter: false
            }
        },
        create: function create() {
            var swiper = this;
            bindModuleMethods(swiper, {
                autoplay: autoplay_extends({}, Autoplay, {
                    running: false,
                    paused: false
                })
            });
        },
        on: {
            init: function init(swiper) {
                if (swiper.params.autoplay.enabled) {
                    swiper.autoplay.start();
                    var document = getDocument();
                    document.addEventListener("visibilitychange", swiper.autoplay.onVisibilityChange);
                    swiper.autoplay.attachMouseEvents();
                }
            },
            beforeTransitionStart: function beforeTransitionStart(swiper, speed, internal) {
                if (swiper.autoplay.running) if (internal || !swiper.params.autoplay.disableOnInteraction) swiper.autoplay.pause(speed); else swiper.autoplay.stop();
            },
            sliderFirstMove: function sliderFirstMove(swiper) {
                if (swiper.autoplay.running) if (swiper.params.autoplay.disableOnInteraction) swiper.autoplay.stop(); else swiper.autoplay.pause();
            },
            touchEnd: function touchEnd(swiper) {
                if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) swiper.autoplay.run();
            },
            destroy: function destroy(swiper) {
                swiper.autoplay.detachMouseEvents();
                if (swiper.autoplay.running) swiper.autoplay.stop();
                var document = getDocument();
                document.removeEventListener("visibilitychange", swiper.autoplay.onVisibilityChange);
            }
        }
    };
    function navigation_extends() {
        navigation_extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
            }
            return target;
        };
        return navigation_extends.apply(this, arguments);
    }
    var Navigation = {
        toggleEl: function toggleEl($el, disabled) {
            $el[disabled ? "addClass" : "removeClass"](this.params.navigation.disabledClass);
            if ($el[0] && $el[0].tagName === "BUTTON") $el[0].disabled = disabled;
        },
        update: function update() {
            var swiper = this;
            var params = swiper.params.navigation;
            var toggleEl = swiper.navigation.toggleEl;
            if (swiper.params.loop) return;
            var _swiper$navigation = swiper.navigation, $nextEl = _swiper$navigation.$nextEl, $prevEl = _swiper$navigation.$prevEl;
            if ($prevEl && $prevEl.length > 0) {
                if (swiper.isBeginning) toggleEl($prevEl, true); else toggleEl($prevEl, false);
                if (swiper.params.watchOverflow && swiper.enabled) $prevEl[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
            if ($nextEl && $nextEl.length > 0) {
                if (swiper.isEnd) toggleEl($nextEl, true); else toggleEl($nextEl, false);
                if (swiper.params.watchOverflow && swiper.enabled) $nextEl[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        },
        onPrevClick: function onPrevClick(e) {
            var swiper = this;
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop) return;
            swiper.slidePrev();
        },
        onNextClick: function onNextClick(e) {
            var swiper = this;
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop) return;
            swiper.slideNext();
        },
        init: function init() {
            var swiper = this;
            var params = swiper.params.navigation;
            swiper.params.navigation = createElementIfNotDefined(swiper.$el, swiper.params.navigation, swiper.params.createElements, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            var $nextEl;
            var $prevEl;
            if (params.nextEl) {
                $nextEl = dom(params.nextEl);
                if (swiper.params.uniqueNavElements && typeof params.nextEl === "string" && $nextEl.length > 1 && swiper.$el.find(params.nextEl).length === 1) $nextEl = swiper.$el.find(params.nextEl);
            }
            if (params.prevEl) {
                $prevEl = dom(params.prevEl);
                if (swiper.params.uniqueNavElements && typeof params.prevEl === "string" && $prevEl.length > 1 && swiper.$el.find(params.prevEl).length === 1) $prevEl = swiper.$el.find(params.prevEl);
            }
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", swiper.navigation.onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", swiper.navigation.onPrevClick);
            utils_extend(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        },
        destroy: function destroy() {
            var swiper = this;
            var _swiper$navigation2 = swiper.navigation, $nextEl = _swiper$navigation2.$nextEl, $prevEl = _swiper$navigation2.$prevEl;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", swiper.navigation.onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", swiper.navigation.onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
    };
    const navigation = {
        name: "navigation",
        params: {
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock"
            }
        },
        create: function create() {
            var swiper = this;
            bindModuleMethods(swiper, {
                navigation: navigation_extends({}, Navigation)
            });
        },
        on: {
            init: function init(swiper) {
                swiper.navigation.init();
                swiper.navigation.update();
            },
            toEdge: function toEdge(swiper) {
                swiper.navigation.update();
            },
            fromEdge: function fromEdge(swiper) {
                swiper.navigation.update();
            },
            destroy: function destroy(swiper) {
                swiper.navigation.destroy();
            },
            "enable disable": function enableDisable(swiper) {
                var _swiper$navigation3 = swiper.navigation, $nextEl = _swiper$navigation3.$nextEl, $prevEl = _swiper$navigation3.$prevEl;
                if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
                if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            },
            click: function click(swiper, e) {
                var _swiper$navigation4 = swiper.navigation, $nextEl = _swiper$navigation4.$nextEl, $prevEl = _swiper$navigation4.$prevEl;
                var targetEl = e.target;
                if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                    if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                    var isHidden;
                    if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                    if (isHidden === true) swiper.emit("navigationShow"); else swiper.emit("navigationHide");
                    if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                    if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
                }
            }
        }
    };
    function pagination_extends() {
        pagination_extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
            }
            return target;
        };
        return pagination_extends.apply(this, arguments);
    }
    var Pagination = {
        update: function update() {
            var swiper = this;
            var rtl = swiper.rtl;
            var params = swiper.params.pagination;
            if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
            var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            var $el = swiper.pagination.$el;
            var current;
            var total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
                if (current > slidesLength - 1 - swiper.loopedSlides * 2) current -= slidesLength - swiper.loopedSlides * 2;
                if (current > total - 1) current -= total;
                if (current < 0 && swiper.params.paginationType !== "bullets") current = total + current;
            } else if (typeof swiper.snapIndex !== "undefined") current = swiper.snapIndex; else current = swiper.activeIndex || 0;
            if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                var bullets = swiper.pagination.bullets;
                var firstIndex;
                var lastIndex;
                var midIndex;
                if (params.dynamicBullets) {
                    swiper.pagination.bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
                    $el.css(swiper.isHorizontal() ? "width" : "height", swiper.pagination.bulletSize * (params.dynamicMainBullets + 4) + "px");
                    if (params.dynamicMainBullets > 1 && swiper.previousIndex !== void 0) {
                        swiper.pagination.dynamicBulletIndex += current - swiper.previousIndex;
                        if (swiper.pagination.dynamicBulletIndex > params.dynamicMainBullets - 1) swiper.pagination.dynamicBulletIndex = params.dynamicMainBullets - 1; else if (swiper.pagination.dynamicBulletIndex < 0) swiper.pagination.dynamicBulletIndex = 0;
                    }
                    firstIndex = current - swiper.pagination.dynamicBulletIndex;
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.removeClass(params.bulletActiveClass + " " + params.bulletActiveClass + "-next " + params.bulletActiveClass + "-next-next " + params.bulletActiveClass + "-prev " + params.bulletActiveClass + "-prev-prev " + params.bulletActiveClass + "-main");
                if ($el.length > 1) bullets.each((function(bullet) {
                    var $bullet = dom(bullet);
                    var bulletIndex = $bullet.index();
                    if (bulletIndex === current) $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) $bullet.addClass(params.bulletActiveClass + "-main");
                        if (bulletIndex === firstIndex) $bullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
                        if (bulletIndex === lastIndex) $bullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
                    }
                })); else {
                    var $bullet = bullets.eq(current);
                    var bulletIndex = $bullet.index();
                    $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        var $firstDisplayedBullet = bullets.eq(firstIndex);
                        var $lastDisplayedBullet = bullets.eq(lastIndex);
                        for (var i = firstIndex; i <= lastIndex; i += 1) bullets.eq(i).addClass(params.bulletActiveClass + "-main");
                        if (swiper.params.loop) if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
                            for (var _i = params.dynamicMainBullets; _i >= 0; _i -= 1) bullets.eq(bullets.length - _i).addClass(params.bulletActiveClass + "-main");
                            bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(params.bulletActiveClass + "-prev");
                        } else {
                            $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
                            $lastDisplayedBullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
                        } else {
                            $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
                            $lastDisplayedBullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
                        }
                    }
                }
                if (params.dynamicBullets) {
                    var dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    var bulletsOffset = (swiper.pagination.bulletSize * dynamicBulletsLength - swiper.pagination.bulletSize) / 2 - midIndex * swiper.pagination.bulletSize;
                    var offsetProp = rtl ? "right" : "left";
                    bullets.css(swiper.isHorizontal() ? offsetProp : "top", bulletsOffset + "px");
                }
            }
            if (params.type === "fraction") {
                $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
                $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
            }
            if (params.type === "progressbar") {
                var progressbarDirection;
                if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                var scale = (current + 1) / total;
                var scaleX = 1;
                var scaleY = 1;
                if (progressbarDirection === "horizontal") scaleX = scale; else scaleY = scale;
                $el.find(classesToSelector(params.progressbarFillClass)).transform("translate3d(0,0,0) scaleX(" + scaleX + ") scaleY(" + scaleY + ")").transition(swiper.params.speed);
            }
            if (params.type === "custom" && params.renderCustom) {
                $el.html(params.renderCustom(swiper, current + 1, total));
                swiper.emit("paginationRender", $el[0]);
            } else swiper.emit("paginationUpdate", $el[0]);
            if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        },
        render: function render() {
            var swiper = this;
            var params = swiper.params.pagination;
            if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
            var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            var $el = swiper.pagination.$el;
            var paginationHTML = "";
            if (params.type === "bullets") {
                var numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && !swiper.params.loop && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (var i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += "<" + params.bulletElement + ' class="' + params.bulletClass + '"></' + params.bulletElement + ">";
                $el.html(paginationHTML);
                swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
            }
            if (params.type === "fraction") {
                if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = '<span class="' + params.currentClass + '"></span>' + " / " + '<span class="' + params.totalClass + '"></span>';
                $el.html(paginationHTML);
            }
            if (params.type === "progressbar") {
                if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = '<span class="' + params.progressbarFillClass + '"></span>';
                $el.html(paginationHTML);
            }
            if (params.type !== "custom") swiper.emit("paginationRender", swiper.pagination.$el[0]);
        },
        init: function init() {
            var swiper = this;
            swiper.params.pagination = createElementIfNotDefined(swiper.$el, swiper.params.pagination, swiper.params.createElements, {
                el: "swiper-pagination"
            });
            var params = swiper.params.pagination;
            if (!params.el) return;
            var $el = dom(params.el);
            if ($el.length === 0) return;
            if (swiper.params.uniqueNavElements && typeof params.el === "string" && $el.length > 1) $el = swiper.$el.find(params.el);
            if (params.type === "bullets" && params.clickable) $el.addClass(params.clickableClass);
            $el.addClass(params.modifierClass + params.type);
            if (params.type === "bullets" && params.dynamicBullets) {
                $el.addClass("" + params.modifierClass + params.type + "-dynamic");
                swiper.pagination.dynamicBulletIndex = 0;
                if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
            }
            if (params.type === "progressbar" && params.progressbarOpposite) $el.addClass(params.progressbarOppositeClass);
            if (params.clickable) $el.on("click", classesToSelector(params.bulletClass), (function onClick(e) {
                e.preventDefault();
                var index = dom(this).index() * swiper.params.slidesPerGroup;
                if (swiper.params.loop) index += swiper.loopedSlides;
                swiper.slideTo(index);
            }));
            utils_extend(swiper.pagination, {
                $el,
                el: $el[0]
            });
            if (!swiper.enabled) $el.addClass(params.lockClass);
        },
        destroy: function destroy() {
            var swiper = this;
            var params = swiper.params.pagination;
            if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
            var $el = swiper.pagination.$el;
            $el.removeClass(params.hiddenClass);
            $el.removeClass(params.modifierClass + params.type);
            if (swiper.pagination.bullets) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
            if (params.clickable) $el.off("click", classesToSelector(params.bulletClass));
        }
    };
    const pagination = {
        name: "pagination",
        params: {
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: function formatFractionCurrent(number) {
                    return number;
                },
                formatFractionTotal: function formatFractionTotal(number) {
                    return number;
                },
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
                modifierClass: "swiper-pagination-",
                currentClass: "swiper-pagination-current",
                totalClass: "swiper-pagination-total",
                hiddenClass: "swiper-pagination-hidden",
                progressbarFillClass: "swiper-pagination-progressbar-fill",
                progressbarOppositeClass: "swiper-pagination-progressbar-opposite",
                clickableClass: "swiper-pagination-clickable",
                lockClass: "swiper-pagination-lock"
            }
        },
        create: function create() {
            var swiper = this;
            bindModuleMethods(swiper, {
                pagination: pagination_extends({
                    dynamicBulletIndex: 0
                }, Pagination)
            });
        },
        on: {
            init: function init(swiper) {
                swiper.pagination.init();
                swiper.pagination.render();
                swiper.pagination.update();
            },
            activeIndexChange: function activeIndexChange(swiper) {
                if (swiper.params.loop) swiper.pagination.update(); else if (typeof swiper.snapIndex === "undefined") swiper.pagination.update();
            },
            snapIndexChange: function snapIndexChange(swiper) {
                if (!swiper.params.loop) swiper.pagination.update();
            },
            slidesLengthChange: function slidesLengthChange(swiper) {
                if (swiper.params.loop) {
                    swiper.pagination.render();
                    swiper.pagination.update();
                }
            },
            snapGridLengthChange: function snapGridLengthChange(swiper) {
                if (!swiper.params.loop) {
                    swiper.pagination.render();
                    swiper.pagination.update();
                }
            },
            destroy: function destroy(swiper) {
                swiper.pagination.destroy();
            },
            "enable disable": function enableDisable(swiper) {
                var $el = swiper.pagination.$el;
                if ($el) $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
            },
            click: function click(swiper, e) {
                var targetEl = e.target;
                if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && swiper.pagination.$el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
                    if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                    var isHidden = swiper.pagination.$el.hasClass(swiper.params.pagination.hiddenClass);
                    if (isHidden === true) swiper.emit("paginationShow"); else swiper.emit("paginationHide");
                    swiper.pagination.$el.toggleClass(swiper.params.pagination.hiddenClass);
                }
            }
        }
    };
    core_class.use([ autoplay, navigation, pagination ]);
    function initSliders() {
        if (document.querySelector(".main-block")) new core_class(".swiper", {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 800,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 5e3,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            }
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    function initSlidersGoods() {
        if (document.querySelector(".goods__slider")) new core_class(".swiper-new", {
            observer: true,
            observeParents: true,
            slidesPerView: 4,
            spaceBetween: 0,
            speed: 800,
            loop: true,
            autoplay: {
                delay: 7e3,
                disableOnInteraction: true
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 80,
                    autoHeight: true
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                1268: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            }
        });
    }
    window.addEventListener("load", (function(e) {
        initSlidersGoods();
    }));
    function initSlidersOther() {
        if (document.querySelector(".other-goods-product__slider")) new core_class(".swiper-other", {
            observer: true,
            observeParents: true,
            slidesPerView: 3,
            spaceBetween: 20,
            speed: 800,
            loop: true,
            autoplay: {
                delay: 7e3,
                disableOnInteraction: true
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 80,
                    autoHeight: true
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSlidersOther();
    }));
    function initSliderProduct() {
        if (document.querySelector(".item-product__slider")) new core_class(".swiper-product", {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 800,
            loop: true,
            autoplay: {
                delay: 5e3,
                disableOnInteraction: false
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            }
        });
    }
    window.addEventListener("load", (function(e) {
        initSliderProduct();
    }));
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if (place === "last" || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if (place === "first") {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (parent.children[index] !== void 0) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if (this.type === "min") Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if (a.place === "first" || b.place === "last") return -1;
                if (a.place === "last" || b.place === "first") return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return 1;
                    if (a.place === "last" || b.place === "first") return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    document.addEventListener("click", documentActions);
    const menuBlocks = document.querySelectorAll(".sub-menu-catalog__block");
    if (menuBlocks.length) menuBlocks.forEach((menuBlock => {
        const menuBlockItems = menuBlock.querySelectorAll(".sub-menu-catalog__list").length;
        menuBlock.classList.add(`sub-menu-catalog__block_${menuBlockItems}`);
    }));
    function documentActions(e) {
        const targetElement = e.target;
        if (targetElement.closest("[data-parent]")) {
            const subMenuId = targetElement.dataset.parent ? targetElement.dataset.parent : null;
            const subMenu = document.querySelector(`[data-submenu="${subMenuId}"]`);
            if (subMenu) {
                const activeLink = document.querySelector("._sub-menu-active");
                const activeBlock = document.querySelector("._sub-menu-open");
                if (activeLink && activeLink !== targetElement) {
                    activeLink.classList.remove("_sub-menu-active");
                    activeBlock.classList.remove("_sub-menu-open");
                    document.documentElement.classList.remove("sub-menu-open");
                }
                document.documentElement.classList.toggle("sub-menu-open");
                targetElement.classList.toggle("_sub-menu-active");
                subMenu.classList.toggle("_sub-menu-open");
            }
            e.preventDefault();
        }
        if (targetElement.closest(".menu-top-header__link_catalog")) {
            document.documentElement.classList.add("catalog-open");
            e.preventDefault();
        }
        if (targetElement.closest(".menu-catalog__back")) {
            document.documentElement.classList.remove("catalog-open");
            document.querySelector("._sub-menu-active") ? document.querySelector("._sub-menu-active").classList.remove("_sub-menu-active") : null;
            document.querySelector("._sub-menu-open") ? document.querySelector("._sub-menu-open").classList.remove("_sub-menu-open") : null;
            e.preventDefault();
        }
        if (targetElement.closest(".sub-menu-catalog__back")) {
            document.documentElement.classList.remove("sub-menu-open");
            document.querySelector("._sub-menu-active") ? document.querySelector("._sub-menu-active").classList.remove("_sub-menu-active") : null;
            document.querySelector("._sub-menu-open") ? document.querySelector("._sub-menu-open").classList.remove("_sub-menu-open") : null;
            e.preventDefault();
        }
        const targetElementSearch = e.target;
        if (targetElementSearch.closest("[data-procreator]")) {
            const subMenu = document.querySelector(`[data-search]`);
            if (subMenu) {
                const activeLink = document.querySelector("._sub-menu-active");
                const activeBlock = document.querySelector("._sub-menu-open");
                if (activeLink && activeLink !== targetElementSearch) {
                    activeLink.classList.remove("_sub-menu-active");
                    activeBlock.classList.remove("_sub-menu-open");
                }
                targetElement.classList.toggle("_sub-menu-active");
                subMenu.classList.toggle("_sub-menu-open");
            }
            e.preventDefault();
        }
    }
    document.addEventListener("DOMContentLoaded", (function() {
        const productContainers = document.querySelectorAll(".quantity-product");
        productContainers.forEach((function(container) {
            const decreaseButton = document.querySelector(".quantity-product__decrease");
            const increaseButton = document.querySelector(".quantity-product__increase");
            const quantityInput = document.querySelector(".quantity-product__quantity-input");
            decreaseButton.addEventListener("click", (function() {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    currentValue--;
                    quantityInput.value = currentValue;
                }
            }));
            increaseButton.addEventListener("click", (function() {
                let currentValue = parseInt(quantityInput.value);
                currentValue++;
                quantityInput.value = currentValue;
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const productContainers = document.querySelectorAll(".quantity-item-cart__block");
        productContainers.forEach((function(container) {
            const decreaseButton = container.querySelector(".quantity-item-cart__decrease");
            const increaseButton = container.querySelector(".quantity-item-cart__increase");
            const quantityInput = container.querySelector(".quantity-item-cart__quantity-input");
            decreaseButton.addEventListener("click", (function() {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    currentValue--;
                    quantityInput.value = currentValue;
                }
            }));
            increaseButton.addEventListener("click", (function() {
                let currentValue = parseInt(quantityInput.value);
                currentValue++;
                quantityInput.value = currentValue;
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const productContainers = document.querySelectorAll(".item-goods");
        productContainers.forEach((function(container) {
            const addToCartButtons = container.querySelectorAll(".item-goods__button");
            const modal = document.querySelector(".notification-block");
            const closeModalButton = document.querySelector(".notification-block__close");
            let notificationShown = false;
            function closeNotification() {
                modal.style.display = "none";
                notificationShown = false;
            }
            function showNotification() {
                if (!notificationShown) {
                    modal.style.display = "block";
                    setTimeout(closeNotification, 2e3);
                    notificationShown = true;
                }
            }
            addToCartButtons.forEach((function(button) {
                button.addEventListener("click", (function(event) {
                    event.preventDefault();
                    showNotification();
                }));
            }));
            closeModalButton.addEventListener("click", (function() {
                closeNotification();
            }));
            window.addEventListener("click", (function(event) {
                if (event.target === modal) closeNotification();
            }));
            modal.addEventListener("click", (function(event) {
                event.preventDefault();
            }));
        }));
    }));
    const itemReviewsContainer = document.querySelector(".item-reviews");
    if (itemReviewsContainer) {
        const arrow = document.querySelector(".item-reviews__button");
        itemReviewsContainer.addEventListener("click", (() => {
            arrow.style.transform = arrow.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
        }));
    }
    window["FLS"] = true;
    menuInit();
    spollers();
    tabs();
    showMore();
    formFieldsInit({
        viewPass: false
    });
})();