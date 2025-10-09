import Image from "next/image";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import HotProduct from "./components/hot-product";
import Video from "./components/video";
import OurChoice from "./components/our-choice";
import Info from "./components/info";
import NewsArticle from "./components/newsArticle";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HotProduct />
      <Video />
      <OurChoice />
      <Info />
      <NewsArticle />
      <Footer />
    </>
  );
}
