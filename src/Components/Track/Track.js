import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    renderAction() {
        if(this.props.isRemoval === true) {
            <a className='Track-action'>-</a>
        } else if(this.props.isRemoval === false) {
            <a onClick={this.addTrack} className='Track-action'>+</a>
        }
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                <button className="Track-action">{this.renderAction}</button>
            </div>
        )
    }
}

export default Track;