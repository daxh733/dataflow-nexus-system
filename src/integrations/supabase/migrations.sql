-- SQL statements to create tables for the Supabase schema

-- Table: customers
CREATE TABLE public.customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  contact VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  order_count INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL
);

-- Table: defects
CREATE TABLE public.defects (
  id SERIAL PRIMARY KEY,
  product VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  report_date DATE NOT NULL,
  reported_by VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: departments
CREATE TABLE public.departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  manager VARCHAR(255) NOT NULL,
  employee_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: employees
CREATE TABLE public.employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  position VARCHAR(255) NOT NULL,
  join_date DATE NOT NULL,
  department VARCHAR(255) NOT NULL, -- Foreign Key to departments.name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department) REFERENCES public.departments(name)
);

-- Table: products
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  sku VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  stock INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: raw_materials
CREATE TABLE public.raw_materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  unit_cost VARCHAR(50) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  supplier VARCHAR(255) NOT NULL, -- Foreign Key to suppliers.name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier) REFERENCES public.suppliers(name)
);

-- Table: suppliers
CREATE TABLE public.suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  contact VARCHAR(255) NOT NULL,
  materials VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

