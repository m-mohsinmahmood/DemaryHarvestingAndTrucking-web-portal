import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  // Save logged in user data
  userData: any;
  // Get user's Access Token
  accessToken: string;
  // check LoggedIn 
  isLoggedIn = false;
  constructor(public fireBaseAuth: AngularFireAuth) { }

  //#region Signin
  async signin(email: string, password: string) {
    await this.fireBaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.getAccessToken()
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user));
      })
  }
  //#endregion

  //#region Signup
  async signup(email: string, password: string) {
    await this.fireBaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(response.user));
      })
  }
  //#endregion

  //#region Logout
  logout(){
    this.fireBaseAuth.signOut();
    localStorage.removeItem('user');
  }

  //#region Returns the accessToken of the loggedIn user
  async getAccessToken() {
    this.accessToken = await (await this.fireBaseAuth.currentUser).getIdToken(true);
  }
  //#endregion
}
