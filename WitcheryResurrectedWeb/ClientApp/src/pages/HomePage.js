import React from "react";
import './../styles/Home.css';

export default class HomePage extends React.Component {

    componentDidMount() {
        document.title += " - Home";
    }

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
                            &nbsp;Minecraft mod in modern versions; with a focus on customizability.
                        </p>

                        <p className='text'>
                            Witchery: Resurrected is not a port, Emoniph's original resources were not packaged in any way, this is simply a remake that intends to stay as close as possible to the original.
                        </p>
                        <p className='text'>
                            Currently, the project is incomplete asset wise. As such, we require the original mod file to be loaded alongside Witchery: Resurrected.
                            Feature wise, everything is implemented; however the backend of the mod is being rewritten to increase maintanability, performance and quality.
                            After both assets and rewriting is complete, the mod will be released to sites such as&nbsp;
                            <a className='welcome-link' target='_blank' rel='noreferrer' href='https://www.curseforge.com/minecraft/mc-mods'>CurseForge</a>
                            &nbsp;and <a className='welcome-link' target='_blank' rel='noreferrer' href='https://modrinth.com/mods'>Modrinth</a>
                            &nbsp;You can find functional test downloads in the <a className='welcome-link' href='/home/downloads'>Downloads</a> page.
                        </p>

                        <p className='text'>
                            Trailer:
                        </p>
                        <iframe
                            className='trailer'
                            src="https://www.youtube.com/embed/3K7DRKqWVCQ"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
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