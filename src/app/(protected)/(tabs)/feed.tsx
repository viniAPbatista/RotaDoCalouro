import { View, StyleSheet, FlatList, TouchableOpacity, Text, ScrollView } from "react-native";
import PostListItem from "@/src/components/postListItem";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import { Post } from "@/src/types";
import { useFocusEffect } from '@react-navigation/native';

export default function Feed() {

  const [posts, setPosts] = useState<Post[]>([])
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*, user:users!posts_user_id_fkey(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts:", error);
      return;
    }

    // Adiciona contagem de comentários para cada post
    const postsWithCommentCounts = await Promise.all(
      postsData.map(async (post) => {
        const { count, error: countError } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        if (countError) {
          console.error("Erro ao contar comentários:", countError);
          return { ...post, nr_of_comments: 0 }; // fallback
        }

        return {
          ...post,
          nr_of_comments: count,
        };
      })
    );

    setPosts(postsWithCommentCounts);
  };

  function handleAcessCriarPost() {
    router.push('/criarPost')
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <TouchableOpacity style={styles.ButtonAdicionarPost} onPress={handleAcessCriarPost}>
        <Text style={styles.TextAdicionarPost}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C2DCF2',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  ButtonAdicionarPost: {
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
  TextAdicionarPost: {
    color: 'white',
    fontSize: 35,
  },
  scrollViewPosts: {
    marginBottom: '27%'
  }
});
