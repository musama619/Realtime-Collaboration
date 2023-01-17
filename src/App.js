import { TextArea } from "./components/TextArea";
import { Navbar } from "./components/Navbar";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:8000");

function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [textValue, setTextValue] = useState("");
    const [messages, setMessages] = useState();

    useEffect(() => {
        socket.on("new-data", (data) => {
            console.log("yolo", data);
            setTextValue(data.message)
            var newData = textValue + data.message;
            setMessages(newData);
        });
    }, [socket, messages]);

    const onValueChange = (value) => {
        setTextValue(value);
        socket.emit("message", {
            text: value,
        });
    };

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
            console.log("connected");
        });

        const username = prompt("Enter name to join");

        socket.emit("new-user-joined", username);

        socket.on("user-joined", () => {
            console.log("new user joined");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("pong");
        };
    }, []);
    return (
        <div>
            <Navbar />
            <div className="container mx-auto">
                <TextArea
                    onValueChange={onValueChange}
                    setTextValue={setTextValue}
                    textValue={textValue}
                />
            </div>
        </div>
    );
}

export default App;
