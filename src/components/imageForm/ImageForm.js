import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";

export const ImageForm = ({ loading, albumName, updateIntent, onAdd, onUpdate}) => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  const imageTitleInput = useRef();
  const imageUrlInput = useRef();
  // function to handle image form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = imageTitleInput.current.value.trim();
    const url = imageUrlInput.current.value.trim();
    if(updateIntent) {
      onUpdate({ title, url});
    } else {
      onAdd({ title, url});
    }
  };
// function to thandle clearing the form
  const handleClear = () => {
    imageTitleInput.current.value = "";
    imageUrlInput.current.value = "";
  };
  // function to prefill the value of the form input 
  const handleDefaultValues = () => {
    if (updateIntent && imageTitleInput.current && imageUrlInput.current) {
      imageTitleInput.current.value = updateIntent.title || "";
      imageUrlInput.current.value = updateIntent.url || "";
    }
  };

  useEffect(() => {
    handleDefaultValues();
  }, [updateIntent]);

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${albumName}`
          : `Update image ${updateIntent.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" ref={imageTitleInput} />
        <input required placeholder="Image URL" ref={imageUrlInput} />
        <div className={styles.actions}>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button type="submit" disabled={loading}>{updateIntent ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
};
