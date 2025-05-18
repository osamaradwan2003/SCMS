import { useLogin } from "@/hooks/auth";

export default function Login() {
  const mutateFunc = useLogin();
  return (
    <button
      onClick={() => {
        mutateFunc.mutate({
          username: "test",
          password: "test",
        });
      }}
    >
      Login
    </button>
  );
}
