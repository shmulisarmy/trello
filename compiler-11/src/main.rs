use core::str;



#[derive(Debug)]
struct  Token {
    type_ : String,
    value : String
}


struct  Tokenizer{
    source : String,
    index : usize
}



#[derive(Debug)]
struct  FunctionCall{
    name : String,
    args : Vec<Expression>
}


#[derive(Debug)]
struct  Variable{
    name : String,
    type_ : String,
    value : Option<Expression>
}


static OPERATOR_CHARS : &str = "+-*/|=<>";
static PUNCTUATION_CHARS : &str = "()[]{},";

impl Tokenizer {
    fn new(source : String) -> Tokenizer {
        Tokenizer { source, index: 0 }
    }

    fn cur_char(&self) -> char {
        self.source.chars().nth(self.index).unwrap()
    }
    fn next_word(&mut self) -> String {
        let start = self.index;
        while self.in_range() && ((self.cur_char() >= 'a' && self.cur_char() <= 'z') || (self.cur_char() >= 'A' && self.cur_char() <= 'Z') || self.cur_char() == '_') {
            self.index += 1;
        }
        self.source[start..self.index].to_string()
    }

    fn next_number(&mut self) -> String {
        let start = self.index;
        while self.in_range() && (self.cur_char().is_numeric() || self.cur_char() == '.') {
            self.index += 1;
        }
        self.source[start..self.index].to_string()
    }


    fn next_string(&mut self) -> String {
        self.index += 1;
        let start = self.index;
        while self.cur_char() != '"' {
            self.index += 1;
        }
        let end = self.index;
        self.index += 1;
        self.source[start..end].to_string()
    }
    fn in_range(&self) -> bool {
        self.index < self.source.len()
    }
    fn eat_lines(&mut self) {
        while self.cur_char() == ' ' || self.cur_char() == '\t' || self.cur_char() == '\n' {
            self.index += 1;
        }
    }
    fn eat_spaces(&mut self) {
        while self.in_range() && (self.cur_char() == ' ' || self.cur_char() == '\t') {
            self.index += 1;
        }
    }

    fn peek(&mut self) -> Option<Token> {
        let index = self.index;
        let token = self.next();
        self.index = index;
        token
    }
    fn next(&mut self) -> Option<Token> {
        let next_token = self.next_under_wapper();
        println!("just tokenized {:?}", next_token);
        next_token
    }

    fn next_under_wapper(&mut self) -> Option<Token> {
        self.eat_spaces();
        if !self.in_range() {
            return None;
        }
        if self.cur_char().is_alphabetic(){
            return Some(Token { type_: "IDENTIFIER".to_string(), value: self.next_word() });
        }
        if self.cur_char().is_numeric(){
            return Some(Token { type_: "NUMBER".to_string(), value: self.next_number() });
        }
        if self.cur_char() == '"' {
            return Some(Token { type_: "STRING".to_string(), value: self.next_string() });
        }
        if PUNCTUATION_CHARS.contains(self.cur_char()) {
            let this_char = self.cur_char();
            self.index += 1;
            return Some(Token { type_: "PUNCTUATION".to_string(), value: this_char.to_string() });
        }
        if OPERATOR_CHARS.contains(self.cur_char()) {
            let this_char = self.cur_char();
            self.index += 1;
            return Some(Token { type_: "OPERATOR".to_string(), value: this_char.to_string() });
        }
        match self.cur_char() {
            ' ' => {
                self.index += 1;
                self.next()
            }
            _ => None
        }
        
    }
    fn expect(&mut self, type_ : &str) -> Token {
        let token = self.next().unwrap();
        if token.type_ != type_ {
            panic!("Expected {} got {}", type_, token.type_);
        }
        token
    }

    fn expect_punctuation(&mut self, value : char) -> Token {
        let token = self.next().unwrap();
        if token.type_ != "PUNCTUATION" || token.value.len() != 1 || token.value.chars().nth(0).unwrap() != value {
            panic!("Expected {} got {}", value, token.value);
        }
        token
    }
    fn optionally_expect(&mut self, type_ : &str) -> Option<String> {
        let position_at_start = self.index;
        let token = self.next();
        if token.is_none() {
            self.index = position_at_start;
            return None;
        }
        let token = token.unwrap();
        if token.type_ != type_ {
            self.index = position_at_start;
            return None;
        }
        Some(token.value)
    }

    fn optionally_expect_string(&mut self, value : &str) -> bool {
        if !self.in_range() {
            return false;
        }
        let position_at_start = self.index;
        let token = self.next();
        if token.is_none() {
            self.index = position_at_start;
            return false;
        }
        let token = token.unwrap();
        if token.value != value {
            self.index = position_at_start;
            return false;
        }
        true
    }

    fn optionally_expect_punctuation(&mut self, value : char) -> bool {
        let position_at_start = self.index;
        let token = self.next();
        if token.is_none() {
            self.index = position_at_start;
            return false;
        }
        let token = token.unwrap();
        if token.type_ != "PUNCTUATION" {
            self.index = position_at_start;
            return false;
        }
        println!("in optionally_expect_punctuation: token.value.chars().nth(0).unwrap(): {}", token.value.chars().nth(0).unwrap());
        if token.value.chars().nth(0).unwrap() == value{
            println!("returning true");
            return true;
        }
        println!("returning false");
        self.index = position_at_start;
        return false;
    }


}


use std::{collections::HashMap, usize};
use once_cell::sync::Lazy;

static OPERATOR_PRECEDENCE: Lazy<HashMap<&'static str, u32>> = Lazy::new(|| {
    let mut hm = HashMap::new();
    hm.insert("+", 1);
    hm.insert("-", 1);
    hm.insert("*", 2);
    hm.insert("/", 2);
    hm.insert("|", 3);
    hm
});

#[derive(Debug)]
struct  OperatorUse {
    left : Box<Expression>,
    operator : String,
    right : Box<Expression>
}




#[derive(Debug)]
enum Expression {
    OperatorUse(OperatorUse)   ,
    Token(Token),
    FunctionCall(FunctionCall)

}


struct  Parser{
    tokenizer : Tokenizer
}

impl Parser {
    fn new(source : String) -> Parser {
        Parser { tokenizer : Tokenizer::new(source) }
    }


    fn parse_var(&mut self) -> Variable {
        let name = self.tokenizer.expect("IDENTIFIER");
        let type_ = self.parse_type();
        if self.tokenizer.optionally_expect_string("=") {
            let value = self.parse_expression(0);
            return Variable { name: name.value, type_, value : Some(value) };
        }
        return Variable { name: name.value, type_, value : None };
    }


    fn parse_expression_piece(&mut self) -> Expression {
        let position_at_start = self.tokenizer.index;
        let next_token = self.tokenizer.next();
        if next_token.is_none() {
            panic!("Unexpected end of file");
        }
        let next_token = next_token.unwrap();
        if  self.tokenizer.optionally_expect_punctuation('(') {
            self.tokenizer.index = position_at_start;
            return Expression::FunctionCall(self.parse_function_call());
        }
        return Expression::Token(next_token);
    }

    fn collect_expression_list(&mut self, start_punctuation : char, end_punctuation : char) -> Vec<Expression> {
        let mut expression_list = Vec::new();
        self.tokenizer.expect_punctuation(start_punctuation);
        while !self.tokenizer.optionally_expect_punctuation(end_punctuation) {
            expression_list.push(self.parse_expression(0));
            println!("self.tokenizer.index: {}", self.tokenizer.index);
            self.tokenizer.expect_punctuation(',');
        }
        expression_list
    }
    

    fn parse_function_call(&mut self) -> FunctionCall {
        let name = self.tokenizer.expect("IDENTIFIER");
        let args = self.collect_expression_list('(', ')');
        return FunctionCall { name: name.value, args };
    }
    fn parse_expression(&mut self, left_pull : u32) -> Expression {
        let mut left: Expression = self.parse_expression_piece();
        while self.tokenizer.in_range() && let Some(token) = self.tokenizer.peek() {
            if token.type_ == "OPERATOR" && *OPERATOR_PRECEDENCE.get(token.value.as_str()).unwrap() > left_pull {
                self.tokenizer.next();
                left = Expression::OperatorUse(OperatorUse {
                    operator: token.value.clone(),
                    left: Box::new(left),
                    right: Box::new(self.parse_expression(*OPERATOR_PRECEDENCE.get(token.value.as_str()).unwrap())),
                });
            } else {
                break;
            }
        }
        return left;
        
    }
    fn parse_type(&mut self) -> String {
        let token = self.tokenizer.expect("IDENTIFIER");
        return token.value;
    }


}   
fn main() {
    let mut p = Parser::new("var num int = b * 9 + a(a, 3*0,)".to_string());
    p.tokenizer.expect("IDENTIFIER");
    let var = p.parse_var();
    println!("{:?}", var);



}
