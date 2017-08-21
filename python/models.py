from main import app, db

# Create our database model
class Employee(db.Model):
    __tablename__ = "employee"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(56))
    birthdate = db.Column(db.DateTime())
    address = db.Column(db.Text())
    parent_id = db.Column(db.Integer, db.ForeignKey('employee.id'), index=True)
    parent = db.relationship(lambda: Employee, remote_side=id,
                                backref='sub_employees')
