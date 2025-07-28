import { View, StyleSheet, FlatList, TouchableOpacity, Text, ScrollView } from "react-native";
import PostListItem from "@/src/components/postListItem";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useState, useEffect } from "react";
import { Post } from "@/src/types";

export default function Feed() {

  const [posts, setPosts] = useState<Post[]>([])

  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:users!posts_user_id_fkey(*)')
      .order('created_at', { ascending: false })
    console.log('error', error)
    console.log('data', JSON.stringify(data, null, 2))

    if (data) setPosts(data)
  }

  function handleAcessCriarPost() {
    router.push('/criarPost')
  }

  return (
    <View style={styles.container}>
        <FlatList
          data={ posts }
          renderItem={({ item }) => <PostListItem post={item} />}
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
