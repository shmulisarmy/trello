#[derive(Debug, PartialEq, Clone)]
pub enum TokenType {
    Identifier,
    Number,
    String,
    Punctuation,
    Operator,
    Keyword,
}

#[derive(Debug)]
pub struct  Token {
    pub type_ : TokenType,
    pub value : String
}
