import './util';
import 'core-js';
import 'isomorphic-fetch';
import React, {
    Component
} from 'react';
import Newspaper from './pages/Newspaper';
import '../css/App.css';
import Editor from './pages/Editor';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/">
                        <Newspaper/>
                    </Route>
                    <Route path="/editor">
                        <Editor/>
                    </Route>
                </Switch>
            </Router>
        ); //Temporary--until I make Treasury
    }
}

export default App;
