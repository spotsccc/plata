export function AuthPage() {
  return (
    <div>
      <button
        onClick={async () => {
          await fetch("http://localhost:4000/api/auth/sign-up", {
            credentials: "include",
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              username: "kek",
              email: "shrek",
              password: "password",
            }),
          })
        }}
      >
        send
      </button>
      <button
        onClick={async () => {
          await fetch("http://localhost:4000/auth/test", {
            credentials: "include",
            method: "GET",
            headers: {
              "content-type": "application/json",
            },
          })
        }}
      >
        test
      </button>
    </div>
  )
}
