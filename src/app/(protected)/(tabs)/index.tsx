import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { router } from 'expo-router';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { supabase } from '../../../lib/supabase';

const ListaCaronas = () => {
  return (
    <View style={styles.containerCarona}>
      <Text>CARONAS</Text>
    </View>
  )
}

export default function TabOneScreen() {
  const { userId } = useAuth();
  const { user } = useUser();

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

  function handleAcessCriarCarona() {
    router.push('/criarCarona')
  }

  return (
    <View style={styles.container}>
      <ListaCaronas />
      <ListaCaronas />
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
