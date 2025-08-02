import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from "expo-router";
import CommentListItem from "@/src/components/commentListItem";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "../../lib/supabase";
import { Comment } from "../../types";

export default function Comentarios() {

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<Comment[]>([]);
    const router = useRouter();
    const { user } = useUser();
    const { postId } = useLocalSearchParams();

    const handleSendComment = async () => {
        if (!comment.trim()) return;

        if (!user) {
            alert("Usuário não autenticado");
            return;
        }

        const { data, error } = await supabase.from("comments").insert([
            {
                content: comment,
                user_id: user.id,
                post_id: postId,
            },
        ]);

        if (error) {
            console.error("Erro ao enviar comentário:", error);
            alert("Erro ao enviar comentário");
        } else {
            setComment("");
            fetchComments();
        }
    };

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*, user:users(*)")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

        if (!error) {
            setComments(data);
        } else {
            console.error("Erro ao buscar comentários:", error);
        }
    };

    useEffect(() => {
        if (postId) fetchComments();
    }, [postId]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.containerTitle}>
                <TouchableOpacity style={styles.backButton} onPress={router.back}>
                    <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Comentarios</Text>
            </View>

            <View style={styles.commentArea}>
                <View style={styles.containerComments}>
                    <ScrollView contentContainerStyle={styles.scroll}>
                        {comments.map((item) => (
                            <CommentListItem key={item.id} comment={item} />
                        ))}
                    </ScrollView>
                </View>

                <SafeAreaView style={styles.containerCommentCreate}>
                    <TextInput
                        placeholder="Deixe um comentario..."
                        style={styles.inputComments}
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                        multiline
                    />
                    <TouchableOpacity style={styles.commentButton} onPress={handleSendComment}>
                        <Text>
                            <Ionicons name="send" size={24} color="#a7a7a7ff" />
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C2DCF2',
    },
    containerTitle: {
        marginTop: '14%',
        marginBottom: '4%',
        paddingStart: '5%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    commentArea: {
        flex: 1,
    },
    containerComments: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    scroll: {
        paddingVertical: 10,
    },
    containerCommentCreate: {
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: '12%'
    },
    inputComments: {
        backgroundColor: '#E4E4E4',
        padding: 10,
        borderRadius: 8,
        flex: 1
    },
    backButton: {
        marginBottom: 20,
    },
    commentButton: {
        marginLeft: 10,
    }
});
