import ProjectCard from "./ProjectCard";

export default function Portfolio() {
  return (
    <div id="portfolio-section" className="min-h-screen text-amber-50 flex flex-col items-center justify-center gap-4 sm:gap-16 p-4 sm:px-48 sm:py-24">
      <h1 className="font-bold text-6xl text-center">My Portfolio</h1>

      <div className="h-full w-[80%] grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 place-items-center rounded-lg">
        {assets.map((data) => (
          <ProjectCard img={data.img} text={data.text} url={data.url} key={assets.indexOf(data)} />
        ))}
      </div>
    </div>
  );
}

const assets = [
  {
    img: "/5-25-clock2.png",
    url: "5-25-clock",
    text: "A pormodoro clock",
  },
  {
    img: "/calculator2.png",
    url: "calculator",
    text: "A react calculator",
  },
  {
    img: "/drum-machine2.png",
    url: "drum-machine",
    text: "A drum machine",
  },
  {
    img: "/markdown-prev2.png",
    url: "markdown-prev",
    text: "A markdown previewer",
  },
  {
    img: "/quote-machine2.png",
    url: "quote-machine",
    text: "A random quote machine",
  },
];
