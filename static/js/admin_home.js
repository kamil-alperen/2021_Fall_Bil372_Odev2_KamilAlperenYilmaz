const user_form = document.getElementsByClassName('manage-users')[0]
const employee_form = document.getElementsByClassName('manage-employees')[0]
const city_form = document.getElementsByClassName('manage-cities')[0]
const district_form = document.getElementsByClassName('manage-districts')[0]
const unit_form = document.getElementsByClassName('manage-units')[0]
const problem_form = document.getElementsByClassName('manage-problems')[0]
const mudahale_form = document.getElementsByClassName('manage-mudahaleler')[0]
const aktivite_form = document.getElementsByClassName('manage-aktiviteler')[0]
const müdahaledetaylar_form = document.getElementsByClassName('manage-müdahaledetaylar')[0]
const çıktıdetaylar_form = document.getElementsByClassName('manage-çıktıdetaylar')[0]
const nextpage_btn = document.getElementById("nextpage")
const exit_btn = document.getElementById("exit")

user_form.addEventListener('click', (e) => {
    location.replace('./userform')
})
employee_form.addEventListener('click', (e) => {
    location.replace('./employeeform')
})
city_form.addEventListener('click', (e) => {
    location.replace('./cityform')
})
district_form.addEventListener('click', (e) => {
    location.replace('./districtform')
})
unit_form.addEventListener('click', (e) => {
    location.replace('./unitform')
})
problem_form.addEventListener('click', (e) => {
    location.replace('./problemform')
})
mudahale_form.addEventListener('click', (e) => {
    location.replace('./interventionform')
})
aktivite_form.addEventListener('click', (e) => {
    location.replace('./activityform')
})
müdahaledetaylar_form.addEventListener('click', (e) => {
    location.replace('./müdahaledetaylarform')
})
çıktıdetaylar_form.addEventListener('click', (e) => {
    location.replace('./çıktıdetaylarform')
})

nextpage_btn.addEventListener("click", (e) => {
    location.replace('../admin_nextpage')
})
exit_btn.addEventListener('click', (e) => {
    location.replace('../logout')
})