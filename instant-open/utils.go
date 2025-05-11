package main

import (
	"fmt"
	"os/exec"
)

func open_site(site_name string) {
	exec.Command("open", "https://"+site_name).Run()
}

func open_app(app_name string) {
	err := exec.Command("open", "-a", app_name).Run()
	if err != nil {
		fmt.Printf("Failed to open %s: %v\n", app_name, err)
	}
}

func last_in_list[T any](list []T) T {
	return list[len(list)-1]
}

func contains[T comparable](list []T, item T) bool {
	for _, v := range list {
		if v == item {
			return true
		}
	}
	return false
}

func list_display[T any](list []T) {
	fmt.Println("displaying list")
	for _, v := range list {
		fmt.Println(v)
	}
}
