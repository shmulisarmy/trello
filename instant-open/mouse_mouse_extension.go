package main

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	"github.com/go-vgo/robotgo"
)

func go_to_the_top_left_of_current_application_window() {
	script := `
    tell application "System Events"
        set frontApp to first application process whose frontmost is true
        set frontWindow to front window of frontApp
        set positionInfo to position of frontWindow
        return item 1 of positionInfo & ", " & item 2 of positionInfo
    end tell
    `
	out, err := exec.Command("osascript", "-e", script).Output()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println("Top-left corner:", strings.TrimSpace(string(out)))

	parts := strings.Split(strings.TrimSpace(string(out)), ",")
	if len(parts) != 4 {
		fmt.Println("Unexpected output format:", string(out))
		return
	}

	x, err := strconv.Atoi(strings.TrimSpace(parts[0]))
	if err != nil {
		fmt.Println("Error parsing x coordinate:", err)
		return
	}

	y, err := strconv.Atoi(strings.TrimSpace(parts[len(parts)-1]))
	if err != nil {
		fmt.Println("Error parsing y coordinate:", err)
		return
	}

	robotgo.MoveMouse(x, y)
}
