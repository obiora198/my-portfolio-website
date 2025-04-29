export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white flex flex-col items-center justify-center gap-6 p-6 sm:p-12">
      
      {/* Social Links */}
      <ul className="flex gap-6 text-2xl sm:text-5xl">
        <li>
          <a
            href="https://github.com/obiora198"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 hover:scale-110 transform transition-all duration-300"
            aria-label="GitHub"
          >
            <i className="fab fa-github" aria-hidden="true"></i>
          </a>
        </li>

        <li>
          <a
            href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 hover:scale-110 transform transition-all duration-300"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin" aria-hidden="true"></i>
          </a>
        </li>
      </ul>

      {/* Copyright */}
      <small className="text-center text-sm font-light italic text-gray-400">
        © {new Date().getFullYear()} - Created by Obiora Sopuluchukwu Emmanuel
      </small>
      
    </footer>
  )
}
