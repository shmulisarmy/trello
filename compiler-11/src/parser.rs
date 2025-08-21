use std::collections::HashMap;
use once_cell::sync::Lazy;
use crate::{
    ast::{Expression, FunctionCall, FunctionDef, OperatorUse, ValidInFunctionBody, Variable},
    data_type::DataType,
    token::TokenType,
    tokenizer::Tokenizer,
};

static OPERATOR_PRECEDENCE: Lazy<HashMap<&'static str, u32>> = Lazy::new(|| {
    let mut hm = HashMap::new();
    hm.insert("+", 1);
    hm.insert("-", 1);
    hm.insert("*", 2);
    hm.insert("/", 2);
    hm.insert("|", 3);
    hm
});

pub struct  Parser{
    pub tokenizer : Tokenizer
}

impl Parser {
    pub fn new(source : String) -> Parser {
        Parser { tokenizer : Tokenizer::new(source) }
    }


    pub fn parse_var(&mut self) -> Variable {
        let name = self.tokenizer.expect(TokenType::Identifier);
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

    fn collect_custom_list<T>(&mut self, parser_method : fn(&mut Parser) -> T, start_punctuation : char, end_punctuation : char) -> Vec<T> {
        let mut expression_list = Vec::new();
        self.tokenizer.expect_punctuation(start_punctuation);
        while !self.tokenizer.optionally_expect_punctuation(end_punctuation) {  
            expression_list.push(parser_method(self));
            println!("self.tokenizer.index: {}", self.tokenizer.index);
            self.tokenizer.expect_punctuation(',');
        }
        expression_list
    }

    fn collect_custom_list_without_comma<T>(&mut self, parser_method : fn(&mut Parser) -> T, start_punctuation : char, end_punctuation : char) -> Vec<T> {
        let mut expression_list = Vec::new();
        self.tokenizer.expect_punctuation(start_punctuation);
        self.tokenizer.eat_lines();
        while !self.tokenizer.optionally_expect_punctuation(end_punctuation) {  
            expression_list.push(parser_method(self));
            println!("self.tokenizer.index: {}", self.tokenizer.index);
            self.tokenizer.eat_lines();
        }
        expression_list
    }
    

    fn parse_function_call(&mut self) -> FunctionCall {
        let name = self.tokenizer.expect(TokenType::Identifier);
        let args = self.collect_expression_list('(', ')');
        return FunctionCall { name: name.value, args };
    }


    pub fn parse_function_header(&mut self) -> (String, Vec<Variable>, DataType) {
        let name = self.tokenizer.expect(TokenType::Identifier);
        let args = self.collect_custom_list(|parser| parser.parse_var(), '(', ')');
        if self.tokenizer.optionally_expect_punctuation(':') {
            let return_type = self.parse_type();
            return (name.value, args, return_type);
        } 
        let return_type = DataType::None;
        return (name.value, args, return_type);
    }

    fn parse_valid_in_function_body(&mut self) -> ValidInFunctionBody {
        if self.tokenizer.optionally_expect_keyword_of("var"){
            return ValidInFunctionBody::Variable(self.parse_var());
        }
        if self.tokenizer.optionally_expect_keyword_of("return"){
            return ValidInFunctionBody::Return(self.parse_expression(0));
        }
        return ValidInFunctionBody::Expression(self.parse_expression(0));
    }

    pub fn parse_function(&mut self) -> FunctionDef {
        let (name, args, return_type) = self.parse_function_header();
        let body = self.collect_custom_list_without_comma(|parser| parser.parse_valid_in_function_body(), '{', '}');
        return FunctionDef { name, args, return_type, body };
    }
    pub fn parse_expression(&mut self, left_pull : u32) -> Expression {
        let mut left: Expression = self.parse_expression_piece();
        while self.tokenizer.in_range() {
            if let Some(token) = self.tokenizer.peek() {
                if token.type_ == TokenType::Operator && *OPERATOR_PRECEDENCE.get(token.value.as_str()).unwrap() > left_pull {
                    self.tokenizer.next();
                    left = Expression::OperatorUse(OperatorUse {
                        operator: token.value.clone(),
                        left: Box::new(left),
                        right: Box::new(self.parse_expression(*OPERATOR_PRECEDENCE.get(token.value.as_str()).unwrap())),
                    });
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        return left;
        
    }
    fn parse_type(&mut self) -> DataType {
        let token = self.tokenizer.expect(TokenType::Identifier);
        match token.value.as_str() {
            "int" => DataType::Int,
            "string" => DataType::String,
            _ => panic!("Unknown type {}", token.value)
        }
    }


}
