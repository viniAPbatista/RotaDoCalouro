import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image } from "react-native";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useAuth } from '@clerk/clerk-expo';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from "expo-image-picker";

export default function CriarPost() {

    const [textPost, setTextPost] = useState('')
    const router = useRouter();
    const { userId } = useAuth();
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        })

        console.log(result)

        if(!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View style={styles.containerHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={router.back}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.message}>Criar Post</Text>
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.containerForm}>
                        <Text style={styles.title}>Publique algo!</Text>
                        <TextInput
                            placeholder="No que você está pensando..."
                            style={styles.input}
                            value={textPost}
                            onChangeText={setTextPost}
                            multiline
                            textAlignVertical="top"
                        />

                        {image && (
                            <Image 
                                source={{ uri: image }}
                                style={{ width: "100%", aspectRatio: 1 }}
                            />
                        )}

                        <TouchableOpacity style={styles.buttonImage} onPress={pickImage}>
                            <Text style={styles.buttonText}>Adicionar imagem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={async () => {
                                if (!textPost.trim()) {
                                    alert("Digite algo antes de publicar.");
                                    return;
                                }
                                try {
                                    const { error } = await supabase.from('posts').insert({
                                        user_id: userId,
                                        content: textPost,
                                    });

                                    if (error) {
                                        console.error("Erro ao publicar:", error);
                                        alert("Erro ao publicar o post.");
                                    } else {
                                        alert("Post publicado com sucesso!");
                                        setTextPost('');
                                        router.back();
                                    }
                                } catch (e) {
                                    console.error("Erro inesperado:", e);
                                    alert("Erro inesperado ao publicar.");
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Publicar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C2DCF2',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white'
    },
    containerForm: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        marginTop: 28,
        marginBottom: 10,
    },
    input: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 12,
        borderColor: '#ccc',
        minHeight: 100,
        borderWidth: 2,
        borderRadius: 10
    },
    button: {
        backgroundColor: '#272874ff',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    backButton: {
        marginBottom: 25
    },
    buttonImage: {
        backgroundColor: '#08c931ff',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
