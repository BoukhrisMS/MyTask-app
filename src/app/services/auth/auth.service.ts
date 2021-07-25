import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {User} from './../../../app/authentication/user.model';
import *  as firebase from 'firebase/firebase'
import { TaskService } from 'src/app/task.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth:AngularFireAuth, private afs:AngularFirestore,private router:Router,private taskService:TaskService) {
    
    this.afAuth.authState.subscribe(user => {
      if (user){
        localStorage.setItem('user', JSON.stringify(user));
      }
        else{
          localStorage.setItem('user', null);
        }
    });
   }

createNewUser(signUpForm){
  return this.afAuth.createUserWithEmailAndPassword(signUpForm.email, signUpForm.password).then((result)=>{this.SetUserData(result.user, signUpForm.userName);}).catch((error)=>{window.alert(error.message);});
  
}

SetUserData(user,userName?){
  const userRef : AngularFirestoreDocument<any> = this.afs.doc(`users/${user.email}`);
  const userData : User ={
    id : user.uid,
    email : user.email,
    userName:userName||user.displayName,
  };
  
  return userRef.set(userData, {merge:true});
}

signIn(signInForm){
  return this.afAuth.signInWithEmailAndPassword(signInForm.email,signInForm.password).then((result)=>{this.router.navigate(['tasks']);
}).catch((error)=>{window.alert(error.message);
})};

signInWithgoogle(){
  return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
    (result)=>{
      this.SetUserData(result.user);
      this.router.navigate(['tasks']);
    }
  ).catch((error)=>{window.alert(error.message);
  });
};


get isLoggedIn():boolean{
  const user=JSON.parse(localStorage.getItem('user'));
  return (user!==null)? true : false;
}


signOut(){
  return this.afAuth.signOut().then(()=>{localStorage.removeItem('user');
  this.router.navigate(['signin']);
  
})
}
}




