import { useRouter } from "next/navigation";

export function redirectByRole(
  router: ReturnType<typeof useRouter>
) {
  const role = localStorage.getItem("role");

  if (!role) {
    router.push("/");
    return;
  }

  switch (role) {
    case "ADMIN":
      router.push("/dashboard");
      break;

    case "MANAGER":
      router.push("/dashboard");
      break;

    default:
      localStorage.removeItem("role");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType"); 
      router.push("/");
  }
}