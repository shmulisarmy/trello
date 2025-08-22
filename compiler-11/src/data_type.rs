use std::fmt;

#[derive(Debug, PartialEq)]
pub enum DataType {
    Int,
    String,
    None,
    Bool,
}

impl fmt::Display for DataType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DataType::Int => write!(f, "int"),
            DataType::String => write!(f, "string"),
            DataType::Bool => write!(f, "bool"),
            DataType::None => write!(f, "none"),
        }
    }
}
