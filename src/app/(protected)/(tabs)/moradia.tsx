import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { Moradia } from '@/src/types';
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from '@/src/lib/supabase';

const MoradiaItem = ({ item }: { item: Moradia }) => (
  <View style={styles.moradiaContainer}>
    {item.fotos && item.fotos.length > 0 ? (
      <Image source={{ uri: item.fotos[0] }} style={styles.moradiaImagem} />
    ) : (
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.moradiaImagem} />
    )}
    <View style={styles.moradiaInfo}>
      <Text style={styles.moradiaTitulo}>{item.titulo}</Text>
      <Text>Quartos: {item.quartos}</Text>
      <Text>Banheiros: {item.banheiros}</Text>
      <Text>Vagas: {item.vagas}</Text>
      <Text style={styles.moradiaValor}>R$ {Number(item.valor).toFixed(2)}</Text>
    </View>
  </View>
);

export default function Moradias() {
  const [moradias, setMoradias] = useState<Moradia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  function handleAcessCriarMoradia() {
    router.push('/criarMoradia');
  }

  const fetchMoradias = async () => {
    try {
      const { data, error } = await supabase
        .from('moradias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setMoradias(data);
      }
    } catch (error: any) {
      console.error("Erro ao buscar moradias:", error);
      Alert.alert('Erro', `Não foi possível carregar a lista de moradias: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchMoradias();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMoradias();
  }, []);


  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#272874ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={moradias}
        renderItem={({ item }) => <MoradiaItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          flexGrow: 1, 
          justifyContent: 'center', 
          padding: 10,
          paddingBottom: 100,
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma moradia cadastrada ainda.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C2DCF2',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#555',
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
    backgroundColor: '#e0e0e0'
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
    lineHeight: 40,
  },
});