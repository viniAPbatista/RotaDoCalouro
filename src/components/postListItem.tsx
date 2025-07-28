import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNowStrict } from 'date-fns';
import { Post } from "../types";
import { useRouter } from "expo-router";

type PostListItemProps = {
    post: Post
}

export default function PostListItem({ post }: PostListItemProps) {

    const router = useRouter();

    function handleAcessComments() {
        router.push({ pathname: '/comments', params: {postId: post.id} })
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.headerPost}>
                <Image
                    source={post.user.image ? {uri: post.user.image} : require('../../assets/images/logo_rota_do_calouro-removebg-preview.png')}
                    style={styles.userImage}
                />
                <Text style={styles.userName}>{post.user.name}</Text>
                <Text style={styles.date}>
                    {formatDistanceToNowStrict(new Date(post.created_at), { addSuffix: true })}
                </Text>
            </View>

            {post.content &&
                <Text style={styles.postText}>{post.content}</Text>
            }

            {post.image_url && (
                <Image
                    source={{ uri: post.image_url }}
                    style={styles.postImage}
                />
            )}

            <View style={styles.interactionsPost}>
                <TouchableOpacity style={styles.commentButton}>
                    <MaterialCommunityIcons name="heart-outline" size={19} color='black' />
                    <Text style={styles.interactionsNumber}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.commentButton} onPress={handleAcessComments}>
                    <MaterialCommunityIcons name="comment-outline" size={19} color='black' />
                    <Text style={styles.interactionsNumber}>{post.nr_of_comments}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    headerPost: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    userImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 8,
    },
    date: {
        color: 'grey',
        fontSize: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginTop: 8,
        marginBottom: 8,
        resizeMode: 'cover',
    },
    postText: {
        fontSize: 14,
        color: '#333',
    },
    interactionsPost: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    interactionsNumber: {
        marginHorizontal: 3,
        marginRight: 20
    },
    commentButton: {
        flexDirection: 'row'
    }
});