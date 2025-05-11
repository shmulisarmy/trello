# Instant Open

A powerful keyboard shortcut utility that allows you to quickly open applications and websites using custom key sequences. This tool helps streamline your workflow by reducing the time spent navigating to frequently used applications and websites.

## Features

- **Quick Application Launch**: Open applications with custom key sequences
- **Website Shortcuts**: Instantly navigate to frequently visited websites
- **Smart Typing Detection**: Automatically detects when you're in "typing mode" (based on your typing speed) to prevent accidental triggers
- **Customizable**: Easy to configure through `user_settings.json`
- **Mouse Position Control**: Optional extension for mouse position control

## Installation

1. Ensure you have Go installed on your system
2. Clone this repository
3. Run `go mod download` to install dependencies
4. Build the project with `go build`
5. Run the executable: `./instant-open`

## Configuration

The tool is configured through `user_settings.json`. Here's how to customize it:

### Application Shortcuts

Configure application shortcuts in the `application_map` section:

```json
"application_map": {
    "t": "Trello", //hold down o+a+t to open Trello app 
    "f": "Firefox", //same idea 
    "v": "Voice Memo"   
    // Add more applications as needed
}
```

### Website Shortcuts

Configure website shortcuts in the `site_map` section:

```json
"site_map": {
    "g": "github.com/", //hold down o+s+t to open github.com site
    "y": "youtube.com", //same idea
    "t": "typingclub.com"
    // Add more websites as needed
}
```

### Additional Settings

- `typing_speed`: Set to "fast" or "slow" to adjust the typing detection sensitivity
- `extensions`: Enable additional features like "mtl" (move to top-left)

## Usage

### Application Shortcuts
- Press `oa` followed by the configured letter to open an application
- Example: `oat` opens Windsurf

### Website Shortcuts
- Press `os` followed by the configured letter to open a website
- Example: `osg` opens GitHub

### Mouse Control
- If enabled, use the `mtl` sequence to move the mouse to the top-left of the current window

## How It Works

The tool monitors keyboard input and detects specific key sequences. When a sequence is recognized:
1. It checks if you're in typing mode (to prevent accidental triggers)
2. If not typing, it executes the corresponding action
3. Any typed characters from the sequence are automatically removed

## Dependencies

- [robotn/gohook](https://github.com/robotn/gohook): For keyboard event handling
- [go-vgo/robotgo](https://github.com/go-vgo/robotgo): For system automation

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 