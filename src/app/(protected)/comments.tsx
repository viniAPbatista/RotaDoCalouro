import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import CommentListItem from "@/src/components/commentListItem";

export default function Comentarios() {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.containerTitle}>
                <TouchableOpacity style={styles.backButton} onPress={router.back}>
                    <Ionicons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Comentarios</Text>
            </View>

            <View style={styles.containerComments}>
                <CommentListItem/>
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
    containerComments: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    backButton: {
        marginBottom: 25
    },
})