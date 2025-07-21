import { View, Image, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNowStrict } from 'date-fns';
import { Post } from "../types";

// type posts, 1:16 youtube

export default function PostListItem() {
    return (
        <View style={styles.postContainer}>
            <View style={styles.headerPost}>
                <Image
                    source={require('../../assets/images/logo_rota_do_calouro-removebg-preview.png')}
                    style={styles.userImage}
                />
                <Text style={styles.userName}>NAME USER</Text>
                <Text style={styles.date}>
                    {formatDistanceToNowStrict(new Date("2025-07-21"), { addSuffix: true })}
                </Text>
            </View>

            {/* condicional se o texto será exibido, possivel post só imagem */}
            <Text style={styles.postText}>TEXT POST</Text>
            {/* condicional se a imagem será exibida, possivel post só texto */}
            <Image
                source={require('../../assets/images/logo_rota_do_calouro-removebg-preview.png')}
                style={styles.postImage}
            />

            <View style={styles.interactionsPost}>
                <MaterialCommunityIcons name="heart-outline" size={19} color='black' />
                <Text>15</Text>
                <MaterialCommunityIcons name="comment-outline" size={19} color='black' />
                <Text>10</Text>
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
    }
});