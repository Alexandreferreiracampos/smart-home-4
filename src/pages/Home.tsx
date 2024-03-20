import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, ToastAndroid, Modal, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenModal from '../components/Screen-Modal';
import { FontAwesome } from '@expo/vector-icons';
import *as Animatable from 'react-native-animatable';
import Button from '../components/Button';
import Gate from '../assets/gate.png';
import BTBedroom1 from '../assets/Bedroom1.png';
import BTLivingRoom from '../assets/sofa.png';
import escritorio from '../assets/escritorio.png';
import cozinha from '../assets/cozinha.png'
import churrasco from '../assets/churrasco.png';
import * as LocalAuthentication from 'expo-local-authentication';


export default function Home() {


    const [modalActive, setModalAtive] = useState(false);
    const [validateData, setValidateData] = useState(true);
    const [activeTextLeds, setActiveTextLeds] = useState(false)
    const [activeTextArandela, setActiveTextArandela] = useState(false)
    const [activeTextGaragem, setActiveTextGaragem] = useState(false)
    const navigation = useNavigation();
    const [statusReguest, setReguest] = useState('red');


    const [devices, setDevices] = useState({ fan: '', Bedroom: '', livingRoom: '', name: '', escritorio: '', cozinha: '', edicula: '', host:'', auth:'', foxx:'' });

    if (validateData == true) {
        async function loadStorgeUserName() {

            const dataDevices = await AsyncStorage.getItem('@Device:quarton')
            const objeto = JSON.parse(dataDevices || '');
            setDevices(objeto)
            setValidateData(false)
        }
        loadStorgeUserName()
    }

    const navigatioScreen = (valor: any) => {
        navigation.navigate(valor)
    }

    const changeStatusModal = () => {

        setModalAtive(false)
      

    }

    const reloadDataSave = () => {

        setValidateData(true)

    }

    const command = (valor: any) => {
        
       
        let url = 'http://' + valor
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.status == 200 && req.readyState == 4) {
                setReguest('#39d76c') 
            } else {
                setReguest('red')
            }
        }

        req.open('GET', url)
        req.send()

        switch (valor) {
            case devices.livingRoom + "/rele1":
                setActiveTextLeds(!activeTextLeds)
                break;
            case devices.livingRoom + "/?rele4":
                setActiveTextArandela(!activeTextArandela)
                break;
            case devices.livingRoom + "?rele3":
                setActiveTextGaragem(!activeTextGaragem)
                break;

        }


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

    const remoteDevice=(value:any, device:any, msg:any)=>{

        let url = devices.host + device + '.json?auth='+ devices.auth
        let req = new XMLHttpRequest();
        req.open('PUT', url)
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(value));

        ToastAndroid.showWithGravityAndOffset(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
        );
        

    }

    const openGate = () => {

        command(devices.livingRoom + "/relea")

        ToastAndroid.showWithGravityAndOffset(
            "Acionando Portão",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
        );

    }

    const placaSolar = async ()=> {

        const url = 'https://www.foxesscloud.com';
        const token = devices.foxx;
        const timestamp = new Date().getTime();
        const sn = 'J02F6020324A137';
        const parms = '/op/v0/device/generation';

        console.log(devices.foxx);

    }

    placaSolar()


    return (

        <View style={styles.container}>
            <StatusBar backgroundColor='rgb(243,243,243)' barStyle="dark-content" />

            <ScreenModal statusModal={modalActive} ipFan={devices.fan} ipBedroom={devices.Bedroom} ipLivingRoom={devices.livingRoom} name={devices.name} ipEdicula={devices.edicula} ipCozinha={devices.cozinha} ipEscritorio={devices.escritorio} hostFirebase={devices.host} authFirebase={devices.auth} foxesscloud={devices.foxx} changeStatusModal={() => changeStatusModal()} reloadDataSave={() => reloadDataSave()} />

            <View style={styles.header}>
                <Animatable.Text numberOfLines={1} allowFontScaling={false}  animation="slideInLeft" style={styles.title}>Olá {devices.name}</Animatable.Text>
                <Animatable.Text numberOfLines={1} allowFontScaling={false}  animation="slideInRight" onPress={() => setModalAtive(true)}><FontAwesome name="gears" size={24} color={statusReguest}/></Animatable.Text>
            </View>
            <View style={styles.subHeader}>
        <Image source={require('../assets/1.jpeg')} style={styles.image}></Image>
      </View>
            <View style={{ top: 5, width: "100%", height: "9%", backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
                <View style={{ width: 130, height: 130, borderRadius: 75, backgroundColor: 'white', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => biometric()} onLongPress={()=> biometricOnLong()}>
                        <View style={styles.ButtonGate}>
                            <Image source={Gate} style={{ width: '60%', height: '60%' }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => command(devices.livingRoom + "/rele1")} onLongPress={()=> remoteDevice("true", "leds", "Led Acionado Remotamente")} ><Text numberOfLines={1} allowFontScaling={false}  style={[styles.titleButton, activeTextLeds && styles.titleButtonActive]}>Leds</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => command(devices.livingRoom + "/?rele4")} onLongPress={()=> remoteDevice("true", "arandelas", "Arandelas Acionado Remotamente")} ><Text numberOfLines={1} allowFontScaling={false}  style={[styles.titleButton, activeTextArandela && styles.titleButtonActive]}>Arandelas</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => command(devices.livingRoom + "?rele3")} onLongPress={()=> remoteDevice("true", "Luzgaragem", "Luz Garagem Acionado Remotamente")}><Text numberOfLines={1} allowFontScaling={false}  style={[styles.titleButton, activeTextGaragem && styles.titleButtonActive]}>Garagem</Text></TouchableOpacity>
            </View>
            <View style={{width:'100%', height:450, top:40}}>
            <ScrollView contentContainerStyle={styles.environmentList} showsHorizontalScrollIndicator={false}>
               
            <View style={styles.containerButton} >
                
                    <Button title='Sala' ico={BTLivingRoom} width={90} height={90} onPress={() => navigatioScreen('LivingRoom')} onLongPress={() => command(devices.livingRoom+"/?rele6")} />
                    <Button title='Quarto' ico={BTBedroom1} width={90} height={90} onPress={() => navigatioScreen('Bedroom')} onLongPress={() => command(devices.Bedroom+"/rele4")}/>
                    
            </View>
            
            <View style={styles.containerButton} >
               
                    
                    <Button title='Edícula' ico={churrasco} width={90} height={90} onPress={() => navigatioScreen('PartyArea')} onLongPress={() => command(devices.edicula+"/relee")}/>
                    <Button title='Cozinha' ico={cozinha} width={90} height={90} onPress={() => command(devices.cozinha + "/Controle?Rele1=on")}/>
              
            </View>
            <View style={styles.containerButton} >
               
                    <Button title='Escritório' ico={escritorio} width={90} height={90} onPress={() => navigatioScreen('GamerRoom')} onLongPress={() => command(devices.escritorio+"/pc")}/>
              
            </View>
            
            </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },
    environmentList:{
        alignItems:'center',
        height:700
       
    
    },
    header: {
        width: "100%",
        height: '12%',
        paddingTop: 10,
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#868686'

    },
    titleButton: {
        color: '#868686',
        fontWeight: 'bold'
    },
    titleButtonActive: {
        color: '#5994ec',
        fontWeight: 'bold'
    },
    subHeader: {
        width: "100%",
        height: '17%',
        backgroundColor: '#cdcdcd',
        borderTopLeftRadius: 80,

    },
    image: {
        width: "100%",
        height: '100%',
        borderTopLeftRadius: 50,
        opacity: 0.8
    },
    ButtonGate: {
        width: 100,
        height: 100,
        borderRadius: 75,
        backgroundColor: 'rgb(243,243,243)',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 9,

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
    containerButton: {
        top: '10%',
        width: '100%',
        paddingTop: '3%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(243,243,243)'

    },
    

})