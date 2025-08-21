use compiler_11::{parser::Parser, token::TokenType, data_type::DataType, ast::Expression};

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

#[test]
fn test_parse_function() {
    let mut p = Parser::new("my_func(a int, b int,): int { return a + b }".to_string());
    let function = p.parse_function();
    assert_eq!(function.name, "my_func");
    assert_eq!(function.args.len(), 2);
    assert_eq!(function.args[0].name, "a");
    assert_eq!(function.args[0].type_, DataType::Int);
    assert_eq!(function.args[1].name, "b");
    assert_eq!(function.args[1].type_, DataType::Int);
    assert_eq!(function.return_type, DataType::Int);
    assert_eq!(function.body.len(), 1);
}

#[test]
fn test_parse_function_header() {
    let mut p = Parser::new("my_func(a int, b int,): int".to_string());
    let (name, args, return_type) = p.parse_function_header();
    assert_eq!(name, "my_func");
    assert_eq!(args.len(), 2);
    assert_eq!(args[0].name, "a");
    assert_eq!(args[0].type_, DataType::Int);
    assert_eq!(args[1].name, "b");
    assert_eq!(args[1].type_, DataType::Int);
    assert_eq!(return_type, DataType::Int);
}