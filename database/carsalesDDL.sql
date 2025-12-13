-- Company
CREATE TABLE Company
(
  company_id NUMBER       NOT NULL,
  name       VARCHAR2(30) NOT NULL,
  CONSTRAINT PK_Company PRIMARY KEY (company_id)
);


-- Brand
CREATE TABLE Brand
(
  brand_id   NUMBER       NOT NULL,
  name       VARCHAR2(50) NOT NULL,
  company_id NUMBER       NOT NULL,
  CONSTRAINT PK_Brand PRIMARY KEY (brand_id)
);


--Factory
CREATE TABLE Factory
(
  factory_id   NUMBER       NOT NULL,
  name         VARCHAR2(50) NOT NULL,
  factory_type VARCHAR2(20) NOT NULL,
  brand_id     NUMBER       NOT NULL,
  CONSTRAINT PK_Factory PRIMARY KEY (factory_id)
);


--Dealer
CREATE TABLE Dealer
(
  dealer_id     NUMBER       NOT NULL,
  name          VARCHAR2(50) NOT NULL,
  street        VARCHAR2(50) NOT NULL,
  city          VARCHAR2(30) NOT NULL,
  state         CHAR(2)      NOT NULL,
  zip_code      VARCHAR2(10) NOT NULL,
  max_stock     NUMBER       NOT NULL,
  current_stock NUMBER       NOT NULL,
  CONSTRAINT PK_Dealer PRIMARY KEY (dealer_id)
);


--Model
CREATE TABLE Model
(
  model_id    NUMBER        NOT NULL,
  name        VARCHAR2(30)  NOT NULL,
  body_style  VARCHAR2(20)  NOT NULL,
  description VARCHAR2(200),
  CONSTRAINT PK_Model PRIMARY KEY (model_id)
);


-- Customer
CREATE TABLE Customer
(
  customer_id    NUMBER       NOT NULL,
  first          VARCHAR2(30) NOT NULL,
  middle_i       CHAR(1)     ,
  last           VARCHAR2(30) NOT NULL,
  street         VARCHAR2(50) NOT NULL,
  city           VARCHAR2(30) NOT NULL,
  state          CHAR(2)      NOT NULL,
  zip_code       VARCHAR2(10) NOT NULL,
  gender         VARCHAR2(7) ,
  income         NUMBER(10,2),
  marital_status VARCHAR2(10),
  dependents     NUMBER(2)   ,
  date_of_birth  DATE         NOT NULL,
  license_num    VARCHAR2(20) NOT NULL,
  cred_score     NUMBER(3)   ,
  SSN            VARCHAR2(11),
  CONSTRAINT PK_Customer PRIMARY KEY (customer_id)
);

CREATE SEQUENCE customer_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- phone number
CREATE TABLE CustomerPhone
(
  customer_id   NUMBER        NOT NULL,
  phone_number  VARCHAR2(15)  NOT NULL,

  CONSTRAINT PK_CustomerPhone PRIMARY KEY (customer_id, phone_number)
);


-- Employee
CREATE TABLE Employee
(
  employee_id NUMBER       NOT NULL,
  first_name  VARCHAR2(30) NOT NULL,
  middle_name VARCHAR2(30),
  last_name   VARCHAR2(30) NOT NULL,
  dealer_id   NUMBER       NOT NULL,
  CONSTRAINT PK_Employee PRIMARY KEY (employee_id)
);


-- Sale
CREATE TABLE Sale
(
  sale_id     NUMBER         NOT NULL,
  sale_date   DATE           NOT NULL,
  sale_price  NUMBER(10,2)   NOT NULL,
  customer_id NUMBER         NOT NULL,
  employee_id NUMBER         NOT NULL,

  CONSTRAINT PK_Sale PRIMARY KEY (sale_id)
);


-- Vehicle
CREATE TABLE Vehicle
(
  VIN              CHAR(17)  NOT NULL,
  manufacture_date DATE      NOT NULL,
  model_year       NUMBER(4) NOT NULL,
  mileage          NUMBER    NOT NULL,
  customer_id      NUMBER   ,
  model_id         NUMBER    NOT NULL,
  brand_id         NUMBER    NOT NULL,
  sale_id          NUMBER   ,
  dealer_id        NUMBER    NOT NULL,
  factory_id       NUMBER    NOT NULL,
  CONSTRAINT PK_Vehicle PRIMARY KEY (VIN)
);


-- Payment
CREATE TABLE Payment
(
  sale_id         NUMBER       NOT NULL,  -- owner (Sale)
  payment_no      NUMBER       NOT NULL,  -- partial key: 1,2,3... per sale

  payment_date    DATE         NOT NULL,
  payment_type    VARCHAR2(15) NOT NULL,  -- e.g. DEPOSIT, FINAL, INSTALLMENT
  payment_method  VARCHAR2(10) NOT NULL,  -- e.g. CARD, ACH, CASH, LOAN
  amt_paid     NUMBER(10,2) NOT NULL,

  -- method-specific fields (nullable)
  card_num     VARCHAR2(19),
  bank_acc_num VARCHAR2(20),
  rout_num  CHAR(9),
  interest_rate   NUMBER(5,4),
  loan_amt     NUMBER(12,2),

  CONSTRAINT PK_Payment PRIMARY KEY (sale_id, payment_no),
  CONSTRAINT FK_Payment_Sale FOREIGN KEY (sale_id)
    REFERENCES Sale(sale_id)
);



-- Options
CREATE TABLE Options
(
  model_id     NUMBER        NOT NULL,         
  option_no    NUMBER        NOT NULL,         

  color        VARCHAR2(20),
  transmission VARCHAR2(20),
  engine       VARCHAR2(30),
  trim_level   VARCHAR2(20),
  description  VARCHAR2(200),

  -- Weak entity: identified by (model_id + option_no)
  CONSTRAINT PK_Options PRIMARY KEY (model_id, option_no),

  -- Identifying relationship to Model
  CONSTRAINT FK_Options_Model
    FOREIGN KEY (model_id) REFERENCES Model(model_id)
);



-- constraints and relationship enforcment
-- Brand references Company
ALTER TABLE Brand
ADD CONSTRAINT FK_Brand_Company
FOREIGN KEY (company_id)
REFERENCES Company(company_id);

-- Factory references Brand
ALTER TABLE Factory
ADD CONSTRAINT FK_Factory_Brand
FOREIGN KEY (brand_id)
REFERENCES Brand(brand_id);

-- Employee works at a Dealer
ALTER TABLE Employee
ADD CONSTRAINT FK_Employee_Dealer
FOREIGN KEY (dealer_id)
REFERENCES Dealer(dealer_id);

-- CustomerPhone belongs to Customer
ALTER TABLE CustomerPhone
ADD CONSTRAINT FK_CustomerPhone_Customer
FOREIGN KEY (customer_id)
REFERENCES Customer(customer_id)
ON DELETE CASCADE;

-- Sale made by Customer
ALTER TABLE Sale
ADD CONSTRAINT FK_Sale_Customer
FOREIGN KEY (customer_id)
REFERENCES Customer(customer_id);

-- Sale handled by Employee
ALTER TABLE Sale
ADD CONSTRAINT FK_Sale_Employee
FOREIGN KEY (employee_id)
REFERENCES Employee(employee_id);

-- Vehicle optionally owned by Customer
ALTER TABLE Vehicle
ADD CONSTRAINT FK_Vehicle_Customer
FOREIGN KEY (customer_id)
REFERENCES Customer(customer_id);

-- Vehicle is of a Model
ALTER TABLE Vehicle
ADD CONSTRAINT FK_Vehicle_Model
FOREIGN KEY (model_id)
REFERENCES Model(model_id);

-- Vehicle belongs to a Brand
ALTER TABLE Vehicle
ADD CONSTRAINT FK_Vehicle_Brand
FOREIGN KEY (brand_id)
REFERENCES Brand(brand_id);

-- Vehicle stored at Dealer
ALTER TABLE Vehicle
ADD CONSTRAINT FK_Vehicle_Dealer
FOREIGN KEY (dealer_id)
REFERENCES Dealer(dealer_id);

-- Vehicle manufactured at Factory
ALTER TABLE Vehicle
ADD CONSTRAINT FK_Vehicle_Factory
FOREIGN KEY (factory_id)
REFERENCES Factory(factory_id);



-- Indexes

-- brand index on company_id
CREATE INDEX IDX_Brand_Company
ON Brand(company_id);

-- factory index on brand_id
CREATE INDEX IDX_Factory_Brand
ON Factory(brand_id);

-- employee index on dealer_id
CREATE INDEX IDX_Employee_Dealer
ON Employee(dealer_id);

-- sale customer and employee index
CREATE INDEX IDX_Sale_Customer
ON Sale(customer_id);

CREATE INDEX IDX_Sale_Employee
ON Sale(employee_id);

-- index on vehicle foreign keys
CREATE INDEX IDX_Vehicle_Model
ON Vehicle(model_id);

CREATE INDEX IDX_Vehicle_Brand
ON Vehicle(brand_id);

CREATE INDEX IDX_Vehicle_Dealer
ON Vehicle(dealer_id);

CREATE INDEX IDX_Vehicle_Factory
ON Vehicle(factory_id);

-- index lookup customer by last name
CREATE INDEX IDX_Customer_Last
ON Customer(last);

-- index vehicle vin
CREATE INDEX IDX_Vehicle_VIN
ON Vehicle(VIN);


-- Views

-- cusomter contact info view
CREATE OR REPLACE VIEW V_Customer_Contact AS
SELECT
    c.customer_id,
    c.first,
    c.last,
    c.city,
    c.state,
    p.phone_number
FROM Customer c
LEFT JOIN CustomerPhone p
ON c.customer_id = p.customer_id;


-- vehicle inventory by dealer
CREATE OR REPLACE VIEW V_Dealer_Inventory AS
SELECT
    d.dealer_id,
    d.name AS dealer_name,
    v.VIN,
    v.model_year,
    v.mileage,
    m.name AS model_name,
    b.name AS brand_name
FROM Dealer d
JOIN Vehicle v ON d.dealer_id = v.dealer_id
JOIN Model m ON v.model_id = m.model_id
JOIN Brand b ON v.brand_id = b.brand_id;

-- car sale summary (customer, salesman, time and price)
CREATE OR REPLACE VIEW V_Sales_Summary AS
SELECT
    s.sale_id,
    s.sale_date,
    s.sale_price,
    c.first || ' ' || c.last AS customer_name,
    e.first_name || ' ' || e.last_name AS employee_name
FROM Sale s
JOIN Customer c ON s.customer_id = c.customer_id
JOIN Employee e ON s.employee_id = e.employee_id;

select * from Customer;