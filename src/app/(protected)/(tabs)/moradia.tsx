import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { Moradia } from '@/src/types';
import { useRouter } from "expo-router";
// Importe seu cliente Supabase aqui
// import { supabase } from '@/src/lib/supabase';

const MoradiaItem = ({ item }: { item: Moradia }) => (
  <View style={styles.moradiaContainer}>
    {item.fotos && item.fotos.length > 0 && (
      <Image source={{ uri: item.fotos[0] }} style={styles.moradiaImagem} />
    )}
    <View style={styles.moradiaInfo}>
      <Text style={styles.moradiaTitulo}>{item.titulo}</Text>
      <Text>Quartos: {item.quartos}</Text>
      <Text>Banheiros: {item.banheiros}</Text>
      <Text>Vagas: {item.vagas}</Text>
      <Text style={styles.moradiaValor}>R$ {item.valor.toFixed(2)}</Text>
    </View>
  </View>
);

export default function Moradias() {
  const [moradias, setMoradias] = useState<Moradia[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  function handleAcessCriarMoradia() {
    router.push('/criarMoradia')
  }

  useEffect(() => {
    const fetchMoradias = async () => {
      // Aqui você buscará as moradias no Supabase
      // Exemplo:
      /*
      const { data, error } = await supabase
        .from('moradias')
        .select('*');

      if (!error && data) {
        setMoradias(data);
      }
      */
      // Dados de exemplo enquanto a busca não é implementada:
      setMoradias([
        { id: '1', created_at: '', titulo: 'Apartamento perto da faculdade', descricao: '', fotos: ['https://via.placeholder.com/150'], quartos: 2, banheiros: 1, vagas: 2, valor: 1200 },
        { id: '2', created_at: '', titulo: 'Kitnet mobiliada', descricao: '', fotos: ['https://via.placeholder.com/150'], quartos: 1, banheiros: 1, vagas: 1, valor: 800 },
      ]);
      setLoading(false);
    };

    fetchMoradias();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={moradias}
        renderItem={({ item }) => <MoradiaItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
      <TouchableOpacity style={styles.ButtonAdicionarMoradia} onPress={handleAcessCriarMoradia}>
        <Text style={styles.TextAdicionarMoradia}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2DCF2',
  },
  moradiaContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moradiaImagem: {
    width: 100,
    height: '100%',
  },
  moradiaInfo: {
    padding: 15,
    flex: 1,
  },
  moradiaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  moradiaValor: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32CD32',
  },
  ButtonAdicionarMoradia: {
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
  TextAdicionarMoradia: {
    color: 'white',
    fontSize: 35,
  },
});