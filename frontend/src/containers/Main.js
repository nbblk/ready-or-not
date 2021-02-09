import React, { useState } from "react";
import Searchbar from "../components/Searchbar";

const user = JSON.parse(sessionStorage.getItem("user"));

function Main(props) {
  const [search, setSearch] = useState({
    keyword: null,
    result: [],
    submit: false
  });

  React.useEffect(() => {
    if (search.submit) { 
      const fetchResult = async () => {
        await fetch(
          `http://localhost:8080/api/v1/search?uid=${user._id}&oauth=${user.oauth}&keyword=${search.keyword}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "X-Access-Token": `${user.token}`,
            },
          }
        )
        .then(async (response) => {
          const result = await response.json();
          await setSearch({
            ...search,
            result: result[0].articles,
            submit: false,
          });
        })
        .catch((error) => {
          console.error(error);
        });
      };
      fetchResult();
    } 
  }, [search]);

  const handleInputChange = async (event) => {
    await setSearch({ ...search, keyword: event.target.value.trim() });
  };

  const handleEnter = async (event) => {
    if (event.keycode === 13 || event.key === "Enter") {
      await setSearch({ ...search, submit: true });
    }
  };

  return (
    <main className="w-full h-full py-20 md:py-40 bg-beige-yellowish flex flex-col justify-center content-center">
      <Searchbar
        change={(event) => handleInputChange(event)}
        keydown={(event) => handleEnter(event)}
      />
      {props.children}
    </main>
  );
}
export default Main;
