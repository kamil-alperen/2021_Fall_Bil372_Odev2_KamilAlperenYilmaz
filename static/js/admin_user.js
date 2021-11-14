const filter_username = document.getElementById("filter_username")
const filter_password = document.getElementById("filter_password")
const filter_create = document.getElementById("filter_create")
const filter_list = document.getElementById("filter_list")
const item_username = document.getElementsByClassName("item_username")
const item_password = document.getElementsByClassName("item_password")
const prev_item_username = []
const prev_item_password = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_username")
const item_error2 = document.getElementsByClassName("label_item_password")
let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}
function mandatory_filter(){
    let b = true
    if(filter_username.value.length == 0){
        filter_username.setAttribute("style", "border-color:red")
        b = false
    }
    if(filter_password.value.length == 0){
        filter_password.setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_filter(){
    filter_username.setAttribute("style", "border-color:black")
    filter_password.setAttribute("style", "border-color:black")
}
function mandatory_item(j){
    let b = true
    if(item_username[j].value.length == 0){
        item_username[j].setAttribute("style", "border-color:red")
        b = false
    }
    else {
        item_username[j].setAttribute("style", "border-color:black")
    }
    if(item_password[j].value.length == 0){
        item_password[j].setAttribute("style", "border-color:red")
        b = false
    }
    else {
        item_password[j].setAttribute("style", "border-color:black")
    }
    return b
}
function reset_item(j){
    item_username[j].setAttribute("style", "border-color:black")
    item_password[j].setAttribute("style", "border-color:black")
}
function check_password_filter(){
    let b1 = filter_password.value !== filter_password.value.toLowerCase()
    let b2 = false
    if(filter_password.value.match(/[A-Za-z]/g) !== null){
        b2 = filter_password.value.match(/[A-Za-z]/g).length >= 8
    }
    let b3 = false
    if(filter_password.value.match(/[A-Za-z0-9]/g) !== null){
        b3 = filter_password.value.match(/[A-Za-z0-9]/g).length < filter_password.value.length
    }
    return b1 && b2 && b3
}
function check_password_item(i){
    let b1 = item_password[i].value !== item_password[i].value.toLowerCase()
    let b2 = false
    if(item_password[i].value.match(/[A-Za-z]/g) !== null){
        b2 = item_password[i].value.match(/[A-Za-z]/g).length >= 8
    }
    let b3 = false
    if(item_password[i].value.match(/[A-Za-z0-9]/g) !== null){
        b3 = item_password[i].value.match(/[A-Za-z0-9]/g).length < item_password[i].value.length
    }
    return b1 && b2 && b3
}
filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        reset_filter()
        if(check_password_filter()){
            let send_data = {
                'Type' : 'CREATE',
                'Kullanıcı Adı' : filter_username.value,
                'Şifre' : filter_password.value
            }
            fetch('./user', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(send_data)
            }).then(response => response.json())
            .then(data => {
                console.log('NEW USER CREATED : ' + data);
                item_error1[0].style.visibility = 'hidden'
                item_error2[0].style.visibility = 'hidden'
                if(data !== "OK"){
                    item_error1[0].style.visibility = 'visible'
                    if(data == "SAME USERNAME"){
                        console.log('Başka Kullanıcı Adı ile aynı');
                        item_error1[0].innerHTML = 'Başka Kullanıcı Adı ile aynı'
                    }
                    else if(data == "NO USERNAME"){
                        console.log('Böyle bir kullanıcı adı yok');
                        item_error1[0].innerHTML = 'Böyle bir kullanıcı adı yok'
                    }
                }
                else {
                    console.log('hidden');
                    filter_username.value = ''
                    filter_password.value = ''
                    list_from_zero(1)
                }
            })
        }
        else {
            item_error2[0].style.visibility = 'visible'
            item_error2[0].innerHTML = 'Şifre uygun değil'
        }
    }
})

filter_list.addEventListener("click", (e) => {
    current_page = 1
    list_from_zero(1)
})
function list_from_zero(page){
    reset_filter()
    item_error1[0].style.visibility = 'hidden'
    item_error2[0].style.visibility = 'hidden'
    for(let i = 0;i < rows.length;i++){
        rows[i].style.visibility = 'hidden'
    }
    let send_data = {
        'Type' : 'LIST',
        'Kullanıcı Adı' : filter_username.value,
        'Şifre' : filter_password.value,
        'Sayfa' : page
    }
    fetch('./user', {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
    }).then(response => response.json())
    .then(data => {
        console.log('USERS LISTED : ');
        console.log(data);
        total_record = data[data.length-1]['ToplamKayıt']
        console.log(total_record);
        add_users_to_table(data)
    })
}
function add_users_to_table(user_dict){
    for(let i = 0;i < user_dict.length-1;i++){
        rows[i].style.visibility = 'visible'
        item_username[i].value = user_dict[i].KullanıcıAdı
        item_username[i].setAttribute('style','pointer-events:none')
        item_password[i].value = user_dict[i].Şifre
        item_password[i].setAttribute('style','pointer-events:none')
        prev_item_username[i] = item_username[i].value
        prev_item_password[i] = item_password[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_username[i].setAttribute('style','pointer-events:all')
            item_password[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i) && check_password_item(i)){
                send_data = {
                    'Satır' : i,
                    'Eski Adı' : prev_item_username[i],
                    'Kullanıcı Adı' : item_username[i].value,
                    'Şifre' : item_password[i].value
                }
                fetch('./user', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    item_error1[i+1].style.visibility = 'hidden'
                    item_error2[i+1].style.visibility = 'hidden'
                    console.log('USER UPDATED : ');
                    if(data == 'SAME USERNAME'){
                        console.log('same username');
                        item_error1[i+1].style.visibility = 'visible'
                        item_error1[i+1].innerHTML = 'Başka Kullanıcı Adı ile aynı'
                    }
                    else if(data == "NO USERNAME"){
                        console.log('no username');
                        item_error1[i+1].style.visibility = 'visible'
                        item_error1[i+1].innerHTML = 'Böyle bir Kullanıcı Adı yok'
                    }
                    else {
                        console.log('hidden');
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_username[i].setAttribute('style','pointer-events:none')
                        item_password[i].setAttribute('style','pointer-events:none')
                        prev_item_username[i] = item_username[i].value
                        prev_item_password[i] = item_password[i].value
                    }
                })
            }
            else if(!check_password_item(i)){
                item_error2[i+1].style.visibility = 'visible'
                item_error2[i+1].innerHTML = 'Şifre uygun değil'
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            item_username[i].value = prev_item_username[i]
            item_password[i].value = prev_item_password[i]
            item_username[i].setAttribute('style','pointer-events:none')
            item_password[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        reset_item(i)
        send_data = {
            'Kullanıcı Adı' : prev_item_username[i]
        }
        item_error1[i+1].style.visibility = 'hidden'
        item_error2[i+1].style.visibility = 'hidden'
        fetch('./user', {
            method : 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('USER DELETED : ');
            console.log(data);
            list_from_zero(1)
        })
    })
}

prev_btn.addEventListener("click", (e) => {
    if(current_page !== 1){
        current_page--
        list_from_zero(current_page)
    }
})
next_btn.addEventListener("click", (e) => {
    console.log("Next will work");
    console.log("Totalpage : "+total_record);
    if(current_page < (total_record / 5)){
        console.log("Next working");
        current_page++
        list_from_zero(current_page)
    }
})