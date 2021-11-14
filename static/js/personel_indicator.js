const filter_belirtecID = document.getElementById("filter_belirtecID")
const filter_belirtectanimi = document.getElementById("filter_belirtectanimi")
const filter_create = document.getElementById("filter_create")
const filter_list = document.getElementById("filter_list")
const item_belirtecID = document.getElementsByClassName("item_belirtecID")
const item_belirtectanimi = document.getElementsByClassName("item_belirtectanimi")
const prev_item_belirtecID = []
const prev_item_belirtectanimi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_belirtecID")
const item_error2 = document.getElementsByClassName("label_item_belirtectanimi")

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    if(filter_belirtecID.value.length == 0){
        filter_belirtecID.setAttribute("style", "border-color:red")
        b = false
    }
    if(filter_belirtectanimi.value.length == 0){
        filter_belirtectanimi.setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_filter(){
    filter_belirtecID.setAttribute("style", "border-color:black")
    filter_belirtectanimi.setAttribute("style", "border-color:black")
}
function mandatory_item(j){
    let b = true
    if(item_belirtecID[j].value.length == 0){
        item_belirtecID[j].setAttribute("style", "border-color:red")
        b = false
    }
    if(item_belirtectanimi[j].value.length == 0){
        item_belirtectanimi[j].setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_item(j){
    item_belirtecID[j].setAttribute("style", "border-color:black")
    item_belirtectanimi[j].setAttribute("style", "border-color:black")
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        reset_filter()
        let send_data = {
            'Type' : 'CREATE',
            'BelirteçID' : filter_belirtecID.value,
            'BelirteçTanımı' : filter_belirtectanimi.value
        }
        fetch('./indicator', {
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
                if(data == "SAME BELIRTECID"){
                    item_error1[0].style.visibility = 'visible'
                }
                else {
                    item_error2[0].style.visibility = 'visible'
                }
            }
            else {
                filter_belirtecID.value = ''
                filter_belirtectanimi.value = ''
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
    for(let i = 0;i < rows.length;i++){
        rows[i].style.visibility = 'hidden'
    }
    item_error1[0].style.visibility = 'hidden'
    item_error2[0].style.visibility = 'hidden'
    reset_filter()
    let send_data = {
        'Type' : 'LIST',
        'BelirteçID' : filter_belirtecID.value,
        'BelirteçTanımı' : filter_belirtectanimi.value,
        'Sayfa' : page
    }
    fetch('./indicator', {
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
        item_belirtecID[i].value = user_dict[i].BelirteçID
        item_belirtecID[i].setAttribute('style','pointer-events:none')
        item_belirtectanimi[i].value = user_dict[i].BelirteçTanımı
        item_belirtectanimi[i].setAttribute('style','pointer-events:none')
        prev_item_belirtecID[i] = item_belirtecID[i].value
        prev_item_belirtectanimi[i] = item_belirtectanimi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_belirtecID[i].setAttribute('style','pointer-events:all')
            item_belirtectanimi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                reset_item(i)
                send_data = {
                    'Satır' : i,
                    'EskiBelirteçID' : prev_item_belirtecID[i],
                    'EskiBelirteçTanımı' : prev_item_belirtectanimi[i],
                    'BelirteçID' : item_belirtecID[i].value,
                    'BelirteçTanımı' : item_belirtectanimi[i].value
                }
                fetch('./indicator', {
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
                    if(data !== 'OK'){
                        if(data == "SAME BELIRTECID"){
                            item_error1[i+1].style.visibility = 'visible'
                        }
                        else {
                            item_error2[i+1].style.visibility = 'visible'
                        } 
                    }
                    else {
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_belirtecID[i].setAttribute('style','pointer-events:none')
                        item_belirtectanimi[i].setAttribute('style','pointer-events:none')
                        prev_item_belirtecID[i] = item_belirtecID[i].value
                        prev_item_belirtectanimi[i] = item_belirtectanimi[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            item_belirtecID[i].value = prev_item_belirtecID[i]
            item_belirtectanimi[i].value = prev_item_belirtectanimi[i]
            item_belirtecID[i].setAttribute('style','pointer-events:none')
            item_belirtectanimi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
            reset_item(i)
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'BelirteçID' : prev_item_belirtecID[i]
        }
        reset_item(i)
        fetch('./indicator', {
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