import './App.css';
import { useEffect, useState } from 'react';
import { auth, googleProvider, db, storage } from "./firebaseConfig"
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes } from "firebase/storage"

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';

const movieCollectionRef = collection(db, "movies")

function App() {

  const [newTitle, setNewTitle] = useState("")
  const [newReleaseDate, setNewReleaseDate] = useState(null)
  const [newOscar, setNewOscar] = useState(false)
  const [updatedTitle, setUpdatedTitle] = useState("")

  // File Upload State
  const [uploadFile, setUploadFile] = useState(null)

  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [movies, setMovies] = useState([])
  const handleInputs = (event) => {
    let inputs = { [event.target.name]: event.target.value }

    setData({ ...data, ...inputs })
  }

  const addData = () => {
    signInWithEmailAndPassword(auth, data.email, data.password).catch((err) => alert(err))
  }
  const googleLogin = () => {
    signInWithPopup(auth, googleProvider).catch((err) => alert(err))
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await deleteDoc(movieDoc)
    getMovieList()
  }
  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef)
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      setMovies(filteredData)
    }
    catch (err) {
      alert(err)
    }
  }

  const handlelogout = () => {
    signOut(auth);
    alert("Logged out successfully!")
  }
  const submitHandler = () => {
    try {
      addDoc(movieCollectionRef, {
        title: newTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: newOscar,
        userId: auth?.currentUser?.uid
      })
      getMovieList()
    } catch (error) {
      console.log(error)
    }

  }
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc, {
      title: updatedTitle
    })
    getMovieList()
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log(user.email)
      // ...
    } else {
      // User is signed out
      // ...

    }
  });
  useEffect(() => {
    getMovieList()
  }, [])

  const fileUpload = async () => {
    const filesFolderRef = ref(storage, `projectFiles/${uploadFile.name}`)
    try {
      await uploadBytes(filesFolderRef, uploadFile)
    } catch (err) {
      console.error(err)
    }

  }
  return (
    <div className="App-header">
      <input
        placeholder="Email"
        name="email"
        type="email"
        className="input-fields"
        onChange={event => handleInputs(event)}
      />
      <input
        placeholder="Password"
        name="password"
        type="password"
        className="input-fields"
        onChange={event => handleInputs(event)}
      />

      <button onClick={addData}>Log In</button>
      <button onClick={googleLogin}> Sign in with Google</button>
      <button onClick={handlelogout}>Log out</button>
      <div>
        <input type="text" value={newTitle} name='newTitle' placeholder='Title...' onChange={(e) => setNewTitle(e.target.value)} />
        <input type="number" value={newReleaseDate} name='newReleaseDate' placeholder='ReleaseDate...' onChange={(e) => setNewReleaseDate(Number(e.target.value))} />
        <input type="checkbox" checked={newOscar} name='oscar' placeholder='Title...' onChange={(e) => setNewOscar(e.target.checked)} />
        <button onClick={submitHandler}> Submit</button>
      </div>
      <div>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h2 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>{movie.title}</h2>
            <p> Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}> Delete Movie</button>
            <input type="text" placeholder='new title...' onChange={(e) => setUpdatedTitle(e.target.value)} />
            <button onClick={() => updateMovieTitle(movie.id)}> Update</button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} />
        <button onClick={fileUpload}> Upload File</button>
      </div>
    </div>
  );
}

export default App;
