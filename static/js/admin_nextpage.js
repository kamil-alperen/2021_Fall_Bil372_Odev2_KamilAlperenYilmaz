const alan_form = document.getElementsByClassName('manage-alan')[0]
const sinif_form = document.getElementsByClassName('manage-sinif')[0]
const cikti_form = document.getElementsByClassName('manage-cikti')[0]
const belirtec_form = document.getElementsByClassName('manage-belirtec')[0]
const problembirim = document.getElementsByClassName('manage-problembirim')[0]
const previouspage_btn = document.getElementById("previouspage")

alan_form.addEventListener('click', (e) => {
    location.replace('../personel/areaform')
})
sinif_form.addEventListener('click', (e) => {
    location.replace('../personel/classform')
})
cikti_form.addEventListener('click', (e) => {
    location.replace('../personel/outputform')
})
belirtec_form.addEventListener('click', (e) => {
    location.replace('../personel/indicatorform')
})
problembirim.addEventListener('click', (e) => {
    location.replace('../personel/problemunitform')
})
previouspage_btn.addEventListener('click', (e) => {
    location.replace('../admin')
})