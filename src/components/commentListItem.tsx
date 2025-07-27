import { View, Text, Image, StyleSheet } from 'react-native'
import { Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { Comment } from '../types'

type CommentListItemProps = {
    comment: Comment
}

export default function CommentListItem() {
    return (
        <View style={styles.container}>
            <View style={styles.headerComment}>
                <Image
                    source={require('../../assets/images/logo_rota_do_calouro-removebg-preview.png')}
                    style={styles.userImage}
                />
                <Text style={styles.userName}>User Name</Text>
                <Text style={styles.dateComment}>
                    <Text style={styles.dateComment}>
                        {formatDistanceToNowStrict(new Date('2025-07-22'), { addSuffix: true })}
                    </Text>
                </Text>
            </View>

            <Text>COMENTARIO</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e5e7ebbb',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
        borderLeftColor: '#E5E7EB',
        borderRadius: 12
    },
    headerComment: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    userImage: {
        width: 28,
        height: 28,
        borderRadius: 15,
        marginRight: 4
    },
    userName: {
        fontWeight: 'bold',
        color: '#737373',
        fontSize: 13,
    },
    dateComment: {
        color: '#737373',
        fontSize: 13,
    }
})