import { createMutable } from "solid-js/store";

export const recipies_making = createMutable<{ [key: string]: number; }>({
    "Pasta Carbonara": 2,
    "Margherita Pizza": 1
})