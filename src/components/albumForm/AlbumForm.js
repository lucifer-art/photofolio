import styles from "./albumForm.module.css";
import { useRef } from "react";
import db from '../../firebase';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export const AlbumForm = ({loading, onAlbumAdded}) => {
  const albumNameInput = useRef();
// function  to handle the clearing of the form
  const handleClear = () =>{
    if(albumNameInput.current) {
      albumNameInput.current.value = "";
    }
  };
// function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = albumNameInput.current.value.trim();
    if(!name) return;
    try {
      await addDoc(collection(db, 'albums'), { name, timestamp: serverTimestamp() });
      handleClear();
      toast.success("Album added successfully");
      onAlbumAdded();
    } catch(err) {
      console.error("Error: ", err.message)
    }
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Album Name" ref={albumNameInput} />
        <button type="button" onClick={handleClear} disabled={loading}>
          Clear
        </button>
        <button disabled={loading}>Create</button>
      </form>
    </div>
  );
};
