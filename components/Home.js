import React, { Fragment, useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Button, TouchableWithoutFeedback  } from "react-native";
import FirebaseProvider from "../services/firebase";
import { useIsFocused } from "@react-navigation/native";

const Home = ({navigation}) => {
    const isFocused = useIsFocused();
    const [posts, setPosts] = useState([]);
   
    const getFirebasePosts = async() => {
      let posts = await FirebaseProvider.getPosts();
      setPosts(posts)
    
    }

    useEffect(() => {   
      // Call only when screen open or when back on screen 
      // redo the search to updat the view cards     
      if(isFocused){ 
        getFirebasePosts();
      } 
     
    }, [isFocused])    


    return(
        <>
          <ScrollView style={styles.cardsContainer}>
            <View>
            {posts.map((post) => {
              return(
                  <TouchableWithoutFeedback key={post.id} onPressIn={() => navigation.navigate("Single", {
                    id: post.id
                  })}>
                    <View style={styles.customCard} >
                        <Image 
                        source={{uri: post.data.cover}}
                        style={styles.cardImage} />
                        <Text style={styles.cardText}>{post.data.title}</Text>
                    </View>
                  </TouchableWithoutFeedback>
              );
            })}
            </View>
          </ScrollView>
          <View>
            <Button
              title="Create a new post"
              onPress={() => navigation.navigate('Create')}
            />
          </View>
        </>
    )

}


const styles = StyleSheet.create({
  cardsContainer: {
    padding: "1rem",
  },  
  customCard: {
    backgroundColor: "white",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    borderRadius: "10px",
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: "10px 10px 0px 0px",
    width: "100%",
    height: "400px"
  },
  cardText: {
    marginTop: "0.5rem",
    marginBottom: "0.5rem"
  }
})

export default Home;