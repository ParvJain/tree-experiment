import sys
from flask import Flask, render_template, request, jsonify, abort
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
            'birth_date': self.birth_date,
            'joining_date': self.joining_date,
            'age': int((datetime.date.today() - self.birth_date).days / 365.25),
            'address': self.address,
            'parent_id': self.parent_id
        }

@app.route('/employees/all', methods = ['GET'])
def index():
    # employee_schema = jsonify(employees = )
    print [e.serialize() for e in Employee.query.all()]
    return jsonify({'employees': [e.serialize() for e in Employee.query.all()]})


if __name__ == '__main__':
    admin = Admin(app)
    admin.add_view(ModelView(Employee, db.session))
    db.create_all()
    app.debug = True
    app.run()
