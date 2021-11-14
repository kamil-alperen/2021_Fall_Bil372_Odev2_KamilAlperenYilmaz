const filter_problemID = document.getElementById("filter_problemID")
const filter_birimID = document.getElementById("filter_birimID")
const filter_eslesmetarihi = document.getElementById("filter_eslesmetarihi")
const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")
const item_problemID = document.getElementsByClassName("item_problemID")
const item_birimID = document.getElementsByClassName("item_birimID")
const item_eslesmetarihi = document.getElementsByClassName("item_eslesmetarihi")
const prev_item_problemID = []
const prev_item_birimID = []
const prev_item_eslesmetarihi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_problemID")
const item_error2 = document.getElementsByClassName("label_item_birimID")

let filter_list = []
filter_list[0] = filter_problemID
filter_list[1] = filter_birimID
filter_list[2] = filter_eslesmetarihi

let item_list = []
item_list[0] = item_problemID
item_list[1] = item_birimID
item_list[2] = item_eslesmetarihi


let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")
for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    b = true
    for(let i = 0;i < filter_list.length;i++){
        if(filter_list[i].value.length == 0){
            b = false
            filter_list[i].setAttribute('style','border-color:red')
        }
        else {
            filter_list[i].setAttribute('style','border-color:black')
        }
    }
    return b;
}
function reset_filter(){
    for(let i = 0;i < filter_list.length;i++){
        filter_list[i].setAttribute('style','border-color:black')
    }
}
function mandatory_item(j){
    b = true
    for(let i = 0;i < item_list.length;i++){
        if(item_list[i][j].value.length == 0){
            b = false
            item_list[i][j].setAttribute('style','border-color:red')
        }
        else {
            item_list[i][j].setAttribute('style','border-color:black')
        }
    }
    return b;
}
function reset_item(j){
    for(let i = 0;i < item_list.length;i++){
        item_list[i][j].setAttribute('style','border-color:black')
    }
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        let send_data = {
            'Type' : 'CREATE',
            'ProblemID' : filter_problemID.value,
            'BirimID' : filter_birimID.value,
            'EşleşmeTarihi' : filter_eslesmetarihi.value
        }
        fetch('./problemunit', {
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
                item_error2[0].style.visibility = 'visible'
            }
            else {
                filter_problemID.value = ''
                filter_birimID.value = ''
                filter_eslesmetarihi.value = ''
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
    item_error1[0].style.visibility = 'hidden'
    item_error2[0].style.visibility = 'hidden'
    reset_filter()
    let send_data = {
        'Type' : 'LIST',
        'ProblemID' : filter_problemID.value,
        'BirimID' : filter_birimID.value,
        'EşleşmeTarihi' : filter_eslesmetarihi.value,
        'Sayfa' : page
    }
    fetch('./problemunit', {
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
        item_birimID[i].value = user_dict[i].BirimID
        item_birimID[i].setAttribute('style','pointer-events:none')
        item_eslesmetarihi[i].value = user_dict[i].EşleşmeTarihi
        item_eslesmetarihi[i].setAttribute('style','pointer-events:none')
        prev_item_problemID[i] = item_problemID[i].value
        prev_item_birimID[i] = item_birimID[i].value
        prev_item_eslesmetarihi[i] = item_eslesmetarihi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_problemID[i].setAttribute('style','pointer-events:all')
            item_birimID[i].setAttribute('style','pointer-events:all')
            item_eslesmetarihi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                send_data = {
                    'Satır' : i,
                    'EskiProblemID' : prev_item_problemID[i],
                    'EskiBirimID' : prev_item_birimID[i],
                    'ProblemID' : item_problemID[i].value,
                    'BirimID' : item_birimID[i].value,
                    'EşleşmeTarihi' : item_eslesmetarihi[i].value
                }
                fetch('./problemunit', {
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
                    if(data === 'SAME USERNAME'){
                        item_error1[i+1].style.visibility = 'visible'
                        item_error2[i+1].style.visibility = 'visible'
                    }
                    else {
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_problemID[i].setAttribute('style','pointer-events:none')
                        item_birimID[i].setAttribute('style','pointer-events:none')
                        item_eslesmetarihi[i].setAttribute('style','pointer-events:none')
                        prev_item_problemID[i] = item_problemID[i].value
                        prev_item_birimID[i] = item_birimID[i].value
                        prev_item_eslesmetarihi[i] = item_eslesmetarihi[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            item_problemID[i].value = prev_item_problemID[i]
            item_birimID[i].value = prev_item_birimID[i]
            item_eslesmetarihi[i].value = prev_item_eslesmetarihi[i]
            item_problemID[i].setAttribute('style','pointer-events:none')
            item_birimID[i].setAttribute('style','pointer-events:none')
            item_eslesmetarihi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
            
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'ProblemID' : prev_item_problemID[i],
            'BirimID' : prev_item_birimID[i]
        }
        reset_item(i)
        fetch('./problemunit', {
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
