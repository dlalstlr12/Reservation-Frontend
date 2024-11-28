import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";

const Home = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                console.log("Fetched Users:", data); // 데이터를 콘솔에 출력
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        loadUsers();
    }, []);

    return (
        <div>
            <h2>User List</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.username}</li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default Home;
