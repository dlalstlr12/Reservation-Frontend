import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/profile", {
                    withCredentials: true, // 쿠키 전송 허용
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Role: {user.role}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
