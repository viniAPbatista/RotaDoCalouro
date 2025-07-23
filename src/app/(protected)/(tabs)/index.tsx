import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { router } from 'expo-router';

const ListaCaronas = () => {
  return(
    <View style={styles.containerCarona}>
      <Text>CARONAS</Text>
    </View>
  )
}

export default function TabOneScreen() {

  function handleAcessCriarCarona() {
    router.push('/criarCarona')
  }

  return (
    <View style={styles.container}>
      <ListaCaronas/>
      <ListaCaronas/>
      <TouchableOpacity style={styles.ButtonAdicionarCarona} onPress={handleAcessCriarCarona}>
        <Text style={styles.TextAdicionarCarona}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#C2DCF2',
    paddingTop: 32,
  },
  containerCarona: {
    backgroundColor: 'white',
    width: '93%',
    height: '20%',
    borderRadius: 15,
    margin: 6
  },
  ButtonAdicionarCarona: {
    position: 'absolute',
    bottom: 130,
    right: 30,
    backgroundColor: '#272874ff',
    borderRadius: 30,
    width: '15%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextAdicionarCarona: {
    color: 'white',
    fontSize: 35,
  }
});
