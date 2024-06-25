// src/app/services/firestore.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private http : HttpClient) { }

  getCollection(collectionPath: string): Observable<any[]> {
    return this.firestore.collection(collectionPath).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addDocument(collectionPath: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.doc(`${collectionPath}/${id}`).set(data);
  }

  updateDocument(collectionPath: string, docId: string, data: any): Promise<void> {
    return this.firestore.doc(`${collectionPath}/${docId}`).update(data);
  }

  deleteDocument(collectionPath: string, docId: string): Promise<void> {
    return this.firestore.doc(`${collectionPath}/${docId}`).delete();
  }

  private apiUrl = 'https://api.imgbb.com/1/upload'; 
  private apiKey = 'f55546bb61033efa3e7912aa9a88d443';


  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', this.apiKey);
    return this.http.post(this.apiUrl, formData);
  }

  


}
