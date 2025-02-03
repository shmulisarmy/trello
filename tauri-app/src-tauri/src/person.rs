pub struct Person {
    pub name: String,
    pub email: String,
    pub age: u8,
    pub height: u8,
    pub weight: u8,

}


impl Person {
    pub fn bmi(&self) -> f32 {
        self.weight as f32 / self.height as f32 
    }
    pub fn display(&self){
        println!("Name: {}, Email: {}, Age: {}, and you bmi is {}", self.name, self.email, self.age, self.bmi())
    }
}