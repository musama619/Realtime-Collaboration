import { TextArea } from "./components/TextArea";
import { Navbar } from "./components/Navbar";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8000");

function App() {
    const [textValue, setTextValue] = useState("");
    const [messages, setMessages] = useState();
    const [isJoined, setisJoined] = useState(false);
    const [sessionName, setSessionName] = useState("");
    const [errorMsg, showErrorMsg] = useState(false);

    useEffect(() => {
        socket.on("new-data", (data) => {
            setTextValue(data.message);
            var newData = textValue + data.message;
            setMessages(newData);
        });

        socket.on("user-joined", () => {
            setisJoined(true);
        });
        socket.on("session-joined", () => {
            setisJoined(true);
        });
        socket.on("session-not-exists", () => {
            setisJoined(false);
            showErrorMsg(true);
        });
    }, [socket, messages]);

    const createSession = () => {
        socket.emit("create-session", sessionName);
    };
    const joinSession = () => {
        socket.emit("join-session", sessionName);
    };

    const onValueChange = (value) => {
        setTextValue(value);
        socket.emit("message", {
            text: value,
            session: sessionName,
        });
    };

    useEffect(() => {
        const username = "";
        // const username = prompt("Enter name to join");

        socket.emit("new-user-joined", username);

        socket.on("user-joined", () => {
            console.log("new user joined");
        });
    }, []);
    return (
        <div>
            <Navbar />
            <div className="container mx-auto">
                {!isJoined && (
                    <div>
                        <div className="flex justify-center mt-44">
                            <input
                                className="font-black font-mono w-96  p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="text"
                                placeholder="Write Session Name"
                                onChange={(e) => setSessionName(e.target.value)}
                                onKeyUp={() => showErrorMsg(false)}
                            />
                        </div>
                        {errorMsg ? (
                            <p className="text-red-600 flex justify-center mt-2">
                                Session does not exists
                            </p>
                        ) : (
                            <></>
                        )}
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={() => createSession()}
                                className="bg-slate-300 mx-5 p-4 rounded-xl font-semibold"
                            >
                                Create Session
                            </button>
                            <button
                                onClick={() => joinSession()}
                                className="bg-emerald-600 text-white mx-5 p-4 rounded-xl font-semibold"
                            >
                                Join Session
                            </button>
                        </div>
                    </div>
                )}
                {isJoined && (
                    <TextArea
                        onValueChange={onValueChange}
                        setTextValue={setTextValue}
                        textValue={textValue}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
