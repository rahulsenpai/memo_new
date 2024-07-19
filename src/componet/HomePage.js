import "./HomePage.css";
import Table from "./Table";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function HomePage() {
  const [text, setText] = useState("");
  const [memos, setMemos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const memosPerPage = 8; 

  const getData = (search = '') => {
    axios
      .get(`/api/?search=${search}`)
      .then((res) => {
        setMemos(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleAdd = (e) => {
    const newMemo = { text: text };
    axios
      .post("/api/", newMemo)
      .then((res) => {
        if (res.data.message === "success") {
          getData(searchTerm); // Refresh data after addition
          setText("");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd(e);
    }
  };

  const addMemo = (newMemo) => {
    setMemos((prevMemos) => [...prevMemos, newMemo]);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    getData(searchTerm);
  };

  // Calculate the memos to display on the current page
  const indexOfLastMemo = currentPage * memosPerPage;
  const indexOfFirstMemo = indexOfLastMemo - memosPerPage;
  const currentMemos = memos.slice(indexOfFirstMemo, indexOfLastMemo);

  return (
    <div className="homepage">
      <Table memos={currentMemos} getData={getData} searchTerm={searchTerm} />
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(memos.length / memosPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          className="page"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
              "&.Mui-selected": {
                backgroundColor: "white",
                color: "black",
              },
              "&:hover": {
                backgroundColor: "white",
              },
            },
          }}
        />
      </Stack>
      <div className="text-area">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button onClick={handleAdd} className="button-85" role="button">
          ADD
        </button>
      </div>
  
    </div>
  );
}

export default HomePage;
