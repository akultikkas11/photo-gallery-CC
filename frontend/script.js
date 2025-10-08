// const uploadForm = document.getElementById('uploadForm');
// const galleryDiv = document.getElementById('gallery');

// uploadForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const formData = new FormData(uploadForm);

//   await fetch('http://localhost:3000/upload', {
//     method: 'POST',
//     body: formData
//   });

//   uploadForm.reset();
//   loadGallery();
// });

// async function loadGallery() {
//   galleryDiv.innerHTML = '';
//   const res = await fetch('http://localhost:3000/photos');
//   const photos = await res.json();

//   photos.forEach(photo => {
//     const container = document.createElement('div');
//     container.classList.add('photo-card');

//     const title = document.createElement('h3');
//     title.textContent = photo.title;

//     const desc = document.createElement('p');
//     desc.textContent = photo.description;

//     const img = document.createElement('img');
//     img.src = `http://localhost:3000/uploads/${photo.filename}`;
//     img.alt = photo.title;
//     img.width = 300;

//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = 'Delete';
//     deleteBtn.onclick = async () => {
//       if (confirm('Are you sure you want to delete this photo?')) {
//         await fetch(`http://localhost:3000/photos/${photo.id}`, {
//           method: 'DELETE'
//         });
//         loadGallery(); // Refresh gallery
//       }
//     };

//     container.appendChild(title);
//     container.appendChild(desc);
//     container.appendChild(img);
//     container.appendChild(deleteBtn);

//     galleryDiv.appendChild(container);
//   });
// }


// loadGallery();

// 2 ======================================================================

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const uploadForm = document.getElementById('uploadForm');
const galleryDiv = document.getElementById('gallery');
const authSection = document.getElementById('authSection');
const gallerySection = document.getElementById('gallerySection');

// ✅ NEW: Create container for all photos
const allPhotosDiv = document.createElement('div');
allPhotosDiv.id = 'allPhotos';
gallerySection.appendChild(document.createElement('hr'));
const allPhotosTitle = document.createElement('h2');
allPhotosTitle.textContent = "All Uploaded Photos:";
gallerySection.appendChild(allPhotosTitle);
gallerySection.appendChild(allPhotosDiv);

// Helper to get userId from localStorage
function getUserId() {
  return localStorage.getItem('userId');
}

// Show/hide sections based on login
function updateUI() {
  if (getUserId()) {
    authSection.style.display = 'none';
    gallerySection.style.display = 'block';
    loadGallery();
    loadAllPhotos(); // ✅ NEW: load all photos after login
  } else {
    authSection.style.display = 'block';
    gallerySection.style.display = 'none';
  }
}

// Register
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);

  const res = await fetch('http://51.21.224.100:3000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.get('email'),
      password: formData.get('password')
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registered successfully!');
    localStorage.setItem('userId', data.userId);
    updateUI();
  } else {
    alert(data.error || 'Registration failed');
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);

  // const res = await fetch('http://localhost:3000/login', {
  const res = await fetch('http://51.21.224.100:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.get('email'),
      password: formData.get('password')
    })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('userId', data.userId);
    updateUI();
  } else {
    alert(data.error || 'Login failed');
  }
});

// Upload
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = getUserId();
  if (!userId) return;

  const formData = new FormData(uploadForm);
  formData.append('userId', userId);

  // const res = await fetch('http://localhost:3000/upload', {
  const res = await fetch('http://51.21.224.100:3000/register', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    alert('Photo uploaded!');
    uploadForm.reset();
    loadGallery();
    loadAllPhotos(); // ✅ reload all photos too
  } else {
    alert(data.error || 'Upload failed');
  }
});

// Load user’s photos
async function loadGallery() {
  const userId = getUserId();
  if (!userId) return;

  galleryDiv.innerHTML = '';
  // const res = await fetch(`http://localhost:3000/my-photos/${userId}`);
  const res = await fetch(`http://51.21.224.100:3000/my-photos/${userId}`);
  const photos = await res.json();

  photos.forEach(photo => {
    const container = document.createElement('div');
    container.classList.add('photo-card');

    const img = document.createElement('img');
    // img.src = `http://localhost:3000/uploads/${photo.filename}`;
    img.src = `http://51.21.224.100:3000/uploads/${photo.filename}`;
    img.width = 300;

    const title = document.createElement('h3');
    title.textContent = photo.title;

    const desc = document.createElement('p');
    desc.textContent = photo.description;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = async () => {
      if (confirm('Delete this photo?')) {
        // await fetch(`http://localhost:3000/photos/${photo.id}`, {
        await fetch(`http://51.21.224.100:3000/photos/${photo.id}`, {
          method: 'DELETE'
        });
        loadGallery();
        loadAllPhotos(); // ✅ also refresh the all-photos list
      }
    };

    container.appendChild(title);
    container.appendChild(desc);
    container.appendChild(img);
    container.appendChild(deleteBtn);
    galleryDiv.appendChild(container);
  });
}

// ✅ NEW: Load all photos (visible to all logged-in users)
async function loadAllPhotos() {
  allPhotosDiv.innerHTML = '';
  // const res = await fetch('http://localhost:3000/photos');
  const res = await fetch('http://51.21.224.100:3000/photos');
  const photos = await res.json();

  photos.forEach(photo => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    // img.src = `http://localhost:3000/uploads/${photo.filename}`;
    img.src = `http://51.21.224.100:3000/uploads/${photo.filename}`;
    img.width = 250;

    const title = document.createElement('h4');
    title.textContent = photo.title;

    const desc = document.createElement('p');
    desc.textContent = photo.description;

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(img);
    allPhotosDiv.appendChild(card);
  });
}

// Logout
function logout() {
  localStorage.removeItem('userId');
  updateUI();
}

updateUI();


// 3=================================================================================
// const registerForm = document.getElementById('registerForm');
// const loginForm = document.getElementById('loginForm');
// const uploadForm = document.getElementById('uploadForm');
// const galleryDiv = document.getElementById('gallery');
// const authSection = document.getElementById('authSection');
// const gallerySection = document.getElementById('gallerySection');

// // TAB SWITCHING
// function showTab(tab) {
//   const loginTab = document.getElementById('loginTab');
//   const registerTab = document.getElementById('registerTab');
//   const buttons = document.querySelectorAll('.tab-button');

//   if (tab === 'login') {
//     loginTab.style.display = 'block';
//     registerTab.style.display = 'none';
//   } else {
//     loginTab.style.display = 'none';
//     registerTab.style.display = 'block';
//   }

//   buttons.forEach(btn => btn.classList.remove('active'));
//   document.querySelector(`.tab-button[onclick="showTab('${tab}')"]`).classList.add('active');
// }

// // Get user ID from localStorage
// function getUserId() {
//   return localStorage.getItem('userId');
// }

// // Update UI based on login state
// function updateUI() {
//   if (getUserId()) {
//     authSection.style.display = 'none';
//     gallerySection.style.display = 'block';
//     loadGallery();
//   } else {
//     authSection.style.display = 'block';
//     gallerySection.style.display = 'none';
//   }
// }

// // Register
// registerForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const formData = new FormData(registerForm);

//   const res = await fetch('http://localhost:3000/register', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       email: formData.get('email'),
//       password: formData.get('password')
//     })
//   });

//   const data = await res.json();
//   if (res.ok) {
//     alert('Registered successfully!');
//     localStorage.setItem('userId', data.userId);
//     updateUI();
//   } else {
//     alert(data.error || 'Registration failed');
//   }
// });

// // Login
// loginForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const formData = new FormData(loginForm);

//   const res = await fetch('http://localhost:3000/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       email: formData.get('email'),
//       password: formData.get('password')
//     })
//   });

//   const data = await res.json();
//   if (res.ok) {
//     localStorage.setItem('userId', data.userId);
//     updateUI();
//   } else {
//     alert(data.error || 'Login failed');
//   }
// });

// // Upload Photo
// uploadForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const userId = getUserId();
//   if (!userId) return;

//   const formData = new FormData(uploadForm);
//   formData.append('userId', userId);

//   const res = await fetch('http://localhost:3000/upload', {
//     method: 'POST',
//     body: formData
//   });

//   const data = await res.json();
//   if (res.ok) {
//     alert('Photo uploaded!');
//     uploadForm.reset();
//     loadGallery();
//   } else {
//     alert(data.error || 'Upload failed');
//   }
// });

// // Load gallery
// async function loadGallery() {
//   const userId = getUserId();
//   if (!userId) return;

//   galleryDiv.innerHTML = '';
//   const res = await fetch(`http://localhost:3000/my-photos/${userId}`);
//   const photos = await res.json();

//   photos.forEach(photo => {
//     const container = document.createElement('div');
//     container.classList.add('photo-card');

//     const img = document.createElement('img');
//     img.src = `http://localhost:3000/uploads/${photo.filename}`;
//     img.width = 300;

//     const title = document.createElement('h3');
//     title.textContent = photo.title;

//     const desc = document.createElement('p');
//     desc.textContent = photo.description;

//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = 'Delete';
//     deleteBtn.onclick = async () => {
//       if (confirm('Delete this photo?')) {
//         await fetch(`http://localhost:3000/photos/${photo.id}`, {
//           method: 'DELETE'
//         });
//         loadGallery();
//       }
//     };

//     container.appendChild(title);
//     container.appendChild(desc);
//     container.appendChild(img);
//     container.appendChild(deleteBtn);
//     galleryDiv.appendChild(container);
//   });
// }

// // Logout
// function logout() {
//   localStorage.removeItem('userId');
//   updateUI();
// }

// // Initial UI update
// updateUI();
// showTab('login'); // Default tab
