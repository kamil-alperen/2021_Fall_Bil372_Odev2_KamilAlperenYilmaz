const filter_sınıfID = document.getElementById("filter_sınıfID")
const filter_Sınıfadi = document.getElementById("filter_Sınıfadi")
const filter_sınıftipi = document.getElementById("filter_sınıftipi")
const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")
const item_sınıfID = document.getElementsByClassName("item_sınıfID")
const item_Sınıfadi = document.getElementsByClassName("item_Sınıfadi")
const item_sınıftipi = document.getElementsByClassName("item_sınıftipi")
const prev_item_sınıfID = []
const prev_item_Sınıfadi = []
const prev_item_sınıftipi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_sınıfID")
const item_error2 = document.getElementsByClassName("label_item_Sınıfadi")
const item_error3 = document.getElementsByClassName("label_item_sınıftipi")[0]

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

let filter_list = [];
filter_list[0] = filter_sınıfID
filter_list[1] = filter_Sınıfadi
filter_list[2] = filter_sınıftipi

let item_list = [];
item_list[0] = item_sınıfID
item_list[1] = item_Sınıfadi
item_list[2] = item_sınıftipi

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    for(let i = 0;i < filter_list.length-1;i++){
        if(i == 10){
            continue
        }
        if(filter_list[i].value.length == 0){
            filter_list[i].setAttribute("style","border-color:red")
            b = false
        }
        else {
            filter_list[i].setAttribute("style","border-color:black")
        }
    }
    if(!(filter_sınıftipi.value == 0 || filter_sınıftipi.value == 1)){
        b = false
        filter_sınıftipi.setAttribute("style", "border-color:red")
    }
    else {
        filter_sınıftipi.setAttribute("style", "border-color:black")
    }
    return b
}
function reset_filter(){
    for(let i = 0;i < filter_list.length-1;i++){
       filter_list[i].setAttribute("style","border-color:black")
    }
}
function mandatory_item(j){
    let b = true
    for(let i = 0;i < item_list.length-1;i++){
        if(i == 10){
            continue
        }
        if(item_list[i][j].value.length == 0){
            item_list[i][j].setAttribute("style","border-color:red")
            b = false
        }
        else {
            item_list[i][j].setAttribute("style","border-color:black")
        }
    }
    return b
}
function reset_item(j){
    for(let i = 0;i < item_list.length-1;i++){
        item_list[i][j].setAttribute("style","border-color:black")
    }
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        let send_data = {
            'Type' : 'CREATE',
            'SınıfID' : filter_sınıfID.value,
            'SınıfAdı' : filter_Sınıfadi.value,
            'SınıfTipi' : filter_sınıftipi.value == 1
        }
        fetch('./class', {
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
                if(data == "SAME SINIFID"){
                    item_error1[0].style.visibility = 'visible'
                }
                else{
                    item_error2[0].style.visibility = 'visible'
                }
            }
            else {
                filter_sınıfID.value = ''
                filter_Sınıfadi.value = ''
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
    reset_filter()
    item_error1[0].style.visibility = 'hidden'
    item_error2[0].style.visibility = 'hidden'
    let send_data = {
        'Type' : 'LIST',
        'SınıfID' : filter_sınıfID.value,
        'SınıfAdı' : filter_Sınıfadi.value,
        'SınıfTipi' : filter_sınıftipi.value == 1,
        'TümSınıfTipleri' : filter_sınıftipi.value == 2,
        'Sayfa' : page
    }
    fetch('./class', {
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
        item_sınıfID[i].value = user_dict[i].SınıfID
        item_sınıfID[i].setAttribute('style','pointer-events:none')
        item_Sınıfadi[i].value = user_dict[i].SınıfAdı
        item_Sınıfadi[i].setAttribute('style','pointer-events:none')
        item_sınıftipi[i].value = user_dict[i].SınıfTipi ? 1 : 0
        item_sınıftipi[i].setAttribute('style','pointer-events:none')
        prev_item_sınıfID[i] = item_sınıfID[i].value
        prev_item_Sınıfadi[i] = item_Sınıfadi[i].value
        prev_item_sınıftipi[i] = item_sınıftipi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_sınıfID[i].setAttribute('style','pointer-events:all')
            item_Sınıfadi[i].setAttribute('style','pointer-events:all')
            item_sınıftipi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                send_data = {
                    'Satır' : i,
                    'EskiSınıfID' : prev_item_sınıfID[i],
                    'EskiSınıfAdı' : prev_item_Sınıfadi[i],
                    'SınıfID' : item_sınıfID[i].value,
                    'SınıfAdı' : item_Sınıfadi[i].value,
                    'SınıfTipi' : item_sınıftipi[i].value == 1
                }
                fetch('./class', {
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
                    if(data != "OK"){
                        if(data == "SAME SINIFID"){
                            item_error1[i+1].style.visibility = 'visible'
                        }
                        else{
                            item_error2[i+1].style.visibility = 'visible'
                        }
                    }
                    else {
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_sınıfID[i].setAttribute('style','pointer-events:none')
                        item_Sınıfadi[i].setAttribute('style','pointer-events:none')
                        item_sınıftipi[i].setAttribute('style','pointer-events:none')
                        prev_item_sınıfID[i] = item_sınıfID[i].value
                        prev_item_Sınıfadi[i] = item_Sınıfadi[i].value
                        prev_item_sınıftipi[i] = item_sınıftipi[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            item_sınıfID[i].value = prev_item_sınıfID[i]
            item_Sınıfadi[i].value = prev_item_Sınıfadi[i]
            item_sınıftipi[i].value = prev_item_sınıftipi[i]
            item_sınıfID[i].setAttribute('style','pointer-events:none')
            item_Sınıfadi[i].setAttribute('style','pointer-events:none')
            item_sınıftipi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'SınıfID' : prev_item_sınıfID[i],
            'SınıfAdı' : prev_item_Sınıfadi[i]
        }
        reset_item(i)
        fetch('./class', {
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
    if(current_page < (total_record / 5)){
        current_page++
        list_from_zero(current_page)
    }
})