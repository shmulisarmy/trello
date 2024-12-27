import { createMutable } from "solid-js/store";
import { EntireProfile } from "./types/ProfileMutable";

const commenters = [
  { name: "Alex Thompson", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
  { name: "Maria Garcia", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
  { name: "James Wilson", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
  { name: "Sophia Chen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
  { name: "Aiden Kumar", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" }
];

const generateComments = (count: number) => {
  return Array(count).fill(null).map(() => ({
    content: [
      "This is amazing! 🔥",
      "Great work! Keep it up! 👏",
      "Can't wait to see more!",
      "Absolutely brilliant! 🌟",
      "This changed my perspective completely",
      "Thanks for sharing! 🙏",
      "Mind-blowing content as always",
      "You're an inspiration! ✨",
      "This deserves more attention",
      "Fascinating insights! 🧠"
    ][Math.floor(Math.random() * 10)],
    posted_by: commenters[Math.floor(Math.random() * commenters.length)],
    likes: Math.floor(Math.random() * 1000)
  }));
};

export const profiles: EntireProfile[] = createMutable([
  {
    image: "https://shmulisarmy.github.io/resume/images/profile.png",
    name: "John Doe",
    last_active: "10 minutes ago",
    likes: 3000000,
    messages: 1000000,
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, necessitatibus. Doloribus iure sapiente excepturi labore quia obcaecati cumque vitae possimus corrupti consectetur? Iusto maxime illo vero? Delectus eius magni voluptatum.",
    comments: generateComments(15)
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    name: "David Chen",
    last_active: "1 hour ago",
    likes: 4200000,
    messages: 800000,
    content: "Excited to announce my new course on quantum computing! We'll explore the fundamentals of quantum mechanics and how they apply to modern computing. Early bird registration starts next week. 🌟 #QuantumComputing #Education",
    comments: generateComments(25)
  },
  {
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    name: "Emma Rodriguez",
    last_active: "5 minutes ago",
    likes: 2800000,
    messages: 600000,
    content: "Just launched my new sustainable fashion line! Each piece is made from recycled materials and produced locally. Fashion can be both beautiful and environmentally conscious. 🌿 #SustainableFashion",
    comments: generateComments(20)
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    name: "Michael Park",
    last_active: "3 hours ago",
    likes: 1800000,
    messages: 300000,
    content: "Today's cooking stream was amazing! Thanks everyone who joined to learn about traditional Korean cuisine. The kimchi recipe will be posted on my blog tomorrow. 🥘 #KoreanFood #Cooking",
    comments: generateComments(18)
  },
  {
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    name: "Lucas Silva",
    last_active: "2 minutes ago",
    likes: 5600000,
    messages: 920000,
    content: "Just wrapped up an incredible gaming session! New speedrun record in Elden Ring - 2 hours and 17 minutes! Full walkthrough video coming soon. 🎮 #Gaming #EldenRing #Speedrun",
    comments: generateComments(30)
  },
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    name: "Zara Ahmed",
    last_active: "20 minutes ago",
    likes: 3900000,
    messages: 670000,
    content: "New AI research paper just published! We've made breakthrough progress in natural language understanding using quantum-inspired neural networks. Link to the full paper in bio. 🤖 #AI #Research #MachineLearning",
    comments: generateComments(22)
  },
  {
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    name: "Nina Patel",
    last_active: "45 minutes ago",
    likes: 2100000,
    messages: 430000,
    content: "Just finished my latest mural in downtown Seattle! 60ft of pure color and expression. Art should be accessible to everyone. Thanks to the community for the support! 🎨 #StreetArt #Mural #Seattle",
    comments: generateComments(19)
  },
  {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    name: "Marcus Johnson",
    last_active: "15 minutes ago",
    likes: 4800000,
    messages: 890000,
    content: "New workout routine just dropped! This high-intensity program is designed for busy professionals. 20 minutes, no equipment needed. Let's get fit together! 💪 #Fitness #Workout #HealthyLifestyle",
    comments: generateComments(28)
  },
  {
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    name: "Clara Zhang",
    last_active: "4 hours ago",
    likes: 3300000,
    messages: 540000,
    content: "Just released my new symphony 'Digital Dreams' - a fusion of classical orchestra and electronic sounds. Available now on all streaming platforms! 🎵 #Music #Symphony #Electronic",
    comments: generateComments(24)
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    name: "Omar Hassan",
    last_active: "30 minutes ago",
    likes: 2900000,
    messages: 480000,
    content: "Successful launch of our new renewable energy project! This solar farm will power 10,000 homes with clean energy. The future is sustainable! ☀️ #CleanEnergy #Sustainability",
    comments: generateComments(21)
  },
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    name: "Sophie Anderson",
    last_active: "1 hour ago",
    likes: 3700000,
    messages: 620000,
    content: "Just opened my first plant-based restaurant in Portland! All ingredients sourced from local organic farms. Come taste the future of food! 🌱 #PlantBased #Sustainable #FoodInnovation",
    comments: generateComments(26)
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    name: "Ryan Martinez",
    last_active: "25 minutes ago",
    likes: 4100000,
    messages: 750000,
    content: "New podcast episode: 'The Future of Space Travel' with special guest Dr. Sarah Mitchell from NASA. We discuss the upcoming Mars mission and more! 🚀 #Space #Science #Podcast",
    comments: generateComments(23)
  }
]);
