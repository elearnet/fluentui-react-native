import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
 rescType: string;
  rescId:string;
}

const NewWindow = ({ rescType, rescId}: Props) => {
  useEffect(() => {
    console.log(`Window opened for rescType: ${rescType},rescId:${rescId}`);
  }, [rescType,rescId]);

  return (
    <View>
      <Text >rescType: {rescType}</Text>
      <Text >rescId: {rescId}</Text>
    </View>
  );
};
export default NewWindow;