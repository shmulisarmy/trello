use std::collections::HashMap;
use once_cell::sync::Lazy;
use crate::token::{Token, TokenType};

static OPERATOR_CHARS : &str = "+-*/|=<>";
static PUNCTUATION_CHARS : &str = "()[]{},:";

static KEYWORDS: Lazy<HashMap<&'static str, TokenType>> = Lazy::new(|| {
    let mut hm = HashMap::new();
    hm.insert("var", TokenType::Keyword);
    hm.insert("return", TokenType::Keyword);
    hm.insert("if", TokenType::Keyword);
    hm.insert("else", TokenType::Keyword);
    hm.insert("while", TokenType::Keyword);
    hm.insert("for", TokenType::Keyword);
    hm.insert("break", TokenType::Keyword);
    hm.insert("continue", TokenType::Keyword);
    hm.insert("func", TokenType::Keyword);
    hm.insert("struct", TokenType::Keyword);
    hm
});

pub struct  Tokenizer{
    pub source : String,
    pub index : usize
}

impl Tokenizer {
    pub fn new(source : String) -> Tokenizer {
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
    pub fn in_range(&self) -> bool {
        self.index < self.source.len()
    }
    pub fn eat_lines(&mut self) {
        while self.cur_char() == ' ' || self.cur_char() == '\t' || self.cur_char() == '\n' {
            self.index += 1;
        }
    }
    fn eat_spaces(&mut self) {
        while self.in_range() && (self.cur_char() == ' ' || self.cur_char() == '\t') {
            self.index += 1;
        }
    }

    pub fn peek(&mut self) -> Option<Token> {
        let index = self.index;
        let token = self.next();
        self.index = index;
        token
    }
    pub fn next(&mut self) -> Option<Token> {
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
            let word = self.next_word();
            if let Some(keyword) = KEYWORDS.get(word.as_str()) {
                return Some(Token { type_: keyword.clone(), value: word });
            }
            return Some(Token { type_: TokenType::Identifier, value: word });
        }
        if self.cur_char().is_numeric(){
            return Some(Token { type_: TokenType::Number, value: self.next_number() });
        }
        if self.cur_char() == '"' {
            return Some(Token { type_: TokenType::String, value: self.next_string() });
        }
        if PUNCTUATION_CHARS.contains(self.cur_char()) {
            let this_char = self.cur_char();
            self.index += 1;
            return Some(Token { type_: TokenType::Punctuation, value: this_char.to_string() });
        }
        if OPERATOR_CHARS.contains(self.cur_char()) {
            let this_char = self.cur_char();
            self.index += 1;
            return Some(Token { type_: TokenType::Operator, value: this_char.to_string() });
        }
        match self.cur_char() {
            ' ' => {
                self.index += 1;
                self.next()
            }
            _ => None
        }
        
    }


    pub fn get_line_and_col_from_pos(&self, pos : usize) -> (usize, usize) {
        let line = self.source.lines().count();
        let col = self.source.lines().nth(line - 1).unwrap().len();
        (line, col)
    }


    pub fn show_user_error(&mut self, start_pos : usize, end_pos : usize, message : String) {
        let all_text_up_until_this_point = &self.source[..start_pos];
        print!("{}", all_text_up_until_this_point);
        println!("{}", red(self.source[start_pos..end_pos].to_string()));
        panic!("{} on line {} column {}", red(message), self.get_line_and_col_from_pos(start_pos).0, self.get_line_and_col_from_pos(start_pos).1);
    }
    pub fn expect(&mut self, type_ : TokenType) -> Token {
        let start_pos = self.index;
        let token = self.next().unwrap();
        if token.type_ != type_ {
            self.show_user_error(start_pos, self.index, format!("Expected {:?} got {:?}", type_, token.type_));
        }
        token
    }

    pub fn expect_punctuation(&mut self, value : char) -> Token {
        let token = self.next().unwrap();
        if token.type_ != TokenType::Punctuation || token.value.len() != 1 || token.value.chars().nth(0).unwrap() != value {
            self.show_user_error(self.index, self.index, format!("Expected {} got {}", value, token.value));
        }
        token
    }
    fn optionally_expect(&mut self, type_ : TokenType) -> Option<String> {
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

    pub fn optionally_expect_string(&mut self, value : &str) -> bool {
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

    pub fn optionally_expect_keyword_of(&mut self, value : &str) -> bool {
        let position_at_start = self.index;
        let token = self.next();
        if token.is_none() {
            self.index = position_at_start;
            return false;
        }
        let token = token.unwrap();
        if token.type_ != TokenType::Keyword {
            self.index = position_at_start;
            return false;
        }
        if token.value == value{
            return true;
        }
        self.index = position_at_start;
        return false;
    }

    pub fn optionally_expect_punctuation(&mut self, value : char) -> bool {
        let position_at_start = self.index;
        let token = self.next();
        if token.is_none() {
            self.index = position_at_start;
            return false;
        }
        let token = token.unwrap();
        if token.type_ != TokenType::Punctuation {
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

    // pub fn optionally_expect_keyword_of(&mut self, value: &str) -> bool {
    //     let position_at_start = self.index;
    //     let token = self.next();
    //     if token.is_none() {
    //         self.index = position_at_start;
    //         return false;
    //     }
    //     let token = token.unwrap();
    //     if token.type_ != TokenType::Keyword || token.value != value {
    //         self.index = position_at_start;
    //         return false;
    //     }
    //     true
    // }


}





fn red(text : String) -> String {
    format!("\x1B[31m{}\x1B[0m", text)
}