import { recipies_making } from "../data/recipies_making";
import { add_to_planner } from "../statfullUtils.ts/add_to_planner";
import { recipeData } from "../data/all_recipies";

export default function RecipePlanner() {
    return (
        <div id="recipe-planner">
            <h2>Recipe Planner</h2>
            <ul>
                {Object.entries(recipies_making).map(([name, quantity]) => (
                    <li key={name}>
                        {name}: {quantity}
                        <button onClick={() => add_to_planner(recipeData.find((r) => r.name === name))}>+</button>
                        <button onClick={() => recipies_making[name]--}>-</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
