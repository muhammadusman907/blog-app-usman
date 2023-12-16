import {
    getAuth, createUserWithEmailAndPassword, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    db, getFirestore, collection, addDoc, doc, onSnapshot, setDoc, getDoc, query, where
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

let getBlogData = (uid) => {
    console.log(uid)
    let id = uid;
    const q = query(collection(db, "blogs"), where("user_uid", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(change.doc.data())
            dashboardAddBlog.innerHTML += `
                
              <div class="flex bg-white shadow-lg rounded-lg mx-4 md:mx-auto mt-4 max-w-md md:max-w-2xl ">
              <div class="flex bg-white items-start px-4 py-6 w-[100%] border-2 ">
                 <img class="w-12 h-12 rounded-full object-cover mr-4 shadow" src="https://images.unsplash.com/photo-1542156822-6924d1a71ace?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="avatar">
                 <div class=" w-[100%]">
                    <div class="flex items-center justify-between w-[100%]">
                       <h2 class="text-lg -mt-1 font-bold">${change.doc.data().user_name}  </h2>
                       <small class="text-sm text-gray-700">22h ago</small>
                       <p class="text-gray-700">Joined 12 SEP 2012. </p>
                       </div>
                    
                    <h1 class="font-bold text-2xl">${change.doc.data().blog_title}</h1>
                    <p class="mt-3 text-gray-700 text-sm">
                    ${change.doc.data().blog_description}
                    </p>
                   
                 </div>
              </div>
           </div>








             `
        });
    });

}
// getBlogData()
onAuthStateChanged(auth, (user) => {
    console.log(location.pathname)

    //  ========================
    //  2 : CHECK CONDITON  
    console.log(user)
    getBlogData(user.uid)
    const docRef = doc(db, "userData", auth.currentUser.uid);
    let profilePage = async () => {


        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data().user_uid);

            if (user && docSnap.data().user_uid) {
                const uid = user.uid;
                //  CHANGE LOCATION 
                //  debugger
                if (location.pathname !== "/profile.html" && location.pathname !== "/dashboard.html") {
                    location.href = "./profile.html";

                }
                else if (location.pathname == "/profile.html") {
                    console.log(profileUsername)
                    profileUsername.innerHTML = docSnap.data().signup_user_name;
                    profileEmail.innerHTML = docSnap.data().signup_email;
                    console.log("Current data------>: ", docSnap.data());
                }
                // console.log(uid)
            } else {
                if (location.pathname !== "/login.html" &&
                    location.pathname !== "/signup.html" &&
                    location.pathname !== "/dashboard.html"
                ) {
                    window.location.href = "./login.html"
                }
                // User is signed out
                // ...
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }
    profilePage()
});

// =====================================================================
// ====================================== Logout =======================
// =====================================================================
let logOutBtn = document.getElementById("logout-btn");
logOutBtn && logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        location.href = "./login.html";
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
    // ==================================================================
    // ======================== SUBMIT BLOG =============================
    // ==================================================================
    submitBlogBtn.addEventListener("click", async () => {
        if (blogTitle.value.trim() === "") {
            alert("tittle not filld")
        } else {
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
                        blog_title: blogTitle.value,
                        blog_description: quill.root.innerHTML,
                        user_uid: doc.data().user_uid,
                        user_name: doc.data().signup_user_name
                    });
                    console.log("Document written with ID: ", docRef.id)
                    getBlogData()
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
