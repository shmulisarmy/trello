package main

import (
	hook "github.com/robotn/gohook"

	"fmt"
	"time"

	"github.com/go-vgo/robotgo"
)

func main() {

	for _, letter := range all_letters_used_in_sequences {
		hook.Register(hook.KeyDown, []string{letter}, func(e hook.Event) {
			if is_pressed[letter] {
				return
			}
			last_letter_pressed_history = append(last_letter_pressed_history, e)
			last_pressed[letter] = e.When
			fmt.Printf("%v has been pressed\n", letter)
			key_press_history = append(key_press_history, e)
			is_pressed[letter] = true
			go execute_first_found_sequence(e)

		})
		hook.Register(hook.KeyUp, []string{letter}, func(e hook.Event) {
			fmt.Printf("%v has been released\n", letter)
			is_pressed[letter] = false
		})
	}

	s := hook.Start()
	for a := range hook.Process(s) {
		fmt.Println(a)
	}
}

var sequences map[string]func() = map[string]func(){}

func setup_sequences_from_maps() {
	for letter := range site_map {
		sequences["os"+letter] = func() {
			open_site(site_map[letter])
		}
	}
	for letter := range application_map {
		sequences["oa"+letter] = func() {
			open_app(application_map[letter])
		}
	}
}

var all_letters_used_in_sequences []string

func init() {
	load_from_user_settings()
	setup_sequences_from_maps()
	if should_use_mtl_extension {
		sequences["mtl"] = go_to_the_top_left_of_current_application_window
	}
	for sequence := range sequences {
		for _, letter := range sequence {
			if !contains(all_letters_used_in_sequences, string(letter)) {
				all_letters_used_in_sequences = append(all_letters_used_in_sequences, string(letter))
			}
		}
	}
}
func last_n_letters_match(sequence string) bool {
	if len(key_press_history) < len(sequence) {
		return false
	}
	fmt.Printf("len(sequence)=%d\n", len(sequence))
	list_display(key_press_history)
	for i := 1; i <= len(sequence); i++ {
		fmt.Printf("i=%v\n", i)
		fmt.Printf("key_press_history[len(key_press_history)-i].Keychar=%c\n\n", key_press_history[len(key_press_history)-i].Keychar)
		fmt.Printf("sequence[i-1]=%c\n\n", rune(sequence[i-1]))

		if key_press_history[len(key_press_history)-i].Keychar != rune(sequence[len(sequence)-i]) {
			return false
		}
	}
	return true
}

func are_all_pressed(sequence string) bool {
	for _, letter := range sequence {
		if !is_pressed[string(letter)] {
			return false
		}
	}
	return true
}

var last_letter_pressed_history []hook.Event

func in_typing_mode(look_back int) bool {
	if len(last_letter_pressed_history) < look_back+1 {
		return false
	}

	// t := time.Now().Add(-time.Minute)

	l := len(last_letter_pressed_history)
	return last_letter_pressed_history[l-look_back].When.Sub(last_letter_pressed_history[l-look_back-1].When) < time.Duration(ms_to_determine_if_in_typing_mode)*time.Millisecond

	// long_enough_distance := false
	// for i := len(last_letter_pressed_history) - 1; i >= len(last_letter_pressed_history)-6; i-- {
	// 	if last_letter_pressed_history[i].When.Before(t) {
	// 		break
	// 	}
	// 	if i > 0 {
	// 		if last_letter_pressed_history[i-1].When.Sub(last_letter_pressed_history[i].When) > time.Millisecond*500 {
	// 			long_enough_distance = true
	// 		}
	// 	}
	// }

	// return !long_enough_distance
}

// func first_and_last_are_pressed(sequence string) bool {
// 	return is_pressed[string(sequence[0])] && is_pressed[string(sequence[len(sequence)-1])]
// }

func undo_chars_generated_from_sequence(sequence string) {
	for range sequence {
		robotgo.KeyTap("backspace")
	}
}

func all_recently_pressed_and_currently_down(sequence string) bool {
	for _, letter := range sequence {
		if !is_pressed[string(letter)] {
			return false
		}
		if time.Since(last_pressed[string(letter)]) > time.Millisecond*300 {
			return false
		}
	}
	return true
}

func execute_first_found_sequence(e hook.Event) {
	if in_typing_mode(3) {
		fmt.Println("you are in typing mode")
		return
	}
	for sequence, command := range sequences {
		// if last_in_list(key_press_history) != e {
		// 	return
		// }

		if last_in_list(key_press_history) != e {
			return
		}

		if all_recently_pressed_and_currently_down(sequence) {
			fmt.Printf("sequence %v matched\n", sequence)
			undo_chars_generated_from_sequence(sequence)
			command()
			break
		}
	}
}
