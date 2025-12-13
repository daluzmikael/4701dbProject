
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





