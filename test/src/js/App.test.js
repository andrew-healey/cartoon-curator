import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../../src/js/components/App';
import Enzyme,{ mount, shallow } from 'enzyme';
import {assert} from 'chai';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe("<App />", function () {
  it("renders without crashing", () => {
    const div = document.createElement('div');
    ReactDOM.render( < App / > , div);
    ReactDOM.unmountComponentAtNode(div);
  });
  it("Renders a <Newspaper />",function(){
    const wrapper=shallow(<App/>);
    assert.lengthOf(wrapper.find('Newspaper'),1);
  });
});