import { StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Post, Ride, Moradia } from '@/src/types';
import PostListItem from '../../../components/postListItem';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const PerfilMoradiaItem = ({ item, onDelete }: { item: Moradia, onDelete: (id: string) => void }) => (
  <View style={styles.moradiaContainer}>
    <Image
      source={{ uri: item.fotos && item.fotos.length > 0 ? item.fotos[0] : 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600' }}
      style={styles.moradiaImagem}
    />
    <View style={styles.moradiaInfo}>
      <View>
        <Text style={styles.moradiaTitulo}>{item.titulo}</Text>
        <Text style={styles.moradiaDescricao} numberOfLines={2} ellipsizeMode="tail">
          {item.descricao}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.specsText}>
          {`${item.quartos} Quarto(s) • ${item.banheiros} Banheiro(s) • ${item.vagas} Vaga(s)`}
        </Text>
        {item.endereco && (
          <View style={styles.iconDetailRow}>
            <Ionicons name="location-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.iconDetailText} numberOfLines={1}>{item.endereco}</Text>
          </View>
        )}
        {item.telefone && (
          <View style={styles.iconDetailRow}>
            <Ionicons name="call-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.iconDetailText}>{item.telefone}</Text>
          </View>
        )}
      </View>
      <View style={styles.footerRow}>
        {item.users && (
          <Text style={styles.moradiaProprietario}>
            Anunciado por: {item.users.name}
          </Text>
        )}
        <View style={{ flex: 1 }} />
        <Text style={styles.moradiaValor}>R$ {Number(item.valor).toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function Perfil() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [reservedRides, setReservedRides] = useState<Ride[]>([]);
  const [userMoradias, setUserMoradias] = useState<Moradia[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onSelectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a galeria é necessária.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true, // CORREÇÃO APLICADA AQUI
    });

    if (result.canceled || !user) {
      return;
    }

    setIsUploading(true);
    try {
      const asset = result.assets[0];
      // CORREÇÃO APLICADA AQUI
      await user.setProfileImage({
        file: `data:${asset.mimeType};base64,${asset.base64}`,
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil.');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchAllData = useCallback(async () => {
    if (user?.id) {
      await Promise.all([
        fetchUserPosts(user.id),
        fetchUserRides(user.id),
        fetchReservedRides(user.id),
        fetchUserMoradias(user.id),
      ]);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [fetchAllData])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

  const fetchUserMoradias = async (userId: string) => {
    const { data, error } = await supabase.from('moradias').select('*, users(name)').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) console.error('Erro ao buscar moradias:', error.message);
    else setUserMoradias(data as any || []);
  };

  const fetchUserPosts = async (userId: string) => {
    const { data: postsData, error } = await supabase.from('posts').select(`id, content, image_url, created_at, user:users!posts_user_id_fkey(id, name, image)`).eq('user_id', userId).order('created_at', { ascending: false });
    if (error) { console.error('Erro ao buscar posts:', error.message); return; }
    if (!postsData) return;
    const postsWithCounts = await Promise.all(
      postsData.map(async (post: any) => {
        const [{ count: likesCount }, { count: commentsCount }, { data: likedByMe }] = await Promise.all([
          supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
          supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
          supabase.from('likes').select('user_id').eq('post_id', post.id).eq('user_id', userId).limit(1),
        ]);
        return { ...post, likes: likesCount ?? 0, nr_of_comments: commentsCount ?? 0, liked_by_me: likedByMe && likedByMe.length > 0 } as Post;
      })
    );
    setPosts(postsWithCounts);
  };

  const fetchUserRides = async (userId: string) => {
    const { data: ridesData, error } = await supabase.from('rides').select(`*, passengers:ride_reservations(user:users(id, name, image))`).eq('user_id', userId).order('ride_date', { ascending: false });
    if (error) console.error('Erro ao buscar caronas:', error.message);
    else setRides(ridesData || []);
  };

  const fetchReservedRides = async (userId: string) => {
    const { data, error } = await supabase.from('ride_reservations').select(`ride_id, rides:ride_id(*, user:users!rides_user_id_fkey(id, name))`).eq('user_id', userId);
    if (error) console.error('Erro ao buscar caronas reservadas:', error.message);
    else {
      const ridesOnly = data.map((reservation) => reservation.rides).filter(Boolean).flat() as Ride[];
      setReservedRides(ridesOnly);
    }
  };

  const deleteMoradia = async (moradiaId: string) => {
    const { error } = await supabase.from('moradias').delete().eq('id', moradiaId);
    if (error) Alert.alert('Erro', 'Não foi possível excluir o anúncio.');
    else { setUserMoradias(prev => prev.filter(m => m.id !== moradiaId)); Alert.alert('Sucesso', 'Anúncio excluído.'); }
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) console.error('Erro ao excluir o post:', error.message);
    else setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const deleteRide = async (rideId: string) => {
    const { error } = await supabase.from('rides').delete().eq('id', rideId);
    if (error) console.error('Erro ao excluir a carona:', error.message);
    else setRides(prev => prev.filter(r => r.id !== rideId));
  };

  const cancelRideReservation = async (rideId: string) => {
    if (!user?.id) return;
    const { error } = await supabase.from('ride_reservations').delete().eq('ride_id', rideId).eq('user_id', user.id);
    if (error) console.error('Erro ao cancelar reserva:', error.message);
    else {
      await supabase.rpc('increment_seats', { ride_id_input: rideId });
      setReservedRides(prev => prev.filter(r => r.id !== rideId));
    }
  };

  const openWaze = async (destination: string) => {
    const url = `waze://?q=${encodeURIComponent(destination)}&navigate=yes`;
    try { await Linking.openURL(url); }
    catch { Alert.alert('Erro', 'Não foi possível abrir o Waze.'); }
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={onSelectProfileImage} disabled={isUploading}>
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              <View style={styles.editIconContainer}>
                <Ionicons name="camera-outline" size={20} color="white" />
              </View>
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>

          <TouchableOpacity onPress={() => signOut()} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <ScrollView
            style={{ width: '100%', marginBottom: '22%' }}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#272874ff" />}
          >
            <Text style={styles.sectionTitle}>Suas Moradias Anunciadas</Text>
            {userMoradias.length > 0 ? (
              userMoradias.map((moradia) => <PerfilMoradiaItem key={moradia.id} item={moradia} onDelete={deleteMoradia} />)
            ) : ( <Text style={styles.emptyMessage}>Você ainda não anunciou nenhuma moradia.</Text> )}

            <Text style={styles.sectionTitle}>Seus Posts</Text>
            {posts.map((post) => (
              <View key={post.id} style={{ marginBottom: 14, borderRadius: 10 }}>
                <PostListItem post={post} />
                <TouchableOpacity onPress={() => deletePost(post.id)} style={styles.deletePostButton}>
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Suas Caronas</Text>
            {rides.map((item) => {
              const pricePerPassenger = item.original_seats ? item.price / item.original_seats : item.price;
              return (
                <View key={item.id} style={styles.containerCarona}>
                  <Text style={styles.titleCarona}>{item.origin} ➜ {item.destination}</Text>
                  <Text style={styles.details}>Data: {new Date(item.ride_date).toLocaleDateString('pt-BR')}</Text>
                  <Text style={styles.details}>Hora: {item.ride_time.slice(0, 5)}</Text>
                  <Text style={styles.details}>Vagas: {item.seats}</Text>
                  <Text style={styles.details}>Por pessoa: R$ {pricePerPassenger.toFixed(2)}</Text>
                  {item.passengers && item.passengers.length > 0 && (
                    <>
                      <Text style={[styles.details, { marginTop: 8, fontWeight: 'bold' }]}>Passageiros:</Text>
                      {item.passengers.map((p, index) => (
                        <View key={p.user.id ?? index} style={styles.passengerContainer}>
                          {p.user.image && <Image source={{ uri: p.user.image }} style={styles.passengerImage} />}
                          <Text style={styles.details}>{p.user.name}</Text>
                        </View>
                      ))}
                    </>
                  )}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => openWaze(item.destination)} style={[styles.actionButton, { backgroundColor: '#33cc33' }]}>
                      <Text style={styles.actionButtonText}>Abrir no Waze</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteRide(item.id)} style={[styles.actionButton, { backgroundColor: '#ff5252' }]}>
                      <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <Text style={styles.sectionTitle}>Caronas Reservadas</Text>
            {reservedRides.length === 0 ? (
              <Text style={styles.emptyMessage}>Nenhuma carona reservada.</Text>
            ) : (
              reservedRides.map((item: Ride) => {
                const pricePerPassenger = item.original_seats ? item.price / item.original_seats : item.price;
                return (
                  <View key={item.id} style={styles.containerCarona}>
                    <Text style={styles.titleCarona}>{item.origin} ➜ {item.destination}</Text>
                    <Text style={styles.details}>Motorista: {item.user?.name ?? 'Desconhecido'}</Text>
                    <Text style={styles.details}>Data: {new Date(item.ride_date).toLocaleDateString('pt-BR')}</Text>
                    {/* MODIFICAÇÃO AQUI */}
                    <Text style={styles.details}>Hora: {item.ride_time ? item.ride_time.slice(0, 5) : 'Não informado'}</Text>
                    <Text style={styles.details}>Modelo do carro: {item.car_model ?? 'Não informado'}</Text>
                    <Text style={styles.details}>Placa do carro: {item.car_plate ?? 'Não informada'}</Text>
                    {/* FIM DA MODIFICAÇÃO */}
                    <Text style={styles.details}>Por pessoa: R$ {pricePerPassenger.toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => cancelRideReservation(item.id)} style={styles.cancelButton}>
                      <Text style={styles.deleteButtonText}>Cancelar reserva</Text>
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
  avatarContainer: {
    marginBottom: 8,
    borderRadius: 49
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 6,
    borderRadius: 15,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
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
  emptyMessage: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 20,
    alignSelf: 'center',
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
    width: 110,
    height: 'auto',
    backgroundColor: '#e0e0e0'
  },
  moradiaInfo: {
    padding: 12,
    flex: 1,
  },
  moradiaTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moradiaDescricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  detailsContainer: {
    flex: 1,
    gap: 8,
  },
  specsText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  iconDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  iconDetailText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  moradiaProprietario: {
    fontSize: 12,
    fontWeight: '500',
    color: '#272874ff',
    flexShrink: 1,
  },
  moradiaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32CD32',
    textAlign: 'right',
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deletePostButton: {
    backgroundColor: '#ff5252',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginRight: 10,
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
  titleCarona: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  passengerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8
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
  cancelButton: {
    backgroundColor: '#ff5252',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});