import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/src/components/Themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
// Importe seu cliente Supabase aqui
// import { supabase } from '@/src/lib/supabase';

export default function CriarMoradia() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quartos, setQuartos] = useState('');
  const [banheiros, setBanheiros] = useState('');
  const [vagas, setVagas] = useState('');
  const [valor, setValor] = useState('');

  const router = useRouter();

  const handleSalvarMoradia = async () => {
    // Aqui você implementará a lógica para salvar os dados no Supabase
    // e fazer o upload das fotos.
    Alert.alert('Funcionalidade a ser implementada', 'A lógica de salvar a moradia ainda precisa ser criada.');

    // Exemplo de como poderia ser a inserção no Supabase:
    /*
    const { data, error } = await supabase
      .from('moradias')
      .insert([{
        titulo,
        descricao,
        quartos: parseInt(quartos),
        banheiros: parseInt(banheiros),
        vagas: parseInt(vagas),
        valor: parseFloat(valor),
        fotos: [], // Adicionar a lógica de upload de fotos aqui
      }]);

    if (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a moradia.');
    } else {
      Alert.alert('Sucesso', 'Moradia cadastrada com sucesso!');
      // Limpar os campos ou navegar para outra tela
    }
    */
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView style={styles.container}>
        <View style={styles.containerTitle}>
          <TouchableOpacity style={styles.backButton} onPress={router.back}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Cadastrar Nova Moradia</Text>
        </View>
        <View style={styles.containerForm}>
          <Text style={styles.textInput}>Titulo do anuncio!</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Apartamento proximo a faculdade!"
            value={titulo}
            onChangeText={setTitulo}
          />
          <Text style={styles.textInput}>Descrição</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição da moradia"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />
          <Text style={styles.textInput}>Quartos</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de quartos"
            value={quartos}
            onChangeText={setQuartos}
            keyboardType="numeric"
          />
          <Text style={styles.textInput}>Banheiros</Text>
          <TextInput
            style={styles.input}
            placeholder="Número de banheiros"
            value={banheiros}
            onChangeText={setBanheiros}
            keyboardType="numeric"
          />
          <Text style={styles.textInput}>Vagas</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade de pessoas"
            value={vagas}
            onChangeText={setVagas}
            keyboardType="numeric"
          />
          <Text style={styles.textInput}>Valor</Text>
          <TextInput
            style={styles.input}
            placeholder="Valor do aluguel"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleSalvarMoradia}>
            <Text style={styles.buttonText}>Salvar Moradia</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2DCF2'
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16
  },
  containerTitle: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%'
  },
  backButton: {
    marginBottom: 25
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  containerForm: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  textInput: {
    fontSize: 20,
    marginTop: 28,
  },
  button: {
    backgroundColor: '#272874ff',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20%'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
});