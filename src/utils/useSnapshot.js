import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const useSnapshot = (collection, docId) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const docRef = doc(db, collection, docId);
    const unsub = onSnapshot(docRef, (querySnapshot) => {
      const data = querySnapshot.data();
      if (data && data.users) {
        setUsers(data.users);
      }
    });

    return () => unsub();
  }, [collection, docId]);

  return { users };
};

export default useSnapshot;
