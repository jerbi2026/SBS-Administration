import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environment/environment';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import{HttpClientModule} from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    ResetpasswordComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, 
    FormsModule,
    AngularFirestoreModule,
    HttpClientModule,
    NgxPaginationModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
