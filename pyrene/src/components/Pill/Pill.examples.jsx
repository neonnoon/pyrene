const examples = {};

examples.props = {
  icon: 'data',
  iconType: 'neutral',
  value: 188,
  type: 'info',
  onClick: () => alert('Max value ' + examples.props.value + ' exceeded!'),
};

examples.examples = [
  {
    props: {
      icon: 'hot',
      iconType: 'danger',
      value: 66,
      type: 'danger',
    },
    description: '66 isolated hosts. Not clickable.',
  },
  {
    props: {
      icon: 'eye',
      iconType: 'neutral',
      value: 66,
      type: 'success',
      onClick: () => alert('Found 66 investigations.'),
    },
    description: '66 investigations. Clickable.',
  },
  {
    props: {
      value: 188,
      maxValue: 200,
      type: 'warning',
    },
  },
  {
    props: {
      icon: 'share',
      iconType: 'info',
      value: 188,
      maxValue: 200,
      type: 'info',
    },
    description: 'More than 99 shares. Not clickable.',
  },
  {
    props: {
      icon: 'data',
      iconType: 'neutral',
      value: 188,
      type: 'info',
      onClick: () => alert('Max value 99 exceeded!'),
    },
    description: 'More than 99 data items. Clickable.',
  },
];

export default examples;
