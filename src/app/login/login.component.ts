import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email="";
  password="";
  message="";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  signIn() {
    this.authService.signIn(this.email, this.password)
      .then((res:any) => {
        const user = res.user._delegate;
        localStorage.setItem('token', user.accessToken);
        localStorage.setItem('displayName', user.email);
        
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.message = 'Erreur lors de la connexion : '+ err;
        let dialog = document.getElementById('dialog');
        if(dialog){
            dialog.style.display = "block";
        }
       
      });
      
      
  }



  close_dialog(){
    let dialog = document.getElementById('dialog');
    if(dialog){
      dialog.style.display = "none";
    }
    this.router.navigate(['/login']);
  }


}
