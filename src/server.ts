import {server} from './http';
import './websocket/WebSocketService';
import './database/database';

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));