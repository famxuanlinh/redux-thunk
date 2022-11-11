// const initState = [
//   { id: 1, name: 'Learn Yoga', completed: false, priority: 'Medium' },
//   { id: 2, name: 'Learn Redux', completed: true, priority: 'High' },
//   { id: 3, name: 'Learn JavaScript', completed: false, priority: 'Low' },
// ];

// const todoListReducer = (state = initState, action) => {
//   switch (action.type) {
//     case 'todoList/addTodo':
//       return [...state, action.payload];

//     case 'todoList/toggleTodoStatus':
//       return state.map((todo) =>
//         todo.id === action.payload
//           ? { ...todo, completed: !todo.completed }
//           : todo
//       );
//     default:
//       return state;
//   }
// };

// export default todoListReducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todoList",
  initialState: { status: "idle", todos: [] }, // Mặc định để nó là idle (rảnh rỗi)
  reducers: {
    // IMMER
    addTodo: (state, action) => {
      state.push(action.payload);
    }, // action creators
    toggleTodoStatus: (state, action) => {
      const currentTodo = state.find((todo) => todo.id === action.payload);
      if (currentTodo) {
        currentTodo.completed = !currentTodo.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;

        state.status = "idle";
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        let currentTodo = state.todos.find(
          (todo) => todo.id === action.payload
        );
        currentTodo = action.payload;
      });
  },
});

//Bất đồng bộ bằng cách sử dụng createAsyncThunk
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const res = await fetch("/api/todos");
  const data = await res.json();
  return data.todos;
});

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async (newTodo) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });
    const data = await res.json();
    return data.todos;
    // console.log("data ", { data });
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo) => {
    const res = await fetch("/api/updateTodo", {
      method: "POST",
      body: JSON.stringify(updatedTodo),
    });
    const data = await res.json();
    console.log("updateTodo", data)
    
    return data.todos;
  }
);

/*
Một cái createAsyncThunk nó tạo cho cta 3 cái actions:
=> todos/fetchTodos/pending
=> todos/fetchTodos/fullfilled
=> todos/fetchTodos/rejected
*/

export default todosSlice;

//action (object) & action creators () => {return action}
//thunk action (fn) & thunk action creators () => {return thunks action}

// export function addTodos(todo) {
//   //thunk fn - think action
//   return function addTodosThunk(dispatch, getState) {
//     console.log("[addTodosThunk]", getState());
//     console.log({ todo });
//     todo.name= 'Fam tesst'
//     dispatch(todosSlice.actions.addTodo(todo))
//     console.log("[addTodosThunk after]", getState());

//   };
// }
