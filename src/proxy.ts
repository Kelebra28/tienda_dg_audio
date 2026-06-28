import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Aplica el middleware (protección) a cualquier ruta que empiece con /admin
     * No protege /login, /, ni /api (a menos que sean /api/admin)
     */
    "/admin/:path*",
  ],
};
