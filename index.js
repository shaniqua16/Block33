const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT= 3000;
const pg = require('pg');
const client = new pg.Client("postgress://shaniquawhitley:@Bettyboo1@localhost/acme_hr");


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((error, req,res, next)=> {
res.status(res.status || 500).send({
    error: error
})
}
);

app.get("/api/employees", async(req, res, next)=>{
    try {
        const SQL= `
        SELECT * FROM employees
        `;
        const response = await client.query(SQL);
        res.status(200).send(response.rows);
    } catch (error) {
        next(error);
    }
})

app.get("/api/departments", async(req, res, next)=>{
    try {
        const SQL= `
        SELECT * FROM departments
        `;
        const response = await client.query(SQL);
        res.status(200).send(response.rows);
    } catch (error) {
        next(error);
    }
})

app.post("/api/employees", async(req, res, next)=>{
    try {
        const {name, department} = req.body;
        const SQL = `
        INSERT INTO employees (name, department_id) VALUES ($1, 
            (SELECT id FROM departments WHERE name = $2))
            RETURNING *;
    `;
    const response = await client.query(SQL, [name, department]);
    res.status(200).send(response.rows);
    } catch (error) {
        next(error);
    }

})
app.delete("/api/employees/:id", async(req, res, next)=>{
    try {
        const { id } = req.params;
    const SQL = `
        DELETE FROM employees WHERE id = $1
    `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
    } catch (error) {
        next(error);
    }
})

app.put("/api/employees/:id", async(req, res, next)=>{
    try {
        const { id } = req.params;
        const {name, department} = req.body;
        const SQL= `
        UPDATE employees
            (SET name = $1, 
            department_id= (SELECT id FROM departments WHERE name = $2)) 
            updated_at = (CURRENT_TIMESTAMP WHERE id = $3)
            RETURNING *
            `;
           const response= await client.query(SQL, [name, department,id]);
    res.sendStatus(200).json(response.rows[0]);
    } catch (error) {
        next(error);
    }
})



const init = async () => {
    try {
        await client.connect();
    }catch (error) {
        console.error(error);
    };
}
   init(); 