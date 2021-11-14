const filter_aktiviteID = document.getElementById("filter_aktiviteID")
const filter_aktiviteadi = document.getElementById("filter_aktiviteadi")
const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")
const item_aktiviteID = document.getElementsByClassName("item_aktiviteID")
const item_aktiviteadi = document.getElementsByClassName("item_aktiviteadi")
const prev_item_aktiviteID = []
const prev_item_aktiviteadi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_aktiviteID")
const item_error2 = document.getElementsByClassName("label_item_aktiviteadi")

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    if(filter_aktiviteID.value.length == 0){
        filter_aktiviteID.setAttribute("style", "border-color:red")
        b = false
    }
    if(filter_aktiviteadi.value.length == 0){
        filter_aktiviteadi.setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_filter(){
    filter_aktiviteID.setAttribute("style", "border-color:black")
    filter_aktiviteadi.setAttribute("style", "border-color:black")
}
function mandatory_item(j){
    let b = true
    if(item_aktiviteID[j].value.length == 0){
        item_aktiviteID[j].setAttribute("style", "border-color:red")
        b = false
    }
    if(item_aktiviteadi[j].value.length == 0){
        item_aktiviteadi[j].setAttribute("style", "border-color:red")
        b = false
    }
    return b
}
function reset_item(j){
    item_aktiviteID[j].setAttribute("style", "border-color:black")
    item_aktiviteadi[j].setAttribute("style", "border-color:black")
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        reset_filter()
        let send_data = {
            'Type' : 'CREATE',
            'AktiviteID' : filter_aktiviteID.value,
            'AktiviteAdı' : filter_aktiviteadi.value
        }
        fetch('./activity', {
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
                if(data == "SAME ACTIVITEID"){
                    item_error1[0].style.visibility = 'visible'
                }
                else {
                    item_error2[0].style.visibility = 'visible'
                }
            }
            else {
                filter_aktiviteID.value = ''
                filter_aktiviteadi.value = ''
                list_from_zero(1)
            }
        })
    }
})

filter_list_btn.addEventListener("click", (e) => {
    current_page = 1
    list_from_zero(1)
})
function list_from_zero(page){
    for(let i = 0;i < rows.length;i++){
        rows[i].style.visibility = 'hidden'
    }
    let send_data = {
        'Type' : 'LIST',
        'AktiviteID' : filter_aktiviteID.value,
        'AktiviteAdı' : filter_aktiviteadi.value,
        'Sayfa' : page
    }
    reset_filter()
    item_error1[0].style.visibility = 'hidden'
    item_error2[0].style.visibility = 'hidden'
    fetch('./activity', {
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
        item_aktiviteID[i].value = user_dict[i].AktiviteID
        item_aktiviteID[i].setAttribute('style','pointer-events:none')
        item_aktiviteadi[i].value = user_dict[i].AktiviteTanımı
        item_aktiviteadi[i].setAttribute('style','pointer-events:none')
        prev_item_aktiviteID[i] = item_aktiviteID[i].value
        prev_item_aktiviteadi[i] = item_aktiviteadi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_aktiviteID[i].setAttribute('style','pointer-events:all')
            item_aktiviteadi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                reset_item(i)
                send_data = {
                    'Satır' : i,
                    'EskiAktiviteID' : prev_item_aktiviteID[i],
                    'EskiAktiviteAdı' : prev_item_aktiviteadi[i],
                    'AktiviteID' : item_aktiviteID[i].value,
                    'AktiviteAdı' : item_aktiviteadi[i].value
                }
                fetch('./activity', {
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
                        if(data == "SAME ACTIVITEID"){
                            item_error1[i+1].style.visibility = 'visible'
                        }
                        else {
                            item_error2[i+1].style.visibility = 'visible'
                        }   
                    }
                    else {
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_aktiviteID[i].setAttribute('style','pointer-events:none')
                        item_aktiviteadi[i].setAttribute('style','pointer-events:none')
                        prev_item_aktiviteID[i] = item_aktiviteID[i].value
                        prev_item_aktiviteadi[i] = item_aktiviteadi[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            item_aktiviteID[i].value = prev_item_aktiviteID[i]
            item_aktiviteadi[i].value = prev_item_aktiviteadi[i]
            item_aktiviteID[i].setAttribute('style','pointer-events:none')
            item_aktiviteadi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'AktiviteID' : prev_item_aktiviteID[i]
        }
        reset_item(i)
        fetch('./activity', {
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