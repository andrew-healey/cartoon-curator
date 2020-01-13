import React, {
    Component
} from 'react';
import {
    API_URL,
    API_VERSION
} from '../util';
//TODO Comply with the v1 api and the new provider attribute
export default class ComicChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strips: {
                "Select": ""
            }
        };
        this.findStrips();
    }
    render() {
        return <select className="comic-choice" onChange={event=>this.props.updateValue({name:event.target.value,...this.state.strips[event.target.value]})}>
    {Object.keys(this.state.strips).sort((last,next)=>next>last).map(i=><option key={i} value={i}>{i}</option>)}
    </select>;
    }
    async findStrips() {
        let strips = await fetch(`${API_URL}/api/${API_VERSION}/ids`);
        strips = await strips.json();
        let newStrips = {
            "Select": [null,null]
        };
        for (let key of Object.keys(strips)) {
            const series=strips[key];
            console.log(series);
            const indSeries=series.reduce((last,next)=>({...last,[next]:{id:next,provider:key}}),{});
            newStrips = { ...newStrips,
                ...indSeries
            };
        }
            console.log(newStrips);
        this.setState({
            strips: newStrips
        });
    }
}
