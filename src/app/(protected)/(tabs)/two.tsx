import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { useAuth } from '@clerk/clerk-expo';

export default function TabTwoScreen() {
  const { signOut } = useAuth()

  return (
    <View style={styles.container}>
      <Text>TELA DE PERFIL</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
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
