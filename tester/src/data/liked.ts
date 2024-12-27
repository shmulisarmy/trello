import { createStore } from "solid-js/store";


export const [liked_recipes, set_liked_recipes] = createStore<{ [key: number]: boolean } >({
    1: true,
    2: true,
    3: true,
    4: true
})