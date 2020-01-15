// import 'url-search-params-polyfill';
// /*import 'core-js';*/
// import 'core-js/features/promise';
// import 'core-js/features/array/includes';
// import 'core-js/web/url-search-params';
// import 'whatwg-fetch';

const API_URL = window.location.origin.startsWith('http://localhost:') ? "http://localhost:3000" : "https://api.freecomics.ml" /*"https://Comic-Strip-API.426729.repl.co"*/ ;
const API_VERSION = "v1";
const SAVE_AS_URL = false;

function dateFromPath(path) {
    return path.replace(/\/[^/]*\/(.*)$/g, "$1");
}

function getCookie(name) {
    return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"));
}

export {
    API_URL,
    API_VERSION,
    dateFromPath,
    getCookie,
    SAVE_AS_URL
};
