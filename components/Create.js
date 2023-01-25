import React, { useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from "react-native";
import FirebaseProvider from "../services/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import * as DocumentPicker from 'expo-document-picker';

const Create = () => {
   
    const [isBusy, setIsBusy] = useState(false);
   
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [cover, setCover] = useState(null);

    //create post function
    const createPost = async() => {
        
        if(title == "" || content == ""){
            console.log("PLEASE FILL THE REQUIRED FIELDS")
        }else if(cover == null) {
            console.log("PLEASE SELECT A COVER IMAGE");
        }else{

            setIsBusy(true);

            let post = {
                title: title,
                content: content,
                cover: cover,
            }

            //create post here
            const storage = FirebaseProvider.storage;
            const _ref = ref(storage, cover.name);
            
            await uploadBytes(_ref, cover).catch(err => console.log(err));
            //get the file url and then pass it to the post to be uploaded
            const downloadURL = await getDownloadURL(_ref);
            //console.log(downloadURL);
            
            let newPost = await FirebaseProvider.newPost(post, downloadURL).catch(err => console.log(err));
            if(newPost == undefined){
                alert("An Error Ocurred");
                const imageRef = ref(storage, cover.name);
                deleteObject(imageRef)
                .then(() => {
                    alert("Image Ref was deleted successfully")
                }).catch(err => {
                    alert(err)
                })
            }else{
                alert("Document created successfully");
                setIsBusy(false);
            }

        }

      

    };

    const selectFile = async() => {
        let doc = await DocumentPicker.getDocumentAsync();
        setCover(doc.file);
    }

    let createForm;
    if(isBusy){
        createForm = (
            <View>
                <Text>Processing request, please wait...</Text>
            </View>
        )
    }else{
        createForm = (
            <ScrollView style={styles.inputsContainer}>
            <View>
            <TextInput style={styles.inputGroup} placeholder="title" onChange={(e) => setTitle(e.target.value)} /> 
            </View>
            <View>
            <TextInput style={styles.inputGroup} placeholder="content" onChange={(e) => setContent(e.target.value)} /> 
            </View>
            
            <View>
            <Button
                title="Select a cover image"
                onPress={selectFile}
                />
            </View>

            <View>
                <Button title='Create Post' onPress={() => createPost()}></Button>
            </View>
        </ScrollView>
        )
    }

    return(
        <>
            {createForm}
        </>
    )

}


const styles = StyleSheet.create({
    inputsContainer: {
        padding: "1rem",
    },
    inputGroup: {
        border: "1px solid red",
        padding: "1rem",
        backgroundColor: "#eee",
        marginBottom: "0.5rem",
    }
})


export default Create;