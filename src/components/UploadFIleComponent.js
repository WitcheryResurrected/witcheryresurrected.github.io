import React from "react";
import AddIcon from '@material-ui/icons/Add';
import {TextField} from "@material-ui/core";

function handleFileChange(event) {
    const files = event.target?.files;
    document.getElementById(event.target.id + "-file-selected").innerHTML = files?.length ? files[0].name : 'File';
}

function DependencyComponent(props) {
    const {id} = props;
    
    return (
        <div className="upload-file">
            <TextField className="upload-input" id={`${id}.name`} name={`${id}.name`} label="Name" variant='outlined'/>
            <br/>
            <TextField className="upload-input" id={`${id}.link`} name={`${id}.link`} label="Link" variant='outlined'/>
        </div>
    )
}

export class UploadFileComponent extends React.Component {
    state = {
        lastDependencyIndex: -1
    }

    addDependency = () => {
        this.setState({
            lastDependencyIndex: this.state.lastDependencyIndex + 1
        })
    }
    
    render() {
        const {index} = this.props;
        const id = `files[${index}]`;
        const elements = [...Array(this.state.lastDependencyIndex + 1).keys()].map(i => (<DependencyComponent key={i} id={`${id}.Dependencies[${i}]`}/>));

        return (
            <div className="upload-file">
                <label className="file-input upload-input">
                    <span id={`${id}.file-file-selected`}>File</span>
                    <input id={`${id}.file`} name={`${id}.file`} type="file" onChange={handleFileChange}/>
                </label>
                <label className="no-text">
                    Mod Loader
                    <select id={`${id}.loader`} name={`${id}.loader`} className="loader-select upload-input">
                        <option value={-1}>Mod Loader</option>
                        <option value={0}>Forge</option>
                        <option value={1}>Fabric</option>
                    </select>
                </label>
                <TextField className="upload-input" id={`${id}.version`} name={`${id}.version`} label="Version" variant='outlined'/>
                <br/>
                <label>
                    Dependencies
                    <div className="upload-dependencies">
                        <div className="dependencies-list">
                            {elements}
                        </div>
                        <AddIcon className="add-new" onClick={this.addDependency}/>
                    </div>
                </label>
            </div>
        )
    }
}
