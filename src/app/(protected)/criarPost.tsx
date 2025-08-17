import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { useAuth } from '@clerk/clerk-expo';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from "expo-image-picker";
import { toByteArray } from 'base64-js';

export default function CriarPost() {
    const [textPost, setTextPost] = useState('');
    const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null); // ALTERADO: para guardar o asset completo
    const [loading, setLoading] = useState(false); // NOVO: estado de loading
    const router = useRouter();
    const { userId } = useAuth();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // ALTERADO: para ser mais específico
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7, // ALTERADO: qualidade um pouco menor para uploads mais rápidos
            base64: true, // NOVO: Pedimos o base64
        });

        if (!result.canceled) {
            setImageAsset(result.assets[0]); // ALTERADO: guardamos o asset
        }
    };

    // NOVO: Função de upload, igual à de moradias mas para o novo bucket
    const uploadImage = async (asset: ImagePicker.ImagePickerAsset): Promise<string> => {
        if (!asset.base64) {
            throw new Error("A imagem selecionada não possui dados em base64.");
        }

        const fileExt = asset.uri.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const contentType = asset.mimeType ?? 'image/jpeg';
        const decodedData = toByteArray(asset.base64);

        const { error: uploadError } = await supabase.storage
            .from('fotos-posts') // ALTERADO: para o novo bucket
            .upload(fileName, decodedData, { contentType });

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('fotos-posts') // ALTERADO: para o novo bucket
            .getPublicUrl(fileName);
            
        return publicUrl;
    };

    const handlePublish = async () => {
        if (!textPost.trim() && !imageAsset) {
            alert("Escreva algo ou adicione uma imagem para publicar.");
            return;
        }

        setLoading(true);

        try {
            let imageUrl: string | null = null;

            // Se uma imagem foi selecionada, faz o upload
            if (imageAsset) {
                imageUrl = await uploadImage(imageAsset);
            }

            // Insere o post com o texto e a URL da imagem (se houver)
            const { error } = await supabase.from('posts').insert({
                user_id: userId,
                content: textPost,
                image_url: imageUrl, // NOVO: adicionamos a URL da imagem
            });

            if (error) throw error;

            alert("Post publicado com sucesso!");
            setTextPost('');
            setImageAsset(null);
            router.back();
        } catch (error: any) {
            console.error("Erro ao publicar:", error);
            alert(`Erro ao publicar o post: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
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

                        {imageAsset && (
                            <Image 
                                source={{ uri: imageAsset.uri }}
                                style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 10, marginTop: 10 }}
                            />
                        )}

                        <TouchableOpacity style={styles.buttonImage} onPress={pickImage} disabled={loading}>
                            <Text style={styles.buttonText}>Adicionar imagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handlePublish} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Publicar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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
        alignItems: 'center',
        height: 48,
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