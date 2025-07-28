import { View, StyleSheet, FlatList, TouchableOpacity, Text, ScrollView } from "react-native";
import PostListItem from "@/src/components/postListItem";
import { useRouter } from "expo-router";

export default function Feed() {

  const router = useRouter()

  function handleAcessCriarPost() {
    router.push('/criarPost')
  }

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={}
        renderItem={({ item }) => <PostListItem post={item} />}
      /> */}
      <ScrollView style={styles.scrollViewPosts}>
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
        <PostListItem />
      </ScrollView>
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
