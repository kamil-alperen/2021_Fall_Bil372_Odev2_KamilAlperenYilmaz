const problemler = document.getElementsByClassName('problemler')[0]
const problemmüdahaleleri = document.getElementsByClassName('problemmüdahaleleri')[0]
const problemçıktıları = document.getElementsByClassName('problemçıktıları')[0]
const ilavemüdahaledetaylar = document.getElementsByClassName('ilavemüdahaledetaylar')[0]
const ilaveçıktıdetaylar = document.getElementsByClassName('ilaveçıktıdetaylar')[0]
const personelproblem = document.getElementsByClassName('personelproblem')[0]
const problemçıktıdeğerlendirme = document.getElementsByClassName('problemçıktıdeğerlendirme')[0]
const problemdurumdeğerlendirme = document.getElementsByClassName('problemdurumdeğerlendirme')[0]
const çalışanproblem = document.getElementsByClassName('çalışanproblem')[0]
const previouspage_btn = document.getElementById("previouspage")



problemler.addEventListener('click', (e) => {
    location.replace('./problemler_form')
})
problemmüdahaleleri.addEventListener('click', (e) => {
    location.replace('./problemmüdahaleleri_form')
})
problemçıktıları.addEventListener('click', (e) => {
    location.replace('./problemçıktıları_form')
})
ilavemüdahaledetaylar.addEventListener('click', (e) => {
    location.replace('./ilavemüdahaledetaylar_form')
})
ilaveçıktıdetaylar.addEventListener('click', (e) => {
    location.replace('./ilaveçıktıdetaylar_form')
})
personelproblem.addEventListener('click', (e) => {
    location.replace('./personelproblem_form')
})
problemçıktıdeğerlendirme.addEventListener('click', (e) => {
    location.replace('./problemçıktıdeğerlendirme_form')
})
problemdurumdeğerlendirme.addEventListener('click', (e) => {
    location.replace('./problemdurumdeğerlendirme_form')
})
çalışanproblem.addEventListener('click', (e) => {
    location.replace('./çalışanproblem_form')
})

previouspage_btn.addEventListener('click', (e) => {
    location.replace('./')
})
