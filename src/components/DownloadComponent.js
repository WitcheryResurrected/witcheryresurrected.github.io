import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {
    Today,
    KeyboardArrowDown,
    KeyboardArrowUp,
    GetApp,
    Backup,
    Keyboard,
    PhotoSizeSelectSmall,
    BarChart
} from '@material-ui/icons';
import {apiLink} from "../pages/DownloadsPage";
import {Link} from "react-router-dom";

export function DownloadComponent(props) {
    const [opened, setOpened] = useState(false);
    const {download, downloadId} = props;
    const {name, paths, release, changelog} = download;
    const {additions, removals, changes} = changelog;

    let date = new Date(release);

    return (
        <div className='download-item'>
            <p className='preview-title'>{name}</p>
            <div className='download-info'>
                <StatComponent title='Additions' data={additions.length} color='#01d701' Icon={AddIcon}/>
                <StatComponent title='Removals' data={removals.length} color='#ce1414' Icon={RemoveIcon}/>
                <StatComponent title='Changes' data={changes.length} color='#db780d' Icon={FiberManualRecordIcon}/>
                <StatComponent title='Files' data={paths.length} color='#4fbaf7' Icon={Backup}/>
                <StatComponent title='Uploaded' data={date.toLocaleString()} color='#01d701' Icon={Today}/>
            </div>
            {opened && <div className='breaker' />}

            <div className={opened ? 'download-data' : 'closed-data'}>
                <div className='download-changes'>
                    <div>
                        {additions.length > 0 && <h4 className='change-title'>Additions:</h4>}
                        {additions.map(addition => <ChangeComponent key={addition} color='#0dcd30' change={addition} Icon={AddIcon} />)}
                    </div>

                    <div>
                        {removals.length > 0 && <h4 className='change-title'>Removals:</h4>}
                        {removals.map(removal => <ChangeComponent key={removal} color='#ce1414' change={removal} Icon={RemoveIcon} />)}
                    </div>

                    <div>
                        {changes.length > 0 && <h4 className='change-title'>Changes:</h4>}
                        {changes.map(change => <ChangeComponent key={change} color='#db780d' change={change} Icon={FiberManualRecordIcon} />)}
                    </div>
                </div>
                <div className='breaker' />

                <div className='download-files'>
                    {paths.map(value => <FileComponent key={value.name} downloadId={downloadId} path={value} />)}
                </div>
            </div>

            <div className='download-collapse'>
                <div className='collapse-button' onClick={() => setOpened(!opened)}>
                    {opened ? <KeyboardArrowUp fontSize='large' /> : <KeyboardArrowDown fontSize='large' />}
                </div>
            </div>
        </div>
    );
}

function ChangeComponent(props) {
    const {color, change, Icon} = props;

    return (
        <div className='change'>
            <Icon fontSize='small' style={{color}}/>
            <p style={{width: '80%', wordWrap: 'break-word'}}>{change}</p>
        </div>
    );
}

function FileComponent(props) {
    const {path, downloadId} = props;
    const {name, size, loader, version, downloadCount, dependencies} = path;

    return (
        <div className='download-file'>
            <div className='download-title'>
                <p className='file-title'>{name}</p>
                <Link className='download-button' to={`${apiLink}/download/${downloadId}/${name}`} target='_blank' rel='noreferrer'><GetApp/></Link>
            </div>

            <div className='file-stats'>
                <StatComponent title='Size' data={bytesToStr(size)} color='#01d701' Icon={PhotoSizeSelectSmall}/>
                <StatComponent title='Loader' data={loader === 0 ? 'Forge' : 'Fabric'} color='#01d701' Icon={Keyboard}/>
                <StatComponent title='Game Version' data={version} color='#01d701' Icon={BarChart}/>
                <StatComponent title='Downloads' data={downloadCount} color='#01d701' Icon={GetApp}/>
            </div>

            {dependencies.length > 0 && <h3 className='dependency-title'>Dependencies:</h3>}
            <div className='file-dependencies'>
                {dependencies.map(dependency => (
                    <Link key={dependency.name} className='file-dependency' target='_blank' rel='noreferrer' to={dependency.link}>
                        {dependency.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

function StatComponent(props) {
    const {title, data, color, Icon} = props;

    return (
        <div className='download-stat'>
            <Icon className='stat-icon' style={{color}}/>
            <div className='stat-info'>
                <b>{title}</b>
                <p>{data}</p>
            </div>
        </div>
    );
}

const types = ['Bytes', 'KB', 'MB', 'GB'];
function bytesToStr(bytes) {
    if (!bytes) return 'N/A';

    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, index)).toFixed(2)) + ' ' + types[index];
}
