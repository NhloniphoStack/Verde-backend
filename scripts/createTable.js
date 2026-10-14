import { db } from "../db/db.js";

async function createTable(){

    await db.query(`CREATE TABLE IF NOT EXISTS category (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL
        )`)
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title TEXT NOT NULL,
        category INTEGER NOT NULL REFERENCES category(id),
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        img TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`)

        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )`)

        await db.query(`CREATE TABLE IF NOT EXISTS featured (
             id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
             product_id INTEGER NOT NULL REFERENCES products(id),
             updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            
            )`)

            await db.query(`CREATE TABLE IF NOT EXISTS cart_items (
             id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
             product_id INTEGER NOT NULL REFERENCES products(id),
             user_id INTEGER NOT NULL REFERENCES users(id),
             quantity INTEGER NOT NULL DEFAULT 1,
             created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
             updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            
             UNIQUE (user_id, product_id)
            )`)

            await db.query(`CREATE TABLE IF NOT EXISTS orders (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                total INTEGER NOT NULL,
                status TEXT DEFAULT 'PENDING'
                )`)


            await db.query(`CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                product_id INTEGER NOT NULL REFERENCES products(id),
                user_id INTEGER NOT NULL REFERENCES users(id),
                order_id INTEGER NOT NULL REFERENCES orders(id),
                quantity INTEGER NOT NULL ,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

                UNIQUE(user_id, product_id)
                )`)


            await db.query(`
                ALTER TABLE users 
                ALTER COLUMN role
                SET DEFAULT 'user'
                `)

        console.log("table was created")
}

createTable()