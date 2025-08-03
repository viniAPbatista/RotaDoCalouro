import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNowStrict } from 'date-fns';
import { Post } from "../types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useUser } from "@clerk/clerk-expo";

type PostListItemProps = {
    post: Post
}

export default function PostListItem({ post }: PostListItemProps) {

    const [liked, setLiked] = useState(post.liked_by_me);
    const [likeCount, setLikeCount] = useState(post.likes || 0);

    const router = useRouter();
    const { user } = useUser();

    const toggleLike = async () => {
        if (!user) return;

        if (liked) {
            const { error } = await supabase
                .from("likes")
                .delete()
                .eq("post_id", post.id)
                .eq("user_id", user.id);

            if (!error) {
                setLiked(false);
                setLikeCount((prev) => prev - 1);
            }
        } else {
            const { error } = await supabase.from("likes").insert({
                post_id: post.id,
                user_id: user.id,
            });

            if (!error) {
                setLiked(true);
                setLikeCount((prev) => prev + 1);
            }
        }
    };

    function handleAcessComments() {
        router.push({ pathname: '/comments', params: { postId: post.id } })
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.headerPost}>
                <Image
                    source={post.user.image ? { uri: post.user.image } : require('../../assets/images/logo_rota_do_calouro-removebg-preview.png')}
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
                <TouchableOpacity style={styles.commentButton} onPress={toggleLike}>
                    <MaterialCommunityIcons
                        name={liked ? "heart" : "heart-outline"}
                        size={19}
                        color={liked ? "red" : "black"}
                    />
                    <Text style={styles.interactionsNumber}>{likeCount}</Text>
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