import { createSignal, type Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import './index.css';
import { AllRecipes } from './RecipeList';
import AvailibleIngredients from './components/availibleIngredients';
import RecipePlanner from './components/recipie_planner';
import Nav from './components/Nav';
import Toaster, { addToast } from './lightning/toast';
import Letter_animator from './lightning/letter_animator';

import kitchen_chaos_1 from "./assets/images/kitchen-chaos-1.webp"
import kitchen_chaos_2 from "./assets/images/kitchen-chaos-2.webp"
import { Image_toggler } from './components/image_toggler';
import { ThemeToggle } from './components/ThemeToggle';



import Blog_card from './lightning/blog-card';


const App: Component = () => {
  return (
    <div class={styles.App}>
      <ThemeToggle></ThemeToggle>
      <header>
      <Image_toggler image_links={[kitchen_chaos_1, kitchen_chaos_2]}></Image_toggler>
      </header>
      <div style={{padding: "20px", "font-size": "2rem", "font-family": "monospace", "text-shadow": "1px 3px 10px grey", color: "darkblue", "box-shadow": "1px 3px 10px grey", width: "60%", "margin-left": "auto", "margin-right": "auto", "margin-top": "100px", "margin-bottom": "50px"}}>

       <Letter_animator letters="let the chaos manage itself" speed={105}></Letter_animator>
      </div>
      <Nav></Nav>
      <AllRecipes></AllRecipes>
      <AvailibleIngredients></AvailibleIngredients>
      <RecipePlanner></RecipePlanner>
      <Toaster></Toaster>
      <button onclick={() => {
        addToast("error", (<div>
          <h2>error</h2>
          <p>please contact the <a style={{color: "white"}} href="mailto:shmulis.army@gmail.com">developer</a></p>
        </div> as Element), 10000)
      }}>
      </button>
    </div>
  );
};

export default App;
