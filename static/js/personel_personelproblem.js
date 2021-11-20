const filter_problemID = document.getElementById("filter_problemID")
const filter_kullanıcıAdı = document.getElementById("filter_kullanıcıAdı")
const filter_create = document.getElementById("filter_create")
const filter_list = document.getElementById("filter_list")
const item_problemID = document.getElementsByClassName("item_problemID")
const item_kullanıcıAdı = document.getElementsByClassName("item_kullanıcıAdı")
const prev_item_problemID = []
const prev_item_kullanıcıAdı = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_problemID")
const item_error2 = document.getElementsByClassName("label_item_kullanıcıAdı")

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    if(filter_problemID.value.length == 0){
        filter_problemID.setAttribute("style", "border-color:red")
        b = false
    }
    if(filter_kullanıcıAdı.value.length == 0){
        filter_kullanıcıAdı.setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_filter(){
    filter_problemID.setAttribute("style", "border-color:black")
    filter_kullanıcıAdı.setAttribute("style", "border-color:black")
}
function mandatory_item(j){
    let b = true
    if(item_problemID[j].value.length == 0){
        item_problemID[j].setAttribute("style", "border-color:red")
        b = false
    }
    if(item_kullanıcıAdı[j].value.length == 0){
        item_kullanıcıAdı[j].setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_item(j){
    item_problemID[j].setAttribute("style", "border-color:black")
    item_kullanıcıAdı[j].setAttribute("style", "border-color:black")
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        reset_filter()
        let send_data = {
            'Type' : 'CREATE',
            'ProblemID' : filter_problemID.value,
            'KullanıcıAdı' : filter_kullanıcıAdı.value
        }
        fetch('./personel-problem', {
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
                if(data == "NO PROBLEMID"){
                    item_error1[0].style.visibility = 'visible'
                }
                else if(data == "NO KULLANICIADI"){
                    item_error2[0].style.visibility = 'visible'
                }
            }
            else {
                filter_problemID.value = ''
                filter_kullanıcıAdı.value = ''
                list_from_zero(1)
            }
        })
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
        'ProblemID' : filter_problemID.value,
        'KullanıcıAdı' : filter_kullanıcıAdı.value,
        'Sayfa' : page
    }
    fetch('./personel-problem', {
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
        add_users_to_table(data)
    })
}
function add_users_to_table(user_dict){
    for(let i = 0;i < user_dict.length-1;i++){
        rows[i].style.visibility = 'visible'
        item_problemID[i].value = user_dict[i].ProblemID
        item_problemID[i].setAttribute('style','pointer-events:none')
        item_kullanıcıAdı[i].value = user_dict[i].KullanıcıAdı
        item_kullanıcıAdı[i].setAttribute('style','pointer-events:none')
        prev_item_problemID[i] = item_problemID[i].value
        prev_item_kullanıcıAdı[i] = item_kullanıcıAdı[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_problemID[i].setAttribute('style','pointer-events:all')
            item_kullanıcıAdı[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                reset_item(i)
                send_data = {
                    'Satır' : i,
                    'EskiProblemID' : prev_item_problemID[i],
                    'EskiKullanıcıAdı' : prev_item_kullanıcıAdı[i],
                    'ProblemID' : item_problemID[i].value,
                    'KullanıcıAdı' : item_kullanıcıAdı[i].value
                }
                fetch('./personel-problem', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    item_error1[i+1].style.visibility = 'hidden'
                    item_error2[i+1].style.visibility = 'hidden'
                    if(data != 'OK'){
                        if(data == "NO PROBLEMID"){
                            item_error1[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO KULLANICIADI"){
                            item_error2[i+1].style.visibility = 'visible'
                        }
                    }
                    else {
                        
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_problemID[i].setAttribute('style','pointer-events:none')
                        item_kullanıcıAdı[i].setAttribute('style','pointer-events:none')
                        prev_item_problemID[i] = item_problemID[i].value
                        prev_item_kullanıcıAdı[i] = item_kullanıcıAdı[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            item_problemID[i].value = prev_item_problemID[i]
            item_kullanıcıAdı[i].value = prev_item_kullanıcıAdı[i]
            item_problemID[i].setAttribute('style','pointer-events:none')
            item_kullanıcıAdı[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'ProblemID' : prev_item_problemID[i],
            'KullanıcıAdı' : prev_item_kullanıcıAdı[i],
        }
        reset_item(i)
        fetch('./personel-problem', {
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