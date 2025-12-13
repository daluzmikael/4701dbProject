CREATE ROLE role_admin;
CREATE ROLE role_employee;
CREATE ROLE role_readonly;
--admin
GRANT
  SELECT, INSERT, UPDATE, DELETE
ON Customer TO role_admin;

GRANT
  SELECT, INSERT, UPDATE, DELETE
ON Vehicle TO role_admin;

GRANT
  SELECT, INSERT, UPDATE, DELETE
ON Sale TO role_admin;

GRANT
  SELECT, INSERT, UPDATE, DELETE
ON Payment TO role_admin;

GRANT
  SELECT, INSERT, UPDATE, DELETE
ON Dealer TO role_admin;

GRANT
  SELECT, INSERT, UPDATE, DELETE
ON Employee TO role_admin;

-- staff
GRANT SELECT ON Dealer TO role_employee;
GRANT SELECT ON Vehicle TO role_employee;
GRANT SELECT ON Model TO role_employee;
GRANT SELECT ON Brand TO role_employee;

GRANT SELECT, INSERT ON Customer TO role_employee;
GRANT SELECT, INSERT ON CustomerPhone TO role_employee;

GRANT SELECT, INSERT ON Sale TO role_employee;
GRANT SELECT, INSERT ON Payment TO role_employee;

GRANT SELECT ON Customer TO role_readonly;
GRANT SELECT ON Sale TO role_readonly;
GRANT SELECT ON Vehicle TO role_readonly;
GRANT SELECT ON Payment TO role_readonly;

CREATE USER admin_user IDENTIFIED BY adminpw;
GRANT CONNECT TO admin_user;
GRANT role_admin TO admin_user;

CREATE USER employee1 IDENTIFIED BY employeepw;
GRANT CONNECT TO employee1;
GRANT role_employee TO employee1;

CREATE USER report_user IDENTIFIED BY userviewpw;
GRANT CONNECT TO report_user;
GRANT role_readonly TO report_user;

