const filter_problemID = document.getElementById("filter_problemID")
const filter_yeniProblemID = document.getElementById("filter_yeniProblemID")
const filter_yeniProblemTanımı = document.getElementById("filter_yeniProblemTanımı")
const filter_yeniHedef = document.getElementById("filter_yeniHedef")
const filter_öncekiProblemSkoru = document.getElementById("filter_öncekiProblemSkoru")
const filter_tahminEdilenProblemSkoru = document.getElementById("filter_tahminEdilenProblemSkoru")
const filter_değerlendirmeTarihi = document.getElementById("filter_değerlendirmeTarihi")
const filter_değerlendirenKullanıcıAdı = document.getElementById("filter_değerlendirenKullanıcıAdı")

const filter_list = []
filter_list[0] = filter_problemID
filter_list[1] = filter_yeniProblemID
filter_list[2] = filter_yeniProblemTanımı
filter_list[3] = filter_yeniHedef
filter_list[4] = filter_öncekiProblemSkoru
filter_list[5] = filter_tahminEdilenProblemSkoru
filter_list[6] = filter_değerlendirmeTarihi
filter_list[7] = filter_değerlendirenKullanıcıAdı


const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")

const item_problemID = document.getElementsByClassName("item_problemID")
const item_yeniProblemID = document.getElementsByClassName("item_yeniProblemID")
const item_yeniProblemTanımı = document.getElementsByClassName("item_yeniProblemTanımı")
const item_yeniHedef = document.getElementsByClassName("item_yeniHedef")
const item_öncekiProblemSkoru = document.getElementsByClassName("item_öncekiProblemSkoru")
const item_tahminEdilenProblemSkoru = document.getElementsByClassName("item_tahminEdilenProblemSkoru")
const item_değerlendirmeTarihi = document.getElementsByClassName("item_değerlendirmeTarihi")
const item_değerlendirenKullanıcıAdı = document.getElementsByClassName("item_değerlendirenKullanıcıAdı")

const item_list = []
item_list[0] = item_problemID
item_list[1] = item_yeniProblemID
item_list[2] = item_yeniProblemTanımı
item_list[3] = item_yeniHedef
item_list[4] = item_öncekiProblemSkoru
item_list[5] = item_tahminEdilenProblemSkoru
item_list[6] = item_değerlendirmeTarihi
item_list[7] = item_değerlendirenKullanıcıAdı

const prev_item_problemID = []
const prev_item_yeniProblemID = []
const prev_item_yeniProblemTanımı = []
const prev_item_yeniHedef = []
const prev_item_öncekiProblemSkoru = []
const prev_item_tahminEdilenProblemSkoru = []
const prev_item_değerlendirmeTarihi = []
const prev_item_değerlendirenKullanıcıAdı = []

const prev_item_list = []
prev_item_list[0] = prev_item_problemID
prev_item_list[1] = prev_item_yeniProblemID
prev_item_list[2] = prev_item_yeniProblemTanımı
prev_item_list[3] = prev_item_yeniHedef
prev_item_list[4] = prev_item_öncekiProblemSkoru
prev_item_list[5] = prev_item_tahminEdilenProblemSkoru
prev_item_list[6] = prev_item_değerlendirmeTarihi
prev_item_list[7] = prev_item_değerlendirenKullanıcıAdı

const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")

const rows = document.getElementsByClassName("item")

const item_error_problemID = document.getElementsByClassName("label_item_problemID")
const item_error_yeniProblemID = document.getElementsByClassName("label_item_yeniProblemID")
const item_error_değerlendirenKullanıcıAdı = document.getElementsByClassName("label_item_değerlendirenKullanıcıAdı")


let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

filter_create.addEventListener("mouseover", (e) => {
    filter_öncekiProblemSkoru.style.visibility = 'hidden'
})
filter_create.addEventListener("mouseout", (e) => {
    filter_öncekiProblemSkoru.style.visibility = 'visible'
})

filter_problemID.addEventListener("change", (e) => {
    send_data = {
        Type : 'GET-SCORE',
        ProblemID : filter_problemID.value
    }
    fetch('./problem-case-evaluation', {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(send_data)
    }).then(response => response.json())
    .then(data => { 
        filter_öncekiProblemSkoru.value = data['ÖncekiProblemSkoru']
    })
})

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}
function mandatory_filter(){
    b = true
    for(let i = 0;i < filter_list.length;i++){
        if(i != 4 && i != 5){
            if(filter_list[i].value.length == 0){
                b = false
                filter_list[i].setAttribute('style','border-color:red')
            }
            else {
                filter_list[i].setAttribute('style','border-color:black')
            }
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
        if(i != 4 && i != 5){
            if(item_list[i][j].value.length == 0){
                b = false
                item_list[i][j].setAttribute('style','border-color:red')
            }
            else {
                item_list[i][j].setAttribute('style','border-color:black')
            }
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
            'YeniProblemID' : filter_yeniProblemID.value,
            'YeniProblemTanımı' : filter_yeniProblemTanımı.value,
            'YeniHedef' : filter_yeniHedef.value,
            'ÖncekiProblemSkoru' : filter_öncekiProblemSkoru.value,
            'TahminEdilenProblemSkoru' : filter_tahminEdilenProblemSkoru.value,
            'DeğerlendirmeTarihi' : filter_değerlendirmeTarihi.value,
            'DeğerlendirenKullanıcıAdı' : filter_değerlendirenKullanıcıAdı.value
        }
        fetch('./problem-case-evaluation', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('NEW USER CREATED : ' + data);
            item_error_problemID[0].style.visibility = 'hidden'
            item_error_yeniProblemID[0].style.visibility = 'hidden'
            item_error_değerlendirenKullanıcıAdı[0].style.visibility = 'hidden'
            reset_filter()
            if(data === "OK"){
                for(let i = 0;i < filter_list.length;i++){
                    filter_list[i].value = ''
                }
                list_from_zero(1)
            }
            else {
                if(data == "NO PROBLEM"){
                    item_error_problemID[0].style.visibility = 'visible'
                }
                else if(data == "YES PROBLEM"){
                    item_error_yeniProblemID[0].style.visibility = 'visible'
                }
                else if(data == "NO KULLANICIADI"){
                    item_error_değerlendirenKullanıcıAdı[0].style.visibility = 'visible'
                }
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
    item_error_problemID[0].style.visibility = 'hidden'
    item_error_yeniProblemID[0].style.visibility = 'hidden'
    item_error_değerlendirenKullanıcıAdı[0].style.visibility = 'hidden'
    reset_filter()
    let send_data = {
        'Type' : 'LIST',
        'ProblemID' : filter_problemID.value,
        'YeniProblemID' : filter_yeniProblemID.value,
        'YeniProblemTanımı' : filter_yeniProblemTanımı.value,
        'YeniHedef' : filter_yeniHedef.value,
        'ÖncekiProblemSkoru' : filter_öncekiProblemSkoru.value,
        'TahminEdilenProblemSkoru' : filter_tahminEdilenProblemSkoru.value,
        'DeğerlendirmeTarihi' : filter_değerlendirmeTarihi.value,
        'DeğerlendirenKullanıcıAdı' : filter_değerlendirenKullanıcıAdı.value,
        'Sayfa' : page
    }
    fetch('./problem-case-evaluation', {
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
        prev_item_problemID[i] = item_problemID[i].value = user_dict[i].ProblemID
        prev_item_yeniProblemID[i] = item_yeniProblemID[i].value = user_dict[i].YeniProblemID
        prev_item_yeniProblemTanımı[i] = item_yeniProblemTanımı[i].value = user_dict[i].YeniProblemTanımı
        prev_item_yeniHedef[i] = item_yeniHedef[i].value = user_dict[i].YeniHedef
        prev_item_öncekiProblemSkoru[i] = item_öncekiProblemSkoru[i].value = user_dict[i].ÖncekiProblemSkoru
        prev_item_tahminEdilenProblemSkoru[i] = item_tahminEdilenProblemSkoru[i].value = user_dict[i].TahminEdilenProblemSkoru
        prev_item_değerlendirmeTarihi[i] = item_değerlendirmeTarihi[i].value = user_dict[i].DeğerlendirmeTarihi
        prev_item_değerlendirenKullanıcıAdı[i] = item_değerlendirenKullanıcıAdı[i].value = user_dict[i].DeğerlendirenKullanıcıAdı
        for(let j = 0;j < item_list.length;j++){
            item_list[j][i].setAttribute('style','pointer-events:none')
        }
    }
    
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].setAttribute('style','pointer-events:all')
            }
        }
        else {
            if(mandatory_item(i)){
                reset_item(i)
                send_data = {
                    'EskiProblemID' : prev_item_problemID[i],
                    'EskiYeniProblemID' : prev_item_yeniProblemID[i],
                    'EskiKullanıcıAdı' : prev_item_değerlendirenKullanıcıAdı[i],
                    'ProblemID' : item_problemID[i].value,
                    'YeniProblemID' : item_yeniProblemID[i].value,
                    'YeniProblemTanımı' : item_yeniProblemTanımı[i].value,
                    'YeniHedef' : item_yeniHedef[i].value,
                    'ÖncekiProblemSkoru' : item_öncekiProblemSkoru[i].value,
                    'TahminEdilenProblemSkoru' : item_tahminEdilenProblemSkoru[i].value,
                    'DeğerlendirmeTarihi' : item_değerlendirmeTarihi[i].value,
                    'DeğerlendirenKullanıcıAdı' : item_değerlendirenKullanıcıAdı[i].value
                }
                fetch('./problem-case-evaluation', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    item_error_problemID[i+1].style.visibility = 'hidden'
                    item_error_yeniProblemID[i+1].style.visibility = 'hidden'
                    item_error_değerlendirenKullanıcıAdı[i+1].style.visibility = 'hidden'
                    if(data === 'OK'){
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'

                        for(let j = 0;j < item_list.length;j++){
                            item_list[j][i].setAttribute('style','pointer-events:none')
                            prev_item_list[j][i] = item_list[j][i].value
                        }
                    }
                    else {
                        if(data == "NO PROBLEM"){
                            item_error_problemID[i+1].style.visibility = 'visible'
                        }
                        else if(data == "YES PROBLEM"){
                            item_error_yeniProblemID[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO KULLANICIADI"){
                            item_error_değerlendirenKullanıcıAdı[i+1].style.visibility = 'visible'
                        }
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            reset_item(i)
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            item_error_problemID[i+1].style.visibility = 'hidden'
            item_error_yeniProblemID[i+1].style.visibility = 'hidden'
            item_error_değerlendirenKullanıcıAdı[i+1].style.visibility = 'hidden'

            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].value = prev_item_list[j][i]
                item_list[j][i].setAttribute('style','pointer-events:none')
            }
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        item_error_problemID[i+1].style.visibility = 'hidden'
        item_error_yeniProblemID[i+1].style.visibility = 'hidden'
        item_error_değerlendirenKullanıcıAdı[i+1].style.visibility = 'hidden'
        send_data = {
            'ProblemID' : prev_item_problemID[i],
        }
        fetch('./problem-case-evaluation', {
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
    if(current_page < (total_record / 3)){
        current_page++
        list_from_zero(current_page)
    }
})