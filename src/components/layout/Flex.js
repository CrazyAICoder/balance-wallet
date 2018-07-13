import omitProps from '@hocs/omit-props';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { componentFromProp } from 'recompose';
import styled from 'styled-components/primitives';

export const getFlexStyleKeysFromShorthand = style => (
  (style === 'end' || style === 'start')
    ? `flex-${style}`
    : style
);

const FlexPropBlacklist = ['align', 'direction', 'justify', 'wrap'];

const Flex = styled(omitProps(...FlexPropBlacklist)(componentFromProp('component')))`
  align-items: ${({ align }) => getFlexStyleKeysFromShorthand(align)};
  flex-direction: ${({ direction }) => direction};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  justify-content: ${({ justify }) => getFlexStyleKeysFromShorthand(justify)};
`;

Flex.displayName = 'Flex';

Flex.propTypes = {
  align: PropTypes.oneOf(['baseline', 'center', 'end', 'start', 'stretch']),
  component: PropTypes.func,
  direction: PropTypes.oneOf(['row', 'column']),
  justify: PropTypes.oneOf(['center', 'end', 'space-around', 'space-between', 'start']),
  wrap: PropTypes.bool,
};

Flex.defaultProps = {
  align: 'stretch',
  component: Animated.View,
  direction: 'row',
  justify: 'start',
};

export default Flex;
