import { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid} from 'react-native'
import Header from '../components/Header';
import Button from '../components/Button';
import led from '../assets/led.png';
import piscina from '../assets/piscina.png';
import pendente from '../assets/pendente.png';
import lamp from '../assets/lamp.png'
import music from '../assets/nota-musical.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Animatable from 'react-native-animatable';

export default function PartyArea(){
    
    const [validateData, setValidateData] = useState(true);
  const [devices, setDevices] = useState({fan:'',Bedroom:'',livingRoom:'', name:'',escritorio:'', edicula:'' });
  const [statusReguest, setReguest] = useState('#39d76c');
  

    if(validateData == true){
    async function loadStorgeUserName(){

        const dataDevices = await AsyncStorage.getItem('@Device:quarton')
        const objeto = JSON.parse(dataDevices || '');
        setDevices(objeto)
        
        setValidateData(false)
        }
    loadStorgeUserName()

    }

    const command = (valor: any) => {

        let url = 'http://'+valor
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

    }

    const alertToast=()=>{

        ToastAndroid.showWithGravityAndOffset(
            "Mantenha pressione para ligar ou desligar o Amplificador",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
        );
       

    }

    return(
        <View style={styles.container}>
            <Header title='Edícula' status={statusReguest} />
        
            <View style={styles.subHeader}>
            <Image source={require('../assets/partyArea.jpg')} style={styles.image}></Image>
            </View>
            <View style={styles.containerButton}>
                <View style={styles.titleDevices}>
                    <Text numberOfLines={1} allowFontScaling={false} style={{ fontSize: 20, fontWeight: 'bold', color: '#868686' }}>Devices</Text>
                </View>
             
                <Animatable.View animation="slideInUp" style={{ flexDirection: 'row'}}>
                    <Button title='Luz' ico={lamp} width={80} height={80} onPress={() => command(devices.edicula+"/relee")} />
                    <Button title='Leds' ico={pendente} width={80} height={80} onPress={() => command(devices.edicula+"/relef")} />  
                </Animatable.View>
                <Animatable.View animation="slideInUp"  delay={100} style={{ flexDirection: 'row'}}>
                    
                    <Button title='Arandelas' ico={led} width={80} height={80} onPress={() => command(devices.edicula+"/releg")} />  
                    <Button title='Piscina' ico={piscina} width={80} height={80} onPress={() => command(devices.edicula+"/releh")} />
                    
                </Animatable.View>

                <Animatable.View animation="slideInUp"  delay={100} style={{ flexDirection: 'row'}}>
                    
                    <Button title='Som' ico={music} width={30} height={30} onPress={()=>alertToast()} onLongPress={() => command(devices.edicula+"/relej")} />  
                    
                    
                </Animatable.View>
              
                </View>
             
        </View>
       
      
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: '100%',
        alignItems: 'center',
    
    },
    subHeader: {
        width: "100%",
        height: '27%',
        backgroundColor: '#cdcdcd',
        borderTopLeftRadius: 80,
    
    },
    image: {
        width: "100%",
        height: '100%',
        borderTopLeftRadius: 80,
        opacity: 0.5
    },
    titleDevices: {
        top: '-2%',
        left: '-31%',
    },
    containerButton: {
        top: '-5%',
        position: "relative",
        width: '100%',
        paddingTop: '7%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(243,243,243)'
    
    },
})