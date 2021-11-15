from os import abort
from flask import Flask, request, redirect, sessions, url_for, render_template
from flask_login.utils import logout_user
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user
from sqlalchemy.sql.elements import Null
from sqlalchemy.sql.schema import PrimaryKeyConstraint
from datetime import datetime
from cryptography.fernet import Fernet
from sqlalchemy.ext.hybrid import hybrid_property

key = Fernet.generate_key()
fernet = Fernet(key) 
app = Flask(__name__)
kalıcı_birim = "Yönetim"
ENV = 'prod'

if(ENV == 'dev'):
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:kamil1789@localhost/COMPANY'
else:
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://owirdaelqqvcat:e813c0f8f0ce7de03b7e446085f29d2b81c4e75b22799c8ad7aef66640b43beb@ec2-34-195-233-155.compute-1.amazonaws.com:5432/d5ochgc7du2jfp'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


app.config['SECRET_KEY'] = 'thisissecret'
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
api = Api(app)

system_admin_name = "SystemAdmin"

class Kullanıcı(UserMixin, db.Model):
    __tablename__ = "Kullanıcı"
    KullanıcıAdı = db.Column(db.String(30), db.ForeignKey('Personel.KullanıcıAdı'), primary_key=True)
    Şifre = db.Column(db.String(30), nullable=False)
    def get_id(self):
        try:
            return self.KullanıcıAdı
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')

class İlçe(db.Model):
    __tablename__ = "İlçe"
    İlKodu = db.Column(db.String(15), db.ForeignKey('İl.İlKodu'), nullable=False)
    İlçeKodu = db.Column(db.String(15), nullable=False)
    İlçeAdı = db.Column(db.String(30), nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('İlKodu', 'İlçeKodu'),
    )
    il_ilçe_personeller = db.relationship('Personel', backref='İlçe', lazy=True)
    ilçe_birimler = db.relationship('Birim', backref='ilçe', lazy=True)


class Personel(db.Model):
    __tablename__ = "Personel"
    KullanıcıAdı = db.Column(db.String(30), primary_key=True)
    Email = db.Column(db.String(50), unique=True, nullable=False)
    Ad = db.Column(db.String(30), nullable=False)
    Soyad = db.Column(db.String(20), nullable=False)
    SicilNo = db.Column(db.String(20), unique=True, nullable=False)
    Cep = db.Column(db.String(20), nullable=False)
    EvAdresi = db.Column(db.String(100), nullable=False)
    İlKodu = db.Column(db.String(15), nullable=False)
    İlçeKodu = db.Column(db.String(15), nullable=False)
    PostaKodu = db.Column(db.Integer, nullable=False)
    ÜstKullanıcıAdı = db.Column(db.String(30), db.ForeignKey('Personel.KullanıcıAdı'), nullable=True)
    ÇalıştığıBirimKodu = db.Column(db.Integer, db.ForeignKey('Birim.BirimKodu'), nullable=False)
    üst_kullanıcı_adı = db.relationship('Personel', remote_side=[KullanıcıAdı], uselist=False)
    kullanıcı_ = db.relationship('Kullanıcı', backref='personel', lazy=True, uselist=False)
    birim_müdürü = db.relationship('Birim', primaryjoin="Personel.KullanıcıAdı==Birim.BirimMüdürKullanıcıAdı")
    __table_args__ = (db.ForeignKeyConstraint([İlKodu, İlçeKodu],
                                              [İlçe.İlKodu, İlçe.İlçeKodu]),
                      {})

class İl(db.Model):
    __tablename__ = "İl"
    İlKodu = db.Column(db.String(15), primary_key=True)
    İlAdı = db.Column(db.String(30), nullable=False)
    İlçeler = db.relationship('İlçe', backref='il', lazy=True)


class Birim(db.Model):
    __tablename__ = "Birim"
    BirimKodu = db.Column(db.Integer, primary_key=True)
    BirimAdı = db.Column(db.String(30), nullable=False)
    ÜstBirimKodu = db.Column(db.Integer, db.ForeignKey('Birim.BirimKodu'), nullable=True)
    BulunduğuAdres = db.Column(db.String(100), nullable=False)
    İlKodu = db.Column(db.String(15), nullable=False)
    İlçeKodu = db.Column(db.String(15), nullable=False)
    PostaKodu = db.Column(db.Integer, nullable=False)
    BirimMüdürKullanıcıAdı = db.Column(db.String(30), db.ForeignKey('Personel.KullanıcıAdı'), nullable=True)
    birim_personeller = db.relationship('Personel', primaryjoin="Personel.ÇalıştığıBirimKodu==Birim.BirimKodu")
    üst_birim_kodu = db.relationship('Birim', remote_side=[BirimKodu], uselist=False)
    birim_eşleşme = db.relationship('ProblemBirim', backref='birim', lazy=True)
    __table_args__ = (db.ForeignKeyConstraint([İlKodu, İlçeKodu],
                                              [İlçe.İlKodu, İlçe.İlçeKodu]),
                      {})

class Problem(db.Model):
    __tablename__ = "Problem"
    ProblemTipiID = db.Column(db.Integer, primary_key=True)
    ProblemTanımı = db.Column(db.String(50), nullable=False)
    ProblemiTanımlayıcıAdı = db.Column(db.String(30), nullable=False)
    ProblemiTanımlayıcıSoyadı = db.Column(db.String(20), nullable=False)
    ProblemiTanımlayanTCnoPasaportno = db.Column(db.String(30), nullable=False)
    HedeflenenAmaçTanımı = db.Column(db.String(50), nullable=False)
    problem_eşleşme = db.relationship('ProblemBirim', backref='problem', lazy=True)

class Alan(db.Model):
    __tablename__ = "Alan"
    AlanID = db.Column(db.Integer, primary_key=True)
    AlanAdı = db.Column(db.String(30), nullable=False)
    AlanTipi = db.Column(db.Boolean, nullable=False)
    alan_müdahaleler = db.relationship('Müdahale', backref='alan', lazy=True)
    alan_çıktı = db.relationship('Çıktı', backref='alan', lazy=True)

class Sınıf(db.Model):
    __tablename__ = "Sınıf"
    SınıfID = db.Column(db.Integer, primary_key=True)
    SınıfAdı = db.Column(db.String(30), nullable=False)
    SınıfTipi = db.Column(db.Boolean, nullable=False)
    sınıf_müdahaleler = db.relationship('Müdahale', backref='sınıf', lazy=True)
    sınıf_çıktı = db.relationship('Çıktı', backref='sınıf', lazy=True)

class Müdahale(db.Model):
    __tablename__ = "Müdahale"
    AlanID = db.Column(db.Integer, db.ForeignKey('Alan.AlanID'), nullable=False)
    SınıfID = db.Column(db.Integer, db.ForeignKey('Sınıf.SınıfID'), nullable=False)
    MüdahaleID = db.Column(db.Integer, nullable=False)
    MüdahaleAdı = db.Column(db.String(30), nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('AlanID', 'SınıfID','MüdahaleID'),
    )

class Aktivite(db.Model):
    __tablename__ = "Aktivite"
    AktiviteID = db.Column(db.Integer, primary_key=True)
    AktiviteTanımı = db.Column(db.String(30), nullable=False)

class MüdahaleDetay(db.Model):
    __tablename__ = "MüdahaleDetay"
    AlanID = db.Column(db.Integer, nullable=False)
    SınıfID = db.Column(db.Integer, nullable=False)
    MüdahaleID = db.Column(db.Integer, nullable=False)
    AktiviteID = db.Column(db.Integer, nullable=False)
    Sıra = db.Column(db.Integer, nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('AlanID', 'SınıfID','MüdahaleID','AktiviteID'),
    )

class Çıktı(db.Model):
    __tablename__ = "Çıktı"
    AlanID = db.Column(db.Integer, db.ForeignKey('Alan.AlanID'), nullable=False)
    SınıfID = db.Column(db.Integer, db.ForeignKey('Sınıf.SınıfID'), nullable=False)
    ÇıktıID = db.Column(db.Integer, nullable=False)
    ÇıktıAdı = db.Column(db.String(30), nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('AlanID', 'SınıfID','ÇıktıID'),
    )

class Belirteç(db.Model):
    __tablename__ = "Belirteç"
    BelirteçID = db.Column(db.Integer, primary_key=True)
    BelirteçTanımı = db.Column(db.String(30), nullable=False)

class ÇıktıDetay(db.Model):
    __tablename__ = "ÇıktıDetay"
    AlanID = db.Column(db.Integer, nullable=False)
    SınıfID = db.Column(db.Integer, nullable=False)
    ÇıktıID = db.Column(db.Integer, nullable=False)
    BelirteçID = db.Column(db.Integer, nullable=False)
    Sıra = db.Column(db.Integer, nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('AlanID', 'SınıfID','ÇıktıID','BelirteçID'),
    )

class ProblemBirim(db.Model):
    __tablename__ = "ProblemBirim"
    ProblemID = db.Column(db.Integer, db.ForeignKey('Problem.ProblemTipiID'), nullable=False)
    BirimID = db.Column(db.Integer, db.ForeignKey('Birim.BirimKodu'), nullable=False)
    EşleşmeTarihi = db.Column(db.DateTime, nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('ProblemID', 'BirimID'),
    )


@login_manager.user_loader
def load_user(user_id):
    return Kullanıcı.query.get(user_id)

Müdür = False

@app.route('/', methods=["GET","POST"])
def login():
    if(request.method == "GET"):
        return render_template('login.html')
    else:
        log = {}
        infos = request.json
        if(db.session.query(Kullanıcı).filter(Kullanıcı.KullanıcıAdı==infos["Username"],Kullanıcı.Şifre==infos["Password"])).count() != 0:
            user = db.session.query(Kullanıcı).filter(Kullanıcı.KullanıcıAdı == infos["Username"]).first()
            if(user.KullanıcıAdı == system_admin_name):
                log['User'] = 'system_admin'
            else :
                log['User'] = 'personel'
                personel = db.session.query(Personel).filter(Personel.KullanıcıAdı == user.KullanıcıAdı).first()
                if(personel != None):
                    birim = db.session.query(Birim).filter(Birim.BirimKodu == personel.ÇalıştığıBirimKodu).first()
                    if(birim != None):
                        if(birim.BirimMüdürKullanıcıAdı == user.KullanıcıAdı):
                            Müdür = True
            login_user(user)
            return log
        else:
            log['User'] = 'NO_RECORD'
            return log


        
@app.route('/admin/', methods=["GET"])
@login_required
def admin_home_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_home.html')
    else:
        abort(401)

@app.route('/personel/', methods=["GET", "POST"])
@login_required
def personel_home_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return redirect(url_for('admin_home_nextpage'))
    else:
        return render_template('personel_home.html')

@app.route('/personel/isManager/', methods=["GET", "POST"])
@login_required
def personel_home_question():
    if(Müdür):
        return "True"
    else:
        return "False"

@app.route('/admin_nextpage/', methods=["GET"])
@login_required
def admin_home_nextpage():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_nextpage.html')
    else:
        abort(401)

@app.route('/admin/userform', methods=["GET"])
@login_required
def admin_user_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_user.html')
    else:
        abort(401)

@app.route('/admin/employeeform', methods=["GET"])
@login_required
def admin_employee_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_employee.html')
    else:
        abort(401)

@app.route('/admin/cityform', methods=["GET"])
@login_required
def admin_city_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_city.html')
    else:
        abort(401)

@app.route('/admin/districtform', methods=["GET"])
@login_required
def admin_district_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_district.html')
    else:
        abort(401)

@app.route('/admin/unitform', methods=["GET"])
@login_required
def admin_unit_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_unit.html')
    else:
        abort(401)

@app.route('/admin/problemform', methods=["GET"])
@login_required
def admin_problem_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_problem.html')
    else:
        abort(401)

@app.route('/admin/problemform/isManager', methods=["GET"])
@login_required
def admin_problem_form_question():
    if(Müdür):
        return "True"
    else:
        return "False"

@app.route('/personel/areaform', methods=["GET"])
@login_required
def personel_area_form_page():
    return render_template('personel_area.html')

@app.route('/personel/classform', methods=["GET"])
@login_required
def personel_class_form_page():
    return render_template('personel_class.html')

@app.route('/admin/interventionform', methods=["GET"])
@login_required
def admin_intervention_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_intervention.html')
    else:
        abort(401)

@app.route('/admin/activityform', methods=["GET"])
@login_required
def admin_activity_form_page():
    if(current_user.KullanıcıAdı == system_admin_name):
        return render_template('admin_activity.html')
    else:
        abort(401)

@app.route('/personel/outputform', methods=["GET"])
@login_required
def personel_output_form_page():
    return render_template('personel_output.html')

@app.route('/personel/indicatorform', methods=["GET"])
@login_required
def personel_indicator_form_page():
    return render_template('personel_indicator.html')

@app.route('/personel/problemunitform', methods=["GET"])
@login_required
def personel_problemunit_form_page():
    return render_template('personel_problemunit.html')

@app.route('/personel/problemform', methods=["GET"])
@login_required
def personel_problem_form_page():
    if(Müdür):
        return render_template('admin_problem.html')
    else:
        abort(401)


class User(Resource):
    
    def post(self):
        infos = request.json
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Personel).filter_by(KullanıcıAdı=infos['Kullanıcı Adı']).count() == 0):
                return "NO USERNAME"
            elif(db.session.query(Kullanıcı).filter_by(KullanıcıAdı=infos['Kullanıcı Adı']).count() == 0):
                password = infos['Şifre']
                encPassword = fernet.encrypt(password.encode())
                new_user = Kullanıcı(KullanıcıAdı=infos['Kullanıcı Adı'], Şifre=encPassword)
                db.session.add(new_user)
                db.session.commit()
                return "OK"
            else:
                return "SAME USERNAME"
        else:
            username = infos['Kullanıcı Adı']
            password = infos['Şifre']
            page = infos['Sayfa']
            user_list = db.session.query(Kullanıcı)
            if(username != ''):
                user_list = user_list.filter(Kullanıcı.KullanıcıAdı==username)
            if(password != ''):
                user_list = user_list.filter(Kullanıcı.Şifre==fernet.decrypt(password).decode())
            count = 0
            send_users = []
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed = infos['Eski Adı'] != infos['Kullanıcı Adı']
        if(changed and db.session.query(Kullanıcı).filter(Kullanıcı.KullanıcıAdı==infos['Kullanıcı Adı']).count() != 0):
            return "SAME USERNAME" # same with other username
        elif(changed and db.session.query(Personel).filter_by(KullanıcıAdı=infos['Kullanıcı Adı']).count() == 0):
                return "NO USERNAME" # there is not such a person
        else:
            global system_admin_name
            password = infos['Şifre']
            encPassword = fernet.encrypt(password.encode())
            user = Kullanıcı.query.filter_by(KullanıcıAdı=infos['Eski Adı']).first()
            if(infos['Eski Adı'] == system_admin_name):
                system_admin_name = infos['Kullanıcı Adı']
            user.KullanıcıAdı = infos['Kullanıcı Adı']
            user.Şifre = encPassword
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = Kullanıcı.query.filter_by(KullanıcıAdı=infos['Kullanıcı Adı'])
        if(user.KullanıcıAdı != system_admin_name):
            user.delete()
            db.session.commit()
        return "OK"

api.add_resource(User,'/admin/user')

class Employee(Resource):
    def post(self):
        infos = request.json
        
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Personel).filter(Personel.KullanıcıAdı==infos['KullanıcıAdı']).count() != 0):
                return "SAME KULLANICIADI"
            elif(db.session.query(Personel).filter(Personel.Email==infos['Email']).count() != 0):
                return "SAME EMAIL"
            elif(db.session.query(Personel).filter(Personel.SicilNo==infos['SicilNo']).count() != 0):
                return "SAME SICILNO"
            elif(db.session.query(İlçe).filter(İlçe.İlKodu==infos['İlKodu'], İlçe.İlçeKodu==infos['İlçeKodu']).count() == 0):
                return "NO ILKODU-ILCEKODU"
            elif(infos['ÜstKullanıcıAdı'] != '' and db.session.query(Personel).filter(Personel.KullanıcıAdı==infos['ÜstKullanıcıAdı']).count() == 0):
                return "NO USTKULLANICIADI"
            elif(db.session.query(Birim).filter(Birim.BirimKodu==infos['ÇalıştığıBirimKodu']).count() == 0):
                return "NO CALISTIGIBIRIMKODU"
            else:
                new_user = Personel(
                    KullanıcıAdı=infos['KullanıcıAdı'],
                    Email=infos['Email'],
                    Ad=infos['Ad'],
                    Soyad=infos['Soyad'],
                    SicilNo=infos['SicilNo'],
                    Cep=infos['Cep'],
                    EvAdresi=infos['EvAdresi'],
                    İlKodu=infos['İlKodu'],
                    İlçeKodu=infos['İlçeKodu'],
                    PostaKodu=infos['PostaKodu'],
                    ÜstKullanıcıAdı=infos['ÜstKullanıcıAdı'],
                    ÇalıştığıBirimKodu=infos['ÇalıştığıBirimKodu']
                )
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            KullanıcıAdı=infos['KullanıcıAdı']
            Email=infos['Email']
            Ad=infos['Ad']
            Soyad=infos['Soyad']
            SicilNo=infos['SicilNo']
            Cep=infos['Cep']
            EvAdresi=infos['EvAdresi']
            İlKodu=infos['İlKodu']
            İlçeKodu=infos['İlçeKodu']
            PostaKodu=infos['PostaKodu']
            ÜstKullanıcıAdı=infos['ÜstKullanıcıAdı']
            ÇalıştığıBirimKodu=''.join(infos['ÇalıştığıBirimKodu'])
            page = infos['Sayfa']
            user_list = db.session.query(Personel)
            if(KullanıcıAdı != ''):
                user_list = user_list.filter(Personel.KullanıcıAdı==KullanıcıAdı)
            if(Email != ''):
                user_list = user_list.filter(Personel.Email==Email)
            if(Ad != ''):
                user_list = user_list.filter(Personel.Ad==Ad)
            if(Soyad != ''):
                user_list = user_list.filter(Personel.Soyad==Soyad)
            if(SicilNo != ''):
                user_list = user_list.filter(Personel.SicilNo==SicilNo)
            if(Cep != ''):
                user_list = user_list.filter(Personel.Cep==Cep)
            if(EvAdresi != ''):
                user_list = user_list.filter(Personel.EvAdresi==EvAdresi)
            if(İlKodu != ''):
                user_list = user_list.filter(Personel.İlKodu==İlKodu)
            if(İlçeKodu != ''):
                user_list = user_list.filter(Personel.İlçeKodu==İlçeKodu)
            if(PostaKodu != ''):
                user_list = user_list.filter(Personel.PostaKodu==PostaKodu)
            if(ÜstKullanıcıAdı != ''):
                user_list = user_list.filter(Personel.ÜstKullanıcıAdı==ÜstKullanıcıAdı)
            if(ÇalıştığıBirimKodu != ''):
                user_list = user_list.filter(Personel.ÇalıştığıBirimKodu==ÇalıştığıBirimKodu)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*3-3:page*3]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
    def put(self):
        infos = request.json
        if(infos['KullanıcıAdı(D)'] and db.session.query(Personel).filter(Personel.KullanıcıAdı==infos['KullanıcıAdı']).count() != 0):
            return "SAME KULLANICIADI"
        elif(infos['Email(D)'] and db.session.query(Personel).filter(Personel.Email==infos['Email']).count() != 0):
            return "SAME EMAIL"
        elif(infos['SicilNo(D)'] and db.session.query(Personel).filter(Personel.SicilNo==infos['SicilNo']).count() != 0):
            return "SAME SICILNO"
        elif(db.session.query(İlçe).filter(İlçe.İlKodu==infos['İlKodu'], İlçe.İlçeKodu==infos['İlçeKodu']).count() == 0):
            return "NO ILKODU-ILCEKODU"
        elif(infos['ÜstKullanıcıAdı'] != '' and db.session.query(Personel).filter(Personel.KullanıcıAdı==infos['ÜstKullanıcıAdı']).count() == 0):
            return "NO USTKULLANICIADI"
        elif(db.session.query(Birim).filter(Birim.BirimKodu==infos['ÇalıştığıBirimKodu']).count() == 0):
            return "NO CALISTIGIBIRIMKODU"
        else:
            person = Personel.query.filter_by(KullanıcıAdı=infos['Eski Adı']).first()
            person.KullanıcıAdı = infos['KullanıcıAdı']
            person.Email=infos['Email']
            person.Ad=infos['Ad']
            person.Soyad=infos['Soyad']
            person.SicilNo=infos['SicilNo']
            person.Cep=infos['Cep']
            person.EvAdresi=infos['EvAdresi']
            person.İlKodu=infos['İlKodu']
            person.İlçeKodu=infos['İlçeKodu']
            person.PostaKodu=infos['PostaKodu']
            person.ÜstKullanıcıAdı=infos['ÜstKullanıcıAdı']
            person.ÇalıştığıBirimKodu=''.join(infos['ÇalıştığıBirimKodu'])
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        print(infos['KullanıcıAdı'])
        person = Personel.query.filter_by(KullanıcıAdı=infos['KullanıcıAdı'])
        person.delete()
        db.session.commit()
        return "OK"

api.add_resource(Employee,'/admin/employee')

class City(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(İl).filter_by(İlKodu=infos['İlKodu']).count() == 0):
                new_user = İl(İlKodu=infos['İlKodu'], İlAdı=infos['İlAdı'])
                db.session.add(new_user)
                db.session.commit()
                return "OK"
            else:
                return "SAME ILKODU"
        else:
            İlKodu = infos['İlKodu']
            İlAdı = infos['İlAdı']
            page = infos['Sayfa']
            if(İlKodu != '' and İlAdı != ''):
                user_list = İl.query.filter(İl.İlKodu==İlKodu,İl.İlAdı==İlAdı).all()[::-1]
            elif(İlKodu != ''):
                user_list = İl.query.filter_by(İlKodu=İlKodu).all()[::-1]
            elif(İlAdı != ''):
                user_list = İl.query.filter_by(İlAdı=İlAdı).all()[::-1]
            else:
                user_list = İl.query.all()[::-1]
            send_users = []
            count = 0
            for the_user in user_list:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed = infos['EskiİlKodu'] != infos['İlKodu']
        if(changed and db.session.query(İl).filter(İl.İlKodu==infos['İlKodu']).count() != 0):
            return "SAME ILKODU"
        else:
            user = İl.query.filter_by(İlKodu=infos['EskiİlKodu']).first()
            user.İlKodu = infos['İlKodu']
            user.İlAdı = infos['İlAdı'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = İl.query.filter_by(İlKodu=infos['İlKodu'])
        user.delete()
        db.session.commit()
        return "OK"

api.add_resource(City,'/admin/city')

class District(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(İl).filter(İl.İlKodu==infos['İlKodu']).count() == 0):
                return "NO ILKODU"
            elif(db.session.query(İlçe).filter(İlçe.İlKodu==infos['İlKodu'], İlçe.İlçeKodu==infos['İlçeKodu']).count() == 0):
                new_user = İlçe(İlKodu=infos['İlKodu'], İlçeKodu=infos['İlçeKodu'], İlçeAdı=infos['İlçeAdı'])
                db.session.add(new_user)
                db.session.commit()
                return "OK"
            else:
                return "SAME ILKODU-ILCEKODU"
        else:
            İlKodu = ''.join(infos['İlKodu'])
            İlçeKodu = ''.join(infos['İlçeKodu'])
            İlçeAdı = infos['İlçeAdı']
            page = infos['Sayfa']
            user_list = db.session.query(İlçe)
            if(İlKodu != ''):
                user_list = user_list.filter(İlçe.İlKodu==İlKodu)
            if(İlçeKodu != ''):
                user_list = user_list.filter(İlçe.İlçeKodu==İlçeKodu)
            if(İlçeAdı != ''):
                user_list = user_list.filter(İlçe.İlçeAdı==İlçeAdı)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed = infos['EskiİlKodu'] != infos['İlKodu'] or infos['EskiİlçeKodu'] != infos['İlçeKodu']
        if(changed and db.session.query(İlçe).filter(İlçe.İlKodu==infos['İlKodu'],İlçe.İlçeKodu==infos['İlçeKodu']).count() != 0):
            return "SAME ILKODU-ILCEKODU"
        elif(changed and db.session.query(İl).filter(İl.İlKodu==infos['İlKodu']).count() == 0):
            return "NO ILKODU"
        else:
            user = İlçe.query.filter(İlçe.İlKodu==infos['EskiİlKodu'],İlçe.İlçeKodu==infos['EskiİlçeKodu']).first()
            user.İlKodu = infos['İlKodu']
            user.İlçeKodu = infos['İlçeKodu']
            user.İlçeAdı = infos['İlçeAdı'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = İlçe.query.filter(İlçe.İlKodu==infos['İlKodu'],İlçe.İlçeKodu==infos['İlçeKodu'])
        user.delete()
        db.session.commit()
        return "OK"

api.add_resource(District,'/admin/district')

class Unit(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Birim).filter(Birim.BirimKodu==infos['BirimKodu']).count()!=0):
                return "SAME BIRIMKODU"
            elif(infos['ÜstBirimKodu'] != "NULL" and db.session.query(Birim).filter(Birim.ÜstBirimKodu==infos['ÜstBirimKodu']).count()==0):
                return "NO USTBIRIMKODU"
            elif(db.session.query(İlçe).filter(İlçe.İlKodu==infos['İlKodu'], İlçe.İlçeKodu==infos['İlçeKodu']).count()==0):
                return "NO ILKODU-ILCEKODU"
            elif(infos['BirimMüdürKullanıcıAdı'] != 'NULL' and db.session.query(Personel).filter(Personel.KullanıcıAdı==infos['BirimMüdürKullanıcıAdı']).count()==0):
                return "NO BIRIMMUDURKULLANICIADI"
            else:
                new_user = Birim(
                    BirimKodu=infos['BirimKodu'],
                    BirimAdı=infos['BirimAdı'],
                    ÜstBirimKodu=infos['ÜstBirimKodu'],
                    BulunduğuAdres=infos['BulunduğuAdres'],
                    İlKodu=infos['İlKodu'],
                    İlçeKodu=infos['İlçeKodu'],
                    PostaKodu=infos['PostaKodu'],
                    BirimMüdürKullanıcıAdı=infos['BirimMüdürKullanıcıAdı']
                )
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            BirimKodu=infos['BirimKodu']
            BirimAdı=infos['BirimAdı']
            ÜstBirimKodu=infos['ÜstBirimKodu']
            BulunduğuAdres=infos['BulunduğuAdres']
            İlKodu=infos['İlKodu']
            İlçeKodu=infos['İlçeKodu']
            PostaKodu=infos['PostaKodu']
            BirimMüdürKullanıcıAdı=infos['BirimMüdürKullanıcıAdı']
            page = infos['Sayfa']
            user_list = db.session.query(Birim)
            if(BirimKodu != ''):
                user_list = user_list.filter(Birim.BirimKodu==BirimKodu)
            if(BirimAdı != ''):
                user_list = user_list.filter(Birim.BirimAdı==BirimAdı)
            if(ÜstBirimKodu != ''):
                user_list = user_list.filter(Birim.ÜstBirimKodu==ÜstBirimKodu)
            if(BulunduğuAdres != ''):
                user_list = user_list.filter(Birim.BulunduğuAdres==BulunduğuAdres)
            if(İlKodu != ''):
                user_list = user_list.filter(Birim.İlKodu==İlKodu)
            if(İlçeKodu != ''):
                user_list = user_list.filter(Birim.İlçeKodu==İlçeKodu)
            if(PostaKodu != ''):
                user_list = user_list.filter(Birim.PostaKodu==PostaKodu)
            if(BirimMüdürKullanıcıAdı != ''):
                user_list = user_list.filter(Birim.BirimMüdürKullanıcıAdı==BirimMüdürKullanıcıAdı)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*3-3:page*3]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
    def put(self):
        infos = request.json
        changed = str(infos['EskiBirimKodu']) != infos['BirimKodu']
        if(changed and db.session.query(Birim).filter(Birim.BirimKodu==infos['BirimKodu']).count() != 0):
            return "SAME BIRIMKODU"
        elif(db.session.query(Birim).filter(Birim.ÜstBirimKodu==infos['ÜstBirimKodu']).count()==0):
            return "NO USTBIRIMKODU"
        elif(db.session.query(İlçe).filter(İlçe.İlKodu==infos['İlKodu'], İlçe.İlçeKodu==infos['İlçeKodu']).count()==0):
            return "NO ILKODU-ILCEKODU"
        elif(infos['BirimMüdürKullanıcıAdı'] != 'NULL' and db.session.query(Personel).filter(Personel.KullanıcıAdı==infos['BirimMüdürKullanıcıAdı']).count()==0):
            return "NO BIRIMMUDURKULLANICIADI"
        else:
            birim = Birim.query.filter_by(BirimKodu=infos['EskiBirimKodu']).first()
            birim.BirimKodu = infos['BirimKodu']
            birim.BirimAdı=infos['BirimAdı']
            kalıcı_birim = infos['BirimAdı']
            birim.ÜstBirimKodu=infos['ÜstBirimKodu']
            birim.BulunduğuAdres=infos['BulunduğuAdres']
            birim.İlKodu=infos['İlKodu']
            birim.İlçeKodu=infos['İlçeKodu']
            birim.PostaKodu=infos['PostaKodu']
            birim.BirimMüdürKullanıcıAdı=infos['BirimMüdürKullanıcıAdı']
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        person = Birim.query.filter_by(BirimKodu=infos['BirimKodu'])
        if(person.BirimAdı != kalıcı_birim):
            person.delete()
            db.session.commit()
        return "OK"

api.add_resource(Unit,'/admin/unit')

class ProblemAPI(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Problem).filter(
                Problem.ProblemTipiID==infos['ProblemTipiID']).count() == 0):
                new_user = Problem(
                    ProblemTipiID=infos['ProblemTipiID'],
                    ProblemTanımı=infos['ProblemTanımı'],
                    ProblemiTanımlayıcıAdı=infos['ProblemiTanımlayıcıAdı'],
                    ProblemiTanımlayıcıSoyadı=infos['ProblemiTanımlayıcıSoyadı'],
                    ProblemiTanımlayanTCnoPasaportno=infos['ProblemiTanımlayanTCnoPasaportno'],
                    HedeflenenAmaçTanımı=infos['HedeflenenAmaçTanımı']
                )
                db.session.add(new_user)
                db.session.commit()
                return "OK"
            else:
                return "SAME RECORD"
        else:
            ProblemTipiID=infos['ProblemTipiID']
            ProblemTanımı=infos['ProblemTanımı']
            ProblemiTanımlayıcıAdı=infos['ProblemiTanımlayıcıAdı']
            ProblemiTanımlayıcıSoyadı=infos['ProblemiTanımlayıcıSoyadı']
            ProblemiTanımlayanTCnoPasaportno=infos['ProblemiTanımlayanTCnoPasaportno']
            HedeflenenAmaçTanımı=infos['HedeflenenAmaçTanımı']
            page = infos['Sayfa']
            user_list = db.session.query(Problem)
            if(ProblemTipiID != ''):
                user_list = user_list.filter(Problem.ProblemTipiID==ProblemTipiID)
            if(ProblemTanımı != ''):
                user_list = user_list.filter(Problem.ProblemTanımı==ProblemTanımı)
            if(ProblemiTanımlayıcıAdı != ''):
                user_list = user_list.filter(Problem.ProblemiTanımlayıcıAdı==ProblemiTanımlayıcıAdı)
            if(ProblemiTanımlayıcıSoyadı != ''):
                user_list = user_list.filter(Problem.ProblemiTanımlayıcıSoyadı==ProblemiTanımlayıcıSoyadı)
            if(ProblemiTanımlayanTCnoPasaportno != ''):
                user_list = user_list.filter(Problem.ProblemiTanımlayanTCnoPasaportno==ProblemiTanımlayanTCnoPasaportno)
            if(HedeflenenAmaçTanımı != ''):
                user_list = user_list.filter(Problem.İlçeKodu==HedeflenenAmaçTanımı)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*3-3:page*3]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
    def put(self):
        infos = request.json
        changed = str(infos['EskiProblemTipiID']) != infos['ProblemTipiID']
        if(changed and db.session.query(Problem).filter(Problem.ProblemTipiID==infos['ProblemTipiID']).count() != 0):
            return "SAME PROBLEM TIPI ID"
        else:
            problem = Problem.query.filter_by(ProblemTipiID=infos['EskiProblemTipiID']).first()
            problem.ProblemTipiID = infos['ProblemTipiID']
            problem.ProblemTanımı=infos['ProblemTanımı']
            problem.ProblemiTanımlayıcıAdı=infos['ProblemiTanımlayıcıAdı']
            problem.ProblemiTanımlayıcıSoyadı=infos['ProblemiTanımlayıcıSoyadı']
            problem.ProblemiTanımlayanTCnoPasaportno=infos['ProblemiTanımlayanTCnoPasaportno']
            problem.HedeflenenAmaçTanımı=infos['HedeflenenAmaçTanımı']
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        problem = Problem.query.filter_by(ProblemTipiID=infos['ProblemTipiID'])
        problem.delete()
        db.session.commit()
        return "OK"

api.add_resource(ProblemAPI,'/admin/problem')

class AreaAPI(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Alan).filter(Alan.AlanID==infos['AlanID']).count() != 0):
                return "SAME ALANID"
            elif(db.session.query(Alan).filter(Alan.AlanAdı==infos['AlanAdı']).count() != 0):
                return "SAME ALANADI"
            else:
                new_user = Alan(AlanID=infos['AlanID'], AlanAdı=infos['AlanAdı'], AlanTipi=infos['AlanTipi'])
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            AlanID = ''.join(infos['AlanID'])
            AlanAdı = infos['AlanAdı']
            AlanTipi = infos['AlanTipi']
            TümAlanTipleri = infos['TümAlanTipleri']
            page = infos['Sayfa']
            user_list = db.session.query(Alan)
            if(AlanID != ''):
                user_list = user_list.filter(Alan.AlanID==AlanID)
            if(AlanAdı != ''):
                user_list = user_list.filter(Alan.AlanAdı==AlanAdı)
            if(AlanTipi != '' and not TümAlanTipleri):
                user_list = user_list.filter(Alan.AlanTipi==AlanTipi)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiAlanID'] != infos['AlanID']
        changed2 = infos['EskiAlanAdı'] != infos['AlanAdı']
        if(changed1 and db.session.query(Alan).filter(Alan.AlanID==infos['AlanID']).count() != 0):
                return "SAME ALANID"
        elif(changed2 and db.session.query(Alan).filter(Alan.AlanAdı==infos['AlanAdı']).count() != 0):
                return "SAME ALANADI"
        else:
            user = Alan.query.filter(Alan.AlanID==infos['EskiAlanID'],Alan.AlanAdı==infos['EskiAlanAdı']).first()
            user.AlanID = infos['AlanID']
            user.AlanAdı = infos['AlanAdı']
            user.AlanTipi = infos['AlanTipi'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = Alan.query.filter(Alan.AlanID==infos['AlanID'],Alan.AlanAdı==infos['AlanAdı'])
        user.delete()
        db.session.commit()
        return "OK"

api.add_resource(AreaAPI,'/personel/area')

class ClassAPI(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Sınıf).filter(Sınıf.SınıfID==infos['SınıfID']).count() != 0):
                return "SAME SINIFID"
            elif(db.session.query(Sınıf).filter(Sınıf.SınıfAdı==infos['SınıfAdı']).count() != 0):
                return "SAME SINIFADI"
            else:
                new_user = Sınıf(SınıfID=infos['SınıfID'], SınıfAdı=infos['SınıfAdı'], SınıfTipi=infos['SınıfTipi'])
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            SınıfID = ''.join(infos['SınıfID'])
            SınıfAdı = infos['SınıfAdı']
            SınıfTipi = infos['SınıfTipi']
            TümSınıfTipleri = infos['TümSınıfTipleri']
            page = infos['Sayfa']
            user_list = db.session.query(Sınıf)
            if(SınıfID != ''):
                user_list = user_list.filter(Sınıf.SınıfID==SınıfID)
            if(SınıfAdı != ''):
                user_list = user_list.filter(Sınıf.SınıfAdı==SınıfAdı)
            if(SınıfTipi != '' and not TümSınıfTipleri):
                user_list = user_list.filter(Sınıf.SınıfTipi==SınıfTipi)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiSınıfID'] != infos['SınıfID']
        changed2 = infos['EskiSınıfAdı'] != infos['SınıfAdı']
        if(changed1 and db.session.query(Sınıf).filter(Sınıf.SınıfID==infos['SınıfID']).count() != 0):
                return "SAME SINIFID"
        elif(changed2 and db.session.query(Sınıf).filter(Sınıf.SınıfAdı==infos['SınıfAdı']).count() != 0):
            return "SAME SINIFADI"
        else:
            user = Sınıf.query.filter(Sınıf.SınıfID==infos['EskiSınıfID'],Sınıf.SınıfAdı==infos['EskiSınıfAdı']).first()
            user.SınıfID = infos['SınıfID']
            user.SınıfAdı = infos['SınıfAdı']
            user.SınıfTipi = infos['SınıfTipi'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = Sınıf.query.filter(Sınıf.SınıfID==infos['SınıfID'],Sınıf.SınıfAdı==infos['SınıfAdı'])
        user.delete()
        db.session.commit()
        return "OK"

api.add_resource(ClassAPI,'/personel/class')   


class Intervention(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Alan).filter(Alan.AlanID==infos['AlanID']).count() == 0):
                return "NO ALANID"
            elif(db.session.query(Sınıf).filter(Sınıf.SınıfID==infos['SınıfID']).count() == 0):
                return "NO SINIFID"
            elif(db.session.query(Müdahale).filter(Müdahale.AlanID==infos['AlanID'], Müdahale.SınıfID==infos['SınıfID'], Müdahale.MüdahaleID==infos['MüdahaleID']).count() != 0):
                return "SAME RECORD"
            else:
                new_record = Müdahale(AlanID=infos['AlanID'], SınıfID=infos['SınıfID'], MüdahaleID=infos['MüdahaleID'], MüdahaleAdı=infos['MüdahaleAdı'])
                db.session.add(new_record)
                db.session.commit()
                return "OK"
        else:
            AlanID = ''.join(infos['AlanID'])
            SınıfID = ''.join(infos['SınıfID'])
            MüdahaleID = ''.join(infos['MüdahaleID'])
            MüdahaleAdı = infos['MüdahaleAdı']
            page = infos['Sayfa']
            user_list = db.session.query(Müdahale)
            if(AlanID != ''):
                user_list = user_list.filter(Müdahale.AlanID==AlanID)
            if(SınıfID != ''):
                user_list = user_list.filter(Müdahale.SınıfID==SınıfID)
            if(MüdahaleID != ''):
                user_list = user_list.filter(Müdahale.MüdahaleID==MüdahaleID)
            if(MüdahaleAdı != ''):
                user_list = user_list.filter(Müdahale.MüdahaleAdı==MüdahaleAdı)
            send_records = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_records.append(user_dict)
                count += 1
            send_records = send_records[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_records.append(record)
            return send_records
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiAlanID'] != infos['AlanID']  
        changed2 = infos['EskiSınıfID'] != infos['SınıfID']
        changed3 = infos['EskiMüdahaleID'] != infos['MüdahaleID']
        if(changed1 and db.session.query(Alan).filter(Alan.AlanID==infos['AlanID']).count() == 0):
            return "NO ALANID"
        elif(changed2 and db.session.query(Sınıf).filter(Sınıf.SınıfID==infos['SınıfID']).count() == 0):
            return "NO SINIFID"
        elif(changed3 and db.session.query(Müdahale).filter(Müdahale.AlanID==infos['AlanID'], Müdahale.SınıfID==infos['SınıfID'], Müdahale.MüdahaleID==infos['MüdahaleID']).count() != 0):
            return "SAME RECORD"
        else:
            record = Müdahale.query.filter(Müdahale.AlanID==infos['EskiAlanID'],Müdahale.SınıfID==infos['EskiSınıfID'], Müdahale.MüdahaleID==infos['EskiMüdahaleID']).first()
            record.AlanID = infos['AlanID']
            record.SınıfID = infos['SınıfID']
            record.MüdahaleID = infos['MüdahaleID'] 
            record.MüdahaleAdı = infos['MüdahaleAdı'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        record = Müdahale.query.filter(Müdahale.AlanID==infos['AlanID'],Müdahale.SınıfID==infos['SınıfID'], Müdahale.MüdahaleID==infos['MüdahaleID'])
        record.delete()
        db.session.commit()
        return "OK"

api.add_resource(Intervention,'/admin/intervention') 


class Output(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Alan).filter(Alan.AlanID==infos['AlanID']).count() == 0):
                return "NO ALANID"
            elif(db.session.query(Sınıf).filter(Sınıf.SınıfID==infos['SınıfID']).count() == 0):
                return "NO SINIFID"
            elif(db.session.query(Çıktı).filter(Çıktı.AlanID==infos['AlanID'], Çıktı.SınıfID==infos['SınıfID'], Çıktı.ÇıktıID==infos['ÇıktıID']).count() != 0):
                return "SAME RECORD"
            else:
                new_record = Çıktı(AlanID=infos['AlanID'], SınıfID=infos['SınıfID'], ÇıktıID=infos['ÇıktıID'], ÇıktıAdı=infos['ÇıktıAdı'])
                db.session.add(new_record)
                db.session.commit()
                return "OK"
        else:
            AlanID = ''.join(infos['AlanID'])
            SınıfID = ''.join(infos['SınıfID'])
            ÇıktıID = ''.join(infos['ÇıktıID'])
            ÇıktıAdı = infos['ÇıktıAdı']
            page = infos['Sayfa']
            user_list = db.session.query(Çıktı)
            if(AlanID != ''):
                user_list = user_list.filter(Çıktı.AlanID==AlanID)
            if(SınıfID != ''):
                user_list = user_list.filter(Çıktı.SınıfID==SınıfID)
            if(ÇıktıID != ''):
                user_list = user_list.filter(Çıktı.ÇıktıID==ÇıktıID)
            if(ÇıktıAdı != ''):
                user_list = user_list.filter(Çıktı.ÇıktıAdı==ÇıktıAdı)
            send_records = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_records.append(user_dict)
                count += 1
            send_records = send_records[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_records.append(record)
            return send_records
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiAlanID'] != infos['AlanID'] 
        changed2 = infos['EskiSınıfID'] != infos['SınıfID']
        changed3 = infos['EskiÇıktıID'] != infos['ÇıktıID']
        if(changed1 and db.session.query(Alan).filter(Alan.AlanID==infos['AlanID']).count() == 0):
            return "NO ALANID"
        elif(changed2 and db.session.query(Sınıf).filter(Sınıf.SınıfID==infos['SınıfID']).count() == 0):
            return "NO SINIFID"
        elif(changed3 and db.session.query(Çıktı).filter(Çıktı.AlanID==infos['AlanID'], Çıktı.SınıfID==infos['SınıfID'], Çıktı.ÇıktıID==infos['ÇıktıID']).count() != 0):
            return "SAME RECORD"
        else:
            record = Çıktı.query.filter(Çıktı.AlanID==infos['EskiAlanID'],Çıktı.SınıfID==infos['EskiSınıfID'], Çıktı.ÇıktıID==infos['EskiÇıktıID']).first()
            record.AlanID = infos['AlanID']
            record.SınıfID = infos['SınıfID']
            record.ÇıktıID = infos['ÇıktıID'] 
            record.ÇıktıAdı = infos['ÇıktıAdı'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        record = Çıktı.query.filter(Çıktı.AlanID==infos['AlanID'],Çıktı.SınıfID==infos['SınıfID'], Çıktı.ÇıktıID==infos['ÇıktıID'])
        record.delete()
        db.session.commit()
        return "OK"


api.add_resource(Output,'/personel/output')


class Activity(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Aktivite).filter_by(AktiviteID=infos['AktiviteID']).count() != 0):
                return "SAME ACTIVITEID"
            elif(db.session.query(Aktivite).filter_by(AktiviteTanımı=infos['AktiviteAdı']).count() != 0):
                return "SAME ACTIVITEADI"
            else:
                new_user = Aktivite(AktiviteID=infos['AktiviteID'], AktiviteTanımı=infos['AktiviteAdı'])
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            AktiviteID = infos['AktiviteID']
            AktiviteAdı = infos['AktiviteAdı']
            page = infos['Sayfa']
            if(AktiviteID != '' and AktiviteAdı != ''):
                user_list = Aktivite.query.filter(Aktivite.AktiviteID==AktiviteID,Aktivite.AktiviteAdı==AktiviteAdı).all()[::-1]
            elif(AktiviteID != ''):
                user_list = Aktivite.query.filter_by(AktiviteID=AktiviteID).all()[::-1]
            elif(AktiviteAdı != ''):
                user_list = Aktivite.query.filter_by(AktiviteTanımı=AktiviteAdı).all()[::-1]
            else:
                user_list = Aktivite.query.all()[::-1]
            send_users = []
            count = 0
            for the_user in user_list:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiAktiviteID'] != infos['AktiviteID']
        changed2 = infos['EskiAktiviteAdı'] != infos['AktiviteAdı']
        if(changed1 and db.session.query(Aktivite).filter_by(AktiviteID=infos['AktiviteID']).count() != 0):
            return "SAME ACTIVITEID"
        elif(changed2 and db.session.query(Aktivite).filter_by(AktiviteTanımı=infos['AktiviteAdı']).count() != 0):
            return "SAME ACTIVITEADI"
        else:
            user = Aktivite.query.filter_by(AktiviteID=infos['EskiAktiviteID']).first()
            user.AktiviteID = infos['AktiviteID']
            user.AktiviteTanımı = infos['AktiviteAdı'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = Aktivite.query.filter_by(AktiviteID=infos['AktiviteID'])
        user.delete()
        db.session.commit()
        return "OK"


api.add_resource(Activity,'/admin/activity')


class Indicator(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Belirteç).filter_by(BelirteçID=infos['BelirteçID']).count() != 0):
                return "SAME BELIRTECID"
            elif(db.session.query(Belirteç).filter_by(BelirteçTanımı=infos['BelirteçTanımı']).count() != 0):
                return "SAME BELIRTECTANIMI"
            else:
                new_user = Belirteç(BelirteçID=infos['BelirteçID'], BelirteçTanımı=infos['BelirteçTanımı'])
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            BelirteçID = infos['BelirteçID']
            BelirteçTanımı = infos['BelirteçTanımı']
            page = infos['Sayfa']
            if(BelirteçID != '' and BelirteçTanımı != ''):
                user_list = Belirteç.query.filter(Belirteç.BelirteçID==BelirteçID,Belirteç.BelirteçTanımı==BelirteçTanımı).all()[::-1]
            elif(BelirteçID != ''):
                user_list = Belirteç.query.filter_by(BelirteçID=BelirteçID).all()[::-1]
            elif(BelirteçTanımı != ''):
                user_list = Belirteç.query.filter_by(BelirteçTanımı=BelirteçTanımı).all()[::-1]
            else:
                user_list = Belirteç.query.all()[::-1]
            send_users = []
            count = 0
            for the_user in user_list:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiBelirteçID'] != infos['BelirteçID']
        changed2 = infos['EskiBelirteçTanımı'] != infos['BelirteçTanımı']
        if(changed1 and db.session.query(Belirteç).filter_by(BelirteçID=infos['BelirteçID']).count() != 0):
            return "SAME BELIRTECID"
        elif(changed2 and db.session.query(Belirteç).filter_by(BelirteçTanımı=infos['BelirteçTanımı']).count() != 0):
            return "SAME BELIRTECTANIMI"
        else:
            user = Belirteç.query.filter_by(BelirteçID=infos['EskiBelirteçID']).first()
            user.BelirteçID = infos['BelirteçID']
            user.BelirteçTanımı = infos['BelirteçTanımı'] 
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = Belirteç.query.filter_by(BelirteçID=infos['BelirteçID'])
        user.delete()
        db.session.commit()
        return "OK"

api.add_resource(Indicator,'/personel/indicator')

class ProblemUnit(Resource):
    def post(self):
        infos = request.json
        print(infos)
        if (infos['Type'] == 'CREATE'):
            if(db.session.query(Problem).filter(Problem.ProblemTipiID==infos['ProblemID']).count() == 0):
                return "NO PROBLEMID"
            elif(db.session.query(Birim).filter(Birim.BirimKodu==infos['BirimID']).count() == 0):
                return "NO BIRIMID"
            elif(db.session.query(ProblemBirim).filter(ProblemBirim.ProblemID==infos['ProblemID'], ProblemBirim.BirimID==infos['BirimID']).count() != 0):
                return "SAME RECORD"
            else:
                datetime_obj = datetime.strptime(infos['EşleşmeTarihi'], '%Y-%m-%d')
                new_user = ProblemBirim(ProblemID=infos['ProblemID'], BirimID=infos['BirimID'], EşleşmeTarihi=datetime_obj)
                db.session.add(new_user)
                db.session.commit()
                return "OK"
        else:
            ProblemID = ''.join(infos['ProblemID'])
            BirimID = ''.join(infos['BirimID'])
            EşleşmeTarihi = infos['EşleşmeTarihi']
            page = infos['Sayfa']
            user_list = db.session.query(ProblemBirim)
            if(ProblemID != ''):
                user_list = user_list.filter(ProblemBirim.ProblemID==ProblemID)
            if(BirimID != ''):
                user_list = user_list.filter(ProblemBirim.BirimID==BirimID)
            if(EşleşmeTarihi != ''):
                datetime_obj = datetime.strptime(infos['EşleşmeTarihi'], '%Y-%m-%d')
                user_list = user_list.filter(ProblemBirim.EşleşmeTarihi==datetime_obj)
            send_users = []
            count = 0
            for the_user in user_list[::-1]:
                user_dict = the_user.__dict__
                del(user_dict['_sa_instance_state'])
                user_dict['EşleşmeTarihi'] = user_dict['EşleşmeTarihi'].strftime('%Y-%m-%d')
                send_users.append(user_dict)
                count += 1
            send_users = send_users[page*5-5:page*5]
            record = {
                'ToplamKayıt' : count
            }
            send_users.append(record)
            return send_users
        
    def put(self):
        infos = request.json
        changed1 = infos['EskiProblemID'] != infos['ProblemID']
        changed2 = infos['EskiBirimID'] != infos['BirimID']
        if(changed1 and db.session.query(Problem).filter(Problem.ProblemTipiID==infos['ProblemID']).count() == 0):
            return "NO PROBLEMID"
        elif(changed2 and db.session.query(Birim).filter(Birim.BirimKodu==infos['BirimID']).count() == 0):
            return "NO BIRIMID"
        elif((changed1 or changed2) and db.session.query(ProblemBirim).filter(ProblemBirim.ProblemID==infos['ProblemID'], ProblemBirim.BirimID==infos['BirimID']).count() != 0):
            return "SAME RECORD"
        else:
            datetime_obj = datetime.strptime(infos['EşleşmeTarihi'], '%Y-%m-%d')
            user = ProblemBirim.query.filter(ProblemBirim.ProblemID==infos['EskiProblemID'],ProblemBirim.BirimID==infos['EskiBirimID']).first()
            user.ProblemID = infos['ProblemID']
            user.BirimID = infos['BirimID']
            user.EşleşmeTarihi = datetime_obj
            db.session.commit()
            return "OK"
    def delete(self):
        infos = request.json
        user = ProblemBirim.query.filter(ProblemBirim.ProblemID==infos['ProblemID'],ProblemBirim.BirimID==infos['BirimID'])
        user.delete()
        db.session.commit()
        return "OK"

api.add_resource(ProblemUnit,'/personel/problemunit')

@app.route('/logout', methods=["GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run()