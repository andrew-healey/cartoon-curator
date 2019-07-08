import 'url-search-params-polyfill';
/*import 'core-js';*/
import 'core-js/features/promise';
import 'core-js/features/array/includes';
import 'core-js/web/url-search-params';
import 'whatwg-fetch';

const API_URL="https://Comic-Strip-API.426729.repl.co";

function dateFromPath(path){
    return path.replace(/\/[^/]*\/(.*)$/g,"$1");
}

export {API_URL,dateFromPath};