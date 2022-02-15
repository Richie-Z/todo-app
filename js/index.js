import { createApp, ref, onUpdated, onMounted, reactive } from "vue";

createApp({
  setup() {
    const todos = reactive([]);
    const contentModel = ref("");
    const contentEl = ref(null);
    const addTodo = () => {
      if (contentModel.value === "") return alert("Todo cannot empty!");
      todos.push({ content: contentModel.value, done: false });
      contentModel.value = "";
    };
    const removeTodo = (index) => {
      todos.splice(index, 1);
    };
    const markTodo = (index) => {
      todos[index].done = !todos[index].done;
    };
    const checkAll = () => {
      todos.forEach((val) => (val.done = !val.done));
    };
    const removeAll = () => {
      todos.splice(0, todos.length);
    };
    const updateLocalStorage = () => {
      localStorage.setItem("todos", JSON.stringify(todos));
    };
    onUpdated(() => {
      updateLocalStorage();
    });
    onMounted(() => {
      JSON.parse(localStorage.getItem("todos"))?.forEach((item) =>
        todos.push(item)
      );
      contentEl.value.focus();
    });
    return {
      todos,
      contentModel,
      contentEl,
      addTodo,
      removeTodo,
      markTodo,
      checkAll,
      removeAll,
    };
  },
}).mount("#app");
