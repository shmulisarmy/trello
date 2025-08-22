use crate::{
    data_type::DataType,
    lexer::token::{Token, TokenType},
};
use colored::*;
use std::fmt;

impl AstComparable for String {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        if self == other {
            Ok(())
        } else {
            Err(vec![ComparisonError::MismatchedValues(format!(
                "Expected '{}', but got '{}'",
                self, other
            ))])
        }
    }
}

impl AstComparable for DataType {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        if self == other {
            Ok(())
        } else {
            Err(vec![ComparisonError::MismatchedValues(format!(
                "Expected type '{:?}', but got '{:?}'",
                self, other
            ))])
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum ComparisonError {
    MismatchedTypes,
    MismatchedValues(String),
    MismatchedLengths(usize, usize),
    MismatchedVariant,
    Custom(String),
}

impl std::fmt::Display for ComparisonError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ComparisonError::MismatchedTypes => write!(f, "types do not match"),
            ComparisonError::MismatchedValues(details) => write!(f, "{}", details),
            ComparisonError::MismatchedLengths(expected, actual) => {
                write!(f, "length mismatch: expected {}, got {}", expected, actual)
            }
            ComparisonError::MismatchedVariant => write!(f, "enum variants do not match"),
            ComparisonError::Custom(msg) => write!(f, "{}", msg),
        }
    }
}

impl std::error::Error for ComparisonError {}

pub trait AstComparable: std::fmt::Debug {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>>;
}

fn compare_optional<T: AstComparable>(
    a: &Option<T>,
    b: &Option<T>,
    context: &str,
) -> Result<(), Vec<ComparisonError>> {
    match (a, b) {
        (Some(a_val), Some(b_val)) => a_val.compare(b_val).map_err(|mut errs| {
            errs.push(ComparisonError::Custom(format!("In {}: ", context)));
            errs
        }),
        (None, None) => Ok(()),
        _ => Err(vec![ComparisonError::MismatchedValues(format!(
            "One value is Some while the other is None in {}",
            context
        ))]),
    }
}

fn compare_vec<T: AstComparable>(
    a: &[T],
    b: &[T],
    context: &str,
) -> Result<(), Vec<ComparisonError>> {
    if a.len() != b.len() {
        return Err(vec![ComparisonError::MismatchedLengths(a.len(), b.len())]);
    }

    let mut errors = Vec::new();
    for (i, (a_item, b_item)) in a.iter().zip(b.iter()).enumerate() {
        if let Err(mut errs) = a_item.compare(b_item) {
            errors.extend(
                errs.into_iter().map(|e| {
                    ComparisonError::Custom(format!("At index {} in {}: {}", i, context, e))
                }),
            );
        }
    }

    if errors.is_empty() {
        Ok(())
    } else {
        Err(errors)
    }
}

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

impl AstComparable for FunctionCall {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        let mut errors = Vec::new();

        if self.name != other.name {
            errors.push(ComparisonError::MismatchedValues(format!(
                "Function name mismatch: '{}' != '{}'",
                self.name, other.name
            )));
        }

        if let Err(mut errs) = compare_vec(&self.args, &other.args, "function arguments") {
            errors.extend(errs);
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

impl PartialEq for FunctionCall {
    fn eq(&self, other: &Self) -> bool {
        self.compare(other).is_ok()
    }
}

impl fmt::Display for FunctionCall {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}(", format_identifier(&self.name))?;
        for (i, arg) in self.args.iter().enumerate() {
            if i > 0 {
                write!(f, "{}", ", ".white())?;
            }
            write!(f, "{}", arg)?;
        }
        write!(f, "{}", ")".white())
    }
}

#[derive(Debug)]
pub struct FunctionCall {
    pub name: String,
    pub args: Vec<Expression>,
}

impl AstComparable for Variable {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        let mut errors = Vec::new();

        if self.name != other.name {
            errors.push(ComparisonError::MismatchedValues(format!(
                "Variable name mismatch: '{}' != '{}'",
                self.name, other.name
            )));
        }

        if self.type_ != other.type_ {
            errors.push(ComparisonError::MismatchedValues(format!(
                "Type mismatch for variable '{}': {:?} != {:?}",
                self.name, self.type_, other.type_
            )));
        }

        if let Err(mut errs) = compare_optional(&self.value, &other.value, "variable value") {
            errors.extend(errs);
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

impl PartialEq for Variable {
    fn eq(&self, other: &Self) -> bool {
        self.compare(other).is_ok()
    }
}

impl fmt::Display for Variable {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}: {}",
            format_identifier(&self.name),
            format_type(&self.type_.to_string())
        )?;
        if let Some(expr) = &self.value {
            write!(f, " {} {}", "=".white(), expr)?;
        }
        Ok(())
    }
}

#[derive(Debug)]
pub struct Variable {
    pub name: String,
    pub type_: DataType,
    pub value: Option<Expression>,
}

impl AstComparable for OperatorUse {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        let mut errors = Vec::new();

        if self.operator != other.operator {
            errors.push(ComparisonError::MismatchedValues(format!(
                "Operator mismatch: '{}' != '{}'",
                self.operator, other.operator
            )));
        }

        if let Err(mut errs) = self.left.compare(&other.left) {
            errors.extend(
                errs.into_iter()
                    .map(|e| ComparisonError::Custom(format!("In left operand: {}", e))),
            );
        }

        if let Err(mut errs) = self.right.compare(&other.right) {
            errors.extend(
                errs.into_iter()
                    .map(|e| ComparisonError::Custom(format!("In right operand: {}", e))),
            );
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

impl PartialEq for OperatorUse {
    fn eq(&self, other: &Self) -> bool {
        self.compare(other).is_ok()
    }
}

impl fmt::Display for OperatorUse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "({} {} {})",
            self.left,
            format_operator(&self.operator),
            self.right
        )
    }
}

#[derive(Debug)]
pub struct OperatorUse {
    pub left: Box<Expression>,
    pub operator: String,
    pub right: Box<Expression>,
}

impl AstComparable for Expression {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        match (self, other) {
            (Expression::OperatorUse(a), Expression::OperatorUse(b)) => a.compare(b),
            (Expression::Token(a), Expression::Token(b)) => {
                if a.type_ != b.type_ || a.value != b.value {
                    Err(vec![ComparisonError::MismatchedValues(format!(
                        "Token mismatch: {:?} != {:?}",
                        a, b
                    ))])
                } else {
                    Ok(())
                }
            }
            (Expression::FunctionCall(a), Expression::FunctionCall(b)) => a.compare(b),
            _ => Err(vec![ComparisonError::MismatchedVariant]),
        }
    }
}

impl PartialEq for Expression {
    fn eq(&self, other: &Self) -> bool {
        self.compare(other).is_ok()
    }
}

impl fmt::Display for Expression {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Expression::OperatorUse(op) => write!(f, "{}", op),
            Expression::Token(t) => match t.type_ {
                crate::lexer::token::TokenType::Number => write!(f, "{}", format_number(&t.value)),
                crate::lexer::token::TokenType::String => write!(f, "\"{}\"", format_string(&t.value)),
                crate::lexer::token::TokenType::Keyword => write!(f, "{}", format_keyword(&t.value)),
                _ => write!(f, "{}", format_identifier(&t.value)),
            },
            Expression::FunctionCall(func) => write!(f, "{}", func),
        }
    }
}

#[derive(Debug)]
pub enum Expression {
    OperatorUse(OperatorUse),
    Token(Token),
    FunctionCall(FunctionCall),
}

impl AstComparable for ValidInFunctionBody {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        match (self, other) {
            (ValidInFunctionBody::Variable(a), ValidInFunctionBody::Variable(b)) => a.compare(b),
            (ValidInFunctionBody::Expression(a), ValidInFunctionBody::Expression(b)) => {
                a.compare(b)
            }
            (ValidInFunctionBody::Return(a), ValidInFunctionBody::Return(b)) => a.compare(b),
            _ => Err(vec![ComparisonError::MismatchedVariant]),
        }
    }
}

impl PartialEq for ValidInFunctionBody {
    fn eq(&self, other: &Self) -> bool {
        self.compare(other).is_ok()
    }
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

impl AstComparable for FunctionDef {
    fn compare(&self, other: &Self) -> Result<(), Vec<ComparisonError>> {
        let mut errors = Vec::new();

        if self.name != other.name {
            errors.push(ComparisonError::MismatchedValues(format!(
                "Function name mismatch: '{}' != '{}'",
                self.name, other.name
            )));
        }

        if self.return_type != other.return_type {
            errors.push(ComparisonError::MismatchedValues(format!(
                "Return type mismatch: '{:?}' != '{:?}'",
                self.return_type, other.return_type
            )));
        }

        if let Err(mut errs) = compare_vec(&self.args, &other.args, "function arguments") {
            errors.extend(errs);
        }

        if let Err(mut errs) = compare_vec(&self.body, &other.body, "function body") {
            errors.extend(errs);
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

impl PartialEq for FunctionDef {
    fn eq(&self, other: &Self) -> bool {
        self.compare(other).is_ok()
    }
}

impl fmt::Display for FunctionDef {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Function signature
        write!(
            f,
            "{} {} (",
            format_keyword("fn"),
            format_identifier(&self.name)
        )?;

        // Format arguments with proper coloring
        for (i, arg) in self.args.iter().enumerate() {
            if i > 0 {
                write!(f, "{}", ", ".white())?;
            }
            write!(
                f,
                "{}: {}",
                format_identifier(&arg.name),
                format_type(&arg.type_.to_string())
            )?;
        }

        // Return type and opening brace
        write!(
            f,
            ") {} {} {{\n",
            "->".white(),
            format_type(&self.return_type.to_string())
        )?;

        // Function body with proper indentation
        for stmt in &self.body {
            write!(f, "    {}\n", stmt)?;
        }

        // Closing brace
        write!(f, "}}")
    }
}

#[derive(Debug)]
pub struct FunctionDef {
    pub name: String,
    pub args: Vec<Variable>,
    pub return_type: DataType,
    pub body: Vec<ValidInFunctionBody>,
}
