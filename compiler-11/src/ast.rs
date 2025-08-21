use std::fmt;
use colored::*;
use crate::{data_type::DataType, token::Token};

fn format_type(s: &str) -> String {
    s.blue().to_string()
}

fn format_keyword(s: &str) -> String {
    s.blue().bold().to_string()
}

fn format_identifier(s: &str) -> String {
    s.yellow().to_string()
}

fn format_number(s: &str) -> String {
    s.green().to_string()
}

fn format_operator(s: &str) -> String {
    s.cyan().to_string()
}

fn format_string(s: &str) -> String {
    s.red().to_string()
}

fn indent(f: &mut std::fmt::Formatter, depth: usize) -> fmt::Result {
    write!(f, "{:indent$}", "", indent = depth * 2)
}

impl fmt::Display for FunctionCall {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}(", format_identifier(&self.name))?;
        for (i, arg) in self.args.iter().enumerate() {
            if i > 0 { write!(f, "{}", ", ".white())?; }
            write!(f, "{}", arg)?;
        }
        write!(f, "{}", ")".white())
    }
}

#[derive(Debug)]
pub struct FunctionCall {
    pub name : String,
    pub args : Vec<Expression>
}

impl fmt::Display for Variable {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}: {}", format_identifier(&self.name), format_type(&self.type_.to_string()))?;
        if let Some(expr) = &self.value {
            write!(f, " {} {}", "=".white(), expr)?;
        }
        Ok(())
    }
}

#[derive(Debug)]
pub struct Variable {
    pub name : String,
    pub type_ : DataType,
    pub value : Option<Expression>
}

impl fmt::Display for OperatorUse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({} {} {})", self.left, format_operator(&self.operator), self.right)
    }
}

#[derive(Debug)]
pub struct OperatorUse {
    pub left : Box<Expression>,
    pub operator : String,
    pub right : Box<Expression>
}

impl fmt::Display for Expression {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Expression::OperatorUse(op) => write!(f, "{}", op),
            Expression::Token(t) => match t.type_ {
                crate::token::TokenType::Number => write!(f, "{}", format_number(&t.value)),
                crate::token::TokenType::String => write!(f, "\"{}\"", format_string(&t.value)),
                crate::token::TokenType::Keyword => write!(f, "{}", format_keyword(&t.value)),
                _ => write!(f, "{}", format_identifier(&t.value)),
            },
            Expression::FunctionCall(func) => write!(f, "{}", func),
        }
    }
}

#[derive(Debug)]
pub enum Expression {
    OperatorUse(OperatorUse)   ,
    Token(Token),
    FunctionCall(FunctionCall)
}

impl fmt::Display for ValidInFunctionBody {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ValidInFunctionBody::Variable(var) => write!(f, "{}", var),
            ValidInFunctionBody::Expression(expr) => write!(f, "{}", expr),
            ValidInFunctionBody::Return(expr) => write!(f, "{} {}", format_keyword("return"), expr),
        }
    }
}

#[derive(Debug)]
pub enum ValidInFunctionBody {
    Variable(Variable),
    Expression(Expression),
    Return(Expression),
}

impl fmt::Display for FunctionDef {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Function signature
        write!(f, "{} {} (", format_keyword("fn"), format_identifier(&self.name))?;
        
        // Arguments
        for (i, arg) in self.args.iter().enumerate() {
            if i > 0 { write!(f, "{}", ", ".white())?; }
            write!(f, "{}", arg)?;
        }
        
        // Return type and opening brace
        write!(f, ") {} {} {{", "->".white(), format_type(&self.return_type.to_string()))?;
        
        // Function body with proper indentation
        if !self.body.is_empty() {
            writeln!(f)?;
            for item in &self.body {
                write!(f, "    {}\n", item)?;
            }
        }
        
        // Closing brace
        write!(f, "{}", "}".white())
    }
}

#[derive(Debug)]
pub struct FunctionDef {
    pub name: String,
    pub args: Vec<Variable>,
    pub return_type: DataType,
    pub body: Vec<ValidInFunctionBody>,
}



