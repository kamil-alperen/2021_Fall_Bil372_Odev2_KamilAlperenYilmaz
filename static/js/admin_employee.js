const filter_kullaniciadi = document.getElementById("filter_kullaniciadi")
const filter_email = document.getElementById("filter_email")
const filter_ad = document.getElementById("filter_ad")
const filter_soyad = document.getElementById("filter_soyad")
const filter_sicilno = document.getElementById("filter_sicilno")
const filter_cep = document.getElementById("filter_cep")
const filter_evadresi = document.getElementById("filter_evadresi")
const filter_ilkodu = document.getElementById("filter_ilkodu")
const filter_ilcekodu = document.getElementById("filter_ilcekodu")
const filter_postakodu = document.getElementById("filter_postakodu")
const filter_ustkullaniciadi = document.getElementById("filter_ustkullaniciadi")
const filter_calistigibirimkodu = document.getElementById("filter_calistigibirimkodu")

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

const filter_list = []
filter_list[0] = filter_kullaniciadi
filter_list[1] = filter_email
filter_list[2] = filter_ad
filter_list[3] = filter_soyad
filter_list[4] = filter_sicilno
filter_list[5] = filter_cep
filter_list[6] = filter_evadresi
filter_list[7] = filter_ilkodu
filter_list[8] = filter_ilcekodu
filter_list[9] = filter_postakodu
filter_list[10] = filter_calistigibirimkodu


const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")

const item_kullaniciadi = document.getElementsByClassName("item_kullaniciadi")
const item_email = document.getElementsByClassName("item_email")
const item_ad = document.getElementsByClassName("item_ad")
const item_soyad = document.getElementsByClassName("item_soyad")
const item_sicilno = document.getElementsByClassName("item_sicilno")
const item_cep = document.getElementsByClassName("item_cep")
const item_evadresi = document.getElementsByClassName("item_evadresi")
const item_ilkodu = document.getElementsByClassName("item_ilkodu")
const item_ilcekodu = document.getElementsByClassName("item_ilcekodu")
const item_postakodu = document.getElementsByClassName("item_postakodu")
const item_ustkullaniciadi = document.getElementsByClassName("item_ustkullaniciadi")
const item_calistigibirimkodu = document.getElementsByClassName("item_calistigibirimkodu")

const item_list = []
item_list[0] = item_kullaniciadi
item_list[1] = item_email
item_list[2] = item_ad
item_list[3] = item_soyad
item_list[4] = item_sicilno
item_list[5] = item_cep
item_list[6] = item_evadresi
item_list[7] = item_ilkodu
item_list[8] = item_ilcekodu
item_list[9] = item_postakodu
item_list[10] = item_ustkullaniciadi
item_list[11] = item_calistigibirimkodu

const prev_item_kullaniciadi = []
const prev_item_email = []
const prev_item_ad = []
const prev_item_soyad = []
const prev_item_sicilno = []
const prev_item_cep = []
const prev_item_evadresi = []
const prev_item_ilkodu = []
const prev_item_ilcekodu = []
const prev_item_postakodu = []
const prev_item_ustkullaniciadi = []
const prev_item_calistigibirimkodu = []

const prev_item_list = []
prev_item_list[0] = prev_item_kullaniciadi
prev_item_list[1] = prev_item_email
prev_item_list[2] = prev_item_ad
prev_item_list[3] = prev_item_soyad
prev_item_list[4] = prev_item_sicilno
prev_item_list[5] = prev_item_cep
prev_item_list[6] = prev_item_evadresi
prev_item_list[7] = prev_item_ilkodu
prev_item_list[8] = prev_item_ilcekodu
prev_item_list[9] = prev_item_postakodu
prev_item_list[10] = prev_item_ustkullaniciadi
prev_item_list[11] = prev_item_calistigibirimkodu

const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")

const rows = document.getElementsByClassName("item")

const item_error_kullaniciadi = document.getElementsByClassName("label_item_kullaniciadi")
const item_error_email = document.getElementsByClassName("label_item_email")
const item_error_sicilno = document.getElementsByClassName("label_item_sicilno")
const item_error_ilkodu = document.getElementsByClassName("label_item_ilkodu")
const item_error_ilcekodu = document.getElementsByClassName("label_item_ilcekodu")
const item_error_ustkullaniciadi = document.getElementsByClassName("label_item_ustkullaniciadi")
const item_error_calistigibirimkodu = document.getElementsByClassName("label_item_calistigibirimkodu")

let current_page = 1
let total_record = 0

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    for(let i = 0;i < filter_list.length;i++){
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
    for(let i = 0;i < item_list.length;i++){
        item_list[i][j].setAttribute("style","border-color:black")
    }
}

filter_create.addEventListener("click", (e) => {
    if(mandatory_filter()){
        let send_data = {
            'Type' : 'CREATE',
            'KullanıcıAdı' : filter_kullaniciadi.value,
            'Email' : filter_email.value,
            'Ad' : filter_ad.value,
            'Soyad' : filter_soyad.value,
            'SicilNo' : filter_sicilno.value,
            'Cep' : filter_cep.value,
            'EvAdresi' : filter_evadresi.value,
            'İlKodu' : filter_ilkodu.value,
            'İlçeKodu' : filter_ilcekodu.value,
            'PostaKodu' : filter_postakodu.value,
            'ÜstKullanıcıAdı' : filter_ustkullaniciadi.value,
            'ÇalıştığıBirimKodu' : filter_calistigibirimkodu.value,
        }
        fetch('./employee', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('NEW USER CREATED : ' + data);
            item_error_kullaniciadi[0].style.visibility = 'hidden'
            item_error_email[0].style.visibility = 'hidden'
            item_error_sicilno[0].style.visibility = 'hidden'
            item_error_ilkodu[0].style.visibility = 'hidden'
            item_error_ilcekodu[0].style.visibility = 'hidden'
            item_error_ustkullaniciadi[0].style.visibility = 'hidden'
            item_error_calistigibirimkodu[0].style.visibility = 'hidden'
            if(data === "OK"){
                for(let i = 0;i < filter_list.length;i++){
                    filter_list[i].value = ''
                }
                filter_ustkullaniciadi.value = ''
                list_from_zero(1)
            }
            else {
                if(data == "SAME KULLANICIADI"){
                    item_error_kullaniciadi[0].style.visibility = 'visible'
                }
                else if(data == "SAME EMAIL"){
                    item_error_email[0].style.visibility = 'visible'
                }
                else if(data == "SAME SICILNO"){
                    item_error_sicilno[0].style.visibility = 'visible'
                }
                else if(data == "NO ILKODU-ILCEKODU"){
                    item_error_ilkodu[0].style.visibility = 'visible'
                    item_error_ilcekodu[0].style.visibility = 'visible'
                }
                else if(data == "NO USTKULLANICIADI"){
                    item_error_ustkullaniciadi[0].style.visibility = 'visible'
                }
                else if(data == "NO CALISTIGIBIRIMKODU"){
                    item_error_calistigibirimkodu[0].style.visibility = 'visible'
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
    reset_filter()
    item_error_kullaniciadi[0].style.visibility = 'hidden'
    item_error_email[0].style.visibility = 'hidden'
    item_error_sicilno[0].style.visibility = 'hidden'
    item_error_ilkodu[0].style.visibility = 'hidden'
    item_error_ilcekodu[0].style.visibility = 'hidden'
    item_error_ustkullaniciadi[0].style.visibility = 'hidden'
    item_error_calistigibirimkodu[0].style.visibility = 'hidden'
    let send_data = {
        'Type' : 'LIST',
        'KullanıcıAdı' : filter_kullaniciadi.value,
        'Email' : filter_email.value,
        'Ad' : filter_ad.value,
        'Soyad' : filter_soyad.value,
        'SicilNo' : filter_sicilno.value,
        'Cep' : filter_cep.value,
        'EvAdresi' : filter_evadresi.value,
        'İlKodu' : filter_ilkodu.value,
        'İlçeKodu' : filter_ilcekodu.value,
        'PostaKodu' : filter_postakodu.value,
        'ÜstKullanıcıAdı' : filter_ustkullaniciadi.value,
        'ÇalıştığıBirimKodu' : filter_calistigibirimkodu.value,
        'Sayfa' : page
    }
    fetch('./employee', {
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
        prev_item_kullaniciadi[i] = item_kullaniciadi[i].value = user_dict[i].KullanıcıAdı
        prev_item_email[i] = item_email[i].value = user_dict[i].Email
        prev_item_ad[i] = item_ad[i].value = user_dict[i].Ad
        prev_item_soyad[i] = item_soyad[i].value = user_dict[i].Soyad
        prev_item_sicilno[i] = item_sicilno[i].value = user_dict[i].SicilNo
        prev_item_cep[i] = item_cep[i].value = user_dict[i].Cep
        prev_item_evadresi[i] = item_evadresi[i].value = user_dict[i].EvAdresi
        prev_item_ilkodu[i] = item_ilkodu[i].value = user_dict[i].İlKodu
        prev_item_ilcekodu[i] = item_ilcekodu[i].value = user_dict[i].İlçeKodu
        prev_item_postakodu[i] = item_postakodu[i].value = user_dict[i].PostaKodu
        prev_item_ustkullaniciadi[i] = item_ustkullaniciadi[i].value = user_dict[i].ÜstKullanıcıAdı
        prev_item_calistigibirimkodu[i] = item_calistigibirimkodu[i].value = user_dict[i].ÇalıştığıBirimKodu
        for(let j = 0;j < item_list.length;j++){
            item_list[j][i].setAttribute('style','pointer-events:none')
        }
    }
    
}


for(let i = 0;i < update_btn.length;i++){
    update_btn[i].addEventListener("click", (e) => {
        console.log("UPDATE BUTTON");
        if(update_btn[i].value == 'Güncelle'){
            update_btn[i].value = 'Onayla'
            quit_btn[i].style.opacity = '1'
            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].setAttribute('style','pointer-events:all')
            }
        }
        else {
            console.log("ELSE");
            if(mandatory_item(i)){
                console.log("TRUE");
                send_data = {
                    'Satır' : i,
                    'KullanıcıAdı(D)' : prev_item_kullaniciadi[i] != item_kullaniciadi[i].value,
                    'Email(D)' : prev_item_email[i] != item_email[i].value,
                    'SicilNo(D)' : prev_item_sicilno[i] != item_sicilno[i].value,
                    'Eski Adı' : prev_item_kullaniciadi[i],
                    'KullanıcıAdı' : item_kullaniciadi[i].value,
                    'Email' : item_email[i].value,
                    'Ad' : item_ad[i].value,
                    'Soyad' : item_soyad[i].value,
                    'SicilNo' : item_sicilno[i].value,
                    'Cep' : item_cep[i].value,
                    'EvAdresi' : item_evadresi[i].value,
                    'İlKodu' : item_ilkodu[i].value,
                    'İlçeKodu' : item_ilcekodu[i].value,
                    'PostaKodu' : item_postakodu[i].value,
                    'ÜstKullanıcıAdı' : item_ustkullaniciadi[i].value,
                    'ÇalıştığıBirimKodu' : item_calistigibirimkodu[i].value,
                }
                fetch('./employee', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    item_error_kullaniciadi[i+1].style.visibility = 'hidden'
                    item_error_email[i+1].style.visibility = 'hidden'
                    item_error_sicilno[i+1].style.visibility = 'hidden'
                    item_error_ilkodu[i+1].style.visibility = 'hidden'
                    item_error_ilcekodu[i+1].style.visibility = 'hidden'
                    item_error_ustkullaniciadi[i+1].style.visibility = 'hidden'
                    item_error_calistigibirimkodu[i+1].style.visibility = 'hidden'
                    if(data == 'OK'){
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
                        for(let j = 0;j < item_list.length;j++){
                            item_list[j][i].setAttribute('style','pointer-events:none')
                            prev_item_list[j][i] = item_list[j][i].value
                        }
                    }
                    else {
                        if(data == "SAME KULLANICIADI"){
                            item_error_kullaniciadi[i+1].style.visibility = 'visible'
                        }
                        else if(data == "SAME EMAIL"){
                            item_error_email[i+1].style.visibility = 'visible'
                        }
                        else if(data == "SAME SICILNO"){
                            item_error_sicilno[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO ILKODU-ILCEKODU"){
                            item_error_ilkodu[i+1].style.visibility = 'visible'
                            item_error_ilcekodu[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO USTKULLANICIADI"){
                            item_error_ustkullaniciadi[i+1].style.visibility = 'visible'
                        }
                        else if(data == "NO CALISTIGIBIRIMKODU"){
                            item_error_calistigibirimkodu[i+1].style.visibility = 'visible'
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
            item_error_kullaniciadi[i+1].style.visibility = 'hidden'
            item_error_email[i+1].style.visibility = 'hidden'
            item_error_sicilno[i+1].style.visibility = 'hidden'
            item_error_ilkodu[i+1].style.visibility = 'hidden'
            item_error_ilcekodu[i+1].style.visibility = 'hidden'
            item_error_ustkullaniciadi[i+1].style.visibility = 'hidden'
            item_error_calistigibirimkodu[i+1].style.visibility = 'hidden'

            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].value = prev_item_list[j][i]
                item_list[j][i].setAttribute('style','pointer-events:none')
            }
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        console.log(prev_item_kullaniciadi[i]);
        send_data = {
            'KullanıcıAdı' : prev_item_kullaniciadi[i]
        }
        reset_item(i)
        fetch('./employee', {
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
    if(current_page < (total_record / 3)){
        console.log("Next working");
        current_page++
        list_from_zero(current_page)
    }
})