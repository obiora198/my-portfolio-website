import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "./components/Footer";
import NavBar from "./components/nav/NavBar";
import { getUserSession } from "./lib/userSession";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Obiora Sopuluchukwu",
  description: "A portfolio website created to showcase my work",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="shortcut icon" href="/my-logo.png" type="image/x-icon" />
      </head>
      <body className={`${poppins.className} bg-gray-950 text-amber-50 min-h-screen w-full flex flex-col items-center`}>
        <NavBar links={links} loggedIn={user.token === null ? false : true}/>
        {children}
        <Footer />
      </body>
    </html>
  );
}

const links = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Projects",
    url: "/projects",
  },
  {
    text: "Lets connect",
    url: "/#contact-section",
  },
];
