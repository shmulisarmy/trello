use compiler_11::parser::Parser;
use compiler_11::token::TokenType;

fn main() {
    let mut p = Parser::new("var num int = b * 9 + a(a, 3*0,)".to_string());
    p.tokenizer.expect(TokenType::Keyword);
    let var = p.parse_var();
    println!("{:?}", var);
}