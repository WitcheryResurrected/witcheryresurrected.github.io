import React from "react";
import InfiniteScroll from 'react-infinite-scroller';

import {DownloadComponent} from "../components/DownloadComponent";
import './../styles/Downloads.css';
import './../styles/LoadingCircle.css';

export default class DownloadsPage extends React.Component {
    state = {
        downloads: [],
        loaded: false,
        downloadStream: null
    }

    componentDidMount() {
        this.loadNext(true);
        document.title += " - Downloads";
    }

    mergeDownloads = (original, added) => added.length === 0 ? original : [...original, ...added];

    loadNext = firstLoad => {
        const addedDownloads = [];
        const callback = downloadStream => {
            const {downloads} = this.state;
            downloadStream.read().then(({done, value}) => {
                if (done) {
                    downloadStream.releaseLock();
                    this.setState({
                        downloads: this.mergeDownloads(downloads, addedDownloads),
                        loaded: true,
                        downloadStream: null
                    });
                } else {
                    for (const downloadJson of new TextDecoder().decode(value).split('\0')) {
                        if (downloadJson.length > 0) {
                            try {
                                addedDownloads.push(JSON.parse(downloadJson));
                            } catch (e) {
                                console.error("Received error while attempting to parse text: " + downloadJson)
                            }
                        }
                    }

                    if (addedDownloads.length < 5) {
                        callback(downloadStream);
                    } else {
                        this.setState({
                            downloads: this.mergeDownloads(downloads, addedDownloads),
                            loaded: true,
                            downloadStream
                        });
                    }
                }
            }).catch(console.error);
        }

        if (firstLoad) {
            fetch('../alldownloads').then(response => {
                callback(response.body.getReader());
            }).catch(console.error);
        } else {
            const downloadStream = this.state.downloadStream;
            if (!downloadStream) return;
            callback(downloadStream);
        }
    }

    render() {
        const {downloads, loaded, downloadStream} = this.state;

        if (!loaded)
            return <LoaderComponent/>;

        return (
            <div className='downloads'>
                <div className='infinite-scroller'>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => this.loadNext(false)}
                        hasMore={!!downloadStream}
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