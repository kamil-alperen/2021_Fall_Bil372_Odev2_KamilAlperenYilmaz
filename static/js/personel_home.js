const alan_form = document.getElementsByClassName('manage-alan')[0]
const sinif_form = document.getElementsByClassName('manage-sinif')[0]
const cikti_form = document.getElementsByClassName('manage-cikti')[0]
const belirtec_form = document.getElementsByClassName('manage-belirtec')[0]
const problembirim = document.getElementsByClassName('manage-problembirim')[0]
const problem = document.getElementsByClassName('manage-problem')[0]
const previouspage_btn = document.getElementById("previouspage")

let müdür = false

fetch('./isManager/').
then(response => response.json()).
then(data => {
    if(data == "True"){
        müdür = True
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

if(müdür){
    problem.addEventListener("click", (e) => {
        location.replace('./problemform')
    })
}
else {
    problem.setAttribute("style", "display:none")
}