import { createEffect } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { addToast } from '../lightning/toast';


export const availibleIngredients = createMutable<{ [key: string]: number; }>({
  eggs: 2,
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
});


const ingredients_watching = new Map<string, number>()



function watch(ingredient: string, amount: number) {
  if (ingredients_watching.has(ingredient)) {
    ingredients_watching.set(ingredient, amount)
    return
  }
  ingredients_watching.set(ingredient, amount)
  createEffect(() => {
    if (availibleIngredients[ingredient] < ingredients_watching.get(ingredient)!) {
      addToast('warning', {header: `running low on ${ingredient}`, message: `only ${availibleIngredients[ingredient]} left`}, 30000)
    }
    
  })
}


watch('eggs', 3)
watch('bacon', 1)
watch('pasta', 1)
watch('pepper', 2)
watch('parmesan', 2)
watch('onion', 1)
watch('garlic', 1)
watch('chicken', 1)
watch('coconut_milk', 5)