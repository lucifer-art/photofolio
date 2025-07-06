import { useState, useEffect } from "react";
import styles from "./albumsList.module.css";
import { AlbumForm } from "./../albumForm/AlbumForm";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase";
import { ImagesList } from "../imagesList/ImagesList";

export const AlbumsList = () => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [albumAddLoading, setAlbumAddLoading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  // create function to get all the album from the firebase.
  // create function to handle adding of the album

  const fetchAlbum = async () => {
    setLoading(true)
    try {
      const albumSnapshot = await getDocs(collection(db, "albums"));
      if(!albumSnapshot) return;
      const albumList = albumSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albumList);
      setLoading(false);
    } catch (err) {
      console.error("Error: ", err.message);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, []);

  const toggleAlbumFormHandler = (flag) => setAlbumAddLoading(flag);

  const getAlbumHandler = () => {
    fetchAlbum();
    setAlbumAddLoading(false);
  };

  const albumHandler = (album) => {
    setSelectedAlbum(album);
  }

  if(selectedAlbum) {
    return (
      <ImagesList album={selectedAlbum} onBack={albumHandler} />
    )
  }

  return (
    <>
      {albumAddLoading ? <AlbumForm onAlbumAdded={getAlbumHandler} /> : ""}
      <div className={styles.top}>
        <h3>Your Albums</h3>
        <button
          type="button"
          className={albumAddLoading ? styles.active : ""}
          onClick={() => toggleAlbumFormHandler(albumAddLoading ? false : true)}
        >
          {albumAddLoading ? "Cancel" : "Add album"}
        </button>
      </div>
      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <div className={styles.albumsList}>
          {albums.map((album) => (
            <div key={album.id} className={styles.album} onClick={() => albumHandler(album)}>
              <img src="/assets/photos.png" alt="images" />
              <span>{album.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
