import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, ScrollView, ToastAndroid, Switch } from "react-native";
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo, MaterialIcons,EvilIcons } from "@expo/vector-icons";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import *as Animatable from 'react-native-animatable';
import Button from "../components/Button";
import * as LocalAuthentication from 'expo-local-authentication';

const ios = Platform.OS == 'ios';
const topMargin = ios ? 'mt-50' : 'mt-80';

export default function Home() {

    const navigation = useNavigation();

    const [valueGeneration, setGeneration] = useState({ "cumulative": 0, "month": 0, "today": 0 })
    const [device, setDevice] = useState({ fan: '', Bedroom: '', livingRoom: '', name: '', escritorio: '', cozinha: '', edicula: '', host: '', auth: '', foxx: '', sn: '' });
    const [KWNow, setKWNow] = useState([]);
    const [circularProgress, setCircularProgress] = useState(0);
    const [statusInversor, setStatusInversor] = useState('red');
    const [statusSala, setStatusSala] = useState('red');
    const [statusQuarto, setStatusQuarto] = useState('red');
    const [statusCozinha, setStatusCozinha] = useState('red');
    const [statusEscritorio, setStatusEscritorio] = useState('red');
    const [statusReguest, setReguest] = useState('red');
    const [activeTextLeds, setActiveTextLeds] = useState(false);
    const [activeTextArandela, setActiveTextArandela] = useState(false);
    const [activeTextGaragem, setActiveTextGaragem] = useState(false);
    const [awaitToken, setAwaitToken] = useState(false); 

    const url = 'https://www.foxesscloud.com';
    const token = device.foxx;
    const sn = device.sn;
    const parametersGeneration = '/op/v0/device/generation';
    const parametershistory = '/op/v0/device/report/query';
    const parameterReal = '/op/v0/device/real/query';

    useEffect(()=>{
        loadStorage();
        
    },[])

     //executa sempre que voltar pelo metodo goback
     useFocusEffect(
        React.useCallback(() => {
            loadStorage();
        }, [])
    );

    useEffect(()=>{
        status();
        setAwaitToken(false);    
    },[device])

    
    const loadStorage=async()=>{
        const dataDevices = await AsyncStorage.getItem('@smartHome:device')
        if(dataDevices != null || ''){
            const objeto = JSON.parse(dataDevices || '');
            setDevice(objeto);
        }
 
    }

    const status = async ()=>{

        const dataDevice = [device.livingRoom, device.cozinha, device.Bedroom, device.escritorio];
        
        for(let i = 0; dataDevice.length > i; i++){
            verifiqueStatus(dataDevice[i], i);     
        }
        
    }

    const verifiqueStatus = async(value, i)=>{
        try {
            const response = await fetch(`https://${value}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            if(i == 0){
                setStatusSala('green');
            }
            if(i == 1){
                setStatusCozinha('green')
            }
            if(i == 2){
                setStatusQuarto('green');
            }
            if(i == 3){
                setStatusEscritorio('green');
            }
           

        } catch (error) {
              console.log(i);
              if(i == 0){
                setStatusSala('red');
            }
            if(i == 1){
                setStatusCozinha('red')
            }
            if(i == 2){
                setStatusQuarto('red');
            }
            if(i == 3){
                setStatusEscritorio('red');
            }

        }
    }

    const headers = async = (param) => {
        const timestamp = new Date().getTime();
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
            try {
                setGeneration(data.result);
                console.log(data.result)
            } catch (error) {
                setStatusInversor('red');
            }
            

        } catch (error) {
            console.error('There was a problem with the request:', error);
            setStatusInversor('red');
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
            if(data.errno){
                ToastAndroid.showWithGravityAndOffset(
                    data.msg,
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,
                    50
                  );
            }
            setStatusInversor('green');
            try {
                const numeroFormatado = Math.round(data.result[0].datas[0].value * 100) / 100;
                setKWNow(numeroFormatado);
                setStatusInversor('green');
                setCircularProgress((numeroFormatado / 5.5) * 100);
                generation();
            } catch (error) {
                setStatusInversor('red');
            }

        } catch (error) {
            console.error('There was a problem with the request:', error);
            console.log(4);
            setStatusInversor('red');
        }
    }

    if( device.foxx != '' && awaitToken == false){
        setAwaitToken(true);
        KW()
    }

    const command = (valor) => {
        
       
        let url = 'http://' + valor
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.status == 200 && req.readyState == 4) {
                setReguest('#39d76c') ;
            } else {
                setReguest('red');
            }
        }

        req.open('GET', url);
        req.send();

        switch (valor) {
            case device.livingRoom + "/rele1":
                setActiveTextLeds(!activeTextLeds)
                break;
            case device.livingRoom + "/?rele4":
                setActiveTextArandela(!activeTextArandela)
                break;
            case device.livingRoom + "?rele3":
                setActiveTextGaragem(!activeTextGaragem)
                break;

        }

    }

    const remoteDevice=(value, devices, msg)=>{

        let url = device.host + devices + '.json?auth='+ device.auth
        let req = new XMLHttpRequest();
        req.open('PUT', url)
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(value));
     console.log(url)
        ToastAndroid.showWithGravityAndOffset(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
        );
        

    }

    const biometric = async () => {


        const authenticationBiometric = await LocalAuthentication.authenticateAsync({
            promptMessage: "Portão eletrônico",
            cancelLabel: "Cancelar",
            disableDeviceFallback: false,
        });

        if (authenticationBiometric.success) {
            openGate()
        }

    };

    const biometricOnLong = async () => {


        const authenticationBiometric = await LocalAuthentication.authenticateAsync({
            promptMessage: "Acionar Remotamente Portão da Garagem?",
            cancelLabel: "Cancelar",
            disableDeviceFallback: false,
        });

        if (authenticationBiometric.success) {
            remoteDevice("true", "portao", "Acionado Remotamente")
        }else{
            remoteDevice("false", "portao", "Cancelado")
        }

    };


    const openGate = () => {

        command(device.livingRoom + "/relea")

        ToastAndroid.showWithGravityAndOffset(
            "Acionando Portão",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
        );

    }




    const navigatioScreen = (value) => {

        navigation.navigate(value)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={'white'} barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} >

                <View style={styles.header}>
                    <Animatable.Text numberOfLines={1} allowFontScaling={false} animation="slideInLeft" style={styles.title}>Olá {device.name}!</Animatable.Text>
                    <Animatable.Text numberOfLines={1} allowFontScaling={false} animation="slideInRight" onPress={() => navigatioScreen('Config')}>
                        <Entypo  name={'add-to-list'} size={wp(8)} color={'white'} />
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

                <View style={{width:'100%',flexDirection:'row', top:-wp(5)}}>
                    <View style={styles.row}>
                    <Button title='Sala' status={statusSala} ico={BTLivingRoom} width={wp(20)} height={wp(20)} onPress={() => navigatioScreen('LivingRoom')} onLongPress={() => command(device.livingRoom+"/?rele6")} />
                    <Button title='Edícula' status={statusSala} ico={churrasco} width={wp(20)} height={wp(20)} onPress={() => navigatioScreen('PratyArea')} onLongPress={() => command(device.edicula+"/relee")}/>
                    <Button title='Escritório' status={statusEscritorio} ico={escritorio} width={wp(20)} height={wp(20)} onPress={() => navigatioScreen('GamerRoom')} onLongPress={() => command(device.escritorio+"/pc")}/>
                    </View>
                    <View style={styles.row}>
                    <Button title='Cozinha' status={statusCozinha} ico={cozinha} width={wp(20)} height={wp(20)} onPress={() => command(device.cozinha + "/Controle?Rele1=on")}/>
                    <Button title='Quarto' status={statusQuarto} ico={BTBedroom1} width={wp(20)} height={wp(20)} onPress={() => navigatioScreen('Bedroom')} onLongPress={() => command(device.Bedroom+"/rele4")}/>
                    <Button title='Placa Solar' status={statusInversor} ico={Pv} width={wp(20)} height={wp(20)} onPress={() => navigatioScreen('History')}/>
                    </View>

                </View>
            </ScrollView>
           
            <View style={{width:'100%', height:wp(16),backgroundColor:'rgb(47,93,180)', flexDirection:'row',alignItems:'center', padding:wp(1), justifyContent:'space-between'}}>
                <TouchableOpacity onPress={() => biometric()} onLongPress={()=> biometricOnLong()} style={{ width: wp(22), height: wp(22), top:wp(-2), borderRadius: 75, backgroundColor:'rgb(47,93,180)', justifyContent: 'center',alignItems: 'center' }}>
                   <Image source={require('../assets/gate.png')} style={{width:'65%', height:'65%'}}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => command(device.livingRoom + "?rele3")} onLongPress={()=> remoteDevice("true", "Luzgaragem", "Luz Garagem Acionado Remotamente")}><Text numberOfLines={1} allowFontScaling={false}  style={[styles.titleButton, activeTextGaragem && styles.titleButtonActive]}>Garagem</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => command(device.livingRoom + "/?rele4")} onLongPress={()=> remoteDevice("true", "arandelas", "Arandelas Acionado Remotamente")} ><Text numberOfLines={1} allowFontScaling={false}  style={[styles.titleButton, activeTextArandela && styles.titleButtonActive]}>Arandelas</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => command(device.livingRoom + "/rele1")} onLongPress={()=> remoteDevice("true", "leds", "Led Acionado Remotamente")} ><Text numberOfLines={1} allowFontScaling={false}  style={[styles.titleButton, activeTextLeds && styles.titleButtonActive]}>Leds</Text></TouchableOpacity>
            </View>
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
        justifyContent: 'center',
        alignItems:'center'
    },
    backgroundImage: {
        position: 'absolute',
        width: '140%',
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
        position: 'absolute',
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
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: "19%",
        height: "56%",
        margin: 5,
        backgroundColor: 'rgb(243,243,243)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 5,

    },
    titleButton: {
        color: '#868686',
        fontWeight: 'bold'
    },
    titleButtonActive: {
        color: '#5994ec',
        fontWeight: 'bold'
    },
});