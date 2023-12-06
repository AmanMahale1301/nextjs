import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Profile from "../components/Profile";
import axios from "axios";
import { data } from "autoprefixer";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const handleEdit = () => {};
  const handleDelete = () => {};
  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        const response = await axios.get(
          `api/users/${session?.user?.id}/posts`
        );
        const data = response?.data;
        setPosts(data);
      }
    };
    fetchUser();
  }, [session]);
  return (
    <div>
      MyProfile
      <Profile
        name={"My"}
        desc="Welcome to Your Personalised Profile Page"
        data={posts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MyProfile;
