const filter_problemtipiID = document.getElementById("filter_problemtipiID")
const filter_problemtanimi = document.getElementById("filter_problemtanimi")
const filter_problemitanimlayiciadi = document.getElementById("filter_problemitanimlayiciadi")
const filter_problemitanimlayicisoyadi = document.getElementById("filter_problemitanimlayicisoyadi")
const filter_problemitanimlayantcnopasaportno = document.getElementById("filter_problemitanimlayantcnopasaportno")
const filter_hedeflenenamactanimi = document.getElementById("filter_hedeflenenamactanimi")

const filter_list = []
filter_list[0] = filter_problemtipiID
filter_list[1] = filter_problemtanimi
filter_list[2] = filter_problemitanimlayiciadi
filter_list[3] = filter_problemitanimlayicisoyadi
filter_list[4] = filter_problemitanimlayantcnopasaportno
filter_list[5] = filter_hedeflenenamactanimi


const filter_create = document.getElementById("filter_create")
const filter_list_btn = document.getElementById("filter_list")

const item_problemtipiID = document.getElementsByClassName("item_problemtipiID")
const item_problemtanimi = document.getElementsByClassName("item_problemtanimi")
const item_problemitanimlayiciadi = document.getElementsByClassName("item_problemitanimlayiciadi")
const item_problemitanimlayicisoyadi = document.getElementsByClassName("item_problemitanimlayicisoyadi")
const item_problemitanimlayantcnopasaportno = document.getElementsByClassName("item_problemitanimlayantcnopasaportno")
const item_hedeflenenamactanimi = document.getElementsByClassName("item_hedeflenenamactanimi")

const item_list = []
item_list[0] = item_problemtipiID
item_list[1] = item_problemtanimi
item_list[2] = item_problemitanimlayiciadi
item_list[3] = item_problemitanimlayicisoyadi
item_list[4] = item_problemitanimlayantcnopasaportno
item_list[5] = item_hedeflenenamactanimi

const prev_item_problemtipiID = []
const prev_item_problemtanimi = []
const prev_item_problemitanimlayiciadi = []
const prev_item_problemitanimlayicisoyadi = []
const prev_item_problemitanimlayantcnopasaportno = []
const prev_item_hedeflenenamactanimi= []

const prev_item_list = []
prev_item_list[0] = prev_item_problemtipiID
prev_item_list[1] = prev_item_problemtanimi
prev_item_list[2] = prev_item_problemitanimlayiciadi
prev_item_list[3] = prev_item_problemitanimlayicisoyadi
prev_item_list[4] = prev_item_problemitanimlayantcnopasaportno
prev_item_list[5] = prev_item_hedeflenenamactanimi

const update_btn = document.getElementsByClassName("update")
const quit_btn = document.getElementsByClassName("quit")
const delete_btn = document.getElementsByClassName("delete")

const rows = document.getElementsByClassName("item")
const item_error = document.getElementsByClassName("label_item_problemID")

let current_page = 1
let total_record = 0

const prev_btn = document.getElementById("prev_btn")
const next_btn = document.getElementById("next_btn")

for(let i = 0;i < quit_btn.length;i++){
    quit_btn[i].style.opacity = '0.5'
}

function mandatory_filter(){
    let b = true
    for(let i = 0;i < filter_list.length-1;i++){
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
    for(let i = 0;i < filter_list.length-1;i++){
       filter_list[i].setAttribute("style","border-color:black")
    }
}
function mandatory_item(j){
    let b = true
    for(let i = 0;i < item_list.length-1;i++){
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
            'ProblemTipiID' : filter_problemtipiID.value,
            'ProblemTanımı' : filter_problemtanimi.value,
            'ProblemiTanımlayıcıAdı' : filter_problemitanimlayiciadi.value,
            'ProblemiTanımlayıcıSoyadı' : filter_problemitanimlayicisoyadi.value,
            'ProblemiTanımlayanTCnoPasaportno' : filter_problemitanimlayantcnopasaportno.value,
            'HedeflenenAmaçTanımı' : filter_hedeflenenamactanimi.value
        }
        fetch('./problem', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(send_data)
        }).then(response => response.json())
        .then(data => {
            console.log('NEW USER CREATED : ' + data);
            item_error[0].style.visibility = 'hidden'
            if(data === "OK"){
                for(let i = 0;i < filter_list.length;i++){
                    filter_list[i].value = ''
                }
                list_from_zero(1)
            }
            else {
                item_error[0].style.visibility = 'visible'
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
    item_error[0].style.visibility = 'hidden'
    let send_data = {
        'Type' : 'LIST',
        'ProblemTipiID' : filter_problemtipiID.value,
        'ProblemTanımı' : filter_problemtanimi.value,
        'ProblemiTanımlayıcıAdı' : filter_problemitanimlayiciadi.value,
        'ProblemiTanımlayıcıSoyadı' : filter_problemitanimlayicisoyadi.value,
        'ProblemiTanımlayanTCnoPasaportno' : filter_problemitanimlayantcnopasaportno.value,
        'HedeflenenAmaçTanımı' : filter_hedeflenenamactanimi.value,
        'Sayfa' : page
    }
    fetch('./problem', {
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
        prev_item_problemtipiID[i] = item_problemtipiID[i].value = user_dict[i].ProblemTipiID
        prev_item_problemtanimi[i] = item_problemtanimi[i].value = user_dict[i].ProblemTanımı
        prev_item_problemitanimlayiciadi[i] = item_problemitanimlayiciadi[i].value = user_dict[i].ProblemiTanımlayıcıAdı
        prev_item_problemitanimlayicisoyadi[i] = item_problemitanimlayicisoyadi[i].value = user_dict[i].ProblemiTanımlayıcıSoyadı
        prev_item_problemitanimlayantcnopasaportno[i] = item_problemitanimlayantcnopasaportno[i].value = user_dict[i].ProblemiTanımlayanTCnoPasaportno
        prev_item_hedeflenenamactanimi[i] = item_hedeflenenamactanimi[i].value = user_dict[i].HedeflenenAmaçTanımı

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
                send_data = {
                    'EskiProblemTipiID' : prev_item_problemtipiID[i],
                    'ProblemTipiID' : item_problemtipiID[i].value,
                    'ProblemTanımı' : item_problemtanimi[i].value,
                    'ProblemiTanımlayıcıAdı' : item_problemitanimlayiciadi[i].value,
                    'ProblemiTanımlayıcıSoyadı' : item_problemitanimlayicisoyadi[i].value,
                    'ProblemiTanımlayanTCnoPasaportno' : item_problemitanimlayantcnopasaportno[i].value,
                    'HedeflenenAmaçTanımı' : item_hedeflenenamactanimi[i].value,
                }
                fetch('./problem', {
                    method : 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(send_data)
                }).then(response => response.json())
                .then(data => {
                    console.log('USER UPDATED : ');
                    console.log(data);
                    if(data === 'OK'){
                        item_error[i+1].style.visibility = 'hidden'
                        update_btn[i].value = 'Güncelle'
                        quit_btn[i].style.opacity = '0.5'
    
                        for(let j = 0;j < item_list.length;j++){
                            item_list[j][i].setAttribute('style','pointer-events:none')
                            prev_item_list[j][i] = item_list[j][i].value
                        }
                    }
                    else {
                        item_error[i+1].style.visibility = 'visible'
                       
                    }
                })
            }
        }
    })
    quit_btn[i].addEventListener("click", (e) => {
        if(quit_btn[i].style.opacity == '1'){
            update_btn[i].value = 'Güncelle'
            quit_btn[i].style.opacity = '0.5'
            reset_item(i)
            item_error[i+1].style.visibility = 'hidden'

            for(let j = 0;j < item_list.length;j++){
                item_list[j][i].value = prev_item_list[j][i]
                item_list[j][i].setAttribute('style','pointer-events:none')
            }
        }
    })
    delete_btn[i].addEventListener("click", (e) => {
        send_data = {
            'ProblemTipiID' : prev_item_problemtipiID[i]
        }
        reset_item(i)
        fetch('./problem', {
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