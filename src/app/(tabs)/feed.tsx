import { StyleSheet } from 'react-native';
import { Text, View } from '@/src/components/Themed';

export default function Feed() {
  return (
    <View style={styles.container}>
      <Text>TELA DE FEED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C2DCF2',
  },
});
