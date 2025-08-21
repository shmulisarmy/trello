use std::fmt;

#[derive(Debug, PartialEq, Clone)]
pub enum TokenType {
    Identifier,
    Number,
    String,
    Punctuation,
    Operator,
    Keyword,
}

impl fmt::Display for TokenType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TokenType::Identifier => write!(f, "identifier"),
            TokenType::Number => write!(f, "number"),
            TokenType::String => write!(f, "string"),
            TokenType::Punctuation => write!(f, "punctuation"),
            TokenType::Operator => write!(f, "operator"),
            TokenType::Keyword => write!(f, "keyword"),
        }
    }
}

impl fmt::Display for Token {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.value)
    }
}

#[derive(Debug)]
pub struct Token {
    pub type_ : TokenType,
    pub value : String
}
