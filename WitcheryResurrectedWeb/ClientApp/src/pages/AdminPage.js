import React from "react";
import {TextField} from "@material-ui/core";
import './../styles/Admin.css';
import {UploadFileComponent} from "../components/UploadFIleComponent";
import AddIcon from "@material-ui/icons/Add";

export default class AdminPage extends React.Component {
    state = {
        lastFileIndex: 0
    }
    
    addFile = () => {
        this.setState({
            lastFileIndex: this.state.lastFileIndex + 1
        })
    }
    
    render() {
        const elements = [...Array(this.state.lastFileIndex + 1).keys()].map(i => (<UploadFileComponent key={i} index={i}/>));
        
        return (
            <div className='admin'>
                <form className='form' method='post' encType='multipart/form-data' action='upload'>
                    <TextField className="upload-input" id='name' name='name' label='Name' variant='outlined' />
                    <textarea className="upload-input changelog" id='changelog' name='changelog' label='ChangeLog' />
                    <TextField className="upload-input" id='pass' name='pass' label='Secret' variant='outlined' />
                    
                    <div className="files">
                        {elements}
                        <AddIcon className="add-new" onClick={this.addFile}/>
                    </div>
                    
                    <button className="upload-btn">Upload</button>
                </form>
            </div>
        );
    }
}
