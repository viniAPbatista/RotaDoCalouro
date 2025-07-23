import { View, StyleSheet, FlatList } from "react-native";
import PostListItem from "@/src/components/postListItem";

export default function Feed() {
  return (
    <View>
      {/* <FlatList
        data={}
        renderItem={({ item }) => <PostListItem post={item} />}
      /> */}
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
});
