package main

import (
	"time"

	hook "github.com/robotn/gohook"
)

var last_pressed = map[string]time.Time{
	"a": time.Time{},
	"b": time.Time{},
	"c": time.Time{},
	"d": time.Time{},
	"e": time.Time{},
	"f": time.Time{},
	"g": time.Time{},
	"h": time.Time{},
	"i": time.Time{},
	"j": time.Time{},
	"k": time.Time{},
	"l": time.Time{},
	"m": time.Time{},
	"n": time.Time{},
	"o": time.Time{},
	"p": time.Time{},
	"q": time.Time{},
	"r": time.Time{},
	"s": time.Time{},
	"t": time.Time{},
	"u": time.Time{},
	"v": time.Time{},
	"w": time.Time{},
	"x": time.Time{},
	"y": time.Time{},
	"z": time.Time{},

	"1": time.Time{},
	"2": time.Time{},
	"3": time.Time{},
	"4": time.Time{},
	"5": time.Time{},
	"6": time.Time{},
	"7": time.Time{},
	"8": time.Time{},
	"9": time.Time{},
	"0": time.Time{},
}

var is_pressed = map[string]bool{
	"a": false,
	"b": false,
	"c": false,
	"d": false,
	"e": false,
	"f": false,
	"g": false,
	"h": false,
	"i": false,
	"j": false,
	"k": false,
	"l": false,
	"m": false,
	"n": false,
	"o": false,
	"p": false,
	"q": false,
	"r": false,
	"s": false,
	"t": false,
	"u": false,
	"v": false,
	"w": false,
	"x": false,
	"y": false,
	"z": false,

	"1": false,
	"2": false,
	"3": false,
	"4": false,
	"5": false,
	"6": false,
	"7": false,
	"8": false,
	"9": false,
	"0": false,
}

var key_press_history []hook.Event
