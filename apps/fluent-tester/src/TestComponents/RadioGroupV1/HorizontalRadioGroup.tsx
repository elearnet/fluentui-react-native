import * as React from 'react';
import { View } from 'react-native';

import { Separator } from '@elui/react-native';
import { RadioGroupV1 as RadioGroup, Radio } from '@elui-react-native/radio-group';

export const HorizontalRadioGroup: React.FunctionComponent = () => {
  // Client's example onChange function
  const onChange = React.useCallback((key: string) => {
    console.log(key);
  }, []);

  return (
    <View>
      <RadioGroup layout={'horizontal'} label="Horizontal RadioGroup" defaultValue="X" onChange={onChange}>
        <Radio label="Apple" value="W" />
        <Radio label="Pear" value="X" />
        <Radio label="Banana" value="C" />
        <Radio label="Orange" value="Z" />
      </RadioGroup>
      <Separator />
      <RadioGroup layout={'horizontal-stacked'} label="Horizontal-Stacked RadioGroup" defaultValue="X" onChange={onChange}>
        <Radio label="Apple" value="W" />
        <Radio label="Pear" value="X" />
        <Radio label="Banana" value="C" />
        <Radio label="Orange" value="Z" />
      </RadioGroup>
    </View>
  );
};
