import React, {useState} from "react";
import {/*NightsStay, Brightness7, */Reorder, Close} from "@material-ui/icons";
import './../styles/Navbar.css';

//const wikiLink = 'https://github.com/WitcheryResurrected/WitcheryResurrectedWiki/wiki';
const discordLink = 'https://discord.gg/y2EN7Uy';
const redditLink = 'https://reddit.com/r/WitcheryResurrected';
const twitterLink = 'https://twitter.com/WitcheryMod';
const trelloLink = 'https://trello.com/b/uEqGT8F7/witchery-resurrected';

export function NavbarComponent(props) {
    const [open, setOpen] = useState(false);
    //let darkMode = true;
    React.useEffect(() =>  window.addEventListener('resize', () => setOpen(false)))

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <div className='navbar-logo'>
                    <img className='navbar-logo-img' src='/assets/images/logo.png' alt='nav-logo'/>
                    <p className='navbar-logo-text'>Witchery:<br/>Resurrected</p>
                </div>

                <div className='navbar-links'><NavbarLinks /></div>

                <div className='fullscreen-links' style={{display: open ? 'flex' : 'none'}}>
                    <NavbarLinks />
                </div>
            </div>

            <div className='navbar-util'>
                {/*<ThemeDisplay darkMode={darkMode} />*/}
                <button className='navbar-open-btn' onClick={() => setOpen(!open)}>
                    {open ? <Close fontSize='large' /> : <Reorder fontSize='large' />}
                </button>
            </div>
        </div>
    );
}

const NavbarLinks = () => (
    <>
        <a className='navbar-link' href='/home'>Home</a>
        <a className='navbar-link' href='/home/downloads'>Downloads</a>
        {/*<a className='navbar-link' target='_blank' href={wikiLink}>Wiki</a>*/}
        <a className='navbar-link' target='_blank' href={discordLink}>Discord</a>
        <a className='navbar-link' target='_blank' href={redditLink}>Reddit</a>
        <a className='navbar-link' target='_blank' href={twitterLink}>Twitter</a>
        <a className='navbar-link' target='_blank' href={trelloLink}>Trello</a>
        <a className='navbar-link' href='/home/about'>About</a>
    </>
);

/*
function ThemeDisplay(props) {
    let darkMode = props.darkMode;

    return (
        <button className='theme-button'>
            {darkMode ? <Brightness7 /> : <NightsStay />}
        </button>
    );
}
*/
