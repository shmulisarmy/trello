use std::collections::HashMap;





fn main() {
    let available_ingredients: HashMap<String, i32> = HashMap::new();
    available_ingredients.insert("eggs".to_string(), 2);
    available_ingredients.insert("flour".to_string(), 4);
    available_ingredients.insert("cheese".to_string(), 3);
    available_ingredients.insert("butter".to_string(), 2);
    available_ingredients.insert("flour".to_string(), 1);
    available_ingredients.insert("sugar".to_string(), 3);
    available_ingredients.insert("water".to_string(), 10);
    



    let recipes: HashMap<String, HashMap<String, i32>> = HashMap::new();
    recipes.insert("bread", HashMap::new(
        [("eggs", 2), ("flour", 1), ("butter", 1)].iter().collect(),
    ));

    recipes.insert("cake", HashMap::new(
        [("eggs", 1), ("flour", 1), ("butter", 1), ("sugar", 3)].iter().collect(),
    ));


    // To print and verify the HashMap
    for (ingredient, quantity) in &available_ingredients {
        println!("{}: {}", ingredient, quantity);
    }
}
