import mongoose, { ConnectOptions } from "mongoose";
import databaseConfig from "../config/databaseConfig";

console.log(databaseConfig.url, "databaseConfig.url");
mongoose.connect(
    databaseConfig.url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions
).catch((err) => {
    console.log(err, 'error connecting to database');
})

export default mongoose;