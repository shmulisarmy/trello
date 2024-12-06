
HTMLElement.prototype.reload = function(){
    if (this.onload){
        load(this)
    }
    for (const childElement of this.querySelectorAll("[onload]")){
        load(childElement)
    }
}


function load(element){
    const func_string = element.getAttribute("onload");
        const func = new Function("event", "component", func_string).bind(element);
        func(element, element.closest("[component]"));
}


document.addEventListener("DOMContentLoaded", () => {
    for (element of document.querySelectorAll("[onload]")){
        
        load(element)
    }
});