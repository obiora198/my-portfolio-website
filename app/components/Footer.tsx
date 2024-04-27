import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <>
    <footer className='bg-gray-800 w-full text-amber-100 text-2xl py-2 px-4 sm:px-48 flex flex-col justify-center items-center gap-2'>
        <ul className='flex gap-8'>
            <li>
              <a href="https://github.com/obiora198"><GitHubIcon /></a>  
            </li>
            <li>
              <a href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"><LinkedInIcon /></a>  
            </li>
        </ul>
        <small className='italic font-extralight text-sm text-center'>Copyright © 2023 Created by Obiora Sopuluchukwu Emmanuel</small>
    </footer>
    </>
  )
}
