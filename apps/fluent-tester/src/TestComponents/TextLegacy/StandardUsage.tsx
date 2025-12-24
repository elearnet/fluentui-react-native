import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@elui/react-native';
import { Stack } from '@elui-react-native/stack';

import { stackStyle } from '../Common/styles';

export const StandardUsage: React.FunctionComponent = () => {
  return (
    <View>
      <Stack style={stackStyle} gap={5}>
        <Text variant="captionStandard">CaptionStandard</Text>
        <Text variant="secondaryStandard">SecondaryStandard</Text>
        <Text variant="secondarySemibold">SecondarySemibold</Text>
        <Text variant="bodyStandard">BodyStandard</Text>
        <Text variant="bodySemibold">BodySemibold</Text>
        <Text variant="subheaderStandard">SubheaderStandard</Text>
        <Text variant="subheaderSemibold">SubheaderSemibold</Text>
        <Text variant="headerStandard">HeaderStandard</Text>
        <Text variant="headerSemibold">HeaderSemibold</Text>
        <Text variant="heroStandard">HeroStandard</Text>
        <Text variant="heroSemibold">HeroSemibold</Text>
        <Text variant="heroLargeStandard">HeroLargeStandard</Text>
        <Text variant="heroLargeSemibold">HeroLargeSemibold</Text>
      </Stack>
    </View>
  );
};
