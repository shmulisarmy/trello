export type LeftSide = {
  "x-value": number;
  coefficient: number;
  constant: number;
}


//todo first in messy code, make rules for applying operations to the right side for example if the operation is divide that has to be done on a  coefficient, and subtract has to be done on a constant

export type RightSide = {
  result: {
    value: number | 'not_set';
  };
  needs_to_be_applied: boolean | {
    value: number;
    operation: 'add' | 'subtract' | 'multiply' | 'divide';
    apply_on: 'coefficient' | 'constant';
  };
}

export type Equation = {
  left_side: LeftSide;
  right_side: RightSide;
} 