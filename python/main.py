import sys
from flask import Flask, render_template, request, jsonify, abort
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
# from models import Employee

from flask_admin import Admin, BaseView, expose

from flask.ext.admin.contrib.sqla import ModelView


app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root' \
                                        '@localhost:5432/employee_tree'
db = SQLAlchemy(app)

app.secret_key = "super secret key"

if app.config['SQLALCHEMY_DATABASE_URI'] == None:
    print "Need database config"
    sys.exit(1)

# Create our database model
class Employee(db.Model):
    __tablename__ = "employee"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(56))
    role = db.Column(db.String(128))
    birth_date = db.Column(db.Date)
    joining_date = db.Column(db.Date)
    address = db.Column(db.Text())
    parent_id = db.Column(db.Integer, db.ForeignKey('employee.id'), index=True)
    parent = db.relationship(lambda: Employee, remote_side=id)

    def serialize(self):
        import datetime
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'birth_date': self.birth_date,
            'joining_date': self.joining_date,
            'age': int((datetime.date.today() - self.birth_date).days / 365.25),
            'address': self.address,
            'parent_id': self.parent_id
        }

@app.route('/employees/all', methods = ['GET'])
@cross_origin()
def index():
    print [e.serialize() for e in Employee.query.all()]
    return jsonify({'employees': [e.serialize() for e in Employee.query.all()]})

@app.route('/employees/create', methods = ['POST'])
def create_employee():
    print request.json
    if not request.json or not 'name' in request.json:
        abort(400)
    from datetime import datetime
    employee = Employee(name=request.json.get('name'),
                        role=request.json.get('role', ''),
                        birth_date=request.json.get('birth_date',''),
                        joining_date=request.json.get('joining_date', datetime.now()),
                        address=request.json.get('address', ''),
                        parent_id=request.json.get('parent_id', ''))
    db.session.add(employee)
    db.session.commit()
    return jsonify( { 'employee': employee.serialize() } ), 201

if __name__ == '__main__':
    admin = Admin(app)
    admin.add_view(ModelView(Employee, db.session))
    db.create_all()
    app.debug = True
    app.run()
