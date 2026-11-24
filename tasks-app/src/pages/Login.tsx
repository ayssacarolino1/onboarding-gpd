import { useState, type SubmitEvent } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

 function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  console.log("Tentando entrar com:", email);
}

  return (
    <main>
      <h1>GPD Tasks</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}