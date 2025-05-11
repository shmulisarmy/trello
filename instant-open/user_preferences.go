package main

import (
	"encoding/json"
	"fmt"
	"os"
)

var application_map = map[string]string{}

var site_map = map[string]string{}

var ms_to_determine_if_in_typing_mode float64
var should_use_mtl_extension bool = false //initial value until user_settings.json is loaded

func load_from_user_settings() {
	data, err := os.ReadFile("user_settings.json")
	if err != nil {
		fmt.Println(err)
		return
	}

	var user_settings map[string]interface{}
	err = json.Unmarshal(data, &user_settings)
	if err != nil {
		fmt.Println(err)
		return
	}

	for sequence, app_name := range user_settings["application_map"].(map[string]interface{}) {
		application_map[sequence] = app_name.(string)
	}

	for sequence, site_name := range user_settings["site_map"].(map[string]interface{}) {
		site_map[sequence] = site_name.(string)
	}

	if v, ok := user_settings["ms_to_determine_if_in_typing_mode"]; ok {
		ms_to_determine_if_in_typing_mode = v.(float64)
	}
	if v, ok := user_settings["typing_speed"]; ok {
		switch v.(string) {
		case "fast":
			ms_to_determine_if_in_typing_mode = 700
		case "medium":
			ms_to_determine_if_in_typing_mode = 1300
		case "slow":
			ms_to_determine_if_in_typing_mode = 2000
		}
	}
	extensions := user_settings["extensions"].([]interface{})
	for _, extension := range extensions {
		if extension == "mtl" {
			should_use_mtl_extension = true
		}
	}
}
