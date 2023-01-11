import React from 'react';
import './../styles/Home.css';
import {Link} from "react-router-dom";

const ASH_GITHUB = 'https://github.com/MsRandom';
const ABUSED_GITHUB = 'https://github.com/abused';
const KOTLIN_LINK = 'https://kotlinlang.org/';

export default class HomePage extends React.Component {

    componentDidMount() {
        document.title += ' - About';
    }

    render() {
        return (
            <div className='home'>
                <div className='welcome'>
                    <div className='welcome-text'>
                        <div className='welcome-header'>
                            <img src='/assets/images/logo.png' alt='logo' width='200px' height='200px' />
                            <h2>About this project</h2>
                        </div>
                        <p className='text'>
                            This remake was started in early 2020 by <a className='welcome-link' target='_blank' rel='noreferrer' href={ASH_GITHUB}>Ashley Wright</a>, who is the owner and maintainer of the project.
                            The mod is written in the <a className='welcome-link' target='_blank' rel='noreferrer' href={KOTLIN_LINK}>Kotlin</a> programming language and is designed to be as data-driven and customizable as possible, to allow for freedom over features for server admins and general users.<br/>
                            This website was designed by <a className='welcome-link' target='_blank' rel='noreferrer' href={ABUSED_GITHUB}>abused_master</a> and the backend server was programmed by Ashley.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
