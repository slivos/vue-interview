import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTodosStore = defineStore("todos", () => {
  const todos = ref([]);

  const addTodo = (label) => {
    const newTodo = {
      id: Date.now(),
      label: label,
      checked: false,
    };
    todos.value = [...todos.value, newTodo];
  };

  const updateTodos = (newTodos) => {
    todos.value = newTodos;
  };

  const deleteTodo = (id) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  };

  const getTodos = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await response.json();
      todos.value = data.slice(0, 10).map((todo) => ({
        id: todo.id,
        label: todo.title,
        checked: todo.completed,
      }));
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const completedCount = computed(() => {
    return todos.value.filter((todo) => todo.checked).length;
  });

  const totalCount = computed(() => {
    return todos.value.length;
  });

  const isCompleted = computed(() => {
    return completedCount.value > 0;
  });

  return {
    todos,
    addTodo,
    updateTodos,
    deleteTodo,
    getTodos,
    completedCount,
    totalCount,
    isCompleted,
  };
});
