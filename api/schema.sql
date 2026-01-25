-- SQL schema for switching blob storage to MySQL

CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(100) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uploads (
  id VARCHAR(150) PRIMARY KEY,
  filename VARCHAR(255),
  mime VARCHAR(100),
  data LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: grant permissions and create database if needed
-- CREATE DATABASE portfolio;
-- GRANT ALL ON portfolio.* TO 'user'@'host' IDENTIFIED BY 'password';
