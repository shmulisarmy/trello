class Signal {
    static instances = new Map();

    constructor(key, value, scope) {
        this.dependents = new Set();
        this.value = null;
        this.key = key;
        if (value) {
            this.set(value, scope);
        }
        Signal.instances.set(key, this);
    }

    update_wild_cards(scope) {
        const key_sections = this.key.split("-");
        for (let i = 0; i < key_sections.length; i++) {
            const current_key = [...key_sections];
            current_key[i] = "any";
            const new_key = current_key.join("-");
            console.log({ new_key });

            const listener_attribute = `listen-for-${new_key}`;
            for (const element of scope.querySelectorAll(`[${listener_attribute}]`)) {
                element[element.getAttribute(listener_attribute) || "innerHTML"] = this.value;
            }

            const attribute = `on_emit_${new_key}`;
            for (const element of scope.querySelectorAll(`[${attribute}]`)) {
                const func_string = element.getAttribute(attribute);
                const func = new Function("event", "component", func_string).bind(element);
                func(this.value, element.closest("[component]"));
            }
        }
    }

    set(new_value, scope, wild_cards = false) {
        this.value = new_value;

        const listener_attribute = `listen-for-${this.key}`;
        for (const element of scope.querySelectorAll(`[${listener_attribute}]`)) {
            const listening_attribute = element.getAttribute(listener_attribute);
            if (!listening_attribute) {
                element["innerHTML"] = this.value;
                continue;
            }
            const attribute_path = listening_attribute.split(".");
            console.log({attribute_path});
            
            let current
            let at = element
            for (let i = 0; i < attribute_path.length; i++) {
                if (i == attribute_path.length-1) {   

                    console.log({i, attribute_path});
                    console.log({at});
                    console.log({current});
                    at[attribute_path[i]] = this.value
                    break;
                }
                current = attribute_path[i]
                console.log({at});
                console.log({current});
                
                at = at[current] 
               
            }
        }

        const attribute = `on_emit_${this.key}`;
        for (const element of scope.querySelectorAll(`[${attribute}]`)) {
            const func_string = element.getAttribute(attribute);
            const func = new Function("event", "component", func_string).bind(element);
            func(this.value, element.closest("[component]"));
        }

        if (wild_cards) {
            this.update_wild_cards(scope);
        }
    }

}

function emit(key, new_value, scope) {
    console.log({key, new_value, scope});
    if (!scope) {
        scope = document;
    }
    if (!Signal.instances.has(key)) {
        new Signal(key, new_value, scope);
    }
    console.log({scope})
    Signal.instances.get(key).set(new_value, scope);
}


