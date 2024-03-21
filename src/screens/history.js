import React,{useEffect, useState} from "react";
import {View, TouchableOpacity, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import md5 from "md5";
import { VictoryLabel, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";


export default function History(){

    const [data, setData] = useState([{ x: 0, y: 0 }]);

    const url = 'https://www.foxesscloud.com';
    const token = '';
    const timestamp = new Date().getTime();
    const sn = '';
    const parametersGeneration = '/op/v0/device/generation';
    const parametershistory = '/op/v0/device/report/query';
    const parameterReal = '/op/v0/device/real/query';

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

    const history = async (value, dataString) => {

        const date = new Date();
        const day = date.getDate(); 
        const month = date.getMonth() + 1; 
        const year = date.getFullYear(); 

        try {
            const response = await fetch(url + parametershistory, {
                method: 'POST',
                headers: headers(parametershistory),
                body: JSON.stringify({
                    "sn": sn,
                    "year": year,
                    "month": month,
                    "day": day,
                    "dimension": value,
                    "variables": ["generation"]
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const dataGrafic = data.result[0].values.map(value => parseFloat(value.toFixed(2)));
            setData(dataGrafic.map((value, index) => ({ x: index + 1, y: value })));
            
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }

    }

    return(
        <View>
            <StatusBar backgroundColor={'white'} barStyle="light-content" />
            <TouchableOpacity style={{top:400}} onPress={()=>history('day',new Date())}><Text>Ver dados</Text></TouchableOpacity>
            <VictoryChart
                    theme={VictoryTheme.material}
                    maxDomain={{ x: data.length }}
                    domainPadding={10}
                    width={430}
                    height={230}
                >
                    <VictoryBar

                        data={data}
                        labels={({ datum }) => datum.y}
                        style={{ labels: { fill: "black", fontSize: 8 }, data: { fill: "#c43a31" } }}
                        labelComponent={<VictoryLabel dy={0} />}

                    />
                </VictoryChart>
        </View>
    )

}