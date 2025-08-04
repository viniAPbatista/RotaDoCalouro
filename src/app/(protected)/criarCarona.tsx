import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { supabase } from '../../lib/supabase';
import { useAuth } from '@clerk/clerk-expo';

export default function CriarCarona() {

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [price, setPrice] = useState('');
    const { userId } = useAuth();
    const router = useRouter();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [seats, setSeats] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carPlate, setCarPlate] = useState('');

    async function handleCreateRide() {
        if (!userId) return;

        const { error } = await supabase.from('rides').insert({
            user_id: userId,
            origin: origin,
            destination: destination,
            ride_date: date.toISOString().split('T')[0],
            ride_time: time.toTimeString().split(' ')[0],
            seats: Number(seats),
            car_model: carModel,
            car_plate: carPlate,
            price: Number(price),
        });

        if (error) {
            console.error('Erro ao criar carona:', error);
            return;
        }

        router.back();
    }

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView style={styles.container}>
                <View style={styles.containerTitle}>
                    <TouchableOpacity style={styles.backButton} onPress={router.back}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Criar carona!</Text>
                </View>

                <View style={styles.containerForm}>
                    <Text style={styles.textInput}>Ponto de Partida</Text>
                    <TextInput
                        placeholder="Digite o endereço"
                        style={styles.input}
                        value={origin}
                        onChangeText={setOrigin}
                    />
                    <Text style={styles.textInput}>Destino</Text>
                    <TextInput
                        placeholder="Digite o endereço"
                        style={styles.input}
                        value={destination}
                        onChangeText={setDestination}
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
                        value={seats}
                        onChangeText={setSeats}
                    />
                    <Text style={styles.textInput}>Valor total</Text>
                    <TextInput
                        placeholder="Valor do transporte"
                        style={styles.input}
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                    <Text style={styles.textInput}>Modelo do Carro</Text>
                    <TextInput
                        placeholder="Digite o modelo do carro"
                        style={styles.input}
                        value={carModel}
                        onChangeText={setCarModel}
                    />
                    <Text style={styles.textInput}>Placa do carro</Text>
                    <TextInput
                        placeholder="Digite a placa do carro."
                        style={styles.input}
                        value={carPlate}
                        onChangeText={setCarPlate}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleCreateRide}>
                        <Text style={styles.buttonText}>Criar Carona</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
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
    },
    backButton: {
        marginBottom: 25
    },
})