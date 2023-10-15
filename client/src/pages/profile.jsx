
import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase"

function Profile() {
  const fileref = useRef(null)
  const { currentUser } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadEroor] = useState(false)
  const [formData, setFormData] = useState({})


  //firebase storage
  // allow read, write: if request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*');
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const filename = new Date().getTime() + file.name
    const storageref = ref(storage, filename)
    const uploadTask = uploadBytesResumable(storageref, file)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
      // console.log("upload "+progress +" is done")
    },
      (error) => {
        setFileUploadEroor(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })

        })
      },
    );
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileref} hidden accept="image/*" />
        <img onClick={() => fileref.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
          ( <span className="text-red-700">Error Image Upload (Image must be 2 mb)</span>) : 
           filePerc >0 && filePerc<100 ?
           <span className="text-green-700">
            {`Uploading ${filePerc}%`}
           </span>
           :
           filePerc === 100 ?
           <span className="text-green-700">
           Image successfully uploaded
          </span>
          :
          ''
           
          }
        </p>
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" />
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile
