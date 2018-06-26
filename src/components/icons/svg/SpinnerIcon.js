import PropTypes from 'prop-types';
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../styles';

const SpinnerIcon = ({ color, height, width, ...props }) => (
  <Svg
    height={height}
    viewBox="0 0 12 12"
    width={width}
  >
    <Path
      d="M11.5 5.75a.75.75 0 1 1-1.5 0A4.25 4.25 0 1 0 5.75 10a.75.75 0 0 1 0 1.5 5.75 5.75 0 1 1 5.75-5.75z"
      fill={color}
    />
  </Svg>
);

SpinnerIcon.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

SpinnerIcon.defaultProps = {
  color: colors.blue,
  height: 12,
  width: 12,
};

export default SpinnerIcon;
