require('dotenv').config()

const  {
    DATABASE_URL,
} = process.env;


export default {
    url: DATABASE_URL,
}