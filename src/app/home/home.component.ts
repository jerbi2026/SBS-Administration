import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  user: firebase.User | null = null;
  display_name="";
  title='';
  message='';
  items: any[] = [];
  item_to_add ={
    materiel:'',
    prix:0,
    photo:'',
    description : '',
    type : '',
    disponible : true
  };
  p=1;
  item_to_edit ={
    id:'',
    materiel:'',
    prix:0,
    photo:'',
    description : '',
    type : '',
    disponible : true
  };
  materiel='';
  
  constructor(private authService:AuthService,private router: Router, private firestoreService: FirestoreService , private afAuth: AngularFireAuth) { }
  async ngOnInit() {
    const localToken = localStorage.getItem('token');
    this.display_name = localStorage.getItem('displayName')??'';
    const google = localStorage.getItem('google');
    
    const firebaseToken = await this.authService.getCurrentUserToken();

    if (!localToken && (localToken !== firebaseToken) ) {
      this.router.navigate(['/login']);
    }
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
    });
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });


  }

  openModal(): void {
    const modal = new window.bootstrap.Modal(document.getElementById('accountDetailsModal'));
    modal.show();
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.afAuth.currentUser.then(user => {
        if (user) {
          user.delete().then(() => {
            alert('Account deleted successfully');
            this.authService.signOut();
          }).catch(error => {
            alert('Error deleting account: ' + error.message);
          });
        }
      });
    }
  }


  sign_out() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
  openPopup() {
    let url = 'https://lookerstudio.google.com/embed/reporting/cb079f0d-e5c9-4ecb-bec1-bd4923222be3/page/kIV1C';
    window.open(url, 'popup', 'width=600,height=600,scrollbars=yes,resizable=yes');
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.isLoading = true;
  
    if (file) {
      let dialog=document.getElementById('dialog');
     
      this.firestoreService.uploadImage(file).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.item_to_add.photo = response.data.display_url;        
          if(dialog){
            this.title='Image uploaded successfully✅';
            this.message='Your image has been uploaded successfully';
            dialog.style.display='block';
          }
          
          
        },
        (error) => {
          this.isLoading = false;
          if(dialog){
            this.title='Error uploading image⛔';
            this.message='Your image has not been uploaded';
            dialog.style.display='block';
          }
          
        }
      );
    }
  }

  

  close_dialog(){
    let dialog=document.getElementById('dialog');
    if(dialog){
      dialog.style.display='none';
    }
  }

  add_item(){
    this.isLoading = true;
    let dialog=document.getElementById('dialog');
    this.firestoreService.addDocument('produit',this.item_to_add).then(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Item added successfully✅';
        this.message='Your item has been added successfully';
        dialog.style.display='block';
      }
     
    }).catch(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Error adding item⛔';
        this.message='Your item has not been added';
        dialog.style.display='block';
      }
    });
    this.item_to_add ={
      materiel:'',
      prix:0,
      photo:'',
      description : '',
      type : '',
      disponible : true
    };
   
  }
  isLoading = false;


  delete_item(id : string){
    this.isLoading = true;
    let dialog=document.getElementById('dialog');
    this.firestoreService.deleteDocument('produit',id).then(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Item deleted successfully✅';
        this.message='Your item has been deleted successfully';
        dialog.style.display='block';
      }
     
    }).catch(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Error deleting item⛔';
        this.message='Your item has not been deleted';
        dialog.style.display='block';
      }
    });
    
    
  }

  prepare_item(item : any){
    this.item_to_edit = item;
  }


  mofifier_item(){
    this.isLoading = true;
    let dialog=document.getElementById('dialog');
    this.firestoreService.updateDocument('produit',this.item_to_edit.id,this.item_to_edit).then(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Item updated successfully✅';
        this.message='Your item has been updated successfully';
        dialog.style.display='block';
      }
     
    }).catch((error)=>{
      this.isLoading = false;
      if(dialog){
        this.title='Error updating item⛔';
        this.message='Your item has not been updated';
        dialog.style.display='block';
      }
    });
    this.item_to_edit ={
      id:'',
      materiel:'',
      prix:0,
      photo:'',
      description : '',
      type : '',
      disponible : true
    };
   
  }

  louer_item(item : any){
    this.isLoading = true;
    let dialog=document.getElementById('dialog');
    this.firestoreService.updateDocument('produit',item.id,{disponible : false}).then(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Item rented successfully✅';
        this.message='Your item has been rented successfully';
        dialog.style.display='block';
      }
     
    }).catch((error)=>{
      this.isLoading = false;
      if(dialog){
        this.title='Error renting item⛔';
        this.message='Your item has not been rented';
        dialog.style.display='block';
      }
    });
    this.item_to_edit ={
      id:'',
      materiel:'',
      prix:0,
      photo:'',
      description : '',
      type : '',
      disponible : true
    };

  }


  retour_item(item : any){
    this.isLoading = true;
    let dialog=document.getElementById('dialog');
    this.firestoreService.updateDocument('produit',item.id,{disponible : true}).then(()=>{
      this.isLoading = false;
      if(dialog){
        this.title='Item rented successfully✅';
        this.message='Your materiel has been back successfully';
        dialog.style.display='block';
      }
     
    }).catch((error)=>{
      this.isLoading = false;
      if(dialog){
        this.title='Error renting item⛔';
        this.message='Your item has not been back';
        dialog.style.display='block';
      }
    });
    this.item_to_edit ={
      id:'',
      materiel:'',
      prix:0,
      photo:'',
      description : '',
      type : '',
      disponible : true
    };

  }

  
  search_product(){
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
      this.items = this.items.filter((item)=>{
        return item.materiel.toLowerCase().includes(this.materiel.toLowerCase());
      });
      if(this.items.length==0){
        let dialog=document.getElementById('dialog');
        if(dialog){
          this.title='No item found⛔';
          this.message='No item found with this name';
          dialog.style.display='block';
        }
        this.firestoreService.getCollection('produit').subscribe(data => {
          this.items = data;
        });
        
      }
    });
  }


  sono(){
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
      this.items = this.items.filter((item)=>{
        return item.type.toLowerCase().includes('sono');
      });
      if(this.items.length==0){
        let dialog=document.getElementById('dialog');
        if(dialog){
          this.title='No item found⛔';
          this.message='No item found with this type';
          dialog.style.display='block';
        }
        this.firestoreService.getCollection('produit').subscribe(data => {
          this.items = data;
        });
        
      }
    });
  }

  lumiere(){
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
      this.items = this.items.filter((item)=>{
        return item.type.toLowerCase().includes('lumiere');
      });
      if(this.items.length==0){
        let dialog=document.getElementById('dialog');
        if(dialog){
          this.title='No item found⛔';
          this.message='No item found with this type';
          dialog.style.display='block';
        }
        this.firestoreService.getCollection('produit').subscribe(data => {
          this.items = data;
        });
        
      }
    });
  }

  autres(){
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
      this.items = this.items.filter((item)=>{
        return item.type.toLowerCase().includes('autres');
      });
      if(this.items.length==0){
        let dialog=document.getElementById('dialog');
        if(dialog){
          this.title='No item found⛔';
          this.message='No item found with this type';
          dialog.style.display='block';
        }
        this.firestoreService.getCollection('produit').subscribe(data => {
          this.items = data;
        });
        
      }
    });
  }


  materiel_loue(){
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
      this.items = this.items.filter((item)=>{
        return item.disponible==false;
      });
      if(this.items.length==0){
        let dialog=document.getElementById('dialog');
        if(dialog){
          this.title='No item found⛔';
          this.message='No item found ';
          dialog.style.display='block';
        }
        this.firestoreService.getCollection('produit').subscribe(data => {
          this.items = data;
        });
        
      }
    });
  }

  materiel_non_loue(){
    this.isLoading = true;
    this.firestoreService.getCollection('produit').subscribe(data => {
      this.items = data;
      this.isLoading = false;
      this.items = this.items.filter((item)=>{
        return item.disponible==true;
      });
      if(this.items.length==0){
        let dialog=document.getElementById('dialog');
        if(dialog){
          this.title='No item found⛔';
          this.message='No item found';
          dialog.style.display='block';
        }
        this.firestoreService.getCollection('produit').subscribe(data => {
          this.items = data;
        });
        
      }
    });
  }



 

}
