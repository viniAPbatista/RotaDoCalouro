import { View, StyleSheet, FlatList, TouchableOpacity, Text, ScrollView } from "react-native";
import PostListItem from "@/src/components/postListItem";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useState, useEffect, useCallback } from "react";
import { Post } from "@/src/types";
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from "@clerk/clerk-expo";

export default function Feed() {

  const [posts, setPosts] = useState<Post[]>([])
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter()
  const { user } = useUser()

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

    const postsWithExtras = await Promise.all(
      postsData.map(async (post) => {
        const [commentsCount, likesCount, likedByMe] = await Promise.all([
          supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id),
          supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id),
          supabase
            .from("likes")
            .select("user_id")
            .eq("post_id", post.id)
            .eq("user_id", user?.id),
        ]);

        return {
          ...post,
          nr_of_comments: commentsCount.count || 0,
          likes: likesCount.count || 0,
          liked_by_me: !!likedByMe.data && likedByMe.data.length > 0,
        };
      })
    );

    setPosts(postsWithExtras);
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
