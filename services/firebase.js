import { initializeApp } from "firebase/app";
import { getFirestore, doc, addDoc, Timestamp, getDoc, updateDoc } from "firebase/firestore";

//firestore
import {collection, getDocs} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";



const config = {
  
}


class FirebaseProvider{

    constructor(){
        this.firebase = initializeApp(config);
        this.firestore = getFirestore(this.firebase);
        this.auth = getAuth(this.firebase);
        this.storage = getStorage(this.firebase, "gs://fir-nine-cb0b5.appspot.com");
     
    }

    //get posts 
    async getPosts(){
      let posts = [];
      const _posts = await getDocs(collection(this.firestore, "posts"));
      _posts.forEach(_p => {
        posts.push({"id":_p.id, "data": _p.data()});
      });

      return posts;
    }


    async newPost(post, url){
        //builld the doc object
        let docData = {
            title: post.title,
            content: post.content,
            cover: url
        }

         return await addDoc(collection(this.firestore, "posts"), docData );
        
    }


    deleteCoverImage(object){
        
    }

    async getPostById(postId){
        const docRef= doc(this.firestore, "posts", postId);
        const docSnap = await getDoc(docRef);

        return docSnap.data()
    }


    async updatePost(postId, postData){
        const docRef = doc(this.firestore, "posts", postId);
        await updateDoc(docRef, {
            title: postData.title,
            content: postData.content,
            cover: postData.cover 
        })
     

        //delete the old cover if a new one was passed
        if(postData.oldcover){
            console.log("has oldcover prop, should delete old cover image");
            
            const storage = this.storage;
            const imageRef = ref(storage, postData.oldcover);
        
            deleteObject(imageRef)
            .then(() => {
                alert("Image Ref was deleted successfully")
            }).catch(err => {
                alert(err)
            })
        
        }else{
            console.log("no new cover image was found")
        }
    
    }

}

export default new FirebaseProvider();