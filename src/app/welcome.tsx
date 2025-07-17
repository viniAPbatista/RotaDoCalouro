import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {

  const router = useRouter()

  function handleAccess() {
    router.push('/login')
  }

  return (
    <View style={styles.container}>

      <View style={styles.containerLogo}>
        <Image
          source={require('../../assets/images/logo_rota_do_calouro-removebg-preview.png')}
          style={{width: '100%'}}
          resizeMode="contain"
        />
      </View>

      <View style={styles.containerForm}>
        <Text style={styles.title}>Conecte-se a universidade</Text>
        <Text style={styles.text}>Faça o Login para começar</Text>

        <TouchableOpacity style={styles.button} onPress={handleAccess}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2DCF2'
  },
  containerLogo: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  containerForm: {
    flex: 1,   
    backgroundColor: 'white',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
  },
  text: {
    color: '#a1a1a1'
  },
  button: {
    position: 'absolute',
    borderRadius: 50,
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '25%',
    backgroundColor: '#272874ff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})