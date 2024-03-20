import React, { useEffect, useState } from "react";
import { View, Text, Touchable, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from "md5";
import Gate from '../assets/gate.png';
import BTBedroom1 from '../assets/Bedroom1.png';
import BTLivingRoom from '../assets/sofa.png';
import escritorio from '../assets/escritorio.png';
import cozinha from '../assets/cozinha.png'
import churrasco from '../assets/churrasco.png';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import *as Animatable from 'react-native-animatable';

const ios = Platform.OS == 'ios';
const topMargin = ios ? 'mt-50' : 'mt-80';

export default function Home() {

    const navigation = useNavigation();

    const [valueGeneration, setGeneration] = useState( {"cumulative": 0, "month": 0, "today": 0})
    const [devices, setDevices] = useState({ fan: '', Bedroom: '', livingRoom: '', name: '', escritorio: '', cozinha: '', edicula: '', host: '', auth: '', foxx: '' });
    const [KWNow, setKWNow] = useState([]);

    const url = 'https://www.foxesscloud.com';
    const token = '';
    const timestamp = new Date().getTime();
    const sn = '';
    const parametersGeneration = '/op/v0/device/generation';
    const parametershistory = '/op/v0/device/report/query';
    const parameterReal = '/op/v0/device/real/query';

    useEffect(()=>{
        KW()
    },[])

    const headers = async = (param) => {

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

            const data = await response.json();

              
            setKWNow(data.result[0].datas[0].value.toFixed(2));
            generation();

        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

    const navigatioScreen = (value) => {

        let object = [,]
        navigation.navigate(value, object)
    }

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar backgroundColor={'white'} barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Text numberOfLines={1} allowFontScaling={false} animation="slideInLeft" style={styles.title}>Olá {devices.name}</Animatable.Text>
                <Animatable.Text numberOfLines={1} allowFontScaling={false} animation="slideInRight" onPress={() => navigatioScreen('History')}>
                    <MaterialIcons name={'wifi'} size={wp(8)} color={'red'} />
                </Animatable.Text>
            </View>

            <View style={styles.subHeader}>
                <Image source={require('../assets/1.jpeg')} className="h-full w-full absolute" style={styles.backgroundImage}/>
                <TouchableOpacity activeOpacity={0.6} onPress={()=>KW()}  style={styles.overlayContainer}>
                <Image source={require('../assets/icon_ennergy_bg.png')} style={styles.overlayImage}/>
                <Text numberOfLines={1} allowFontScaling={false} style={styles.overlayText}>kwh</Text>
                <Text numberOfLines={1} allowFontScaling={false} style={styles.overlayText}>{KWNow}</Text>
                </TouchableOpacity >  
            </View>
            <View style={{width:'100%', height:wp(17), flexDirection:'row', justifyContent:'space-between',padding:wp(2)}}>
                <View style={{flex:1,justifyContent:'center', alignItems:'center',padding:wp(1)}}>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(4)}}>Hoje</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(5)}}>{valueGeneration.today.toFixed(2)}</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(3)}}>kwh</Text>
                </View>
                <View style={{flex:1, justifyContent:'center', alignItems:'center',padding:wp(1), borderEndWidth:1, borderLeftWidth:1, borderColor:'gray'}}>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(4)}}>Mês</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(5)}}>{valueGeneration.month.toFixed(2)}</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(3)}}>kwh</Text>
                </View>
                <View style={{flex:1, justifyContent:'center', alignItems:'center',padding:wp(1)}}>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(4)}}>Acumulado</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(5)}}>{valueGeneration.cumulative.toFixed(2)}</Text>
                    <Text numberOfLines={1} allowFontScaling={false} style={{fontSize:wp(3)}}>kwh</Text>
                </View>
            </View>

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: wp(10)
    },
    header: {
        width: "100%",
        height: wp(20),
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
    subHeader: {
        width: "100%",
        height: wp(50),
        backgroundColor: '#cdcdcd',
        borderTopLeftRadius: 80
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 80,
        opacity: 0.7
      },
      overlayContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(33),
        height: wp(33),
        top: wp(10),
        left: wp(7),
      },
      overlayText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
      },
      overlayImage: {
        position: 'absolute',
        width: wp(33),
        height: wp(33),
      },
});