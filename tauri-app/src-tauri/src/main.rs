// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod person;
use person::Person;


fn main() {
    let people = vec![
        Person {
            name: "John Doe".to_string(),
            email: "t6o1o@example.com".to_string(),
            age: 30,
            height: 180,
            weight: 75
        },
        Person {
            name: "Jane Doe".to_string(),
            email: "t6o1o@example.com".to_string(),
            age: 25,
            height: 170,
            weight: 70
        },
        Person {
            name: "John Doe".to_string(),
            email: "t6o1o@example.com".to_string(),
            age: 30,
            height: 180,
            weight: 75
        },
        Person {
            name: "Jane Doe".to_string(),
            email: "t6o1o@example.com".to_string(),
            age: 25,
            height: 170,
            weight: 70
        },
    ];

    for person in people{
        person.display();
        }




    tauri_app_lib::run()
}
