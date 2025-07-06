package main

import (
	"testing"
)

func TestFindPatternMatches(t *testing.T) {
	tests := []struct {
		name     string
		source   string
		pattern  []Tokentype
		expected [][]Token
	}{
		{
			name:    "Find hello 18 world pattern",
			source:  "hello 18 world you are you now 18",
			pattern: []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier},
			expected: [][]Token{
				{
					{Type: Tokentype_Identifier, Text: "hello"},
					{Type: Tokentype_Number, Text: "18"},
					{Type: Tokentype_Identifier, Text: "world"},
				},
			},
		},
		{
			name:    "Find multiple patterns",
			source:  "hello 18 world test 42 example",
			pattern: []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier},
			expected: [][]Token{
				{
					{Type: Tokentype_Identifier, Text: "hello"},
					{Type: Tokentype_Number, Text: "18"},
					{Type: Tokentype_Identifier, Text: "world"},
				},
				{
					{Type: Tokentype_Identifier, Text: "test"},
					{Type: Tokentype_Number, Text: "42"},
					{Type: Tokentype_Identifier, Text: "example"},
				},
			},
		},
		{
			name:     "No pattern found",
			source:   "hello world test example",
			pattern:  []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier},
			expected: [][]Token{},
		},
		{
			name:     "Empty source",
			source:   "",
			pattern:  []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier},
			expected: [][]Token{},
		},
		{
			name:    "Single token pattern",
			source:  "hello 18 world",
			pattern: []Tokentype{Tokentype_Identifier},
			expected: [][]Token{
				{{Type: Tokentype_Identifier, Text: "hello"}},
				{{Type: Tokentype_Identifier, Text: "world"}},
			},
		},
		{
			name:    "Overlapping patterns",
			source:  "hello 18 fuck world 10 are you now 18 now",
			pattern: []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier},
			expected: [][]Token{
				{
					{Type: Tokentype_Identifier, Text: "hello"},
					{Type: Tokentype_Number, Text: "18"},
					{Type: Tokentype_Identifier, Text: "fuck"},
				},
				{
					{Type: Tokentype_Identifier, Text: "world"},
					{Type: Tokentype_Number, Text: "10"},
					{Type: Tokentype_Identifier, Text: "are"},
				},
				{
					{Type: Tokentype_Identifier, Text: "now"},
					{Type: Tokentype_Number, Text: "18"},
					{Type: Tokentype_Identifier, Text: "now"},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := FindPatternMatches(tt.source, tt.pattern)

			if len(result) != len(tt.expected) {
				t.Errorf("Expected %d matches, got %d", len(tt.expected), len(result))
				return
			}

			for i, match := range result {
				if len(match) != len(tt.expected[i]) {
					t.Errorf("Match %d: Expected %d tokens, got %d", i, len(tt.expected[i]), len(match))
					continue
				}

				for j, token := range match {
					expectedToken := tt.expected[i][j]
					if token.Type != expectedToken.Type {
						t.Errorf("Match %d, Token %d: Expected type %d, got %d", i, j, expectedToken.Type, token.Type)
					}
					if token.Text != expectedToken.Text {
						t.Errorf("Match %d, Token %d: Expected text '%s', got '%s'", i, j, expectedToken.Text, token.Text)
					}
				}
			}
		})
	}
}

func TestFindPatternMatchesSpecificCase(t *testing.T) {
	// This test specifically ensures the original case mentioned by the user always works
	source := "hello 18 world you are you now 18"
	pattern := []Tokentype{Tokentype_Identifier, Tokentype_Number, Tokentype_Identifier}

	expected := []Token{
		{Type: Tokentype_Identifier, Text: "hello"},
		{Type: Tokentype_Number, Text: "18"},
		{Type: Tokentype_Identifier, Text: "world"},
	}

	matches := FindPatternMatches(source, pattern)

	if len(matches) != 1 {
		t.Fatalf("Expected exactly 1 match, got %d", len(matches))
	}

	match := matches[0]
	if len(match) != len(expected) {
		t.Fatalf("Expected %d tokens in match, got %d", len(expected), len(match))
	}

	for i, token := range match {
		if token.Type != expected[i].Type {
			t.Errorf("Token %d: Expected type %d, got %d", i, expected[i].Type, token.Type)
		}
		if token.Text != expected[i].Text {
			t.Errorf("Token %d: Expected text '%s', got '%s'", i, expected[i].Text, token.Text)
		}
	}
}
