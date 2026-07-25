import { motion, useScroll, useSpring } from "framer-motion";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import Skills from "./components/Skills.jsx";
import Journey from "./components/Journey.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";
import { useCardSpotlight } from "./components/useCardSpotlight.js";

/** Thin sunset-gradient bar tracking scroll — the route progress of the ride. */
function RouteProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return <motion.div className="route-progress" style={{ scaleX }} aria-hidden="true" />;
}

export default function App() {
  useCardSpotlight();
  return (
    <>
      <RouteProgress />
      <div className="film-grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
