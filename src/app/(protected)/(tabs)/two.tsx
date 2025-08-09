import { StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Alert } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Post, Ride } from '@/src/types';
import PostListItem from '../../../components/postListItem';
import { useFocusEffect } from '@react-navigation/native';

export default function Perfil() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [reservedRides, setReservedRides] = useState<Ride[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchUserPosts(user.id);
        fetchUserRides(user.id);
        fetchReservedRides(user.id);
      }
    }, [user])
  );

  const fetchUserPosts = async (userId: string) => {
    const { data: postsData, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        image_url,
        created_at,
        user:users!posts_user_id_fkey(id, name, image)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar posts:', error.message);
      return;
    }
    if (!postsData) return;

    const postsWithCounts = await Promise.all(
      postsData.map(async (post: any) => {
        const [{ count: likesCount }, { count: commentsCount }, { data: likedByMe }] = await Promise.all([
          supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id),
          supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id),
          supabase
            .from('likes')
            .select('user_id')
            .eq('post_id', post.id)
            .eq('user_id', userId)
            .limit(1),
        ]);

        return {
          id: post.id,
          content: post.content,
          image_url: post.image_url,
          created_at: post.created_at,
          user: Array.isArray(post.user) ? post.user[0] : post.user,
          likes: likesCount ?? 0,
          nr_of_comments: commentsCount ?? 0,
          liked_by_me: likedByMe && likedByMe.length > 0,
        } as Post;
      })
    );

    setPosts(postsWithCounts);
  };

  const fetchUserRides = async (userId: string) => {
    const { data: ridesData, error } = await supabase
      .from('rides')
      .select(`
      *,
      passengers:ride_reservations (
        user:users (
          id,
          name,
          image
        )
      )
    `)
      .eq('user_id', userId)
      .order('ride_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar caronas:', error.message);
      return;
    }

    setRides(ridesData);
  };

  const fetchReservedRides = async (userId: string) => {
    const { data, error } = await supabase
      .from('ride_reservations')
      .select(`
      ride_id,
      rides:ride_id (
        id,
        origin,
        destination,
        ride_date,
        ride_time,
        seats,
        price,
        original_seats,
        car_model,
        car_plate,
        user:users!rides_user_id_fkey (id, name)
      )
    `)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar caronas reservadas:', error.message);
      return;
    }

    const ridesOnly = data
      .map((reservation) => reservation.rides)
      .filter((ride) => ride !== null)
      .flat() as Ride[];

    setReservedRides(ridesOnly);
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Erro ao excluir o post:', error.message);
      return;
    }

    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const deleteRide = async (rideId: string) => {
    const { error } = await supabase
      .from('rides')
      .delete()
      .eq('id', rideId);

    if (error) {
      console.error('Erro ao excluir a carona:', error.message);
      return;
    }

    setRides(prevRides => prevRides.filter(ride => ride.id !== rideId));
  };

  const cancelRideReservation = async (rideId: string) => {
    if (!user?.id) return;

    const { error: deleteError } = await supabase
      .from('ride_reservations')
      .delete()
      .eq('ride_id', rideId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Erro ao cancelar reserva:', deleteError.message);
      return;
    }

    const { error: rpcError } = await supabase.rpc('increment_seats', {
      ride_id_input: rideId,
    });

    if (rpcError) {
      console.error('Erro ao atualizar vagas da carona:', rpcError.message);
      return;
    }

    setReservedRides(prev =>
      prev.filter(ride => ride.id !== rideId)
    );
  };

  const openWaze = async (destination: string) => {
    const encodedDest = encodeURIComponent(destination);
    const url = `waze://?q=${encodedDest}&navigate=yes`;
    const webUrl = `https://www.waze.com/ul?q=${encodedDest}&navigate=yes`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir a rota.');
      console.error('Erro ao abrir o Waze:', error);
    }
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>

          <TouchableOpacity onPress={() => signOut()} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <ScrollView style={{ width: '100%', marginBottom: '22%' }} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.sectionTitle}>Seus Posts</Text>
            {posts.map((post) => (
              <View key={post.id} style={{ marginBottom: 14, borderRadius: 10 }}>
                <PostListItem post={post} />
                <TouchableOpacity
                  onPress={() => deletePost(post.id)}
                  style={{
                    backgroundColor: '#ff5252',
                    padding: 8,
                    borderRadius: 6,
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Suas Caronas</Text>
            {rides.map((item) => {
              const pricePerPassenger = item.original_seats && item.original_seats > 0
                ? (item.price / item.original_seats)
                : item.price;

              return (
                <View key={item.id} style={styles.containerCarona}>
                  {/* ... (código existente para exibir os detalhes da carona) ... */}
                  <Text style={styles.title}>{item.origin} ➜ {item.destination}</Text>
                  <Text style={styles.details}>Data: {new Date(item.ride_date).toLocaleDateString('pt-BR')}</Text>
                  <Text style={styles.details}>Hora: {item.ride_time.slice(0, 5)}</Text>
                  <Text style={styles.details}>Vagas: {item.seats}</Text>
                  <Text style={styles.details}>Valor total: R$ {item.price.toFixed(2)}</Text>
                  <Text style={styles.details}>Por pessoa: R$ {pricePerPassenger.toFixed(2)}</Text>

                  {/* ... (código existente para exibir os passageiros) ... */}
                  {item.passengers && item.passengers.length > 0 && (
                    <>
                      <Text style={[styles.details, { marginTop: 8, fontWeight: 'bold' }]}>Passageiros:</Text>
                      {item.passengers.map((p, index) => (
                        <View key={p.user.id ?? index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          {p.user.image && (
                            <Image
                              source={{ uri: p.user.image }}
                              style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
                            />
                          )}
                          <Text style={styles.details}>{p.user.name}</Text>
                        </View>
                      ))}
                    </>
                  )}

                  {/* Container para os botões */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => openWaze(item.destination)}
                      style={[styles.actionButton, { backgroundColor: '#33cc33' }]}
                    >
                      <Text style={styles.actionButtonText}>Abrir no Waze</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteRide(item.id)}
                      style={[styles.actionButton, { backgroundColor: '#ff5252' }]}
                    >
                      <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <Text style={styles.sectionTitle}>Caronas Reservadas</Text>
            {reservedRides.length === 0 ? (
              <Text style={{ fontStyle: 'italic', color: '#666' }}>Nenhuma carona reservada.</Text>
            ) : (
              reservedRides.map((item: Ride) => {
                const pricePerPassenger = item.original_seats && item.original_seats > 0
                  ? (item.price / item.original_seats)
                  : item.price;

                return (
                  <View key={item.id} style={styles.containerCarona}>
                    <Text style={styles.title}>{item.origin} ➜ {item.destination}</Text>
                    <Text style={styles.details}>Motorista: {item.user?.name ?? 'Desconhecido'}</Text>
                    <Text style={styles.details}>Modelo do carro: {item.car_model || 'Não informado'}</Text>
                    <Text style={styles.details}>Placa: {item.car_plate || 'Não informada'}</Text>
                    <Text style={styles.details}>Data: {new Date(item.ride_date).toLocaleDateString('pt-BR')}</Text>
                    <Text style={styles.details}>Hora: {item.ride_time.slice(0, 5)}</Text>
                    <Text style={styles.details}>Valor total: R$ {item.price.toFixed(2)}</Text>
                    <Text style={styles.details}>Por pessoa: R$ {pricePerPassenger.toFixed(2)}</Text>

                    <TouchableOpacity
                      onPress={() => cancelRideReservation(item.id)}
                      style={{
                        backgroundColor: '#ff5252',
                        padding: 8,
                        borderRadius: 6,
                        alignSelf: 'flex-end',
                        marginTop: 10,
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar reserva</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#C2DCF2',
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    padding: 10,
    backgroundColor: '#ff5252',
    borderRadius: 8,
    zIndex: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  rideItem: {
    backgroundColor: '#eef6fc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
