import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ImageBackground, Button, Modal, TextInput } from "react-native";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import FirebaseProvider from "../services/firebase";


import * as DocumentPicker from 'expo-document-picker';

const Single = ({route, navigation}) => {
    
    const [post, setPost] = useState("");
    const [cover, setCover] = useState(null);
    const [oldcover, setOldcover] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    //get the params
    const {id} = route.params;
    
    const [isBusy, setIsBusy] = useState(false);
   
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
   

    const getFirebasePostById = async() => {
        let post = await FirebaseProvider.getPostById(id);
        setPost(post);  
    }


    const openEditModal = () => {
        
        setIsVisible(true);
        setTitle(post.title);
        setContent(post.content);
        setOldcover(post.cover);
    }

    const closeEditModal = () => {
        setIsVisible(false);
    }


    const selectFile = async() => {
         
        let doc = await DocumentPicker.getDocumentAsync();
        setCover(doc.file);
        
    }

    const updatePost = async() => {
      
        if(title == "" || content == ""){
            console.log("PLEASE FILL THE REQUIRED FIELDS")
        }else{

            let downloadURL = "";

            let _updatePost = {
                title: title,
                content: content,
                cover: oldcover
            }

           
           if(cover != null){
            const storage = FirebaseProvider.storage;
            const _ref = ref(storage, cover.name);
            
            await uploadBytes(_ref, cover).catch(err => console.log(err));
            //get the file url and then pass it to the post to be uploaded
            downloadURL = await getDownloadURL(_ref);
            _updatePost.cover = downloadURL;
            _updatePost.oldcover = oldcover;
           }
            
            //update the post
            let updatePost =  await FirebaseProvider.updatePost(id, _updatePost).catch(err => console.log(err));
            console.log(updatePost);
          
            closeEditModal();
        
        }

    }

    useEffect(() => {
       getFirebasePostById();

    }, [])   

    return(
        <>
            <ScrollView>
                <Modal
                animationType='slide'
                visible={isVisible}
                onRequestClose= {() => closeEditModal()}
                >
                    <ScrollView style={styles.inputsContainer}>
                        <View>
                            <TextInput style={styles.inputGroup} placeholder="title" defaultValue={post.title} onChange={(e) => setTitle(e.target.value)} /> 
                        </View>
                        <View>
                            <TextInput style={styles.inputGroup} placeholder="content" defaultValue={post.content} onChange={(e) => setContent(e.target.value)} /> 
                        </View>
                        
                        <TextInput style={styles.inputGroupHidden} defaultValue={post.cover} onChange={(e) => setOldcover(e.target.value)} disabled /> 
                        <View>
                        <Button
                            title="Select a cover image"
                            onPress={selectFile}
                            />
                        </View>

                    </ScrollView>
                    <View>
                        
                        <Button 
                        title='Save Changes' 
                        onPress={() => updatePost()} 
                        />
                        
                        <Button
                        title="Discard Changes"
                        onPress={() => closeEditModal()}
                        />
                    </View>


                </Modal>
                
                
                <ImageBackground source={post.cover} resizeMode="cover" style={styles.image}></ImageBackground>
                <View style={styles.postContainer}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text>{post.content}</Text>
                </View>
            
                <View>
                <Button
                    title="Edit Post"
                    onPress={() => openEditModal()}
                    />
                </View>
            </ScrollView>
        </>
    )

}

const styles = StyleSheet.create({
    image: {
        justifyContent: 'center',
        height: "600px",
       
    },
    postContainer: {
        padding: "2em"
    },
    postTitle: {
        fontSize: "2rem",
        textAlign: "center",
        color: "#666",
        marginBottom: "2rem"
    },
    inputGroup: {
        border: "1px solid red",
        padding: "1rem",
        backgroundColor: "#eee",
        marginBottom: "0.5rem",
    },
    inputGroupHidden: {
        display: "none",
    }
});

export default Single;