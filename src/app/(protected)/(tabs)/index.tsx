import { StyleSheet, TouchableOpacity, Text, View, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { supabase } from '../../../lib/supabase';
import { Ride } from '@/src/types';

export default function TabOneScreen() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [rides, setRides] = useState<Ride[]>([]);

  function handleAcessCriarCarona() {
    router.push('/criarCarona')
  }

  useEffect(() => {
    const fetchRides = async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('id, origin, destination, ride_date, ride_time, seats, price')
        .order('ride_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar caronas: ', error);
        return;
      }

      setRides(data || []);
    };

    fetchRides();
  }, []);

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (!userId || !user) return;

      const { data: existingUser, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar usuário existente:', error);
        return;
      }
      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert({
          id: userId,
          name: user.fullName || user.username || 'Usuário',
          image: user.imageUrl || null,
        });

        if (insertError) {
          console.error('Erro ao inserir usuário:', insertError);
        } else {
          console.log('Usuário inserido com sucesso!');
        }
      }
    };

    syncUserToSupabase();
  }, [userId, user]);

  const renderItem = ({ item }: { item: Ride }) => {
    const pricePerPassenger = item.seats > 1 ? (item.price / item.seats) : 0;

    return (
      <View style={styles.containerCarona}>
        <Text style={styles.title}>{item.origin} ➜ {item.destination}</Text>
        <Text style={styles.details}>Data: {new Date(item.ride_date).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.details}>Hora: {item.ride_time.slice(0, 5)}</Text>
        <Text style={styles.details}>Vagas: {item.seats}</Text>
        <Text style={styles.details}>Valor total: R$ {item.price.toFixed(2)}</Text>
        <Text style={styles.details}>Por pessoa: R$ {pricePerPassenger.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity style={styles.ButtonAdicionarCarona} onPress={handleAcessCriarCarona}>
        <Text style={styles.TextAdicionarCarona}>+</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C2DCF2',
    paddingHorizontal: 16, 
    paddingBottom: 100, 
    paddingTop: 20,
    flex: 1
  },
  containerCarona: {
    backgroundColor: 'white',
    alignSelf: 'center',      
    width: '100%',                
    borderRadius: 12,
    marginVertical: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});
