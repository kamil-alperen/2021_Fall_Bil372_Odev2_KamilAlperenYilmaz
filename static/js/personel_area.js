const filter_alanID = document.getElementById("filter_alanID")
const filter_alanadi = document.getElementById("filter_alanadi")
const filter_alantipi = document.getElementById("filter_alantipi")
const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")
const item_alanID = document.getElementsByClassName("item_alanID")
const item_alanadi = document.getElementsByClassName("item_alanadi")
const item_alantipi = document.getElementsByClassName("item_alantipi")
const prev_item_alanID = []
const prev_item_alanadi = []
const prev_item_alantipi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_alanID")
const item_error2 = document.getElementsByClassName("label_item_alanadi")
const item_error3 = document.getElementsByClassName("label_item_alantipi")[0]

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

let filter_list = [];
filter_list[0] = filter_alanID
filter_list[1] = filter_alanadi
filter_list[2] = filter_alantipi

let item_list = [];
item_list[0] = item_alanID
item_list[1] = item_alanadi
item_list[2] = item_alantipi

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
    if(!(filter_alantipi.value == 0 || filter_alantipi.value == 1)){
        b = false
        filter_alantipi.setAttribute("style", "border-color:red")
    }
    else {
        filter_alantipi.setAttribute("style", "border-color:black")
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
            'AlanID' : filter_alanID.value,
            'AlanAdı' : filter_alanadi.value,
            'AlanTipi' : filter_alantipi.value == 1
        }
        fetch('./area', {
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
                if(data == "SAME ALANID"){
                    item_error1[0].style.visibility = 'visible'
                }
                else{
                    item_error2[0].style.visibility = 'visible'
                }
            }
            else {
                filter_alanID.value = ''
                filter_alanadi.value = ''
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
        'AlanID' : filter_alanID.value,
        'AlanAdı' : filter_alanadi.value,
        'AlanTipi' : filter_alantipi.value == 1,
        'TümAlanTipleri' : filter_alantipi.value == 2,
        'Sayfa' : page
    }
    fetch('./area', {
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
        item_alanID[i].value = user_dict[i].AlanID
        item_alanID[i].setAttribute('style','pointer-events:none')
        item_alanadi[i].value = user_dict[i].AlanAdı
        item_alanadi[i].setAttribute('style','pointer-events:none')
        item_alantipi[i].value = user_dict[i].AlanTipi ? 1 : 0
        item_alantipi[i].setAttribute('style','pointer-events:none')
        prev_item_alanID[i] = item_alanID[i].value
        prev_item_alanadi[i] = item_alanadi[i].value
        prev_item_alantipi[i] = item_alantipi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_alanID[i].setAttribute('style','pointer-events:all')
            item_alanadi[i].setAttribute('style','pointer-events:all')
            item_alantipi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                send_data = {
                    'Satır' : i,
                    'EskiAlanID' : prev_item_alanID[i],
                    'EskiAlanAdı' : prev_item_alanadi[i],
                    'AlanID' : item_alanID[i].value,
                    'AlanAdı' : item_alanadi[i].value,
                    'AlanTipi' : item_alantipi[i].value == 1
                }
                fetch('./area', {
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
                        if(data == "SAME ALANID"){
                            item_error1[i+1].style.visibility = 'visible'
                        }
                        else{
                            item_error2[i+1].style.visibility = 'visible'
                        }
                    }
                    else {
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_alanID[i].setAttribute('style','pointer-events:none')
                        item_alanadi[i].setAttribute('style','pointer-events:none')
                        item_alantipi[i].setAttribute('style','pointer-events:none')
                        prev_item_alanID[i] = item_alanID[i].value
                        prev_item_alanadi[i] = item_alanadi[i].value
                        prev_item_alantipi[i] = item_alantipi[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            item_alanID[i].value = prev_item_alanID[i]
            item_alanadi[i].value = prev_item_alanadi[i]
            item_alantipi[i].value = prev_item_alantipi[i]
            item_alanID[i].setAttribute('style','pointer-events:none')
            item_alanadi[i].setAttribute('style','pointer-events:none')
            item_alantipi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
            reset_item(i)
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'AlanID' : prev_item_alanID[i],
            'AlanAdı' : prev_item_alanadi[i]
        }
        reset_item(i)
        fetch('./area', {
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