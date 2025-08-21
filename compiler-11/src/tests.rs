#[cfg(test)]
mod tests {
    use crate::{Parser, TokenType, DataType, Expression};

    #[test]
    fn test_parse_variable_declaration() {
        let mut p = Parser::new("var num int = 10".to_string());
        p.tokenizer.expect(TokenType::Keyword);
        let var = p.parse_var();
        assert_eq!(var.name, "num");
        assert_eq!(var.type_, DataType::Int);
        if let Some(Expression::Token(token)) = var.value {
            assert_eq!(token.value, "10");
        } else {
            panic!("Expected a value");
        }
    }
}
