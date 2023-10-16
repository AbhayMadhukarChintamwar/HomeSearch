
import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

function Profile() {
  const fileref = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadEroor] = useState(false)
// const [updateSuccess ,setUpdateSuccess]   =  useState(false);
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch();


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
      () => {
        setFileUploadEroor(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })

        })
      },
    );
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      // dispatch(setUpdateSuccess(true))
    } catch (error) {
      dispatch(updateUserFailure(error.message))

    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileref} hidden accept="image/*" />
        <img onClick={() => fileref.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
            (<span className="text-red-700">Error Image Upload (Image must be 2 mb)</span>) :
            filePerc > 0 && filePerc < 100 ?
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
        <input type="text" placeholder="username" defaultValue={currentUser.username} className="border p-3 rounded-lg" id="username" onChange={handleChange} />
        <input type="email" placeholder="email" defaultValue={currentUser.email} className="border p-3 rounded-lg" id="email" onChange={handleChange} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-70 mt-5">{error ? <p className="text-red-700 mt-5">{'You can updated only your account'}</p>: <p className="text-green-700 mt-5">{'User is updated succcessfully'}</p>}</p>

    </div>
  )
}

export default Profile

// {
//   this.state.error ? (
//     <div></div>
//   ) : (
//     <div>
//       this.otherCondition && <div>title</div>
//       <div>body</div>
//     </div>
//   );
// }