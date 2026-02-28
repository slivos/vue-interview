<template>
  <div class="todo-results">
    <span class="todo-results-title">COUNT OF COMPLETED TODOS:</span>
    <div
      class="todo-results-completed"
      :class="{ 'todo-done': isCompleted, 'todo-undone': !isCompleted }"
    >
      {{ completedCount }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useTodosStore } from "@/stores/todos";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "TodoResults",

  setup() {
    const todosStore = useTodosStore();
    const { completedCount, isCompleted } = storeToRefs(todosStore);

    return {
      completedCount,
      isCompleted,
    };
  },
});
</script>

<style scoped>
.todo-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  margin-top: 24px;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
}

.todo-results-title {
  font-weight: 500;
  font-size: 18px;
  text-transform: uppercase;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
  margin-bottom: 10px;
  width: 100%;
}

.todo-results-completed {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}

.todo-done {
  color: green;
}

.todo-undone {
  color: red;
}
</style>
