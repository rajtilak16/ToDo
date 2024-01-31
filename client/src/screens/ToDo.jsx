import React, { useState } from "react";
import List from "./List";
import axios from "axios";
import Navbar from "./Navbar";

const ToDo = () => {
  const [task, settask] = useState("");
  const [desc, setdesc] = useState("");
  const [list, setList] = useState([]);
  const [id, setid] = useState("");
  async function submitHandler(e) {
    e.preventDefault();
    // console.log(list)
    const user = JSON.parse(localStorage.getItem("currUser"));
    const tasklist = {
      title: task,
      description: desc,
      user: user.user._id,
    };
    try {
      const taskData = (
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/tasks`,
          tasklist
        )
      ).data;
      setList([
        ...list,
        { ...taskData, task: taskData.title, desc: taskData.description },
      ]);
      setdesc("");
      settask("");
      setid(taskData._id);
      console.log(taskData);
      console.log("printint id at 0", list[0]._id);
      console.log(taskData._id);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteHandler(index) {
    let copyTask = [...list];
    copyTask.splice(index, 1);
    setList(copyTask);
    console.log("printing id using index");
    const taskid = list[index]._id;
    try {
      const del = (
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/delete`,
           taskid 
        )
      ).data;
      // const del = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/v1/delete`,list[index]._id);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="h-screen w-screen bg-zinc-900 text-white">
      <Navbar />
      <form className="">
        <input
          className="text-2xl text-black border-2 border-zinc-800 ml-20 px-4 py-2 rounded-xl"
          type="text"
          name="task"
          id="task"
          value={task}
          placeholder="Add Task..."
          required
          onChange={(e) => {
            settask(e.target.value);
          }}
        />
        <input
          className="text-2xl text-black w-1/3 border-2 border-zinc-800 m-5 px-4 py-2 rounded-xl"
          type="text"
          name="task"
          id="desc"
          value={desc}
          placeholder="Description"
          required
          onChange={(e) => {
            setdesc(e.target.value);
          }}
        />
        <button
          onClick={submitHandler}
          type="submit"
          className="ml-auto py-2 rounded-lg text-2xl px-4 bg-blue-300"
        >
          Add Task
        </button>
      </form>
      <hr />
      <div className="p-8 bg-zinc-700">
        <ul className="flex flex-col justify-start items-star gap-y-6">
          {list.length > 0 ? (
            list.map((task, index) => {
              return (
                <li key={index} className="w-full flex justify-between">
                  <div className="flex items-center justify-between mb-5 w-2/3">
                    <h5 className="text-2xl ml-2 font-semibold text-black">
                      {task.task}
                    </h5>
                    <h6 className="text-xl font-semibold text-black">
                      {task.desc}
                    </h6>
                  </div>
                  <button
                    onClick={() => {
                      deleteHandler(index, task._id);
                    }}
                    className="py-2 px-4 mr-4 rounded bg-zinc-800 text-white font-bold"
                  >
                    Delete
                  </button>
                </li>
              );
            })
          ) : (
            <h2 className="text-black font-semibold">No Task Available</h2>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ToDo;
