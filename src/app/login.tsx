import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {

    const router = useRouter()
    
    function handleAccessCadastro() {
        router.push('/cadastro')
    }

    function handleAccessLogin() {
        router.push('/(tabs)')
    }

    return(
        <View style={styles.container}>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Bem-vindo(a)</Text>
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.textInput}>Email</Text>

                <TextInput
                    placeholder="Digite um email..."
                    style={styles.input}
                />
                <Text style={styles.textInput}>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha..."
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={handleAccessLogin}>Acessar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRegister}>
                    <Text style={styles.buttonTextRegister} onPress={handleAccessCadastro}>Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C2DCF2'
    },
    containerTitle: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    title: {
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
        paddingEnd: '5%'
    },
    textInput: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16
    },
    button: {
        backgroundColor: '#272874ff',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center',
    },
    buttonTextRegister: {
        color: '#a1a1a1'
    }
})