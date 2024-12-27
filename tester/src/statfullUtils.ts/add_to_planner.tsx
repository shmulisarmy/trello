import { availibleIngredients } from "../data/availibleIngredients";
import { recipies_making } from "../data/recipies_making";
import { Dish } from "../types/dish";

export function add_to_planner(recipe: Dish) {
  console.log(`Adding ${recipe.name} to planner`);
  for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
    availibleIngredients[ingredient] -= amount;
  }
  recipies_making[recipe.name] = (recipies_making[recipe.name] || 0) + 1;
}
