const alan_form = document.getElementsByClassName('manage-alan')[0]
const sinif_form = document.getElementsByClassName('manage-sinif')[0]
const cikti_form = document.getElementsByClassName('manage-cikti')[0]
const belirtec_form = document.getElementsByClassName('manage-belirtec')[0]
const problembirim = document.getElementsByClassName('manage-problembirim')[0]
const previouspage_btn = document.getElementById("previouspage")
const nextpage_btn = document.getElementById("nextpage")


fetch('./isManager/').
then(response => response.json()).
then(data => {
    console.log("isManager : "+data);
    if(data == "True"){
        nextpage_btn.style.visibility = 'visible'
        nextpage_btn.addEventListener("click", (e) => {
            location.replace('./nextPage')
        })
    }
})


alan_form.addEventListener('click', (e) => {
    location.replace('./areaform')
})
sinif_form.addEventListener('click', (e) => {
    location.replace('./classform')
})
cikti_form.addEventListener('click', (e) => {
    location.replace('./outputform')
})
belirtec_form.addEventListener('click', (e) => {
    location.replace('./indicatorform')
})
problembirim.addEventListener('click', (e) => {
    location.replace('./problemunitform')
})
previouspage_btn.addEventListener('click', (e) => {
    location.replace('../logout')
})

