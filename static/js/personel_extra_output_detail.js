const filter_problemID = document.getElementById("filter_problemID")
const filter_alanID = document.getElementById("filter_alanID")
const filter_sınıfID = document.getElementById("filter_sınıfID")
const filter_çıktıID = document.getElementById("filter_çıktıID")
const filter_belirteçID = document.getElementById("filter_belirteçID")
const filter_sıra = document.getElementById("filter_sıra")
const filter_ekleyenKullanıcıAdı = document.getElementById("filter_ekleyenKullanıcıAdı")
const filter_eklenmeTarihi = document.getElementById("filter_eklenmeTarihi")

const filter_list = []
filter_list[0] = filter_problemID
filter_list[1] = filter_alanID
filter_list[2] = filter_sınıfID
filter_list[3] = filter_çıktıID
filter_list[4] = filter_belirteçID
filter_list[5] = filter_sıra
filter_list[6] = filter_ekleyenKullanıcıAdı
filter_list[7] = filter_eklenmeTarihi


const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")

const item_problemID = document.getElementsByClassName("item_problemID")
const item_alanID = document.getElementsByClassName("item_alanID")
const item_sınıfID = document.getElementsByClassName("item_sınıfID")
const item_çıktıID = document.getElementsByClassName("item_çıktıID")
const item_belirteçID = document.getElementsByClassName("item_belirteçID")
const item_sıra = document.getElementsByClassName("item_sıra")
const item_ekleyenKullanıcıAdı = document.getElementsByClassName("item_ekleyenKullanıcıAdı")
const item_eklenmeTarihi = document.getElementsByClassName("item_eklenmeTarihi")

const item_list = []
item_list[0] = item_problemID
item_list[1] = item_alanID
item_list[2] = item_sınıfID
item_list[3] = item_çıktıID
item_list[4] = item_belirteçID
item_list[5] = item_sıra
item_list[6] = item_ekleyenKullanıcıAdı
item_list[7] = item_eklenmeTarihi

const prev_item_problemID = []
const prev_item_alanID = []
const prev_item_sınıfID = []
const prev_item_çıktıID = []
const prev_item_belirteçID = []
const prev_item_sıra = []
const prev_item_ekleyenKullanıcıAdı = []
const prev_item_eklenmeTarihi = []

const prev_item_list = []
prev_item_list[0] = prev_item_problemID
prev_item_list[1] = prev_item_alanID
prev_item_list[2] = prev_item_sınıfID
prev_item_list[3] = prev_item_çıktıID
prev_item_list[4] = prev_item_belirteçID
prev_item_list[5] = prev_item_sıra
prev_item_list[6] = prev_item_ekleyenKullanıcıAdı
prev_item_list[7] = prev_item_eklenmeTarihi

const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")

const rows = document.getElementsByClassName("item")

const item_error_problemID = document.getElementsByClassName("label_item_problemID")
const item_error_alanID = document.getElementsByClassName("label_item_alanID")
const item_error_sınıfID = document.getElementsByClassName("label_item_sınıfID")
const item_error_çıktıID = document.getElementsByClassName("label_item_çıktıID")
const item_error_belirteçID = document.getElementsByClassName("label_item_belirteçID")
const item_error_ekleyenKullanıcıAdı = document.getElementsByClassName("label_item_ekleyenKullanıcıAdı")

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
            'AlanID' : filter_alanID.value,
            'SınıfID' : filter_sınıfID.value,
            'ÇıktıID' : filter_çıktıID.value,
            'BelirteçID' : filter_belirteçID.value,
            'Sıra' : filter_sıra.value,
            'EkleyenKullanıcıAdı' : filter_ekleyenKullanıcıAdı.value,
            'EklenmeTarihi' : filter_eklenmeTarihi.value
        }
        fetch('./extra-output-detail', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('NEW USER CREATED : ' + data);
            item_error_problemID[0].style.visibility = 'hidden'
            item_error_alanID[0].style.visibility = 'hidden'
            item_error_sınıfID[0].style.visibility = 'hidden'
            item_error_çıktıID[0].style.visibility = 'hidden'
            item_error_belirteçID[0].style.visibility = 'hidden'
            item_error_ekleyenKullanıcıAdı[0].style.visibility = 'hidden'
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
                else if(data == "NO KULLANICIADI"){
                    item_error_ekleyenKullanıcıAdı[0].style.visibility = 'visible'
                }
                else if(data == "NO ÇIKTI RECORD"){
                    item_error_alanID[0].style.visibility = 'visible'
                    item_error_sınıfID[0].style.visibility = 'visible'
                    item_error_çıktıID[0].style.visibility = 'visible'
                }
                else if(data == "NO BELİRTEÇ RECORD"){
                    item_error_belirteçID[0].style.visibility = 'visible'
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
    item_error_alanID[0].style.visibility = 'hidden'
    item_error_sınıfID[0].style.visibility = 'hidden'
    item_error_çıktıID[0].style.visibility = 'hidden'
    item_error_belirteçID[0].style.visibility = 'hidden'
    item_error_ekleyenKullanıcıAdı[0].style.visibility = 'hidden'
    reset_filter()
    let send_data = {
        'Type' : 'LIST',
        'ProblemID' : filter_problemID.value,
        'AlanID' : filter_alanID.value,
        'SınıfID' : filter_sınıfID.value,
        'ÇıktıID' : filter_çıktıID.value,
        'BelirteçID' : filter_belirteçID.value,
        'Sıra' : filter_sıra.value,
        'EkleyenKullanıcıAdı' : filter_ekleyenKullanıcıAdı.value,
        'EklenmeTarihi' : filter_eklenmeTarihi.value,
        'Sayfa' : page
    }
    fetch('./extra-output-detail', {
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
        prev_item_alanID[i] = item_alanID[i].value = user_dict[i].AlanID
        prev_item_sınıfID[i] = item_sınıfID[i].value = user_dict[i].SınıfID
        prev_item_çıktıID[i] = item_çıktıID[i].value = user_dict[i].ÇıktıID
        prev_item_belirteçID[i] = item_belirteçID[i].value = user_dict[i].BelirteçID
        prev_item_sıra[i] = item_sıra[i].value = user_dict[i].Sıra
        prev_item_ekleyenKullanıcıAdı[i] = item_ekleyenKullanıcıAdı[i].value = user_dict[i].EkleyenKullanıcıAdı
        prev_item_eklenmeTarihi[i] = item_eklenmeTarihi[i].value = user_dict[i].EklenmeTarihi
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
                    'EskiAlanID' : prev_item_alanID[i],
                    'EskiSınıfID' : prev_item_sınıfID[i],
                    'EskiÇıktıID' : prev_item_çıktıID[i],
                    'EskiBelirteçID' : prev_item_belirteçID[i],
                    'EskiEkleyenKullanıcıAdı' : prev_item_ekleyenKullanıcıAdı[i],
                    'ProblemID' : item_problemID[i].value,
                    'AlanID' : item_alanID[i].value,
                    'SınıfID' : item_sınıfID[i].value,
                    'ÇıktıID' : item_çıktıID[i].value,
                    'BelirteçID' : item_belirteçID[i].value,
                    'Sıra' : item_sıra[i].value,
                    'EkleyenKullanıcıAdı' : item_ekleyenKullanıcıAdı[i].value,
                    'EklenmeTarihi' : item_eklenmeTarihi[i].value
                }
                fetch('./extra-output-detail', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    item_error_problemID[i+1].style.visibility = 'hidden'
                    item_error_alanID[i+1].style.visibility = 'hidden'
                    item_error_sınıfID[i+1].style.visibility = 'hidden'
                    item_error_çıktıID[i+1].style.visibility = 'hidden'
                    item_error_belirteçID[i+1].style.visibility = 'hidden'
                    item_error_ekleyenKullanıcıAdı[i+1].style.visibility = 'hidden'
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
                        else if(data == "NO KULLANICIADI"){
                            item_error_ekleyenKullanıcıAdı[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO ÇIKTI RECORD"){
                            item_error_alanID[i+1].style.visibility = 'visible'
                            item_error_sınıfID[i+1].style.visibility = 'visible'
                            item_error_çıktıID[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO BELİRTEÇ RECORD"){
                            item_error_belirteçID[i+1].style.visibility = 'visible'
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
            item_error_alanID[i+1].style.visibility = 'hidden'
            item_error_sınıfID[i+1].style.visibility = 'hidden'
            item_error_çıktıID[i+1].style.visibility = 'hidden'
            item_error_belirteçID[i+1].style.visibility = 'hidden'
            item_error_ekleyenKullanıcıAdı[i+1].style.visibility = 'hidden'

            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].value = prev_item_list[j][i]
                item_list[j][i].setAttribute('style','pointer-events:none')
            }
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        item_error_problemID[i+1].style.visibility = 'hidden'
        item_error_alanID[i+1].style.visibility = 'hidden'
        item_error_sınıfID[i+1].style.visibility = 'hidden'
        item_error_çıktıID[i+1].style.visibility = 'hidden'
        item_error_belirteçID[i+1].style.visibility = 'hidden'
        item_error_ekleyenKullanıcıAdı[i+1].style.visibility = 'hidden'
        send_data = {
            'ProblemID' : prev_item_problemID[i],
            'AlanID' : prev_item_alanID[i],
            'SınıfID' : prev_item_sınıfID[i],
            'ÇıktıID' : prev_item_çıktıID[i],
            'BelirteçID' : prev_item_belirteçID[i],
        }
        fetch('./extra-output-detail', {
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