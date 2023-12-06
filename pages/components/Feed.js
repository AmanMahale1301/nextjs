import React, { useEffect, useState } from "react";

import PromptCard from "./PromptCard.js";
import axios from "axios";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};
const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e) => {};

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("/api/prompt");
      console.log(response);
      const data = response?.data;
      console.log(data, "data");
      setPosts(data);
    };
    fetchPosts();
  }, []);
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        {/* <input
          type="text"
          placeholder="Search for a text"
          value={searchText}
          className="search_input peer"
          required
          onChange={handleSearchChange}
        /> */}
      </form>
      <PromptCardList data={posts} handleTagClick={() => {}} />
    </section>
  );
};

export default Feed;
