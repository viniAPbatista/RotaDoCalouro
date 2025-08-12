import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { Moradia } from '@/src/types';
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from '@/src/lib/supabase';

const MoradiaItem = ({ item }: { item: Moradia }) => (
  <View style={styles.moradiaContainer}>
    {/* {item.fotos && item.fotos.length > 0 ? (
      <Image source={{ uri: item.fotos[0] }} style={styles.moradiaImagem} />
    ) : (
      <Image source={{ uri: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600' }} style={styles.moradiaImagem} />
    )} */}
    <Image source={{ uri: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600' }} style={styles.moradiaImagem} />
    <View style={styles.moradiaInfo}>
      <Text style={styles.moradiaTitulo}>{item.titulo}</Text>
      
      <Text style={styles.moradiaDescricao} numberOfLines={2} ellipsizeMode="tail">
        {item.descricao}
      </Text>

      {item.users && (
        <Text style={styles.moradiaProprietario}>
          Anunciado por: {item.users.name}
        </Text>
      )}

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Quartos: {item.quartos}</Text>
        <Text style={styles.detailText}>Banheiros: {item.banheiros}</Text>
        <Text style={styles.detailText}>Vagas: {item.vagas}</Text>
      </View>

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
        .select('*, users(name)') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setMoradias(data as any); 
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
        contentContainerStyle={styles.listContentContainer}
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
  listContentContainer: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 100,
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
    marginTop: '10%',
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moradiaImagem: {
    width: 110, 
    height: 'auto',
    backgroundColor: '#e0e0e0'
  },
  moradiaInfo: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  moradiaTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moradiaDescricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  moradiaProprietario: {
    fontSize: 12,
    fontWeight: '500',
    color: '#272874ff',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#333',
  },
  moradiaValor: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32CD32',
    textAlign: 'right',
  },
  ButtonAdicionarMoradia: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#272874ff',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  TextAdicionarMoradia: {
    color: 'white',
    fontSize: 35,
    lineHeight: 40,
  },
});