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
        console.log("🚀 ~ file: todosSlice.js ~ line 49 ~ .addCase ~ action.payload", action.payload)
        state.status = "idle";
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        console.log('state',action.payload)
        state.todos.push(action.payload)
      })
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

    console.log('data ',{ data });
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
