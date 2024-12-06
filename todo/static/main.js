const route_cache = new Map();


function preFetch(path, method) {
    if (!method) { method = 'GET'; }
    fetch(path, { method: method }).then(res => res.text()).then(route_cache.set(path, {data, method, timestamp: Date.now()}));
    return route_cache.get(path);
}

/**
 * 
 * @param {HTMLElement} element to replace
 * @param {string} path to fetch from 
 * @param {*} method 
 * @param {number | undefined} check_cache milliseconds
 * @returns 
 */
function replace(element, path, method, check_cache) {
    if (method === void 0) { method = 'GET'; }

    __p(element);

    var elements_to_preserve = element.querySelectorAll("[hx-preserve]");
    elements_to_preserve.forEach(function (el) { return document.body.appendChild(el); });

    let should_get_from_cache = undefined;

    if (check_cache && route_cache.has(path) && route_cache.get(path).method == method) {
        const cached = route_cache.get(path);
        const time_since = Date.now() - cached.timestamp;
        if (check_cache > time_since) {
            should_get_from_cache = true;
        } else {
            should_get_from_cache = false;
        }
    }

    if (should_get_from_cache) {
        element[element.getAttribute("hx-swap") || "innerHTML"] = route_cache.get(path).data;
    } else {
        fetch(path, { method: method }).then(function (res) { return res.text(); }).then(function (data) {
            console.log(data);
            console.log(element);
            element[element.getAttribute("hx-swap") || "innerHTML"] = data;
        });
    }
    for (var _i = 0, elements_to_preserve_1 = elements_to_preserve; _i < elements_to_preserve_1.length; _i++) {
        var element_to_preserve = elements_to_preserve_1[_i];
        var id = element_to_preserve.getAttribute("id");
        element_to_preserve.replaceWith(element.querySelector("#".concat(id)));
    }

    element.classList.remove("loading");


    element.querySelectorAll("[onload]").forEach(function (el) { return el.onload(); });
}




function __p(element) {
    element.classList.add("loading");
}

function append(endpoint, element, method, data){
    console.log({method});
    console.log({data});
    
    fetch(endpoint, {
        method: method || 'POST',
        headers: {
            'Content-Type': 'application/json'  // The content type of the request
        },
        body: JSON.stringify(data)
    }).then(res => res.text()).then(res => {
        console.log({res})
        element.appendChild(createElement(res))
    })
}


