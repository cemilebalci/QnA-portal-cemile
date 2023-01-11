import { Uye } from './../models/Uye';
import { Soru } from '../models/Soru';
import { Cevap } from '../models/Cevap';
import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FbservisService {
  aktifUye = authState(this.auth);
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) { }

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<Uye>;
      })
    );
  }

 

  UyeListele() {
    var ref = collection(this.fs, "Uyeler");
    return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  }
  UyeEkle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return deleteDoc(ref);
  }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }

  /*SORULAR KISMI */
  SoruListele() {
    var ref = collection(this.fs, "Sorular");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('uid', '==', user?.uid)
        );
        return collectionData(myQuery, { idField: 'soruId' }) as Observable<Soru[]>;
      })
    );
  }
  SoruEkle(soru: Soru) {
    var ref = collection(this.fs, "Sorular");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          baslik: soru.baslik,
          soru: soru.soru,
          tamam: soru.tamam,
          uid: user?.uid
        })
      ),
      map((ref) => ref.id)
    );
  }
  SoruDuzenle(soru: Soru) {
    var ref = doc(this.fs, "Sorular/" + soru.soruId);
    return updateDoc(ref, { ...soru });
  }
  SoruSil(soru: Soru) {
    var ref = doc(this.fs, "Sorular/" + soru.soruId);
    return deleteDoc(ref);
  }

  /*CEVAP KISMI */
  CevapListele() {
    var ref = collection(this.fs, "Cevaplar");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('uid', '==', user?.uid)
        );
        return collectionData(myQuery, { idField: 'cevapId' }) as Observable<Cevap[]>;
      })
    );
  }
  CevapEkle(cevap: Cevap) {
    var ref = collection(this.fs, "Sorular");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          cevap: cevap.cevap,
          soru: cevap.soru,
          baslik: cevap.baslik,
          eklemetarih: cevap.eklemetarih,
          uid: user?.uid
        })
      ),
      map((ref) => ref.id)
    );
  }
  CevapDuzenle(cevap: Cevap) {
    var ref = doc(this.fs, "Cevaplar/" + cevap.cevapId);
    return updateDoc(ref, { ...cevap });
  }
  CevapSil(cevap: Cevap) {
    var ref = doc(this.fs, "Cevaplar/" + cevap.cevapId);
    return deleteDoc(ref);
  }

}
