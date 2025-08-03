import { StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Post } from '@/src/types';
import PostListItem from '../../../components/postListItem';
import { useFocusEffect } from '@react-navigation/native';

export default function Perfil() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchUserPosts(user.id);
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

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>

          <Text style={styles.sectionTitle}>Seus Posts</Text>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PostListItem post={item} />}
            style={{ width: '100%' }}
            ListFooterComponent={() => (
              <TouchableOpacity onPress={() => signOut()} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}
          />
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
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff5252',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
