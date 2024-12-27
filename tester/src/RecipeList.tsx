import { createEffect, createSignal, For, Show } from "solid-js";
import { createMutable } from "solid-js/store";

import Form from "./lightning/form";
import Profile from "./lightning/profile";
import Blog from "./lightning/blog";
import Blog_card from "./lightning/blog-card";

import { Dish } from './types/dish';
import { recipeData } from "./data/all_recipies";
import { availibleIngredients } from "./data/availibleIngredients";
import { canMakeRecipe, canMakePercentage } from "./canMakeRecipe";
import { recipies_making } from "./data/recipies_making";
import { add_to_planner } from "./statfullUtils.ts/add_to_planner";
import { $A } from "./utils/dom";
import { is_sequence } from "./lightning/data_picker/utils";
import { liked_recipes, set_liked_recipes } from "./data/liked";
import { profiles as profiles_data } from "./lightning/blog-card/data";





const profiles = [
  { id: 1, name: "Profile 1", image: "data:image/png;base64,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" },
  { id: 2, name: "Profile 2", image: "https://shmulisarmy.github.io/resume/images/profile.png" },
  { id: 3, name: "Profile 3", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABHVBMVEX///8Qdv8QUuf///3//v8Qdv79//8QUub///sQUegUbfoPd/4Acv8QUer///kAcPsAau8AavT1//8Abvaqy/AARt00fePy//8AQdgAZ/IAa+Tr+/7o+P8AZuoAS+YATukAROHF3/wAZeMQb+InduONtue83PU7guF0p+fZ8PtZkeOt0PCmyu6Js+4APNjC0vXr9f8hUdJgftSEsuiywOjX7f3P5f3G4vNknOxJiOKgxOtmnuF1qeM+h9g3ft0ueOF7l9sAR9RWeNqOp9rK1/Lb5fZEacoAPcmMot6xxueOuuJelu4/atkteestWNh7jc6lt+B0kOAnU8g8Zdhqg9gvWcQPRstOcs6dsOqruekAWucANshJadpmhN3d5/7b047GAAAU/ElEQVR4nO1dC1vazBJO2GSzIYFAUEEIl0pBwUvpRUHbr7UVP/Wc2k/tqf16enr+/884MxvwmtsmQe1zePu0WgWSN7M7MzszOytJc8wxxxxzzDHHHHPMMcccc8wxxxxzzDHHHI8Owv8hCpUURaIEvuP/B0gKoYRS9zXkce8yERQkQxUkCd8hI0L4X0XBn0gS5YQf+zaTgFKKzIgLxojLEL9HfvwrF+VvCi40hcuIlnvbO8+66wsLC+vPnu1s98rXxH5jhiQvEeoMNzZHq8+rK/Xl5WIWYC0v1+sr1eero82N4QDGKfuthilx//LRSJ1uZ3RaL5YsWbZM+Qoq/xd+UCoV66ejzjMHp6Orc564PFEaqEYkibFad3O3XbQsOQSmlS1Wd193a/hOULqc6xMVKmFcpQA76qyPTgvmtbx8Ab82ZMMws4Xno3XHFb7iWpUnCf74SXl9VC3hIHTphXCcMjXl7Mpovcy1q/JEZQjmD+z4cK2aNeGOVfXGnItAEV9oFqtrQ1Q9j03EBzBEaxurBYvfrQqjLzrc52AYqinXVzfKj83kNlxHhYH7Ijmd58Xp7RpCEpRV97X8S/Z5B9QOd3mkJ2BImOKqeEKc1+2SgNiCUGpvcq2DqvnxzQf6ZQphtU6VmzyRsekHQ5WtlU4NXDz6BJxWSvFB23ttNHyRB2UEWO09G52AR9c6oD3ztLtUMkFNcPmlxBI+zPrQZU9BhqBg3hYs4CenyA8JGoZceOs86uKR4sKP0Y12yVDTHaGcI/5Tam9wB/dxhirOESY5/WUjDe3iA7PQd/ISo48jSbguXW+rIMC05XcN0KrtBfpIQgQVWn5XmBm3axTWyo/kirPeqmW4q4PZwHVtVaO02nsEemCLu1VunNUZTkN54sJXuw+rUxX0Ykinbl6tIGaOQodwD0d6ID8OrLy9VpBnqUTvUVyzQbNhDPIB+KGVKPeL6kMSBNPYLzOM3D0IRZJ3ds3we0oVYDb+qOWlBxIhcZZMvsJ9oEnoMpTl92D86azDVASVqPPh+sJxSE7fI/Jm9AvNpR7OxZkSRH5550NoiPAODF82Yg/IXHJm7sDBYtB5bwneGYxo1TQtyyqWOKxsqWRNmAtBld/XZu2/UVL+wxQcm2A1zeV2f3NvYYKN9YW9zX67KK6tDHO3PGOKzO6LDlFAfdQt80D/JAVFYFEi2d1R3RQbDfBaq2/P1uSTNWGCaqG/LTGXG0Z1MHLPg8dM2u4XRT9NLq3xz5gFGH5sp2SIzUFTri7Y+Um+ZnJjbqAQ45B0o3qtWSN+YrFDKFNmwJFiJrBbF9IO+DSWtimDceWjAUkP9JYB7pHAx9a78IxmwRCefK9qirlqana3lodJ588wX/sjy41d9JFhVntkFjYDVhPlVVMV8mQMcCbzOOt8b0gheXRxZb4Oi/qp8upM4v6weFnLRubmwuqXeclFgKNFKVAUi5WrlrU2CxkSsl5QxbIRaLwwjxSQ84T5RPO1XTEFbaiF9XQZ8oIR5rSn3CJmBOV27Wq+BAkRPPm2KhjOqjqoa1IMUKGZ7gs9Z1k16sOoWXkyrAu68Gafppjzx1UnlTaWxfwPw1ojkXU62V82RHw41Shu+JsgcYZ8xVQVUXd4D6DTo16BksHHrJiWNtsOS40hL9h6WxKbKobZj34FuNNPTUtsoFpvwZNIaa2IPmW3IDZPVLXUEXjCTDrQdTFdYxS6qVU0wCi1lwRXOqq8vC5wCSadtDKZrNg8X7LTGqWwrN4rCcfVis8ELkGl8Zaua0IehVHcS807JbW2KcrQWN4WUARUOtzK6BkRijBr27W0GOY7MVa9VZHkJpMGHzMZlKKAdypbnZTibmgpxIO/u7aAHoCp/mcThAgUBSa8UXVSmomvBRW5jJG/dyIrcZhQ+6BqMhkNpBj1WoZsvZYSh0/RZ4ZZKMgPrp5dj+7R8JIjUKYaUBRRNzATHayCSzIbYeEjsY4VI+xb7wk8XJA22/6ZcSEgRRVnYtDaLBxYg11+LhgR41iBdUXkki1YuRDnyCWouxQjXdCQn4tcxgvgcpONq1o1IYZDgeg0zAW2M5Wh0EAtbuSTeW5YaL8aJwOjmq+l6F4jLiOPW9pUiAJ20VqlyeYheH7DYpxaC1AC0ZcWqGkOL3Na5kqKmagU1cIwmftN4oSAXWQF/FJ4Fidb1wT5QI34VGEVmsixoaxcjSFBXiX6j+g+DbzwoHGDYEaLTrFaTqRKFbYuGl+bwlyTog8fIu3r+k2KKMVIC25ueBNQVOjIjJnotf4pcB0ifcrdJhhN3WBaa5TM/cbgRTyoq0Kj9PMdGYIQo2lUNZlzStaL8UQI7zq1Iz9chdhfOEM9o90aqBEubhTX8+6uuDgEGRvJMesRDLk6EFg9DSpNTbvDMMOlGHh1VTVlc4RJg5hyJLVTM2bVU6n/rhc9XssO//q+eGeYRpEi/227JsXf/9YtxKzLwyCKgF8KHp79OXePIacYyrHQJXEHqSRtZuV4oxQjbdE9Yr7Z6bZFvBqpweoG783ajF8NTndjkHMZrksil8W44IkHQxy4IT4VyHiXkjghfox0O+24ZU+lPZFxw/eZnnnKMMpcrDoSFXAvblyXdIti2dlrWJuSAEWKq7Rjb4ZhAxXurthlsQhSwjpxXTbZ/KckUk2Aw+xTQ/MkqIeGirMdQhVxVYOpnVGc1b2LU1sot6dI9hcPXeoy5AM14D7AIhJxhrz45TQeO4Ba7zERTUPdOM1ti3+LYtCTPo2TTESGTj1+gWVxXUiXUvam5ceQa9Rs0J3UnRi10ajdhuIVS1Oo5qaAJ4UX81U0U3Xjvy9HLQ5xl6AoQ/i7kWQ/YV+kXALM4fdmIMNMkNEobcQwhxT+bMYMYHCc1gSuSoj90kfRXI3UACmibRJXpaDrR0mqnOvbAhFhwg63QhhO0jbetzSKMw9h4KwmKVdXBap6YBruB0/DKUWfZ74qELq8YghP9nmigvzC6xcDEl4wweBZDl4cL3qb+1vjFL0bT4rm8zheGyHlaiKGqvXxLNRMEVSC7GyroYcyzEx91HskVQy4CY9SGGK9lSQE0WK8BZc6+NnCI2BUOm9m7oZpfOCjUVd64kW14AVt1+Ozc6W/ir5GyPDBl3xGlzSKEDPoo3p4cKDWYpgLsrMcn6GLalkKtfvwBGqXOUCkYeqTtlneEWdIFPYsMcP6Dk60YH5UIeOKpkcdpt7lDPVn4ot8Qtiz2GunKaw9iQXXDypYNPejlYlGb8LxvropxmCI9aSJGYLrFrZKVBihYQ7bXdyXokga6AYWkjMsbLPgigxsOHFYEZDghOIdXRObYdK9aWAvwro+gDtzHubO3IHHevHxZGgWwjJDRDqpRLQTNyhmtNuLgjgMFZyHiWVomCvDEILjo4wmShE5WjeVTTZO3Tfo0uU0dlDWhzAViYfd53YkP/4JhlCY4bScYXKD6vIz8UpMQkhye4gXN1Z2iJfdJ0BcYeOPOS0X0RTexq3kGzIUFiEhOwm8tiuCpmG2h3kvk6FgicllTtPFBykXon5jpVHfiVG1ryTyS68YGqBuPtieGpVK9KKp5eIRnAYZXZK43BYdpbBqS7q2kKfbYz94Jr/wnr7qIMNIHqk3JvlFte6Iy1ChrBY7w32DoIxVPZ6TBKONn+LNwakUrwrE4hRk4H6lZGv8K5gj4jWG8Cf/EvTX7pHkc1HFNb44FAnrvdKA9Q53N3kyDI3OhCNrAMPVGAxxm8woSTTxGtl/+FxCks5aiRmiFM04sTZ8xJvpjNLigneaHX520oqpSadww1PWpiS+5xL7iCaKeV9BXd7x2WFJpJ2tOP7MPYqljRi5J+whMizELMS48S7TKrwfSJ4dSeGxO98WG6hNwXzrwRHhQJL/HsbpeULd3JMw3Go00+1+aRY/dLbLec8hxDt62/89+LrVAEHyOI2eixRUvIeKE2ODELazjJU/xL5RKt8ubBbb74Y2YUwB/+H+RASGCs8xHu5fYr1QE4UYS5L6S0mkbP5KhFyZimzIuyVJ2Sr0123cFcawWtwjnIntXLEbK8jXPvmEgoRFhhbHAWi+IjEY8s7MnbCqK28hYs/D6hrPzOBmAcV7qzP8gnfU5Vv96eH+x0YOfc0YDBsHUox9F9jggXWLMQqicLtO+3Vv0vGa7/P1TAfzlsiTDu34CAbHly1NJOh2hdaYxNygH6eeBqagtdJxeDmOciOr56VLb33FrPrBUUPH0KnIZARVfDlgcZss0F1TpKyNr2XMwlot5lYd4LhfaQhRzIH2bf4J/OJutty0hLoimoZc7G/H7f7LsAn04atKzrtewVuCMHMbx5glj1naJrY5VsWmqpTkiRKLImUM5+OLi0bkyQi6V8tUxp5hkkggtVORoi+1NCrnKXaNi9VAhmCyBNSr/a9WdH2j682XNXxvvF0XhI4sgVFaekeZxI+ziMdQUdxNXnQ/OkVd138RLDWJyRA3I0TaE4BK1HqLucDEjRywM+J5S4uqbPStkySV7CxyrT48h/c2SaFfPJ4bgAXDeqScKSjejwL15PcBwzQSPzQpdXTwk++QR39cIsNKJpoDpzdeJWmtQHA7QiQJwlpiDffYSYmbVGGTEfiQ86i1C603yR4qKUcdpisOTvYUNlcTfnLS4Ciii3ppi5e03boci7R3TeV5NNz2kHyYUpyIvD4jiggb+0m7tpNoC32jMEyzJyWR8uNoSTcw90kZujHF0P1dSzZLscGYIjH7IoKq0XKfacLrgmA2oiRKrdfpniwCnsOxT933LbTeJJwY6CiWTyOsL4rd1MhxwE2PI8RScxd2PuFudVzjReiKgR1/0mz0hzuKBpfhbk3rb2yHlkiXKnCxWjt8l+Vu0ulwGwTXGd+D1xga+ASXg3SOh3gdfiyVQNeraMBOGSEM+cowlTaYpFZVQyxGdo+l13lLcr1vdha8woC14ZGT0kk7pBPW3KT+LJ/qEXic4bgSRFAHh+3APZQuOUul1g5ZCK/0PIO+CQAO+OBnkAw1Xb+sxVwVelxurxQcGq6Wk/Vu8LgklexAZQoiPCOSko4nRYj9IXiUntok1XbpWGuj2F+8XVPMcOSA4VebpOLqIxiGpII4Vmskn8qVJsCCPpSh5zDV9CZYilxlnOKJXpSwt4G5RKxCDit3FgJRmG/NopZDkvp5erqN7yN2AhuagbVIdx4y0KU/fKwF39WeuxxIqXUVdIf6RiFoO+muraTq1GDqy7+wVtd0cLmpkto5iQqqLBbYqrzYTfXIAhw24y1fY6FnGt/duZomyHUP2vtQ5Q+1vAQDFZ4r326T4DrueXL52kXTZ/UE7ho6pOmfkZBfKPgaRVXN9su4jlHAA6dJ7Abh3VJJ3n7luzzUmlrlJJ9+q2SF0LUAfaqW+o6EhzZjqVGiq/Nso/N90bceLIfBmVmcAcGksm+RFHjmqtk+szFpfaO9fAxgv31SPnsJFsE3W6p/s2dxUAkYPNbzDy1i5cXy5f4OvDKfILyHT+dw/7KFe2h8ZXjUm8k5Hhiolbo+8WGDc5Sz+tbFwaE9NTCR/P6rF/D32IcHF5WGrvlUZPJiVHBmUnJHvdApBGVqVEvTG62L8x/IkrlpRJ6md89Yv3FXGB5xz5LH9K2b6LcPf5xftFrertp0gGp65SBW5UVEEALaJohiFmZPs1k5uvh1MD6k1D1rG1ZWk+b6nCqdNOqYlGjgwLQH44NfX44WmyGBbpDt4l/YP2F2MiR2P3CPgpHFml9dzzVbW1svv/918GY8KNPJ07l+TtPvaXkwPjnY//5ya6vRbOL2rkCG8NGNVzbuypzhiUHE/iOIIRhGTeP3iaoQhmyrcnT08uvnX+f7x3///eONix8//j7eP//1+evl0c+tVquR07Gcnefv+RD1Lxxu/FnLY/IgWQgxkCBltfeBgSk1i5OF3yJoQ6ALt99sNBuAxRvA/zebbhcFZJfT3c3MgQU1WuPbgGEB0gxPmlHwSLKlwL7JOBdvyYE38Zq08kLB8mJE3q5s8nss2OP/0UIqhhoXA+Yu0mZ3YBCG0PO9JSuAoiq7FGOVN/khh1UXzYtBPp3wYRCwZpI5782AAgYVB2rKFFF/Nb8N8myGltAFVkxSidV2zYDQFJeini5DVDIOw2jDbAmiCLkYyyEHW2UTFjffg954BVqUK5nZCpGfSYW5L3stKMGvqmlTrPzFmxaReC2vhBi6lafwLDt1LAZGPh5qBymiVUywJcYNG6I1gSlYOaBssmKZuaqZwD1L1nJdbk/NmtWSqhusbsdCRa15BM62kmbaIAzcy5SkHrf9PqflpmE00EaAF9D41nPPpXu4c4+5I80IKQcfKJtYo2q4d0+v7NtMcQs0Hhi4Qliv+jZsV+Wk6kbP5DK5xuUJT0Vhh40HPp2b8H01Tt+/Gzaa/kQMtVyu8n2Qv1tR/bBgdKPNz672no5Zt/pedKTmMvx9+uLlm1mfHRsKUOLO24LPQUnqlUYVFF7O1aNb54nqDlMCmsbuEtbceAkxrkYFDdpsfR3TmR8dG4UhhoXsvbZPMTFSFNc3oERbl2c2moiHsxA+oHhCJdxIrbPifYiuKu6jgpFpVQ5quKNm9p52OAgv6wVP1Xndtq5Y3fADIvuo+oSeBgrm2MGCcUwuPboMr0Ekp/O8OJGjeqtJTvh6Medu6tKwwULr5fFAIunld1MEODkbqwVrolhvJhvDfFSdb37B/YfNytc3ZWnma6SYwPuiw7Vq1t1LdG1Bpkti/wHK41CZZuvyfAe3Izy8gxYJGADGKG95YbRSMuWbwzSMIoag9NbRqzf25ETPJylB3ocBF3GgAZ31UXvldi7OV90g8dxi5eWvk4F7prUizSA5mC4ILjxq3c3daskyb0iRxxH5TtGJicQtlXqz1br883hcu/LOPLdFPz3gVivqdDujdr2IR8Wb7mJK13OgU1zA18XW1stXB+MBJmke3/AJgR/0ykgejJoz3NscrZ5WV+r/rlRaHJWtnz8vv/zn1/HZeDBJY/wmgrsG5fqC73B28zC03NveGb84QbwYj//r5mump8ljevypz707cMvccDMzbnTGMCcjVzkxtOYTTvBrNtGcv5kMeQCA5w/dzcw8yDpNqUm8NbKEpCnh+z9xkP6GDPmX6X/v/v6JOi1zzDHHHHPMMcccc8wxxxxzzDHHHHPMMcf/Mf4HQHSUqT1Q110AAAAASUVORK5CYII=" },
]

interface RecipeItemProps {
  recipe: Dish;
}

function RecipeItem({ recipe }: RecipeItemProps) {
  const [isLiked, setIsLiked] = createSignal(recipe.is_liked);
  const [isVisible, setIsVisible] = createSignal(false);
  const [showOptions, setShowOptions] = createSignal(false);

  let buttonRef: HTMLButtonElement | undefined;

  return (
    <div class="recipe-item">
      <div class="recipe-header">
        <h2>{recipe.name}</h2>

        <button
          class="info-btn"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          ...
        </button>
        {showOptions() && (
          <div class="options-menu">
            <p>Option 1: Save Recipe</p>
            <p>Option 2: Share Recipe</p>
          </div>
        )}
      </div>

      <img
        style={{ "margin-bottom": 0 }}
        src={recipe.image_url}
        alt={recipe.name}
        class="recipe-image"
      />

      <div
        style={{
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          "margin-bottom": "20px",
        }}
        class="top"
      >
        {/* <div class="profile" style={{"display": "flex", "align-items": "center", "gap": "10px"}}> */}
        <img
          width={"40px"}
          style={{ "border-radius": "50%" }}
          src={profiles[recipe.id % profiles.length].image}
          alt=""
        />
        <h3>{profiles[recipe.id % profiles.length].name}</h3>
        {/* </div> */}
        <button
          onClick={() => {
            setIsLiked((prev) => {
              set_liked_recipes(recipe.id, !prev);
              return !prev;
            });
          }}
        >
          {isLiked() ? "♡" : "♥"}
        </button>
      </div>
      <p style={{ "font-size": "20px" }}>
        <strong>Time to make:</strong> {recipe.time_to_make} minutes
      </p>

      <details
        open
        class="details"
        style={{ border: "1px solid rgb(145,145,145)" }}
      >
        <summary>logistics</summary>
        <div
          style={{ color: canMakeRecipe(recipe) ? "green" : "red" }}
          class="can-make-display"
        >
          <Show
            when={canMakeRecipe(recipe)}
            fallback={<p>Cannot make this recipe</p>}
          >
            <p>Can make this recipe</p>
          </Show>
        </div>
        <progress
          value={canMakePercentage(recipe)}
          max="100"
          style={{
            "--progress-bar-color": canMakeRecipe(recipe) ? "green" : canMakePercentage(recipe) > 75 ? "orange" : "red",
          }}
        >
          {Math.round(canMakePercentage(recipe))}%
        </progress>

        <div
          onMouseEnter={() => (buttonRef!.style.display = "inline")}
          class="planner"
        >
          <p class="info">
            you have{" "}
            <span style={{ "font-weight": "bold" }}>
              {recipies_making[recipe.name] || 0}
            </span>{" "}
            of this recipe on your <a href="#recipe-planner"> planner </a>
          </p>
          <button
            ref={buttonRef}
            disabled={!canMakeRecipe(recipe)}
            onClick={() => add_to_planner(recipe)}
          >
            add to planner
          </button>
        </div>

        <div
          class="recipe-details"
          style={{ display: isVisible() ? "block" : "none" }}
        >
          <p>
            <strong>Ingredients:</strong>
          </p>
          <Ingredients_display ingredients={recipe.ingredients} />
        </div>

        <button
          class="toggle-visibility"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible() ? "Hide" : "Show"} Ingredients
        </button>
      </details>
    </div>
  );
}

function Ingredients_display({ ingredients }: { ingredients: { [key: string]: number } }) {
  return (
    <ul class="ingredients-list">
      {Object.entries(ingredients).map(([ingredient, quantity]) => (
        <li style={{ color: availibleIngredients[ingredient] >= quantity ? 'green' : 'red' }}>
          {ingredient}: {quantity} 
          <span class="have-amount" style={{ color: 'black' }}>
            {" "}(have: {availibleIngredients[ingredient] || 0})
            </span>
        </li>
      ))}
    </ul>
  );
}

function RecipeList({recipeData, should_show}: {recipeData: Dish[], should_show?: (recipe: Dish) => boolean}) {
  const time_filter = createMutable({greater_than: 0, less_than: 120})
  let ref: HTMLFormElement | undefined = undefined
  return(
    <>
    <div style={{border: "1px solid rgb(145,145,145)", width: "fit-content", margin: "0 auto", padding: "2%"}} class="too-bar">

    <h3 style={{"font-size": "2rem"}}>🛠️ tool bar</h3>
    <h4>filter recipes by time to make</h4>
    <Form data={time_filter}></Form>
    <p>show all recipes that take between {time_filter.greater_than} and {time_filter.less_than} minutes to make</p>
    <button onclick={() => $A(".details", ref)?.forEach(detail => detail.removeAttribute("open"))}>colapse all logistics details</button>
    <button onclick={() => $A(".details", ref)?.forEach(detail => detail.setAttribute("open", ""))}>expand all logistics details</button>
    </div>
    
    <div ref={ref} class="recipe-list">
    <For each={recipeData}>
      {(recipe, index) => (
      <>
      {is_sequence(recipe.time_to_make, time_filter.greater_than, time_filter.less_than) && (should_show ? should_show(recipe) : true) && <RecipeItem key={recipe.id} recipe={recipe} />}
      </>
    )}
    </For>
    </div>
    </>
  )
}


export function AllRecipes() {
  let blog_ref1: HTMLDivElement | undefined = undefined;
  let blog_ref2: HTMLDivElement | undefined = undefined;
  let blog_ref3: HTMLDivElement | undefined = undefined;
  return (
    <>

      <RecipeList recipeData={recipeData} />
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <div style={{padding: "120px", display: "flex", gap: "20px", "flex-wrap": "wrap"}}>

      <Blog_card profile={profiles_data[0]}></Blog_card>
      <Blog_card profile={profiles_data[1]}></Blog_card>
      </div>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    




      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    



      <RecipeList recipeData={recipeData} />
      <Blog ref={blog_ref1} title="The friday fiasco" headline="1000 found at the gateway" content="On a sunny friday morning, forest near my home. As I was strolling, I stumbled upon a small clearing. And to my surprise, I found 1000 dollars just lying there. I couldn't believe my eyes! I had always dreamed of finding a treasure, and here it was. I quickly grabbed the money and started to make my way back home, feeling like the luckiest person alive. But little did I know, my adventure was just beginning..." imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref2} title="The friday fiasco" headline="1000 found at the gateway" content={"during my journey along the broken path towards new beginnings i flew over the mountains of time."} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
      <button onclick={() => blog_ref1!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <button onclick={() => blog_ref3!.scrollIntoView({behavior: "smooth"})}>next blog</button>
      <RecipeList recipeData={recipeData} />
    <Blog ref={blog_ref3} title="The friday fiasco" headline="1000 found at the gateway" content={"Hello"} imageUrl="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" place_first="text"> </Blog>
        <button onclick={() => blog_ref2!.scrollIntoView({behavior: "smooth"})}>previous blog</button>
      <RecipeList recipeData={recipeData} />
    


    <h1>Liked recipes</h1>
      <RecipeList should_show={(recipe: Dish) => liked_recipes[recipe.id]} recipeData={recipeData} />
        <button onclick={() => console.log(liked_recipes)}>log likes</button>
      </>
  );
}



