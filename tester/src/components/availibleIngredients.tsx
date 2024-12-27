import { availibleIngredients } from "../data/availibleIngredients";
import { addToast } from "../lightning/toast";



/**
 * Component that displays the list of ingredients with their quantities
 * @returns JSX.Element
 */
/**
 * Displays the list of ingredients with their quantities
 * @returns JSX.Element
 */
export default function AvailibleIngredientsList(): JSX.Element {
    let inputRef: HTMLInputElement | undefined;
    return (
        <>
     
        <ul class="ingredients-list" style={{ display: 'grid', "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))", listStyle: 'none', padding: 0, margin: 0 }}>
            {Object.entries(availibleIngredients).map(([ingredient, quantity]) => (
                <li
                    key={ingredient}
                    style={{padding: '1rem 0', "border": "1px solid #ccc" }}
                    class={`ingredient-item`}
                >
                    <span class="ingredient-name" style={{ "margin-left": '1rem', "font-weight": 'bold' }}>{ingredient}</span>
                    <span class="ingredient-quantity">
                        (have: {availibleIngredients[ingredient] || 0})
                        <button
                            class="decrease-btn"
                            onclick={() => {
                                availibleIngredients[ingredient] -= 1;
                            }}
                            style={{
                                "margin-left": '0.5rem',
                                padding: '0.3rem 0.6rem',
                                border: '1px solid #ccc',
                                "border-radius": '4px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            -
                        </button>
                        <button
                            class="increase-btn"
                            style={{
                                "margin-left": '0.5rem',
                                padding: '0.3rem 0.6rem',
                                border: '1px solid #ccc',
                                "border-radius": '4px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onclick={() => {
                                availibleIngredients[ingredient] += 1;
                            }}
                        >
                            +
                        </button>
                    </span>
                </li>
            ))}
        </ul>
        <form>
            <label for="new-ingredient">
                Add new ingredient:
                <input
                    ref={inputRef}
                    type="text"
                    id="new-ingredient"
                    name="new-ingredient"
                />
            </label>
            <button onclick={(e) => {
                console.log(e, inputRef, inputRef?.value, availibleIngredients[inputRef!.value]);
                e.preventDefault();
                if (!inputRef?.value) return;
                if (availibleIngredients[inputRef!.value]) {
                    addToast("error", `already have ${inputRef!.value}`);
                    return
                };
                availibleIngredients[inputRef!.value] = 0; inputRef!.value = ""}}>Add</button>
        </form>
        </>
    );
}

