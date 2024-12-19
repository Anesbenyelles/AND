import { useState, useEffect } from 'react';
import logo from '../assets/designItems/Logo bachir fond blanc.svg'
import logoSurVert from '../assets/designItems/Logo bachir fond vert.svg'
import greebArrow from '../assets/designItems/Triangle vert.svg'
import { NavLink } from 'react-router-dom';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 mx-auto z-30 flex justify-between items-center transition-all duration-300 bg-white px-10 ${scrolled  ? 'w-full' : 'sm:w-[80%] w-full'}`}>
      <img src={greebArrow} className='absolute top-0 right-0 z-40  scale-x-[-1] h-full invisible sm:visible' />
      <div className="flex items-center flex-1 w-1/2 gap-2 logo sm:flex-auto ">
        <img src={logo} alt="OWB Logo" className="w-auto m-5 max-h-16" />
        <h1 className="text-[calc(5px+2vw)] great-vibes-regular tracking-wider text-[#00aba7] w-1/2">El Bachir <span className="text-[#cfb173]">Promo</span> </h1>
      </div>

      <nav className={`justify-center flex-grow hidden ${scrolled ? 'gap-14':'gap-5'} sm:flex  transition-all `}>
        <NavLink to={'home'} className={({isActive}) => (` text-[calc(2px+1vw)] font-bold hover:text-[#00aba7] no-underline  transition-colors duration-300 ${isActive && 'text-[#00aba7]'}`)}>Acceuil</NavLink>
        <NavLink to={'apropos'} className={({isActive}) => (` text-[calc(2px+1vw)] font-bold hover:text-[#00aba7] no-underline  transition-colors duration-300 ${isActive && 'text-[#00aba7]'}`)}>À propos</NavLink>
        <NavLink to={'appart'} className={({isActive}) => (` text-[calc(2px+1vw)] font-bold hover:text-[#00aba7] no-underline  transition-colors duration-300 ${isActive && 'text-[#00aba7]'}`)}>Appartements</NavLink>
        <NavLink to={'media'} className={({isActive}) => (` text-[calc(2px+1vw)] font-bold hover:text-[#00aba7] no-underline  transition-colors duration-300 ${isActive && 'text-[#00aba7]'}`)}>Media</NavLink>
        <NavLink to={'contact'} className={({isActive}) => (` text-[calc(2px+1vw)] font-bold hover:text-[#00aba7] no-underline  transition-colors duration-300 ${isActive && 'text-[#00aba7]'}`)}>Contacter-Nous</NavLink>
      </nav>

      <button
        className={`sm:hidden p-2 font-bold text-4xl text-[#ceb173] ${isMenuOpen ? "invisible" : "visible"} z-50`}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      <div
        id="mobile-menu"
        className={`fixed top-0 p-4 left-0 w-full  md:w-full h-fit bg-[#00aba7] text-white transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className='flex items-center justify-between mb-4'>
          <img src={logoSurVert} alt="OWB Logo" className="flex-1 w-auto h-20" />

          <button
            className="text-xl text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col items-start px-4">
          <NavLink to={'home'} className={({isActive}) => (` py-2 text-lg   no-underline font-bold hover:text-black ${isActive ? 'text-[#cfb173]' : 'text-white'}`)} onClick={() => setIsMenuOpen(false)}>Acceuil</NavLink>
          <NavLink to={'apropos'} className={({isActive}) => (` py-2 text-lg   no-underline font-bold hover:text-black ${isActive ? 'text-[#cfb173]' : 'text-white'}`)} onClick={() => setIsMenuOpen(false)}>À propos</NavLink>
          <NavLink to={'appart'} className={({isActive}) => (` py-2 text-lg   no-underline font-bold hover:text-black ${isActive ? 'text-[#cfb173]' : 'text-white'}`)} onClick={() => setIsMenuOpen(false)}>Appartements</NavLink>
          <NavLink to={'media'} className={({isActive}) => (` py-2 text-lg   no-underline font-bold hover:text-black ${isActive ? 'text-[#cfb173]' : 'text-white'}`)} onClick={() => setIsMenuOpen(false)}>Media</NavLink>
          <NavLink to={'contact'} className={({isActive}) => (` py-2 text-lg   no-underline font-bold hover:text-black ${isActive ? 'text-[#cfb173]' : 'text-white'}`)} onClick={() => setIsMenuOpen(false)}>Contacter-Nous</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;