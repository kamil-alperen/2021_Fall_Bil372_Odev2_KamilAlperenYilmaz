const filter_ilkodu = document.getElementById("filter_ilkodu")
const filter_iladi = document.getElementById("filter_iladi")
const filter_create = document.getElementById("filter_create")
const filter_list = document.getElementById("filter_list")
const item_ilkodu = document.getElementsByClassName("item_ilkodu")
const item_iladi = document.getElementsByClassName("item_iladi")
const prev_item_ilkodu = []
const prev_item_iladi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error = document.getElementsByClassName("label_item_ilkodu")

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    if(filter_ilkodu.value.length == 0){
        filter_ilkodu.setAttribute("style", "border-color:red")
        b = false
    }
    if(filter_iladi.value.length == 0){
        filter_iladi.setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_filter(){
    filter_ilkodu.setAttribute("style", "border-color:black")
    filter_iladi.setAttribute("style", "border-color:black")
}
function mandatory_item(j){
    let b = true
    if(item_ilkodu[j].value.length == 0){
        item_ilkodu[j].setAttribute("style", "border-color:red")
        b = false
    }
    if(item_iladi[j].value.length == 0){
        item_iladi[j].setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_item(j){
    item_ilkodu[j].setAttribute("style", "border-color:black")
    item_iladi[j].setAttribute("style", "border-color:black")
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        reset_filter()
        let send_data = {
            'Type' : 'CREATE',
            'İlKodu' : filter_ilkodu.value,
            'İlAdı' : filter_iladi.value
        }
        fetch('./city', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('NEW USER CREATED : ' + data);
            item_error[0].style.visibility = 'hidden'
            if(data !== "OK"){
                item_error[0].style.visibility = 'visible'
            }
            else {
                filter_ilkodu.value = ''
                filter_iladi.value = ''
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
    item_error[0].style.visibility = 'hidden'
    for(let i = 0;i < rows.length;i++){
        rows[i].style.visibility = 'hidden'
    }
    let send_data = {
        'Type' : 'LIST',
        'İlKodu' : filter_ilkodu.value,
        'İlAdı' : filter_iladi.value,
        'Sayfa' : page
    }
    fetch('./city', {
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
        item_ilkodu[i].value = user_dict[i].İlKodu
        item_ilkodu[i].setAttribute('style','pointer-events:none')
        item_iladi[i].value = user_dict[i].İlAdı
        item_iladi[i].setAttribute('style','pointer-events:none')
        prev_item_ilkodu[i] = item_ilkodu[i].value
        prev_item_iladi[i] = item_iladi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_ilkodu[i].setAttribute('style','pointer-events:all')
            item_iladi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                reset_item(i)
                send_data = {
                    'Satır' : i,
                    'EskiİlKodu' : prev_item_ilkodu[i],
                    'İlKodu' : item_ilkodu[i].value,
                    'İlAdı' : item_iladi[i].value
                }
                fetch('./city', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    console.log(data);
                    if(data === 'SAME USERNAME'){
                        item_error[i+1].style.visibility = 'visible'
                    }
                    else {
                        item_error[i+1].style.visibility = 'hidden'
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_ilkodu[i].setAttribute('style','pointer-events:none')
                        item_iladi[i].setAttribute('style','pointer-events:none')
                        prev_item_ilkodu[i] = item_ilkodu[i].value
                        prev_item_iladi[i] = item_iladi[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            item_ilkodu[i].value = prev_item_ilkodu[i]
            item_iladi[i].value = prev_item_iladi[i]
            item_ilkodu[i].setAttribute('style','pointer-events:none')
            item_iladi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error[i+1].style.visibility = 'hidden'
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'İlKodu' : prev_item_ilkodu[i]
        }
        reset_item(i)
        fetch('./city', {
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