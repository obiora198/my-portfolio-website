import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-900 w-full h-[300px] text-white text-5xl flex flex-col justify-center items-center gap-4">
        <ul className="flex gap-8">
          <li>
            <a href="https://github.com/obiora198">
              <i className="fa-brands fa-square-github"></i>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </li>
        </ul>
        <small className="italic font-extralight text-sm text-center">
          Copyright © 2023 Created by Obiora Sopuluchukwu Emmanuel
        </small>
      </footer>
    </>
  )
}
