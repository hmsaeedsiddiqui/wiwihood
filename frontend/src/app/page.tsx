import Image from "next/image";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import DynamicCategoriesSection from "./components/DynamicCategoriesSection";
import DynamicHomepageSections from "./components/DynamicHomepageSections";
import Video from "./components/video";
import Info from "./components/info";
import NewsArticle from "./components/newsArticle";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DynamicCategoriesSection />
      <DynamicHomepageSections />
      <Video />
      <Info />
      <NewsArticle />
      <Footer />
    </>
  );
}
