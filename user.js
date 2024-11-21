import { MongoClient } from "mongodb";
//const uri="mongodb+srv://amarjeet34537:DmH9JrGr46K5Qwhv@cluster0.2cp2m.mongodb.net/"
const uri="mongodb+srv://amarjeet34537:DmH9JrGr46K5Qwhv@cluster0.2cp2m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000 // 5 seconds
});
//const client = new MongoClient(url);
const dbName = 'intelli_search';

await client.connect(); // Use await with async functions
const db = client.db(dbName);


// user.js
export async function update_chat_data(req, res) {
    try {
        const username = req.query.username;
        const chatMessage = req.query.chat;
        console.log()
        await db.collection('chat_data').updateOne(
            { username: username },
            {
                $push: { chat: chatMessage }
            },
            { upsert: true }
        );

        res.send({ 'message': "Chat data updated successfully!" });
    } catch (e) {
        console.log(e);
        res.send({ 'message': JSON.stringify(e) });
    }
}

export async function get_chat_data(req, res) {
    try {
        const username = req.query.username
        // Find the chat data for the specified username
        const chatData = await db.collection('chat_data').findOne(
            { username: username },
            { projection: { chat: 1, _id: 0 } } // Only return the chat array, exclude the _id field
        );

        // Check if chat data exists for the username
        if (chatData) {
            res.send({ 'chat': chatData.chat });
        } else {
            res.send({ 'message': "No chat data found for this user." });
        }
    } catch (e) {
        console.log(e);
        res.send({ 'message': JSON.stringify(e) });
    }

}