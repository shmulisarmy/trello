import { createSignal } from "solid-js";

const themes = ["Dark", "Purple-Dream", "Sunset", "Forest", "Ruby", "Sakura"];

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = createSignal("");

  const toggleTheme = (theme: string) => {
    // Remove previous theme class
    if (currentTheme()) {
      document.body.classList.remove(currentTheme());
    }
    // Add new theme class
    document.body.classList.add(theme);
    setCurrentTheme(theme);
  };

  return (
    <div style={{ 
      position: "fixed", 
      top: "1rem", 
      right: "1rem",
      display: "flex",
      gap: "0.5rem",
      "flex-direction": "column"
    }}>
      {themes.map((theme) => (
        <button
          onClick={() => toggleTheme(theme)}
          style={{
            padding: "0.5rem 1rem",
            "border-radius": "var(--border-radius-small)",
            border: "1px solid var(--color-border)",
            background: "var(--background-color)",
            color: "var(--color-text)",
            cursor: "pointer"
          }}
        >
          {theme}
        </button>
      ))}
    </div>
  );
} 