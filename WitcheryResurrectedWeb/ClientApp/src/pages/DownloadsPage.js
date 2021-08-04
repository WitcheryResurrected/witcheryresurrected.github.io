import React from "react";
import InfiniteScroll from 'react-infinite-scroller';

import {DownloadComponent} from "../components/DownloadComponent";
import './../styles/Downloads.css';
import './../styles/LoadingCircle.css';

export default class DownloadsPage extends React.Component {

    state = {
        downloads: [],
        loaded: false,
        lastTime: null
    }

    componentDidMount() {
        this.loadNext(true);
    }

    handleResponse = (response) => response.json().then(json => {
        return response.ok ? json : Promise.reject(json);
    });

    loadNext = (firstLoad) => {
        const {downloads, lastTime} = this.state;
        if (!lastTime && !firstLoad) return;

        const time = Math.round(Date.parse(lastTime) / 1000);
        fetch('../downloads/' + (!firstLoad ? time : '')).then(this.handleResponse).then(data => {
            const keys = Object.keys(data);
            const newDownloads = {...downloads, ...data};

            this.setState({
                downloads: newDownloads,
                loaded: true,
                lastTime: keys.length > 0 ? data[keys[keys.length - 1]].release : null
            });
        }).catch(console.error);
    }

    render() {
        const {downloads, loaded, lastTime} = this.state;

        if (!loaded)
            return <LoaderComponent/>;

        return (
            <div className='downloads'>
                <div className='infinite-scroller'>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => this.loadNext(false)}
                        hasMore={!!lastTime}
                        loader={<h3 key={0}>Loading...</h3>}
                    >
                        {Object.keys(downloads).map(keyVal => <DownloadComponent key={keyVal} downloadId={keyVal} download={downloads[keyVal]} />)}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

const LoaderComponent = (props) => (
    <div id="loader-page">
        <div className="loader-name">Loading</div>
        <div className="loader-circle"/>
    </div>
);