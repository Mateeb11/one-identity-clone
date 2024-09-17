import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from 'firebase/firestore';

import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private dbValue: string = '';

  constructor(private papa: Papa) {}

  async getData() {
    const docRef = doc(this.db, 'Test', 'TestName');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      this.dbValue = docSnap.data()['Name'];
    } else {
      console.log('No such document!');
    }
  }

  async setData(writeInputValue: any) {
    const citiesRef = collection(this.db, 'Test');

    await setDoc(doc(citiesRef, 'TestName'), {
      Name: writeInputValue.nativeElement.value,
    });

    console.log(`Write value = ${writeInputValue.nativeElement.value}`);
  }

  public readCSV(file: any): void {
    this.papa.parse(file, {
      complete: async (result: any) => {
        const mailBoxRef = collection(this.db, 'MailBox');
        const adsRef = collection(this.db, 'ADSAccount');

        for (let i = 1; i < result.data.length; i++) {
          await setDoc(doc(mailBoxRef, result.data[i][0]), {
            isActive: result.data[i][4] || true,
            isCompanyEmployee: result.data[i][3] || true,
            quota: result.data[i][3] == 'TRUE' ? 5 : 2,
          });

          await setDoc(doc(adsRef, result.data[i][0]), {
            isActive: result.data[i][4] || true,
            email: result.data[i][2],
            fullName: result.data[i][1],
          });
        }
      },
    });
  }
}
