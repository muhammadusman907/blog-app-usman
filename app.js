import {
    getAuth, createUserWithEmailAndPassword, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getFirestore, collection, addDoc, doc, onSnapshot, setDoc, getDoc, query, where, updateDoc, deleteDoc, serverTimestamp, getDocs,
    getStorage, ref, uploadBytesResumable, getDownloadURL, storage
} from "./firebase.js";
// ==========================================================================
// ================================ signup create user ======================
// ==========================================================================
// ========================================================
// 1: sign page get ids & value (email , password , button)

let signupEmail = document.getElementById("signup-email");
let signupPassword = document.getElementById("signup-password");
let signupBtn = document.getElementById("signup-btn");
let signupUserName = document.getElementById("signup-user-name");
let dashboardAddBlog = document.getElementById("dashboard-add-blog");
let loader = document.getElementById("loader");
// loader.style.display = "flex";

// ================================
// 2: click sign up btn create user

signupBtn && signupBtn.addEventListener("click", () => {
    //===================================================
    //  3: check value console (email , password , value)
    console.log(signupEmail.value, signupPassword.value, signupBtn)
    createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
        .then(async (userCredential) => {
            // ====================
            // 4: Signed up check user
            const user = userCredential.user;
            console.log("signup user sucess --->", user)
            // =========================
            // USER NAME DATA BASE SAVE

            // Add a new document in collection "cities"
            await setDoc(doc(db, "userData", auth.currentUser.uid), {
                user_uid: auth.currentUser.uid,
                signup_user_name: signupUserName.value,
                signup_email: signupEmail.value
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("signup user error --->", errorMessage)
        });

})
// ===================== sign up compete ========================== 
// =====================******************=========================

// ===============================================================
// ============================LOGIN PAGE=========================
// ===============================================================

// ========================================================
// 1: sign page get ids & value (email , password , button)

let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");
let loginBtn = document.getElementById("login-btn");

// 2: click sign in check user to login

loginBtn && loginBtn.addEventListener("click", () => {
    //===================================================
    //  3: check value console (email , password , value)
    console.log(loginEmail.value, loginPassword.value)

    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
            // Signed in user 
            const user = userCredential.user;
            console.log("login check user --->", user)
            location.href = "./profile.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("login user error----> ", errorMessage)
        });
})
// ===========================================================
// ==================== on auth change =======================
// ===========================================================

// ===========================================================
// =================== PROFILE PAGE GET IDS ==================
// ===========================================================
let profileUsername = document.getElementById("profile-user-name");
let profileEmail = document.getElementById("profile-email");
let num = 0;
let getBlogData = async (uid) => {
    loader.style.display = "flex";
    if (location.pathname == "/dashboard.html") {
        dashboardAddBlog.innerHTML = "";
    }
    console.log("heloo");
    console.log(uid);
    let id = uid;


    const q = query(collection(db, "blogs"), where("user_uid", "==", id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        loader.style.display = "none";
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        if (location.pathname == "/dashboard.html") {

            dashboardAddBlog.innerHTML += `

        <div class="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto mt-4 max-w-md md:max-w-2xl ">
        <div class="flex bg-white items-start px-4 py-6 w-[100%] border-2 ">
           <img class="w-12 h-12 rounded-full object-cover mr-4 shadow" src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="avatar">
           <div class=" w-[100%]">
              <div class="flex items-center justify-between w-[100%]">
                 <h2 class="text-lg -mt-1 font-bold">${doc.data().user_name}  </h2>
                 <small class="text-sm text-gray-700">22h ago</small>
                 <p class="text-gray-700">${doc.data().timestamp.toDate().toString().slice(0, 15)}</p>
                 </div>
              
              <h1 class="font-bold text-2xl">${doc.data().blog_title}</h1>
              <p class="mt-3 text-gray-700 text-sm mb-5">
              ${doc.data().blog_description}
              </p>
              <button class="text-purple-800" id="update-value" onclick="updateBlog('${doc.id}')">Update</button>
              <button class="mx-3 text-red-800" id="${doc.id}" onclick="deleteBlog(this ,'${doc.id}')">Delete</button>
              </div>
              </div>
              </div>
              `
            //  debugger


        }


    });




    // const q = query(collection(db, "blogs"), where("user_uid", "==", id));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //         console.log("user post data ----->" + num, change)
    //         num++
    //         // console.log("time stamp=====",change.doc.data().timestamp.toDate());


    //     });
    // });

}
// ========================================================================
// =============================== index page  ============================
// ========================================================================
let allUserBlog = document.getElementById("all-user-blog")
let getAllBlog = () => {
    // console.log()
    // let id = allUserId;
    const unsubscribe = onSnapshot(collection(db, "blogs"), (getAllUser) => {
        // Respond to data
        // console.log(getAllUser.docs);
        getAllUser.docs.forEach((loopForAllUser) => {
            // console.log(loopForAllUser.data())
            if (location.pathname == "/index.html") {
                allUserBlog.innerHTML += `
        
              <div class="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto mt-4 max-w-md md:max-w-2xl ">
              <div class="flex bg-white items-start px-4 py-6 w-[100%] border-2 ">
                 <img class="w-12 h-12 rounded-full object-cover mr-4 shadow" src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="avatar">
                 <div class=" w-[100%]">
                    <div class="flex items-center justify-between w-[100%]">
                       <h2 class="text-lg -mt-1 font-bold">${loopForAllUser.data().user_name}  </h2>
                       <small class="text-sm text-gray-700">22h ago</small>
                       <p class="text-gray-700"> </p>
                       </div>
                    
                    <h1 class="font-bold text-2xl">${loopForAllUser.data().blog_title}</h1>
                    <p class="mt-3 text-gray-700 text-sm">
                    ${loopForAllUser.data().blog_description}
                    </p>
                   
                 </div>
              </div>
           </div>
           `
            }

        })

    });




}
getAllBlog()

// getBlogData()
// ======================================================================
//============================= update profile ==========================
// ======================================================================
let updateProfileBtn = document.getElementById("update-profile");
let profileImage = document.getElementById("profile-image");
let imageFile = document.getElementById("image-file");
let getImage = async () => {
    let imageData = await imageUploadFunction();
    profileImage.src = imageData;
    console.log(imageData)
}

let imageUploadFunction = (file) => {
    return new Promise((resolve, reject) => {
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + file);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL)
                 
                });
            }
        );

    })
}



imageFile && imageFile.addEventListener('change', async() => {
    console.log(event.target.files[0]);
   let imageData = await imageUploadFunction(event.target.files[0])
   console.log(imageData)
    profileImage.src = imageData;
})
updateProfileBtn && updateProfileBtn.addEventListener("click", () => {
    console.log(imageFile);
    getImage()

})

onAuthStateChanged(auth, (user) => {
    console.log(location.pathname)

    //  ========================
    //  2 : CHECK CONDITON  
    if (user) {
        const docRef = doc(db, "userData", auth.currentUser.uid)

        let profilePage = async () => {


            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data().user_uid);

                if (user && docSnap.data().user_uid) {
                    getBlogData(user.uid)
                    const uid = user.uid;
                    //  CHANGE LOCATION 
                    //  debugger
                    if (location.pathname !== "/profile.html" && location.pathname !== "/dashboard.html" &&
                        location.pathname !== "/index.html"
                    ) {
                        location.href = "./profile.html";

                    }
                    else if (location.pathname == "/profile.html") {
                        console.log(profileUsername)
                        profileUsername.innerHTML = docSnap.data().signup_user_name;
                        profileEmail.innerHTML = docSnap.data().signup_email;
                        console.log("Current data------>: ", docSnap.data());
                    }
                    // console.log(uid)
                }
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");

            }
        }
        profilePage()
    }
    else {
        if (location.pathname !== "/login.html" &&
            location.pathname !== "/signup.html" &&
            location.pathname !== "/index.html"
        ) {
            window.location.href = "./login.html"
        }
    }
}

);

// =====================================================================
// ====================================== Logout =======================
// =====================================================================
let logOutBtn = document.getElementById("logout-btn");
logOutBtn && logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        location.href = "./index.html";
    }).catch((error) => {
        // An error happened.
    });
})

// 

// =====================================================================
// ================================== Blog VALUE =======================
// =====================================================================
let blogTitle = document.getElementById("blog-title");
let blogValue = document.getElementById("blog-value");
let submitBlogBtn = document.getElementById("submit-blog");


if (location.pathname == "/dashboard.html") {
    var quill = new Quill('#editor', {
        theme: 'snow'
    });
    var quill1 = new Quill('#editor1', {
        theme: 'snow'
    });
    // ==================================================================
    // ======================== SUBMIT BLOG =============================
    // ==================================================================
    submitBlogBtn.addEventListener("click", async () => {

        if (blogTitle.value.trim() === "") {
            alert("tittle not filld")
        } else {
            loader.style.display = "flex";

            console.log(blogTitle.value)
            console.log(quill.root.innerHTML)

            // ===============================================================================
            // ==================================== ADD BLOG FIRESTORE =======================
            // ===============================================================================
            try {
                console.log(auth.currentUser.uid)
                const unsub = onSnapshot(doc(db, "userData", auth.currentUser.uid), async (doc) => {
                    console.log("Current data: ", doc.data().signup_email);
                    console.log("Current data: ", doc.data().signup_user_name);
                    console.log("Current data: ", doc.data().user_uid);

                    const docRef = await addDoc(collection(db, "blogs"), {
                        timestamp: serverTimestamp(),
                        blog_title: blogTitle.value,
                        blog_description: quill.root.innerHTML,
                        user_uid: doc.data().user_uid,
                        user_name: doc.data().signup_user_name,

                    });
                    getBlogData(auth.currentUser.uid)
                    console.log("Document written with ID: ", docRef.id)
                    console.log("ha mai chala");
                    blogTitle.value = "";
                    loader.style.display = "none";
                })
            } catch (e) {
                console.error("Error adding document: ", e);
            }


        }
    })
    // ==============================================================
    // ================================= GET DATA USER BLOG DASHBOARD
    // ==============================================================

}

let upadteID = "";
let editDivShow = document.getElementById("edit-value-show");
let updateBlogTitle = document.getElementById("update-blog-title");

let updateBlog = async (userDocId) => {
    // PASS ID UPDATE DOC ====================
    upadteID = userDocId;
    editDivShow.style.display = "flex";
    console.log(userDocId);

}

let editBlogBtn = document.getElementById("edit-blog");
let editBlog = async () => {
    console.log("edit value id ----->", upadteID)
    console.log(updateBlogTitle.value)
    console.log(quill.root.innerHTML);
    const docRef = doc(db, "blogs", upadteID);
    // UPDATE BLOG TITTLE AND VALUE
    await updateDoc(docRef, {
        blog_description: quill1.root.innerHTML,
        blog_title: updateBlogTitle.value
    });
    editDivShow.style.display = "none";
    getBlogData(auth.currentUser.uid)
}
editBlogBtn && editBlogBtn.addEventListener("click", editBlog)
// ====================================================
// ================ DELETE BLOG  ======================
// ====================================================

let deleteBlog = async (e, deleteId) => {
    console.log(deleteId, "delete Id -------------->");
    console.log(e.parentNode.parentNode, "delete Id -------------->");
    loader.style.display = "flex";
    await deleteDoc(doc(db, "blogs", deleteId));
    // e.parentNode.parentNode.remove();
    getBlogData(auth.currentUser.uid)
    loader.style.display = "none";

    // getBlogData()
}


let closeBtn = document.getElementById("close-btn");
console.log(closeBtn);
closeBtn && closeBtn.addEventListener("click", () => {
    editDivShow.style.display = "none";
    console.log("hello");
}
)

window.updateBlog = updateBlog;
window.deleteBlog = deleteBlog;
