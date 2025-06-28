# PhotoFolio - Online Photo Album

**PhotoFolio** is a digital photo management application that allows users to upload, organize, and share their photos. The app enables the creation of albums, uploading images, editing images, and deleting images, all while interacting with Firebase for backend data storage.

---

## **Technologies Used**

* **Frontend**: React.js
* **Backend**: Firebase (Firestore)
* **State Management**: React hooks
* **Styling**: CSS/SCSS (or any styling library you prefer)
* **Libraries**:

  * **react-toastify** (for toast notifications)
  * **react-spinner-material** (for loading state)
  * **firebase** (Firestore integration)

---

## **Features**

1. **Create Album**: Users can create new photo albums.
2. **Display Albums**: Users can view a list of all albums present in Firebase.
3. **Add Image to Album**: Users can add images to selected albums.
4. **Edit Image**: Users can edit the details (title, URL) of an image.
5. **Delete Image**: Users can delete images from albums.
6. **Image Search**: Users can filter images within an album by title.
7. **Carousel**: Users can view images in a carousel with navigation (next, previous, close).
8. **Toast Notifications**: Display error or success messages based on user actions.
9. **Loading State**: Show a loading spinner during data fetching.
10. **Back Navigation**: Navigate back to the album list from image details view.

---

## **Project Setup**

### 1. Clone the Repository

```bash
git clone https://github.com/lucifer-art/photofolio.git
cd photo-folio
```

### 2. Install Dependencies

Make sure to have Node.js installed, and then run:

```bash
npm install
```

### 3. Firebase Setup

* Go to [Firebase Console](https://console.firebase.google.com/).
* Create a new Firebase project.
* Set up Firestore (Firestore Database).
* Copy your Firebase configuration details.

### 4. Firebase Configuration

In your project, navigate to `src/firebaseConfig.js` and paste your Firebase configuration:

```js
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

---

## **Components Overview**

### 1. **AlbumsList Component**

* **Description**: Displays a list of albums fetched from Firebase.
* **State**:

  * `albums`: Stores the list of albums from Firestore.
* **Features**:

  * Fetch albums on mount.
  * Show “Add Album” button to trigger the album creation form.

### 2. **AlbumForm Component**

* **Description**: A form to add a new album.
* **State**:

  * `albumName`: Stores the name of the album being added.
* **Features**:

  * Two buttons: “Create an album” and “Cancel”.
  * When "Create an album" is clicked, it adds the album to Firebase.
  * Clicking "Cancel" hides the form.

### 3. **ImagesList Component**

* **Description**: Displays the images of a selected album.
* **State**:

  * `images`: Stores the list of images within the selected album.
  * `selectedAlbum`: Stores the currently selected album.
  * `searchTerm`: Stores the search term for filtering images.
* **Features**:

  * Fetch images from Firebase for the selected album.
  * Show “Add Image” button to add new images.
  * Show a search input for filtering images by title.
  * Conditional rendering for image edit and delete buttons on hover.
  * Display a carousel for image viewing.

### 4. **ImageForm Component**

* **Description**: A form for adding or editing images.
* **State**:

  * `title`: Stores the title of the image.
  * `imageUrl`: Stores the URL of the image.
* **Features**:

  * Form fields for entering the image title and URL.
  * Submit button to add or update the image in Firebase.
  * Prefill the form if editing an existing image.

### 5. **Carousel Component**

* **Description**: Displays a carousel of images with navigation (next, previous, and close buttons).
* **State**:

  * `currentIndex`: Tracks the current image index in the carousel.
* **Features**:

  * Shows the image in full-screen mode.
  * Allows navigating through images using next and previous buttons.
  * Close button to close the carousel and return to the ImagesList.

---

## **Test Cases**

### Home Page

1. **Initial View**:

   * Button with text “Add album” should be visible.
   * If clicked, a form should appear with fields for creating a new album.

2. **Album Form**:

   * Two buttons should be displayed:

     * “Create an album” to submit the new album.
     * “Cancel” to hide the form.

3. **On clicking "Cancel"**: The form should disappear, and the album list should remain visible.

### Add Image

1. **On Clicking an Album**:

   * Display a list of images for that album.
   * Show a button “Add image” to add new images.

2. **Add Image Form**:

   * Two input fields should be present: Title and Image URL.
   * The "Add" button should add the image to the album, with the alt text set to the title.

### Update Image

1. **Image Edit Button**:

   * On hovering over an image, an edit button should appear.
   * Clicking it should open a form prefilled with the image details.

2. **Update Button**:

   * Clicking the "Update" button should save the changes to Firebase and update the displayed image.

### Delete Image

1. **Delete Button**:

   * On hovering over an image, a delete button should appear.
   * Clicking the delete button should remove the image from the album and from Firebase.

---

## **Known Issues**

* Ensure that the album "first" already exists in Firebase for testing purposes.
* If the image URL is incorrect or inaccessible, the image may not display correctly.

---

## **Contributing**

Feel free to fork this repository, submit issues, and send pull requests. Contributions to improve the project are welcome!

---

## **License**

This project is open source and available under the [MIT License](LICENSE).
