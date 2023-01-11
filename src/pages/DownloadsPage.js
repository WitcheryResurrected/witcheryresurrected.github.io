import React from "react";
import InfiniteScroll from 'react-infinite-scroller';

import {DownloadComponent} from "../components/DownloadComponent";
import './../styles/Downloads.css';
import './../styles/LoadingCircle.css';

export const apiLink = "https://witchery-api.msrandom.net";

export default class DownloadsPage extends React.Component {
    state = {
        downloads: [],
        loaded: false,
        lastId: null
    }

    componentDidMount() {
        this.loadNext(true);
        document.title += " - Downloads";
    }

    handleResponse = response => response.json().then(json => response.ok ? json : Promise.reject(json));

    loadNext = firstLoad => {
        const {downloads, lastId} = this.state;
        if (!lastId && !firstLoad) return;

        fetch(`${apiLink}/downloads?limit=5` + (!firstLoad ? `&after=${lastId}` : '')).then(this.handleResponse).then(data => {
            const newDownloads = [...downloads, ...data];

            this.setState({
                downloads: newDownloads,
                loaded: true,
                lastId: data.length > 0 ? data[data.length - 1].id : null
            });
        }).catch(console.error);
    }

    render() {
        const {downloads, loaded, lastId} = this.state;

        if (!loaded)
            return <LoaderComponent/>;

        return (
            <div className='downloads'>
                <div className='infinite-scroller'>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => this.loadNext(false)}
                        hasMore={!!lastId}
                        loader={<h3 key={0}>Loading...</h3>}
                    >
                        {downloads.map(download => <DownloadComponent key={download.id} downloadId={download.id}
                                                                      download={download}/>)}
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

const LoaderComponent = () => (
    <div id="loader-page">
        <div className="loader-name">Loading</div>
        <div className="loader-circle"/>
    </div>
);
