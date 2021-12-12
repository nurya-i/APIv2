const urlBase = "http://localhost:8000";
const modalLogin = document.getElementById("modalLogin");
const bsModalLogin = new bootstrap.Modal(modalLogin, (backdrop = "static"));
const modalRegister = document.getElementById("modalRegister");
const bsModalRegister = new bootstrap.Modal(
  modalRegister,
  (backdrop = "static")
);

const btnModalRegister = document.getElementById("btnModalRegister");
const btnModalLogin = document.getElementById("btnModalLogin");
const btnLogoff = document.getElementById("btnLogoff");

const nRegister = document.getElementById("nRegister");
const allArticles = document.getElementById("allArticles");

nRegister.addEventListener("click", () => {
  bsModalLogin.hide();
  callRegisterModal();
});

modalLogin.addEventListener("shown.bs.modal", () => {
  document.getElementById("emailLogin").focus();
});

btnModalLogin.addEventListener("click", () => {
  bsModalLogin.show();
});

btnModalRegister.addEventListener("click", () => {
  callRegisterModal();
});

function callRegisterModal() {
  document.getElementById("btnSubmitRegister").style.display = "block";
  document.getElementById("btnCancelRegister").innerHTML = "Cancel";
  bsModalRegister.show();
}

btnLogoff.addEventListener("click", () => {
  localStorage.removeItem("token");
  document.getElementById("btnLogoff").style.display = "none";
  window.location.replace("index.html");
});

function validateRegister() {
  let email = document.getElementById("emailRegister").value; 
  let pwd = document.getElementById("pwdRegister").value; 
  
  if (pwd.length < 6) {
    document.getElementById("pwdLoginError").innerHTML =
      "Your password must have at least 6 characters!";
    return;
  }
  const statReg = document.getElementById("registerStatus");
  fetch(`${urlBase}/api/register`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `email=${email}&password=${pwd}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        error = response.statusText;
        statReg.innerHTML = response.statusText;
        throw new Error(error);
      }
      result = await response.json();
      console.log(result.message);
      statReg.innerHTML = result.message;
      document.getElementById("btnSubmitRegister").style.display = "none";
      document.getElementById("btnCancelRegister").innerHTML = "Close this box";
    })
    .catch((error) => {
      document.getElementById(
        "registerStatus"
      ).innerHTML = `Request failed: ${error}`;
    });
}

function validateLogin() {
  let email = document.getElementById("emailLogin").value; 
  let pwd = document.getElementById("pwdLogin").value; 
  if (pwd.length < 6) {
    document.getElementById("pwdLoginError").innerHTML =
      "Your password must have at least 6 characters";
    return;
  }
  const loginStatus = document.getElementById("loginStatus");

  fetch(`${urlBase}/api/login`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", 
    body: `email=${email}&password=${pwd}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        error = await response.json();
        throw new Error(error.msg);
      }
      result = await response.json();
      console.log(result.accessToken);
      const token = result.accessToken;
      localStorage.setItem("token", token);
      document.getElementById("loginStatus").innerHTML = "Sucess!";
      document.getElementById("btnLoginClose").click();
    })
    .catch(async (error) => {
      loginStatus.innerHTML = error;
    });
}



async function showFeed() {
  const showAll = document.getElementById("feed");
  
  
    if (showAll.style.display === "none" || showAll.style.display === "") {
    showAll.style.display = "block";
    fetch(urlBase + "/articles")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((article) => {
          const feedDisplay = document.querySelector("#feed");
          const articleItem =
            `<div><h3>` +
            article.title +
            `</h3><a href=` +
            article.url +
            `>` +
            article.url + `</a></div>`;
          feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
      })
      .catch((err) => console.log(err));
    
  } else {
    showAll.style.display = "none";
  }
}

function showCNN() {
  const showAll = document.getElementById("cnn");
  if (showAll.style.display === "none" || showAll.style.display === "") {
    showAll.style.display = "block";
    fetch(urlBase + "/articles/cnntravel")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((article) => {
          const feedDisplay = document.querySelector("#cnn");
          const articleItem =
            `<div><h3>` +
            article.title +
            `</h3><a href=` +
            article.url +
            `>` +
            article.url + `</a></div>`;
          feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
      })
      .catch((err) => console.log(err));
    
  } else {
    showAll.style.display = "none";
  }
}

function showEBD() {
  const showAll = document.getElementById("ebd");
  if (showAll.style.display === "none" || showAll.style.display === "") {
    showAll.style.display = "block";
    fetch(urlBase + "/articles/europeanbestdestinations")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((article) => {
          const feedDisplay = document.querySelector("#ebd");
          const articleItem =
            `<div><h3>` +
            article.title +
            `</h3><a href=` +
            article.url +
            `>` +
            article.url + `</a></div>`;
          feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
      })
      .catch((err) => console.log(err));
    
  } else {
    showAll.style.display = "none";
  }
}

function showBBC() {
  const showAll = document.getElementById("bbc");
  if (showAll.style.display === "none" || showAll.style.display === "") {
    showAll.style.display = "block";
    fetch(urlBase + "/articles/bbctravel")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((article) => {
          const feedDisplay = document.querySelector("#bbc");
          const articleItem =
            `<div><h3>` +
            article.title +
            `</h3><a href=` +
            article.url +
            `>` +
            article.url + `</a></div>`;
          feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
      })
      .catch((err) => console.log(err));
    
  } else {
    showAll.style.display = "none";
  }
}

function showPlanetware() {
  const showAll = document.getElementById("planetware");
  if (showAll.style.display === "none" || showAll.style.display === "") {
    showAll.style.display = "block";
    fetch(urlBase + "/articles/planetware")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((article) => {
          const feedDisplay = document.querySelector("#planetware");
          const articleItem =
            `<div><h3>` +
            article.title +
            `</h3><a href=` +
            article.url +
            `>` +
            article.url + `</a></div>`;
          feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
      })
      .catch((err) => console.log(err));
    
  } else {
    showAll.style.display = "none";
  }
}

function showITS() {
  const showAll = document.getElementById("its");
  if (showAll.style.display === "none" || showAll.style.display === "") {
    showAll.style.display = "block";
    fetch(urlBase + "/articles/its")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((article) => {
          const feedDisplay = document.querySelector("#its");
          const articleItem =
            `<div><h3>` +
            article.title +
            `</h3><a href=` +
            article.url +
            `>` +
            article.url + `</a></div>`;
          feedDisplay.insertAdjacentHTML("beforeend", articleItem);
        });
      })
      .catch((err) => console.log(err));
    
  } else {
    showAll.style.display = "none";
  }
}

const buttons = document.querySelectorAll("[data-carousel-button]")
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1
    const slides = button.closest("[data-carousel]").querySelector("[data-slides]")

    const activeSlide = slides.querySelector("[data-active]")
    let newIndex = [...slides.children].indexOf(activeSlide) + offset

    if (newIndex < 0) newIndex = slides.children.length -1
    if (newIndex >= slides.children.length) newIndex = 0

    slides.children[newIndex].dataset.active = true
    delete activeSlide.dataset.active
  })
})
