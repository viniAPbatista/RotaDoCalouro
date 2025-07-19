import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CriarCarona() {

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const handleTimeChange = (_event: any, selectedTime?: Date) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(false);
        setTime(currentTime);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerTitle}>
                <Text style={styles.title}>Criar carona!</Text>
            </View>

            <View style={styles.containerForm}>
                <Text style={styles.textInput}>Ponto de Partida</Text>
                <TextInput
                    placeholder="Digite o endereço"
                    style={styles.input}
                />
                <Text style={styles.textInput}>Destino</Text>
                <TextInput
                    placeholder="Digite o endereço"
                    style={styles.input}
                />
                <Text style={styles.textInput}>Data</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dataHora}>
                    <Text style={styles.textDataHora}>{date.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
                <Text style={styles.textInput}>Hora</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dataHora}>
                    <Text style={styles.textDataHora}>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                        is24Hour={true}
                    />
                )}
                <Text style={styles.textInput}>Vagas</Text>
                <TextInput
                    placeholder="Vagas disponiveis"
                    style={styles.input}
                />
                <Text style={styles.textInput}>Modelo do Carro</Text>
                <TextInput
                    placeholder="Digite o modelo do carro"
                    style={styles.input}
                />
                <Text style={styles.textInput}>Placa do carro</Text>
                <TextInput
                    placeholder="Digite a placa do carro."
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Criar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        paddingEnd: '5%',
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
        alignItems: 'center',
        marginBottom: '20%'
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
    },
    dataHora: {
        width: '100%',
        backgroundColor: '#6668dfff',
        borderRadius: 50
    },
    textDataHora: {
        color: 'white',
        margin: 10,
        alignSelf: 'center',
        fontSize: 18
    }
})