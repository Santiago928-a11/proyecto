CREATE DATABASE IF NOT EXISTS muebles;

USE muebles;

CREATE TABLE IF NOT EXISTS muebles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL
);
