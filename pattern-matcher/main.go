package main

import (
	"strings"
	"unicode"
)

type Tokenizer struct {
	source string
	index  int
}

func (this *Tokenizer) cur_char() rune {
	if !this.in_range() {
		return 0
	}
	return rune(this.source[this.index])

}

func (this *Tokenizer) in_range() bool {
	return this.index < len(this.source)

}

var space_chars = " \t\n\r"

func (this *Tokenizer) eat_spaces() {
	for strings.Contains(space_chars, string(this.cur_char())) {
		this.index++
	}
}

type Tokentype int

const (
	Tokentype_Unknown Tokentype = iota
	Tokentype_Identifier
	Tokentype_Number
	Tokentype_Punct
)

type Token struct {
	Type Tokentype
	Text string
}

func (this *Tokenizer) Next() Token {
	this.eat_spaces()
	if this.cur_char() == 0 {
		return Token{Tokentype_Unknown, ""}
	}

	start := this.index
	if unicode.IsLetter(this.cur_char()) {
		for unicode.IsLetter(this.cur_char()) {
			this.index++
		}
		return Token{Tokentype_Identifier, this.source[start:this.index]}
	}
	if unicode.IsDigit(this.cur_char()) {
		for unicode.IsDigit(this.cur_char()) {
			this.index++
		}
		return Token{Tokentype_Number, this.source[start:this.index]}
	}
	if unicode.IsPunct(this.cur_char()) {
		for unicode.IsPunct(this.cur_char()) {
			this.index++
		}
		return Token{Tokentype_Punct, this.source[start:this.index]}
	}

	panic("unknown token")
}

// FindPatternMatches finds all occurrences of the given pattern in the source text
func FindPatternMatches(source string, pattern []Tokentype) [][]Token {

	type PatternCollection struct {
		collected_tokens []Token
		pos_in_pattern   int
		active           bool
	}
	var PatternCollections []PatternCollection = []PatternCollection{}
	var matches [][]Token
	t := Tokenizer{source, 0}

	for {
		token := t.Next()
		if token.Type == Tokentype_Unknown {
			break
		}

		if len(pattern) == 1 && pattern[0] == token.Type {
			// Special case: single-token pattern, match immediately
			matches = append(matches, []Token{token})
			continue
		}

		for i := range PatternCollections {
			p := &PatternCollections[i]
			if !p.active {
				continue
			}
			if pattern[p.pos_in_pattern] == token.Type {
				p.pos_in_pattern++
				p.collected_tokens = append(p.collected_tokens, token)
				if p.pos_in_pattern >= len(pattern) {
					// Found a match, make a copy of collected tokens
					match := make([]Token, len(p.collected_tokens))
					copy(match, p.collected_tokens)
					matches = append(matches, match)
					p.active = false
				}
			} else {
				p.active = false
			}
		}

		if len(pattern) > 0 && pattern[0] == token.Type && len(pattern) > 1 {
			//first try to see if we can find an inactive pattern to reactivate at 0
			was_able_to_just_reuse_an_inactive_one := false
			for i := range PatternCollections {
				p := &PatternCollections[i]
				if !p.active {
					p.active = true
					p.pos_in_pattern = 1
					p.collected_tokens = p.collected_tokens[:0]
					p.collected_tokens = append(p.collected_tokens, token)
					was_able_to_just_reuse_an_inactive_one = true
					break
				}
			}

			if !was_able_to_just_reuse_an_inactive_one {
				PatternCollections = append(PatternCollections, PatternCollection{
					collected_tokens: []Token{
						token,
					},
					pos_in_pattern: 1,
					active:         true,
				})
			}
		}
	}

	return matches
}

func main() {
	pattern := []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier}
	source := "hello 18 fuck world 10 are you now 18 now"

	matches := FindPatternMatches(source, pattern)

	for i, match := range matches {
		println("Match", i+1, ":")
		for _, token := range match {
			println(token.Type, token.Text)
		}
	}
}
