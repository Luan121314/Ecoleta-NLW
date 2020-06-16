import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SelectPicker from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string
}
interface IBGECITYResponse {
    nome: string
}
interface UFs {
    label: string,
    value: string,
    key: string
}
interface Cities {
    label: string,
    value: string,
    key: string
}


const Home = () => {
    const navigation = useNavigation();
    const [uf, setUf] = useState<UFs[]>([]);
    const [city, setCity] = useState<Cities[]>([]);
    const [selectUF, setSelectUF] = useState('0');
    const [selectCity, setSelectCity] = useState('0');

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectUF,
            city: selectCity
        });
    }

    function handleSelectUf(uf: string) {
        setSelectUF(uf)
    }
    function handleSelectCity(city: string) {
        setSelectCity(city)
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
            const intials = response.data.map(data => ({
                value: data.sigla,
                label: data.sigla,
                key: data.sigla
            }));
            setUf(intials);
        })
    }, []);

    useEffect(() => {
        if (selectUF === '0') return;

        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUF}/municipios`).then(response => {
            const cities = response.data.map(data => ({
                value: data.nome,
                label: data.nome,
                key: data.nome
            }));
            setCity(cities)
        })
    }, [selectUF]);



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
        >
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={style.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={style.main} >
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={style.title} >Seu marketplace de coleta de resíduos</Text>
                        <Text style={style.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiênte</Text>
                    </View>
                </View>
                <View style={style.footer} >
                    <View style={style.input} >
                        <SelectPicker
                            value={selectUF}
                            onValueChange={(value) => { handleSelectUf(value) }}
                            placeholder={{
                                label: 'Selcione uma UF',
                                value: null,
                                key: String(0)

                            }}
                            items={uf}
                        />
                    </View>
                    <View style={style.input} >
                        <SelectPicker
                            value={selectCity}
                            placeholder={{
                                label: 'Selecione uma cidade',
                                value: null,
                                key: String(0)
                            }}
                            onValueChange={(value) => handleSelectCity(value)}

                            items={city}
                        />
                    </View>

                    <RectButton
                        style={style.button}
                        onPress={handleNavigateToPoints}
                    >
                        <View style={style.buttonIcon} >
                            <Text>
                                <Icon name="arrow-right" size={24} color="#FFF" />
                            </Text>
                        </View>

                        <Text style={style.buttonText} >
                            Entrar
                     </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView >
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
        alignItems: "center"
        // backgroundColor: '#f0f0f5'
    },
    main: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64
    },
    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24
    },
    footer: {

    },
    input: {
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 16,
        // fontSize: 
        // flex:3
    },
    button: {
        backgroundColor: '#34CB79',
        height: 60,
        width: '100%',
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8
    },
    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16
    }
})

export default Home;