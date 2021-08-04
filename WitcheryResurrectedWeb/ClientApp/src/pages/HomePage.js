import React from "react";
import './../styles/Home.css';

export default class HomePage extends React.Component {

    render() {
        return (
            <div className='home'>
                <div className='welcome'>
                    <div className='welcome-header'>
                        <img src='/assets/images/logo.png' alt='logo' width='200px' height='200px' />
                        <h2>Welcome to Witchery: Resurrected</h2>
                    </div>

                    <div className='welcome-text'>
                        <p className='text'>
                            Witchery: Resurrected aims to recreate and improve the popular&nbsp;
                            <a className='welcome-link' target='_blank' rel='noreferrer' href='https://www.curseforge.com/minecraft/mc-mods/witchery'>Witchery</a>
                            &nbsp;mod in modern versions; with a focus on customizability.
                        </p>

                        <p className='text'>
                            Currently, the project is incomplete asset wise. As such, we require the original mod file to be loaded alongside Witchery: Resurrected.
                            Feature wise, everything is implemented; however the backend of the mod is being rewritten to increase maintanability, performance and quality.
                            After both assets and rewriting is complete, the mod will be released to sites such as&nbsp;
                            <a className='welcome-link' target='_blank' rel='noreferrer' href='https://www.curseforge.com/minecraft/mc-mods'>CurseForge</a>
                            &nbsp;and <a className='welcome-link' target='_blank' rel='noreferrer' href='https://modrinth.com/mods'>Modrinth</a>
                            &nbsp;You can find functional test downloads in the <a className='welcome-link' target='_blank' rel='noreferrer' href='/downloads'>Downloads</a> page.
                        </p>

                        <p className='text'>
                            Trailer:<br />Coming Soon!
                        </p>
                    </div>
                </div>

                <CommunityComponent />
            </div>
        );
    }
}

function CommunityComponent(props) {
    return (
        <div className='community'>
            <iframe
                src="https://discord.com/widget?id=663101542685212697&theme=dark"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                title='Discord'
            />

            <iframe className="trello-widget" src="https://trello.com/b/uEqGT8F7.html" title='Trello'/>
        </div>
    );
}