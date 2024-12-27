/**
 * get alerted when any of these items are added/removed
 */

import { createEffect } from "solid-js";
import { availibleIngredients } from "./availibleIngredients";

export const ingredients_on_watch = new Map<string, number>(
    Object.entries({
        eggs: 1,
        bacon: 1,
        pasta: 1,
        pepper: 2,
        parmesan: 2,
        onion: 1,
        garlic: 1,
        chicken: 1,
        coconut_milk: 5,
        curry_powder: 3,
        basil: 6,
        flour: 2,
        yeast: 4,
        mozzarella: 1,
        tomato_sauce: 1,
        salt: 4,
        bread: 5,
        lemon: 10,
        avocado: 50,
        honey: 1,
        banana: 6,
        yogurt: 1,
        blueberries: 1,
        strawberries: 1,
    })
);


