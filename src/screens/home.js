import React, { useEffect, useState } from "react";
import { View, Text, Touchable, TouchableOpacity, StyleSheet } from "react-native";


import md5 from "md5";
import { VictoryLabel, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

export default function Home() {

    const [valueGeneration, setGeneration] = useState([{ "cumulative": "", "month": "", "today": "" }])
    const [valueHistory, setHistory] = useState([0, 2, 4, 67]);
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

        } catch (error) {
            console.error('There was a problem with the request:', error);
        }

    }

    const history = async (value, dataString) => {

        const date = new Date(dataString);
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
            console.log(data.result);

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


            console.log(data.result[0].datas[0].value);

        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

   
    return (
        <View>
            <TouchableOpacity style={{ top: 300 }} onPress={() => generation()}><Text>generation</Text></TouchableOpacity>
            <TouchableOpacity style={{ top: 300 }} onPress={() => history('day', new Date())}><Text>day</Text></TouchableOpacity>
            <TouchableOpacity style={{ top: 300 }} onPress={() => history('month', new Date())}><Text>mes</Text></TouchableOpacity>
            <TouchableOpacity style={{ top: 300 }} onPress={() => history('year', new Date())}><Text>ano</Text></TouchableOpacity>
            <TouchableOpacity style={{ top: 300 }} onPress={() => KW()}><Text>Agora</Text></TouchableOpacity>
            <Text style={{ top: 300 }}>Total de hoje: {valueGeneration.today} : {valueGeneration.month}</Text>
            <View style={{ top: 300 }}>
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
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
});