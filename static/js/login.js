const username = document.getElementById("username")
const password = document.getElementById("password")
const username_info = document.getElementById("username_info")
const password_info = document.getElementById("password_info")
const clearBtn = document.getElementById("clear")
const submitBtn = document.getElementById("submit")

clearBtn.addEventListener("click", (e) => {
    username.value = null
    password.value = null
    
})

submitBtn.addEventListener("click", (e) => {
    b1 = password.value !== password.value.toLowerCase()
    let b2 = false
    if(password.value.match(/[A-Za-z]/g) !== null){
        b2 = password.value.match(/[A-Za-z]/g).length >= 8
    }
    b3 = false
    if(password.value.match(/[A-Za-z0-9]/g) !== null){
        b3 = password.value.match(/[A-Za-z0-9]/g).length < password.value.length
    }
    if(username.value === ""){
        username_info.textContent = "Kullanıcı adı zorunludur"
        username_info.style.visibility = 'visible'
    }
    if(password.value === ""){
        password_info.textContent = "Şifre alanı zorunludur"
        password_info.style.visibility = 'visible'
    }
    else if(!b1){
        password_info.textContent = "Şifre büyük harf içermelidir"
        password_info.style.visibility = 'visible'
    }
    else if(!b2){
        password_info.textContent = "Şifre en az 8 harf içermelidir"
        password_info.style.visibility = 'visible'
    }
    else if(!b3){
        password_info.textContent = "Şifre noktalama işareti içermeli"
        password_info.style.visibility = 'visible'
    }
    else {
        let send_data = {
            Username : username.value,
            Password : password.value
        }
        
        fetch('./', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            if(data.User !== "NO_RECORD"){
                if(data.User === "system_admin"){
                    location.replace('./admin/')
                }
                else {
                    location.replace('./personel/')
                }
            }
            else {
                console.log("Wrong Username or password");
                username_info.textContent = "Kullanıcı adı veya şifre hatalıdır"
                password_info.textContent = "Kullanıcı adı veya şifre hatalıdır"
                username_info.style.visibility = 'visible'
                password_info.style.visibility = 'visible'
            }
        })
    }
   
})