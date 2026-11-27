
import { useCallback, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    [],
  );

  const handleSenhaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSenha(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log("Tentando entrar com:", email);
    },
    [email],
  );

  return (
    <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center px-4">
      <main className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#db4d87]">
            GPD Tasks
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Digite seu e-mail"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#db4d87] focus:ring-2 focus:ring-[#db4d87]/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={handleSenhaChange}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#db4d87] focus:ring-2 focus:ring-[#db4d87]/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#db4d87] hover:bg-[#c33b73] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Entrar
          </button>

        </form>
      </main>
    </div>
  );
}
