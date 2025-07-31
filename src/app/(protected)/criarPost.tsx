import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from "react-native";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

export default function CriarPost() {

    const [textPost, setTextPost] = useState('')

    const router = useRouter();

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
                            textAlignVertical="top" // para alinhar o texto no topo
                        />
                        <TouchableOpacity style={styles.button}>
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
})
