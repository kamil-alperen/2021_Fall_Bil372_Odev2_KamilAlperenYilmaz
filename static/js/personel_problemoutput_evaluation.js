const filter_problemID = document.getElementById("filter_problemID")
const filter_belirteçID = document.getElementById("filter_belirteçID")
const filter_skor = document.getElementById("filter_skor")
const filter_skorTarihi = document.getElementById("filter_skorTarihi")
const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")
const item_problemID = document.getElementsByClassName("item_problemID")
const item_belirteçID = document.getElementsByClassName("item_belirteçID")
const item_skor = document.getElementsByClassName("item_skor")
const item_skorTarihi = document.getElementsByClassName("item_skorTarihi")
const prev_item_problemID = []
const prev_item_belirteçID = []
const prev_item_skor = []
const prev_item_skorTarihi = []
const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")
const rows = document.getElementsByClassName("item")
const item_error1 = document.getElementsByClassName("label_item_problemID")
const item_error2 = document.getElementsByClassName("label_item_belirteçID")
const item_error3 = document.getElementsByClassName("label_item_skor")

let filter_list = []
filter_list[0] = filter_problemID
filter_list[1] = filter_belirteçID
filter_list[2] = filter_skor
filter_list[3] = filter_skorTarihi

let item_list = []
item_list[0] = item_problemID
item_list[1] = item_belirteçID
item_list[2] = item_skor
item_list[3] = item_skorTarihi

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    for(let i = 0;i < filter_list.length;i++){
        if(filter_list[i].value.length == 0){
            filter_list[i].setAttribute("style","border-color:red")
            b = false
        }
        else {
            filter_list[i].setAttribute("style","border-color:black")
        }
    }
    return b
}
function reset_filter(){
    for(let i = 0;i < filter_list.length;i++){
       filter_list[i].setAttribute("style","border-color:black")
    }
}
function mandatory_item(j){
    let b = true
    for(let i = 0;i < item_list.length;i++){
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
    for(let i = 0;i < item_list.length;i++){
        item_list[i][j].setAttribute("style","border-color:black")
    }
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        let send_data = {
            'Type' : 'CREATE',
            'ProblemID' : filter_problemID.value,
            'BelirteçID' : filter_belirteçID.value,
            'Skor' : filter_skor.value,
            'SkorTarihi' : filter_skorTarihi.value
        }
        fetch('./problemoutput-evaluation', {
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
            item_error3[0].style.visibility = 'hidden'
            let between = filter_skor.value >= 1 && filter_skor.value <= 5
            if(data !== "OK"){
                if(data == "NO PROBLEMID"){
                    item_error1[0].style.visibility = 'visible'
                }
                else if(data == "NO BELİRTEÇID"){
                    item_error2[0].style.visibility = 'visible'
                }
            }
            else if(!between){
                item_error3[0].style.visibility = 'visible'
            }
            else {
                filter_problemID.value = ''
                filter_belirteçID.value = ''
                filter_skor.value = ''
                filter_skorTarihi.value = ''
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
        'ProblemID' : filter_problemID.value,
        'BelirteçID' : filter_belirteçID.value,
        'Skor' : filter_skor.value,
        'SkorTarihi' : filter_skorTarihi.value,
        'Sayfa' : page
    }
    item_error1[0].style.visibility = 'hidden'
    item_error2[0].style.visibility = 'hidden'
    item_error3[0].style.visibility = 'hidden'
    reset_filter()
    fetch('./problemoutput-evaluation', {
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
        item_belirteçID[i].value = user_dict[i].BelirteçID
        item_belirteçID[i].setAttribute('style','pointer-events:none')
        item_skor[i].value = user_dict[i].Skor
        item_skor[i].setAttribute('style','pointer-events:none')
        item_skorTarihi[i].value = user_dict[i].SkorTarihi
        item_skorTarihi[i].setAttribute('style','pointer-events:none')
        prev_item_problemID[i] = item_problemID[i].value
        prev_item_belirteçID[i] = item_belirteçID[i].value
        prev_item_skor[i] = item_skor[i].value
        prev_item_skorTarihi[i] = item_skorTarihi[i].value
    }
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            item_problemID[i].setAttribute('style','pointer-events:all')
            item_belirteçID[i].setAttribute('style','pointer-events:all')
            item_skor[i].setAttribute('style','pointer-events:all')
            item_skorTarihi[i].setAttribute('style','pointer-events:all')
        }
        else {
            if(mandatory_item(i)){
                send_data = {
                    'Satır' : i,
                    'EskiProblemID' : prev_item_problemID[i],
                    'EskiBelirteçID' : prev_item_belirteçID[i],
                    'EskiSkor' : prev_item_skor[i],
                    'ProblemID' : item_problemID[i].value,
                    'BelirteçID' : item_belirteçID[i].value,
                    'Skor' : item_skor[i].value,
                    'SkorTarihi' : item_skorTarihi[i].value
                }
                fetch('./problemoutput-evaluation', {
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
                    item_error3[i+1].style.visibility = 'hidden'
                    let between = item_skor[i].value >= 1 && item_skor[i].value <= 5
                    if(data !== 'OK'){
                        if(data == "NO PROBLEMID"){
                            item_error1[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO BELİRTEÇID"){
                            item_error2[i+1].style.visibility = 'visible'
                        }
                    }
                    else if(!between){
                        item_error3[i+1].style.visibility = 'visible'
                    }
                    else {
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        item_problemID[i].setAttribute('style','pointer-events:none')
                        item_belirteçID[i].setAttribute('style','pointer-events:none')
                        item_skor[i].setAttribute('style','pointer-events:none')
                        item_skorTarihi[i].setAttribute('style','pointer-events:none')
                        prev_item_problemID[i] = item_problemID[i].value
                        prev_item_belirteçID[i] = item_belirteçID[i].value
                        prev_item_skor[i] = item_skor[i].value
                        prev_item_skorTarihi[i] = item_skor[i].value
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            item_problemID[i].value = prev_item_problemID[i]
            item_belirteçID[i].value = prev_item_belirteçID[i]
            item_skor[i].value = prev_item_skor[i]
            item_skorTarihi[i].value = prev_item_skorTarihi[i]
            item_problemID[i].setAttribute('style','pointer-events:none')
            item_belirteçID[i].setAttribute('style','pointer-events:none')
            item_skor[i].setAttribute('style','pointer-events:none')
            item_skorTarihi[i].setAttribute('style','pointer-events:none')
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error1[i+1].style.visibility = 'hidden'
            item_error2[i+1].style.visibility = 'hidden'
            item_error3[i+1].style.visibility = 'hidden'
            reset_item(i)
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'ProblemID' : prev_item_problemID[i],
            'BelirteçID' : prev_item_belirteçID[i],
            'Skor' : prev_item_skor[i],
        }
        reset_item(i)
        fetch('./problemoutput-evaluation', {
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