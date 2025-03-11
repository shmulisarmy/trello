import {createEffect, createSignal} from 'solid-js'

const ThemeSwitcher = () => {
  const themes = ['light-mode', 'dark-mode', 'matrix-view', 'forest-view', 'cyberpunk-view']
  const [theme, setTheme] = createSignal(themes[0]) // Default to matrix-view

  const toggleTheme = () => {
    const currentTheme = theme()
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length]
    setTheme(nextTheme)
  }

  createEffect(() => {
    document.body.className = theme()
  })

  return (
    <div class={theme()}>
      <h1>Welcome to the Themed View!</h1>
      <p class="light-text">This is a sample paragraph with {theme()} color.</p>
      <button class="theme-toggle" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  )
}

export default ThemeSwitcher
