import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, ScrollView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from "md5";
import Gate from '../assets/gate.png';
import BTBedroom1 from '../assets/Bedroom1.png';
import BTLivingRoom from '../assets/sofa.png';
import escritorio from '../assets/escritorio.png';
import cozinha from '../assets/cozinha.png';
import Pv from '../assets/icon_inversor.png';
import churrasco from '../assets/churrasco.png';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import *as Animatable from 'react-native-animatable';
import Button from "../components/Button";

const ios = Platform.OS == 'ios';
const topMargin = ios ? 'mt-50' : 'mt-80';

export default function Home() {

    const navigation = useNavigation();

    const [valueGeneration, setGeneration] = useState({ "cumulative": 0, "month": 0, "today": 0 })
    const [devices, setDevices] = useState({ fan: '', Bedroom: '', livingRoom: '', name: '', escritorio: '', cozinha: '', edicula: '', host: '', auth: '', foxx: '' });
    const [KWNow, setKWNow] = useState([]);
    const [circularProgress, setCircularProgress] = useState(0);

    const url = 'https://www.foxesscloud.com';
    const token = '';
    const timestamp = new Date().getTime();
    const sn = '';
    const parametersGeneration = '/op/v0/device/generation';
    const parametershistory = '/op/v0/device/report/query';
    const parameterReal = '/op/v0/device/real/query';

    useEffect(() => {
        // KW()
        /*
        setInterval(() => {
            KW();
        }, 12000);
        */
    }, [])

    const headers = async = (param) => {
        console.log(1);
        const signature = [param, token, timestamp].join('\\r\\n');
        const signatureMD5 = md5(signature);
        console.log(timestamp, signatureMD5);
        return {
            'Content-Type': 'application/json',
            'token': token,
            'timestamp': timestamp,
            'signature': signatureMD5,
            'lang': 'en',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
        };
    }

    const generation = async () => {
        console.log(5);
        try {
            const response = await fetch(url + parametersGeneration + '?sn=' + sn, {
                method: 'GET',
                headers: headers(parametersGeneration)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setGeneration(data.result);
            console.log(data.result)

        } catch (error) {
            console.error('There was a problem with the request:', error);
        }

    }

    const KW = async () => {
        console.log(2);
        setCircularProgress(0);
        try {
            const response = await fetch(url + parameterReal, {
                method: 'POST',
                headers: headers(parameterReal),
                body: JSON.stringify({
                    "sn": sn,
                    "variables": ["feedinPower"]
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(3);
            const data = await response.json();
            try {
                const numeroFormatado = Math.round(data.result[0].datas[0].value * 100) / 100;
                setKWNow(numeroFormatado);

                setCircularProgress((numeroFormatado / 5.5) * 100);
                generation();
            } catch (error) {
                console.log(data)
            }

        } catch (error) {
            console.error('There was a problem with the request:', error);
            console.log(4);
        }
    }

    const navigatioScreen = (value) => {

        let object = [,]
        navigation.navigate(value, object)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'white'} barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} >

                <View style={styles.header}>
                    <Animatable.Text numberOfLines={1} allowFontScaling={false} animation="slideInLeft" style={styles.title}>Olá {devices.name} Alexandre!</Animatable.Text>
                    <Animatable.Text numberOfLines={1} allowFontScaling={false} animation="slideInRight" onPress={() => navigatioScreen('History')}>
                        <MaterialIcons name={'wifi'} size={wp(8)} color={'red'} />
                    </Animatable.Text>
                </View>

                <View style={styles.subHeader}>
                    <Image source={require('../assets/4.png')} className="absolute" style={styles.backgroundImage} />
                    <View style={styles.containerGeneration}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: wp(1) }}>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(4), color: 'white' }}>Hoje</Text>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(5), fontWeight: 'bold', color: 'white' }}>{valueGeneration.today.toFixed(2)}</Text>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(3), color: 'white' }}>kwh</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: wp(1), borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'gray' }}>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(4), color: 'white' }}>Mês</Text>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(5), fontWeight: 'bold', color: 'white' }}>{valueGeneration.month.toFixed(2)}</Text>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(3), color: 'white' }}>kwh</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: wp(1) }}>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(4), color: 'white' }}>Acumulado</Text>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(5), fontWeight: 'bold', color: 'white' }}>{valueGeneration.cumulative.toFixed(2)}</Text>
                            <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: wp(3), color: 'white' }}>kwh</Text>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={0.6} onPress={() => KW()} style={styles.overlayContainer}>
                        <AnimatedCircularProgress
                            style={{ position: 'absolute', }}
                            size={wp(35)}
                            width={4}
                            fill={circularProgress}
                            tintColor="white"
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor="rgba(240,240,240,0.4)"
                            rotation={0}
                        />
                        <Image source={require('../assets/icon_ennergy_bg.png')} style={styles.overlayImage} />
                        <Text numberOfLines={1} allowFontScaling={false} style={styles.overlayText}>kwh</Text>
                        <Text numberOfLines={1} allowFontScaling={false} style={[styles.overlayText, { fontWeight: 'bold', fontSize: wp(6) }]}>{KWNow}</Text>
                    </TouchableOpacity >
                </View>

                <View style={{width:'100%',flexDirection:'row'}}>
                    <View style={styles.row}>
                    <Button title='Sala' ico={BTLivingRoom} width={90} height={90} onPress={() => navigatioScreen('LivingRoom')} onLongPress={() => command(devices.livingRoom+"/?rele6")} />
                    <Button title='Edícula' ico={churrasco} width={90} height={90} onPress={() => navigatioScreen('PartyArea')} onLongPress={() => command(devices.edicula+"/relee")}/>
                    <Button title='Escritório' ico={escritorio} width={90} height={90} onPress={() => navigatioScreen('GamerRoom')} onLongPress={() => command(devices.escritorio+"/pc")}/>
                    </View>
                    <View style={styles.row}>
                    <Button title='Cozinha' ico={cozinha} width={90} height={90} onPress={() => command(devices.cozinha + "/Controle?Rele1=on")}/>
                    <Button title='Quarto' ico={BTBedroom1} width={90} height={90} onPress={() => navigatioScreen('Bedroom')} onLongPress={() => command(devices.Bedroom+"/rele4")}/>
                    <Button title='Placa Solar' ico={Pv} width={90} height={90} onPress={() => navigatioScreen('History')}/>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: wp(7),
        backgroundColor: '#f0f0f0'
    },
    header: {
        width: "100%",
        height: wp(25),
        position: 'absolute',
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'

    },
    subHeader: {
        width: wp(100),
        height: wp(80),
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '120%',
    },
    overlayContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(12),
        height: wp(12),
        top: wp(41),
        left: wp(70),
    },
    overlayText: {
        fontSize: wp(4),
        color: 'white',
        textAlign: 'center',
    },
    overlayImage: {
        position: 'absolute',
        width: wp(33),
        height: wp(33),
    },
    containerGeneration: {
        width: wp(30),
        left: wp(13),
        height: wp(57),
        top: wp(18),
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: wp(2),
        zIndex: 100
    },
    row: {
        margin:10,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});