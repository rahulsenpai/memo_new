import "./Table.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import * as React from 'react';

function Table(props) {
  const [selectedMemos, setSelectedMemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMemo, setEditingMemo] = useState(null); // State for editing memo
  const [editText, setEditText] = useState(""); // State for edit text

  const handleClose = () => setEditingMemo(false);

  useEffect(() => {
    setSearchTerm(props.searchTerm); // Set searchTerm from props
  }, [props.searchTerm]);

  const handleDelete = (memoId) => {
    axios
      .delete(`/api/${memoId}`)
      .then((res) => {
        if (res.data.message === "success") {
          props.getData(searchTerm); // Refresh data after deletion
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteSelected = () => {
    axios
      .all(selectedMemos.map((id) => axios.delete(`/api/${id}`)))
      .then(
        axios.spread((...responses) => {
          props.getData(searchTerm);
          setSelectedMemos([]);
        })
      )
      .catch((err) => console.error("Error deleting selected memos:", err));
  };

  const handleSelectMemo = (memoId) => {
    setSelectedMemos((prev) => {
      if (prev.includes(memoId)) {
        return prev.filter((id) => id !== memoId);
      } else {
        return [...prev, memoId];
      }
    });
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    props.getData(searchTerm);
  };

  const handleEdit = (memo) => {
    setEditingMemo(memo);
    setEditText(memo.text);
  };

  const handleEditSave = () => {
    axios
      .put("/api/", { id: editingMemo._id, text: editText })
      .then((res) => {
        if (res.data.message === "success") {
          props.getData(searchTerm); // Refresh data after edit
          setEditingMemo(null); // Close edit form
          setEditText(""); // Clear edit text
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEditCancel = () => {
    setEditingMemo(null);
    setEditText("");
  };

  return (
    <div>
      <div className="heading">
        <h1>Memo</h1>
        <div>
          <button
            onClick={handleDeleteSelected}
            disabled={!selectedMemos.length}
            className="button-85"
            role="button"
          >
            Delete Selected
          </button>
        </div>
        <form className="example" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search.."
            name="search"
            value={searchTerm}
            onChange={handleSearch}
          />

          <button type="submit" className="button-85" role="button">
            <i className="fa fa-search">Search</i>
          </button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <td className="date">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMemos(props.memos.map((memo) => memo._id));
                  } else {
                    setSelectedMemos([]);
                  }
                }}
                checked={selectedMemos.length === props.memos.length}
              />
            </td>
            <td className="text">Notes</td>
            <td className="delete">Actions</td>
          </tr>
        </thead>
        <tbody>
          {props.memos.map((memo) => (
            <tr key={memo._id}>
              <td className="date">
                <input
                  type="checkbox"
                  checked={selectedMemos.includes(memo._id)}
                  onChange={() => handleSelectMemo(memo._id)}
                />
              </td>
              <td className="text">{memo.text}</td>
              <td className="delete">
                <div className="btn">
                  <button
                    onClick={() => handleEdit(memo)}
                    className="button-85"
                    role="button"
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(memo._id)}
                    className="button-85"
                    role="button"
                  >
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>      

       <React.Fragment>
      <Modal open={editingMemo} onClose={() => setEditingMemo(false)}>
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
          sx={(theme) => ({
            [theme.breakpoints.only('xs')]: {
              top: 'unset',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: 'none',
              maxWidth: 'unset',
            },
          })}
        >
          <Typography id="nested-modal-title" level="h2">
            Update
          </Typography>
          <Typography id="nested-modal-description" textColor="text.tertiary">
          <div className="edit-form">
            <h2>Edit Memo</h2>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            ></textarea>
          </div>
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row-reverse' },
            }}
          >
            <Button variant="solid" color="primary" onClick={handleEditSave}>
              Upload
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={handleEditCancel}
            >
              Cancel
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>


    </div>  
  );
}

export default Table;
