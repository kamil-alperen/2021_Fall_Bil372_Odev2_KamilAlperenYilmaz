const filter_birimkodu = document.getElementById("filter_birimkodu")
const filter_birimadi = document.getElementById("filter_birimadi")
const filter_ustbirimkodu = document.getElementById("filter_ustbirimkodu")
const filter_bulunduguadres = document.getElementById("filter_bulunduguadres")
const filter_ilkodu = document.getElementById("filter_ilkodu")
const filter_ilcekodu = document.getElementById("filter_ilcekodu")
const filter_postakodu = document.getElementById("filter_postakodu")
const filter_birimmudurkullaniciadi = document.getElementById("filter_birimmudurkullaniciadi")

const filter_list = []
filter_list[0] = filter_birimkodu
filter_list[1] = filter_birimadi
filter_list[2] = filter_ustbirimkodu
filter_list[3] = filter_bulunduguadres
filter_list[4] = filter_ilkodu
filter_list[5] = filter_ilcekodu
filter_list[6] = filter_postakodu
filter_list[7] = filter_birimmudurkullaniciadi


const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")

const item_birimkodu = document.getElementsByClassName("item_birimkodu")
const item_birimadi = document.getElementsByClassName("item_birimadi")
const item_ustbirimkodu = document.getElementsByClassName("item_ustbirimkodu")
const item_bulunduguadres = document.getElementsByClassName("item_bulunduguadres")
const item_ilkodu = document.getElementsByClassName("item_ilkodu")
const item_ilcekodu = document.getElementsByClassName("item_ilcekodu")
const item_postakodu = document.getElementsByClassName("item_postakodu")
const item_birimmudurkullaniciadi = document.getElementsByClassName("item_birimmudurkullaniciadi")

const item_list = []
item_list[0] = item_birimkodu
item_list[1] = item_birimadi
item_list[2] = item_ustbirimkodu
item_list[3] = item_bulunduguadres
item_list[4] = item_ilkodu
item_list[5] = item_ilcekodu
item_list[6] = item_postakodu
item_list[7] = item_birimmudurkullaniciadi

const prev_item_birimkodu = []
const prev_item_birimadi = []
const prev_item_ustbirimkodu = []
const prev_item_bulunduguadres = []
const prev_item_ilkodu = []
const prev_item_ilcekodu = []
const prev_item_postakodu = []
const prev_item_birimmudurkullaniciadi = []

const prev_item_list = []
prev_item_list[0] = prev_item_birimkodu
prev_item_list[1] = prev_item_birimadi
prev_item_list[2] = prev_item_ustbirimkodu
prev_item_list[3] = prev_item_bulunduguadres
prev_item_list[4] = prev_item_ilkodu
prev_item_list[5] = prev_item_ilcekodu
prev_item_list[6] = prev_item_postakodu
prev_item_list[7] = prev_item_birimmudurkullaniciadi

const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")

const rows = document.getElementsByClassName("item")

const item_error_birimkodu = document.getElementsByClassName("label_item_birimkodu")
const item_error_ustbirimkodu = document.getElementsByClassName("label_item_ustbirimkodu")
const item_error_ilkodu = document.getElementsByClassName("label_item_ilkodu")
const item_error_ilcekodu = document.getElementsByClassName("label_item_ilcekodu")
const item_error_birimmudurkullaniciadi = document.getElementsByClassName("label_item_birimmudurkullaniciadi")

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
            'BirimKodu' : filter_birimkodu.value,
            'BirimAdı' : filter_birimadi.value,
            'ÜstBirimKodu' : filter_ustbirimkodu.value,
            'BulunduğuAdres' : filter_bulunduguadres.value,
            'İlKodu' : filter_ilkodu.value,
            'İlçeKodu' : filter_ilcekodu.value,
            'PostaKodu' : filter_postakodu.value,
            'BirimMüdürKullanıcıAdı' : filter_birimmudurkullaniciadi.value
        }
        fetch('./unit', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('NEW USER CREATED : ' + data);
            item_error_birimkodu[0].style.visibility = 'hidden'
            item_error_ustbirimkodu[0].style.visibility = 'hidden'
            item_error_ilkodu[0].style.visibility = 'hidden'
            item_error_ilcekodu[0].style.visibility = 'hidden'
            item_error_birimmudurkullaniciadi[0].style.visibility = 'hidden'
            reset_filter()
            if(data === "OK"){
                for(let i = 0;i < filter_list.length;i++){
                    filter_list[i].value = ''
                }
                list_from_zero(1)
            }
            else {
                if(data == "SAME BIRIMKODU"){
                    item_error_birimkodu[0].style.visibility = 'visible'
                    item_error_birimkodu[0].innerHTML = 'Birim Kodu zaten var'
                }
                else if(data == "NO USTBIRIMKODU"){
                    item_error_ustbirimkodu[0].style.visibility = 'visible'
                    item_error_ustbirimkodu[0].innerHTML = 'Bu ÜstBirimKodu yok'
                }
                else if(data == "NO ILKODU-ILCEKODU"){
                    item_error_ilkodu[0].style.visibility = 'visible'
                    item_error_ilcekodu[0].style.visibility = 'visible'
                    item_error_ilkodu[0].innerHTML = 'Bu İlKodu+İlçeKodu yok'
                    item_error_ilcekodu[0].innerHTML = 'Bu İlKodu+İlçeKodu yok'
                }
                else if(data == "NO BIRIMMUDURKULLANICIADI"){
                    item_error_birimmudurkullaniciadi[0].style.visibility = 'visible'
                    item_error_birimmudurkullaniciadi[0].innerHTML = 'Bu Kullanıcı Adı yok'
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
    item_error_birimkodu[0].style.visibility = 'hidden'
    item_error_ustbirimkodu[0].style.visibility = 'hidden'
    item_error_ilkodu[0].style.visibility = 'hidden'
    item_error_ilcekodu[0].style.visibility = 'hidden'
    item_error_birimmudurkullaniciadi[0].style.visibility = 'hidden'
    reset_filter()
    let send_data = {
        'Type' : 'LIST',
        'BirimKodu' : filter_birimkodu.value,
        'BirimAdı' : filter_birimadi.value,
        'ÜstBirimKodu' : filter_ustbirimkodu.value,
        'BulunduğuAdres' : filter_bulunduguadres.value,
        'İlKodu' : filter_ilkodu.value,
        'İlçeKodu' : filter_ilcekodu.value,
        'PostaKodu' : filter_postakodu.value,
        'BirimMüdürKullanıcıAdı' : filter_birimmudurkullaniciadi.value,
        'Sayfa' : page
    }
    fetch('./unit', {
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
        prev_item_birimkodu[i] = item_birimkodu[i].value = user_dict[i].BirimKodu
        prev_item_birimadi[i] = item_birimadi[i].value = user_dict[i].BirimAdı
        prev_item_ustbirimkodu[i] = item_ustbirimkodu[i].value = user_dict[i].ÜstBirimKodu
        prev_item_bulunduguadres[i] = item_bulunduguadres[i].value = user_dict[i].BulunduğuAdres
        prev_item_ilkodu[i] = item_ilkodu[i].value = user_dict[i].İlKodu
        prev_item_ilcekodu[i] = item_ilcekodu[i].value = user_dict[i].İlçeKodu
        prev_item_postakodu[i] = item_postakodu[i].value = user_dict[i].PostaKodu
        prev_item_birimmudurkullaniciadi[i] = item_birimmudurkullaniciadi[i].value = user_dict[i].BirimMüdürKullanıcıAdı
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
                    'EskiBirimKodu' : prev_item_birimkodu[i],
                    'BirimKodu' : item_birimkodu[i].value,
                    'BirimAdı' : item_birimadi[i].value,
                    'ÜstBirimKodu' : item_ustbirimkodu[i].value,
                    'BulunduğuAdres' : item_bulunduguadres[i].value,
                    'İlKodu' : item_ilkodu[i].value,
                    'İlçeKodu' : item_ilcekodu[i].value,
                    'PostaKodu' : item_postakodu[i].value,
                    'BirimMüdürKullanıcıAdı' : item_birimmudurkullaniciadi[i].value
                }
                fetch('./unit', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    item_error_birimkodu[i+1].style.visibility = 'hidden'
                    item_error_ustbirimkodu[i+1].style.visibility = 'hidden'
                    item_error_ilkodu[i+1].style.visibility = 'hidden'
                    item_error_ilcekodu[i+1].style.visibility = 'hidden'
                    item_error_birimmudurkullaniciadi[i+1].style.visibility = 'hidden'
                    if(data === 'OK'){
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'

                        for(let j = 0;j < item_list.length;j++){
                            item_list[j][i].setAttribute('style','pointer-events:none')
                            prev_item_list[j][i] = item_list[j][i].value
                        }
                    }
                    else {
                        if(data == "SAME BIRIMKODU"){
                            item_error_birimkodu[i+1].style.visibility = 'visible'
                            item_error_birimkodu[i+1].innerHTML = 'Birim Kodu zaten var'
                        }
                        else if(data == "NO USTBIRIMKODU"){
                            item_error_ustbirimkodu[i+1].style.visibility = 'visible'
                            item_error_ustbirimkodu[i+1].innerHTML = 'Bu ÜstBirimKodu yok'
                        }
                        else if(data == "NO ILKODU-ILCEKODU"){
                            item_error_ilkodu[i+1].style.visibility = 'visible'
                            item_error_ilcekodu[i+1].style.visibility = 'visible'
                            item_error_ilkodu[i+1].innerHTML = 'Bu İlKodu+İlçeKodu yok'
                            item_error_ilcekodu[i+1].innerHTML = 'Bu İlKodu+İlçeKodu yok'
                        }
                        else if(data == "NO BIRIMMUDURKULLANICIADI"){
                            item_error_birimmudurkullaniciadi[i+1].style.visibility = 'visible'
                            item_error_birimmudurkullaniciadi[i+1].innerHTML = 'Bu Kullanıcı Adı yok'
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
            item_error_birimkodu[i+1].style.visibility = 'hidden'
            item_error_ustbirimkodu[i+1].style.visibility = 'hidden'
            item_error_ilkodu[i+1].style.visibility = 'hidden'
            item_error_ilcekodu[i+1].style.visibility = 'hidden'
            item_error_birimmudurkullaniciadi[i+1].style.visibility = 'hidden'

            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].value = prev_item_list[j][i]
                item_list[j][i].setAttribute('style','pointer-events:none')
            }
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        item_error_birimkodu[i+1].style.visibility = 'hidden'
        item_error_ustbirimkodu[i+1].style.visibility = 'hidden'
        item_error_ilkodu[i+1].style.visibility = 'hidden'
        item_error_ilcekodu[i+1].style.visibility = 'hidden'
        item_error_birimmudurkullaniciadi[i+1].style.visibility = 'hidden'
        send_data = {
            'BirimKodu' : prev_item_birimkodu[i]
        }
        fetch('./unit', {
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


