
import { useState, useCallback } from "react";

type Status = "todo" | "doing" | "done";

type Task = {
  id: number;
  title: string;
  priority: string;
  status: Status;
};

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Criar tela de login",
      priority: "Alta",
      status: "todo",
    },
    {
      id: 2,
      title: "Desenvolver página inicial",
      priority: "Média",
      status: "doing",
    },
    {
      id: 3,
      title: "Configurar projeto",
      priority: "Baixa",
      status: "done",
    },
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask,
      priority: "Média",
      status: "todo",
    };

    setTasks((currentTasks) => [...currentTasks, task]);
    setNewTask("");
  }, [newTask]);

  const moveTask = useCallback(
    (id: number, status: Status) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? { ...task, status } : task
        )
      );
    },
    [],
  );

  const columns: { id: Status; title: string }[] = [
    { id: "todo", title: "A fazer" },
    { id: "doing", title: "Em andamento" },
    { id: "done", title: "Concluída" },
  ];

  return (
    <main className="min-h-screen bg-[#FFF0F5] p-6 md:p-10">

      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#DB4D87]">
          GPD Tasks
        </h1>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Quadro de tarefas
        </h2>

        <p className="text-gray-500 mt-2">
          Organize e acompanhe suas atividades.
        </p>
      </div>

      <div className="flex gap-2 mb-8 max-w-lg">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Digite uma nova tarefa..."
          className="flex-1 min-w-0 bg-white border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#DB4D87]"
        />

        <button
          onClick={addTask}
          className="bg-[#DB4D87] hover:bg-[#C33B73] text-white px-5 py-3 rounded-lg font-semibold transition-colors"
        >
          + Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {columns.map((column) => (
          <section
            key={column.id}
            className="bg-[#F8E9EF] rounded-xl p-4 min-h-80"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-gray-700">
                {column.title}
              </h3>

              <span className="bg-white text-[#DB4D87] rounded-full px-3 py-1 text-sm font-semibold">
                {tasks.filter((task) => task.status === column.id).length}
              </span>
            </div>

            <div className="space-y-3">

              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3">
                      {task.title}
                    </h4>

                    <span className="text-xs bg-pink-100 text-[#DB4D87] px-3 py-1 rounded-full">
                      {task.priority}
                    </span>

                    <div className="flex flex-wrap gap-2 mt-4">

                      {column.id !== "todo" && (
                        <button
                          onClick={() => moveTask(
                            task.id,
                            column.id === "done" ? "doing" : "todo"
                          )}
                          className="text-xs text-gray-500 hover:text-[#DB4D87]"
                        >
                          ← Voltar
                        </button>
                      )}

                      {column.id !== "done" && (
                        <button
                          onClick={() => moveTask(
                            task.id,
                            column.id === "todo" ? "doing" : "done"
                          )}
                          className="text-xs text-[#DB4D87] font-semibold hover:text-[#C33B73]"
                        >
                          Avançar →
                        </button>
                      )}

                    </div>
                  </div>
                ))}

            </div>
          </section>
        ))}

      </div>
    </main>
  );
}
