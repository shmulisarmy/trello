

fn max(arr: Vec<i32>) -> i32{
    let mut max_so_far = 0;
    for num in &arr{
        if *num > max_so_far{
            max_so_far = *num;
        }
    }
    max_so_far
}



fn main(){
    let numbers = vec![1, 2, 3, 14, 10, 5];

    let highest_one = max(numbers.clone());


    for iter in 0..highest_one{
        let i = highest_one-iter;
        println!("");
        for num in &numbers{
            if *num >= i{
                print!("| ");
            } else {
                print!("  ");
            }
        }
    }
}