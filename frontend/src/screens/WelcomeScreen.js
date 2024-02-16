import React, { useState } from 'react';
import { StyleSheet, ImageBackground, View, Text, TextInput, TouchableOpacity } from "react-native";
import bgImg from '../assets/bg2.jpg';

import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function WelcomeScreen() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    
    function handleSignupClick() {
        console.log(email);
        console.log(password);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(userCredential.user.uid);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                // ..
            });
    }
    
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.container} source={bgImg} resizeMode="cover">
                <Text style={styles.text}>LearnFitness</Text>
                <Text style={styles.text}>A fitness app for everyone</Text>

                <TextInput 
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={text => setEmail(text)}
                    value={email}
                    autoCapitalize="false"
                />
                <TextInput 
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={text => setPassword(text)}
                    value={password}
                    autoCapitalize="false"             
                />
                <TouchableOpacity style={styles.button} onPress={handleSignupClick}>
                    <Text>Sign Up</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    image: {
        flex: 1,
        justifyContent: "center"
    },

    text: {
        color: "#fff",
        fontSize: 50,
    },

    input: {
        color: "#fff",
        fontSize: 20,

        margin: 5,
        padding: 5,
        height: 30,
        borderWidth: 1,
        borderColor: "#fff"
    },

    button: {
        color: "black",
        height: 50,
        width: 200, 
        backgroundColor: "#fff",
        borderRadius: 5,
    }
  });