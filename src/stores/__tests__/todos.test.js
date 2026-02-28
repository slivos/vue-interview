import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTodosStore } from '../todos.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('Todos Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('addTodo', () => {
    it('should add a new todo to the list', () => {
      const store = useTodosStore();

      // Add a new todo
      store.addTodo('New Task');

      // Assertions
      expect(store.todos).toHaveLength(1);
      expect(store.todos[0].label).toBe('New Task');
      expect(store.todos[0].checked).toBe(false);
      expect(store.todos[0].id).toBeTypeOf('number');
    });

    it('should add multiple todos correctly', () => {
      const store = useTodosStore();

      store.addTodo('First Task');
      store.addTodo('Second Task');

      expect(store.todos).toHaveLength(2);
      expect(store.todos[0].label).toBe('First Task');
      expect(store.todos[1].label).toBe('Second Task');
    });
  });

  describe('updateTodos', () => {
    it('should update the entire todos list', () => {
      const store = useTodosStore();

      // Add initial todo
      store.addTodo('Initial Task');

      // Update with new list
      const newTodos = [
        { id: 1, label: 'Updated Task 1', checked: true },
        { id: 2, label: 'Updated Task 2', checked: false },
      ];
      store.updateTodos(newTodos);

      expect(store.todos).toEqual(newTodos);
      expect(store.todos).toHaveLength(2);
    });
  });

  describe('computed properties', () => {
    it('should correctly count completed todos', () => {
      const store = useTodosStore();

      const newTodos = [
        { id: 1, label: 'Task 1', checked: true },
        { id: 2, label: 'Task 2', checked: false },
        { id: 3, label: 'Task 3', checked: true },
      ];
      store.updateTodos(newTodos);

      expect(store.completedCount).toBe(2);
    });

    it('should correctly count total todos', () => {
      const store = useTodosStore();

      const newTodos = [
        { id: 1, label: 'Task 1', checked: true },
        { id: 2, label: 'Task 2', checked: false },
        { id: 3, label: 'Task 3', checked: true },
      ];
      store.updateTodos(newTodos);

      expect(store.totalCount).toBe(3);
    });

    it('should correctly determine if any todos are completed', () => {
      const store = useTodosStore();

      // No todos
      expect(store.isCompleted).toBe(false);

      // Add uncompleted todo
      store.addTodo('Uncompleted Task');
      expect(store.isCompleted).toBe(false);

      // Add completed todo
      store.updateTodos([{ id: 1, label: 'Completed Task', checked: true }]);
      expect(store.isCompleted).toBe(true);
    });
  });

  describe('getTodos', () => {
    it('should fetch todos from API and map them correctly', async () => {
      const store = useTodosStore();

      // Mock successful API response
      const mockData = [
        { id: 1, title: 'Todo 1', completed: false },
        { id: 2, title: 'Todo 2', completed: true },
        { id: 3, title: 'Todo 3', completed: false },
      ];

      global.fetch.mockResolvedValueOnce({
        json: async () => mockData,
      });

      await store.getTodos();

      // Verify data was mapped correctly
      expect(store.todos).toHaveLength(3); // Should slice to 10 items
      expect(store.todos[0]).toEqual({
        id: 1,
        label: 'Todo 1',
        checked: false,
      });
      expect(store.todos[1]).toEqual({
        id: 2,
        label: 'Todo 2',
        checked: true,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/todos'
      );
    });

    it('should handle API errors gracefully', async () => {
      const store = useTodosStore();

      // Mock API error
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await store.getTodos();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching todos:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
