import { createEffect, createSignal } from 'solid-js';
import styles from './.module.css';

type Theme = 'Light' | 'Dark' | 'Purple-Dream' | 'Sunset' | 'Forest' | 'Ruby' | 'Sakura';

const themes: Theme[] = ['Light', 'Dark', 'Purple-Dream', 'Sunset', 'Forest', 'Ruby', 'Sakura'];

const themeEmojis: Record<Theme, string> = {
  'Light': '☀️',
  'Dark': '🌙',
  'Purple-Dream': '🌌',
  'Sunset': '🌅',
  'Forest': '🌿',
  'Ruby': '🌹',
  'Sakura': '🌸'
};

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = createSignal<Theme>(
    (localStorage.getItem('theme') as Theme) || 'Light'
  );

  const nextTheme = (current: Theme): Theme => {
    const currentIndex = themes.indexOf(current);
    return themes[(currentIndex + 1) % themes.length];
  };

  createEffect(() => {
    const theme = currentTheme();
    localStorage.setItem('theme', theme);
    
    themes.forEach(t => document.body.classList.remove(t));
    
    if (theme !== 'Light') {
      document.body.classList.add(theme);
    }
  });

  return (
    <button 
      class={styles.themeToggle}
      onClick={() => setCurrentTheme(nextTheme(currentTheme()))}
      title={`Switch to ${nextTheme(currentTheme())} Theme`}
    >
      <span class={styles.themeIcon}>{themeEmojis[currentTheme()]}</span>
      <span>{currentTheme()}</span>
    </button>
  );
}