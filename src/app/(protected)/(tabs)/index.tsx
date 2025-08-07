import { StyleSheet, TouchableOpacity, Text, View, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { supabase } from '../../../lib/supabase';
import { Ride } from '@/src/types';
import { useFocusEffect } from '@react-navigation/native';

export default function TabOneScreen() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [rides, setRides] = useState<Ride[]>([]);
  const [reservadas, setReservadas] = useState<string[]>([]);

  function handleAcessCriarCarona() {
    router.push('/criarCarona')
  }

  useFocusEffect(
    useCallback(() => {
      const fetchRides = async () => {
        const { data, error } = await supabase
          .from('rides')
          .select(`
            id,
            origin,
            destination,
            ride_date,
            ride_time,
            seats,
            original_seats,
            price,
            user_id,
            car_model,
            car_plate,
            users (
              name
            )
          `)
          .order('ride_date', { ascending: true });

        if (error) {
          console.error('Erro ao buscar caronas: ', error);
          return;
        }

        setRides(data || []);

        if (userId) {
          const { data: reservas, error: reservasError } = await supabase
            .from('ride_reservations')
            .select('ride_id')
            .eq('user_id', userId);

          if (reservasError) {
            console.error('Erro ao buscar reservas:', reservasError);
            return;
          }

          const idsReservados = reservas.map((r) => r.ride_id);
          setReservadas(idsReservados);
        }
      };

      fetchRides();
    }, [userId])
  );

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
    const pricePerPassenger = item.original_seats > 0
      ? (item.price / item.original_seats)
      : item.price;

    const handleReserveRide = async () => {
      if (!userId) return;

      if (item.seats <= 0) {
        alert('Não há mais vagas disponíveis.');
        return;
      }

      const { error: insertError } = await supabase.from('ride_reservations').insert({
        ride_id: item.id,
        user_id: userId,
      });

      if (insertError) {
        if (insertError.code === '23505') {
          alert('Você já reservou essa carona.');
        } else {
          console.error('Erro ao reservar:', insertError);
        }
        return;
      }

      const { error: updateError } = await supabase
        .from('rides')
        .update({ seats: item.seats - 1 })
        .eq('id', item.id);

      if (updateError) {
        console.error('Erro ao atualizar vagas:', updateError);
        return;
      }

      alert('Carona reservada com sucesso!');
      setReservadas((prev) => [...prev, item.id]);

      setRides((prev) =>
        prev.map((ride) => (ride.id === item.id ? { ...ride, seats: ride.seats - 1 } : ride))
      );
    };

    return (
      <View style={styles.containerCarona}>
        <Text style={styles.title}>{item.origin} ➜ {item.destination}</Text>
        <Text style={styles.details}>
          Motorista: {item.users?.name || 'Desconhecido'}
        </Text>
        <Text style={styles.details}>Data: {new Date(item.ride_date).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.details}>Hora: {item.ride_time.slice(0, 5)}</Text>
        <Text style={styles.details}>Vagas: {item.seats}</Text>
        <Text style={styles.details}>Valor total: R$ {item.price.toFixed(2)}</Text>
        <Text style={styles.details}>Por pessoa: R$ {pricePerPassenger.toFixed(2)}</Text>
        <Text style={styles.details}>Modelo do carro: {item.car_model || 'Não informado'}</Text>
        <Text style={styles.details}>Placa: {item.car_plate || 'Não informada'}</Text>

        {item.user_id !== userId && item.seats > 0 && (
          reservadas.includes(item.id) ? (
            <TouchableOpacity style={styles.buttonReservado} disabled={true}>
              <Text style={styles.textReservado}>Reservado</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonReservar} onPress={handleReserveRide}>
              <Text style={styles.textReservar}>Reservar</Text>
            </TouchableOpacity>
          )
        )}

        {item.user_id !== userId && item.seats === 0 && (
          <Text style={{ color: 'red', marginTop: 4 }}>Vagas esgotadas</Text>
        )}
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
    paddingTop: 20
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
  buttonReservar: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  textReservar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonReservado: {
    marginTop: 10,
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  textReservado: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
