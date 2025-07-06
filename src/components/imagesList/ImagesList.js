import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";
import { collection, getDocs, doc, query, where, serverTimestamp, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import db from "../../firebase";
import { toast } from "react-toastify";
export const ImagesList = ({album, onBack}) => {

  //These state and functions are create just for your convience you can create modify or delete the state as per your requirement.
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);
  const searchInput = useRef();
  // async function
  const getImages = async () => {
    if(!album?.id) {
      return;
    }
    setLoading(true);
    try {
      const imageQuery = query(collection(db, 'images'), where('albumId', '==', album.id));
      const imageSnapshot = await getDocs(imageQuery);
      if(!imageSnapshot.empty) {
        const images = imageSnapshot.docs.map(image => ({
          id: image.id,
          ...image.data()
        }));
        setImages(images);
        setFilteredImages(images);
      } else {
        setImages([]);
        setFilteredImages([]);
      }
    } catch(err) {
      console.error("Error:", err.message);
      // toast.error("Error Fetching images")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(album?.id) {
      getImages()
    }
  }, []);

  // function to handle toggle next image
  const handleNext = () => {
    if (activeImageIndex < filteredImages.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      setActiveImageIndex(0);
    }
  };
  // function to handle toggle previous image
  const handlePrev = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else {
      setActiveImageIndex(filteredImages.length - 1);
    }
  };
  // function to handle cancel  
  const handleCancel = () => {
    setActiveImageIndex(null);
  };
  // function to handle search functionality for image
  const handleSearchClick = () => {
    setSearchIntent(!searchIntent);
    if (searchIntent && searchInput.current) {
      searchInput.current.value = "";
      setFilteredImages(images);
    }
  };
  // function to handle search functionality for image
  const handleSearch = async () => {
    const searchTerm = searchInput.current.value.toLowerCase();
    if (!searchTerm) {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image =>
        image.title.toLowerCase().includes(searchTerm)
      );
      setFilteredImages(filtered);
    }
  };

  // async functions
  const handleAdd = async ({title, url}) => {
    setImgLoading(true);
    try {
      if (title && url) {
        await addDoc(collection(db, "images"), {
          title,
          url,
          albumId: album.id,
          timestamp: serverTimestamp(),
        });
        await getImages();
        toast.success("image added successfully");
      } else {
        toast.success("title or url iss  missing");
      }
      setAddImageIntent(false);
    } catch(err) {
      console.error("Error: ", err.message);
      toast.error("Error adding image");
    } finally {
      setImgLoading(false)
    }
  };
  // function to handle update image
  const handleUpdate = async ({ title, url }) => {
    setImgLoading(true);
    try {
      const imageRef = doc(db, "images", updateImageIntent.id);
      await updateDoc(imageRef, {
        title,
        url,
      });
      await getImages();
      setUpdateImageIntent(false);
      toast.success("Image updated successfully!");
    } catch (err) {
      console.error("Error updating image: ", err.message);
      toast.error("Error updating image");
    } finally {
      setImgLoading(false);
    }
  };
  // function to handle delete image
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteDoc(doc(db, "images", id));
        await getImages();
        toast.success("Image deleted successfully!");
      } catch (err) {
        console.error("Error deleting image: ", err.message);
        toast.error("Error deleting image");
      }
    }
  };

  if (!images.length && !searchInput.current?.value && !loading) {
    return (
      <>
        <div className={styles.top}>
          <span onClick={onBack}>
            <img src="/assets/back.png" alt="back" />
          </span>
          <h3>No images found in the album.</h3>
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        </div>
        {addImageIntent && (
          <ImageForm
            loading={imgLoading}
            onAdd={handleAdd}
            albumName={album.name}
          />
        )}
      </>
    );
  }
  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAdd}
          albumName={album.name}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
        />
      )}
      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].title}
          url={images[activeImageIndex].url}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.top}>
        <span onClick={onBack}>
          <img src="/assets/back.png" alt="back" />
        </span>
        <h3>Images in {album.name}</h3>

        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={handleSearch}
              ref={searchInput}
              autoFocus={true}
            />
          )}
          <img
            onClick={handleSearchClick}
            src={!searchIntent ? "/assets/search.png" : "/assets/clear.png"}
            alt="clear"
          />
        </div>
        {updateImageIntent && (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        )}
        {!updateImageIntent && (
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        )}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}
      {!loading && (
        <div className={styles.imageList}>
          {images.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(image);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>
              <div
                className={`${styles.delete} ${
                  activeHoverImageIndex === i && styles.active
                }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>
              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  currentTarget.src = "/assets/warning.png";
                }}
              />
              <span>{image.title.substring(0, 20)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
