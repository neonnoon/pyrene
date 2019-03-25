import React from 'react';


import Banner from './Banner.jsx';

const props = {
  label: 'TestMessage',
  type: 'info',
};

describe('<Banner />', () => {

  it('renders without crashing', () => {
    shallow(<Banner {...props} />);
  });

  it('overlay is clearable', () => {
    const onClick = jest.fn();
    const rendered = shallow(<Banner {...props} styling="overlay" onClear={onClick} clearable />);
    expect(rendered.find('.clearIcon')).toHaveLength(1);

    rendered.find('.clearIcon').simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('overlay has a clearIcon', () => {
    let rendered = shallow(<Banner {...props} styling="overlay" type="info" clearable />);
    expect(rendered.find('.clearIcon')).toHaveLength(1);

    rendered = shallow(<Banner {...props} styling="overlay" type="success" clearable />);
    expect(rendered.find('.clearIcon')).toHaveLength(1);

    rendered = shallow(<Banner {...props} styling="overlay" type="warning" clearable />);
    expect(rendered.find('.clearIcon')).toHaveLength(1);
  });

  it('has no clearIcon if not clearable', () => {
    const rendered = shallow(<Banner {...props} clearable={false} styling="overlay" />);
    expect(rendered.find('.clearIcon')).toHaveLength(0);
  });

  it('has no clearIcon if not overlay', () => {
    const rendered = shallow(<Banner {...props} styling="standard" />);
    expect(rendered.find('.clearIcon')).toHaveLength(0);
  });

  it('renders the icon', () => {
    const rendered = shallow(<Banner {...props} />);
    expect(rendered.find('.bannerIcon')).toHaveLength(1);
  });

  it('renders the message', () => {
    const rendered = shallow(<Banner {...props} />);
    expect(rendered.contains('TestMessage')).toBe(true);
  });

});