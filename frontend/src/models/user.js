export class BaseUser {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.password = user.password;
    this.role = user.role;
    this.department = user.department;
    this.email = user.email;
  }
}

export class Staff extends BaseUser {
  constructor(user) {
    super(user);
    this.employeeId = user.employeeId;
    this.position = user.position;
  }
}

export class Student extends BaseUser {
  constructor(user) {
    super(user);
    this.startYear = user.startYear;
  }
}
