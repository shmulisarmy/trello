HTMLFormElement.prototype.to_json = function(){
    const formElement = this
    const json = {}
    for (const [key, value] of new FormData(formElement).entries()) {
        json[key] = value
    }
    return json
}


function $(selector){
    return document.querySelector(selector)
}



function createElement(html_text){
    let template = document.createElement("div")
    template.innerHTML = html_text.trim()
    const element = template.firstChild
    console.log({element})
    return element
}



/**
 * 
 * @type {Map<string, {number, function, recent_time_out_id: number}>} 
 */
let throttled_events = new Map()

function throttle(func, ms_rest_time, key) {
    if (!throttled_events.has(key)) {
        // Initialize the key in the map if not present
        throttled_events.set(key, { last_call: 0, timeout_id: null });
    }

    const event_data = throttled_events.get(key);
    const now = Date.now();
    const time_since_last_call = now - event_data.last_call;

    if (time_since_last_call >= ms_rest_time) {
        // Enough time has passed, call the function immediately
        event_data.last_call = now;
        func();
        throttled_events.set(key, { last_call: now, timeout_id: null });
    } else {
        // Not enough time has passed, schedule the call
        const remaining_time = ms_rest_time - time_since_last_call;

        if (event_data.timeout_id) {
            // Clear any existing timeout to avoid duplicate scheduling
            clearTimeout(event_data.timeout_id);
        }

        event_data.timeout_id = setTimeout(() => {
            event_data.last_call = Date.now();
            event_data.timeout_id = null; // Clear the timeout_id after execution
            func();
        }, remaining_time);
    }
}
