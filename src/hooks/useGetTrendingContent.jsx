import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState([]); // Create a state variable to store the trending content
  const {contentType} = useContentStore(); // Get the contentType from the store

  useEffect (() => {
    const getTrendingContent = async () => {
      const res =  await axios.get(`/api/${contentType}/trending`); // Fetch the trending content based on the contentType  
        setTrendingContent(res.data.content); // Set the trending content in the state
    }

    getTrendingContent()
  }, [contentType])

    return { trendingContent };
}

export default useGetTrendingContent;
