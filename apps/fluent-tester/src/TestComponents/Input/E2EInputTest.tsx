import * as React from 'react';

import {
  INPUT_TEST_COMPONENT,
  INPUT_TEXT,
  INPUT_TEST_COMPONENT_DISMISS_BUTTON,
  INPUT_ERROR_STRING,
  INPUT_ONCLICK_STRING,
  INPUT_START_STRING,
} from '@elui-react-native/e2e-testing';
import type { IconProps } from '@elui-react-native/icon';
import { Input } from '@elui-react-native/input';
import { Stack } from '@elui-react-native/stack';
import { Text } from '@elui-react-native/text';

import FilledSvg from '../../../assets/filledIcon.svg';
import OutlineSvg from '../../../assets/outlineIcon.svg';
import { stackStyle } from '../Common/styles';
import { testProps } from '../Common/TestProps';

export const outlineIconProps: IconProps = { svgSource: { src: OutlineSvg, viewBox: '0 0 20 20' } };
export const filledIconProps: IconProps = { svgSource: { src: FilledSvg, viewBox: '0 0 20 20' } };

export const E2EInputTest: React.FunctionComponent = () => {
  const [error, setError] = React.useState<string>('');
  const [text, setText] = React.useState<string>(INPUT_START_STRING);

  return (
    <Stack style={stackStyle}>
      <Text
        /* For Android E2E testing purposes, testProps must be passed in after accessibilityLabel. */
        {...testProps(INPUT_TEXT)}
      >
        {text}
      </Text>
      <Input
        error={error}
        defaultIcon={outlineIconProps}
        value={text}
        focusedStateIcon={filledIconProps}
        textInputProps={{ autoFocus: true }}
        placeholder="Only text upto 5 characters!"
        assistiveText="Assistive Text"
        label="Label"
        onChange={(text: string) => {
          setText(text);
          if (text.length > 5) {
            setError('Text must be less than 5 characters!');
            setText(INPUT_ERROR_STRING);
          } else {
            setError('');
          }
        }}
        /* For Android E2E testing purposes, testProps must be passed in after accessibilityLabel. */
        {...testProps(INPUT_TEST_COMPONENT)}
        accessoryIconAccessibilityLabel={INPUT_TEST_COMPONENT_DISMISS_BUTTON}
        accessoryButtonOnPress={() => {
          setText(INPUT_ONCLICK_STRING);
        }}
      />
    </Stack>
  );
};
