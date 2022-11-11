import { createServer, Model } from "miragejs";

export const setupServer = () => {
  //Các bước tạo nên 1 fakeApi
  createServer({
    models: {
      todos: Model,
    },
    routes() {
      this.get("/api/todos", (schema) => {
        return schema.todos.all();
      });
      this.post("/api/todos", (schema, request) => {
        const payload = JSON.parse(request.requestBody);

        return schema.todos.create(payload);
      });

      this.post("/api/updateTodo", (schema, request) => {
        const id = JSON.parse(request.requestBody);

        //Khi cập nhật mình sẽ kiếm cái id của todo đấy
        const currentTodo = schema.todos.find(id);

        //Và mình update lại hết những gì nó có lên
        currentTodo.update({ completed: !currentTodo.completed });
        return currentTodo;
      });
    },
  });
};
