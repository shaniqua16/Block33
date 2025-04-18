const pg = require('pg');

const client = new pg.Client("postgress://shaniquawhitley:@Bettyboo1@localhost/acme_hr");

const init = async () => {
    try {
        await client.connect();
        console.log("Connected to the database");
        const SQL = `
            DROP TABLE IF EXISTS departments CASCADE;
            CREATE TABLE departments (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            );
            INSERT INTO departments (name) VALUES ('HR'); 
            INSERT INTO departments (name) VALUES ('IT');
            INSERT INTO departments (name) VALUES ('FINANCE');

            DROP TABLE IF EXISTS employees;
            CREATE TABLE employees (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_at time DEFAULT CURRENT_TIMESTAMP,
                updated_at time DEFAULT CURRENT_TIMESTAMP,
                department_id INTEGER REFERENCES departments(id) NOT NULL 
                );
            INSERT INTO employees (name, department_id) VALUES ('John Doe', 
            (SELECT id FROM departments WHERE name = 'HR'));
            INSERT INTO employees (name, department_id) VALUES ('Jane Smith',
            (SELECT id FROM departments WHERE name = 'IT'));
            INSERT INTO employees (name, department_id) VALUES ('Bob Johnson',
            (SELECT id FROM departments WHERE name = 'FINANCE'));
                
        `;
        await client.query(SQL);
        await client.end();
        console.log("Tables created successfully");
             
    }catch (error) {
        console.error(error);
    };
    
};
init();
