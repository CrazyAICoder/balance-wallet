import PropTypes from 'prop-types';
import React, { Component } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components/primitives';
import { Centered, Column } from '../components/layout';
import { Monospace } from '../components/text';
import { colors, fonts, padding, position, shadow } from '../styles';

import ToolTip from 'react-native-tooltip';

const Container = styled(Centered).attrs({ direction: 'column' })`
  ${padding(0, 31)}
  height: 100%;
`;

const WalletAddressTextContainer = styled(Centered).attrs({ direction: 'column' })`
  margin-top: 22;
  width: 100%;
`;

const QRCodePadding = 25;
const QRCodeImageSize = 150;

const QRCodeContainer = styled(Centered)`
  ${padding(QRCodePadding)}
  ${position.size(QRCodeImageSize + (QRCodePadding * 2))}
  ${shadow.build(0, 3, 5)}
  ${shadow.build(0, 6, 10)}
  background-color: ${colors.white};
  border-color: ${shadow.color};
  border-radius: 24;
  border-width: 1;
`;

const SettingsScreen = ({ address, onCopyAddress }) => (
  <Container>
    <QRCodeContainer>
      {address && <QRCode size={QRCodeImageSize} value={address} />}
    </QRCodeContainer>
    <WalletAddressTextContainer>
      <ToolTip
        actions={[{ onPress: onCopyAddress, text: 'Copy' }]}
        underlayColor={colors.transparent}
      >
        <Monospace size="big" weight="semibold">{address}</Monospace>
      </ToolTip>
    </WalletAddressTextContainer>
  </Container>
);

SettingsScreen.propTypes = {
  address: PropTypes.string,
  onCopyAddress: PropTypes.func,
};

export default compose(
  withHandlers({
    onCopyAddress: () => () => {

    },
  }),
)(SettingsScreen);