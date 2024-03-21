import React,{useEffect, useState} from "react";
import {View, TouchableOpacity, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function GamerRoom(){

    return(
        <View>
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
            
        </View>
    )

}