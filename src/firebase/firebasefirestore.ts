import { addDoc, collection, deleteDoc,doc, getFirestore,setDoc, updateDoc,} from "firebase/firestore";
import { app } from "./firebaseconfig";
import { auth } from "./firebaseauth";


export const db = getFirestore(app);

type userSaveType = {
    email: string | null;
    uid: string;
  };
  



export async function saveUser(user : userSaveType) {
  try {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, user);
  } catch (e) {
    console.log(e);
  }
}




export async function saveExpense(
    title: string,
    amount: number | string, 
    date: Date,
    category: string,
    note: string
) {
    const uid = auth.currentUser?.uid;
    const collectionRef = collection(db, "expenses");

    try {
       
        const amountNumber = typeof amount === 'string' ? Number(amount) : amount;

        const newExpense = { title, uid, amount: amountNumber, date, category, note };
        const docRef = await addDoc(collectionRef, newExpense);
        const docRefToUpdate = doc(db, "expenses", docRef.id);
        await updateDoc(docRefToUpdate, {
            firebaseID: docRef.id,
        });
    } catch (error) {
        console.log("Error saving expense:", error);
    }
}




export async function deleteExpense(firebaseID: string) {
  await deleteDoc(doc(db, "expenses", firebaseID));
  console.log(firebaseID)
}











