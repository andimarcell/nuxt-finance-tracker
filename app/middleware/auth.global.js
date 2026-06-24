export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Jika user belum login dan mencoba masuk ke dashboard (index)
  if (!user.value && to.path === "/dashboard") {
    return navigateTo("/login");
  }

  // Jika user sudah login tapi mencoba akses halaman login atau confirm
  if (
    user.value &&
    (to.path === "/login" || to.path === "/confirm")
  ) {
    return navigateTo("/dashboard");
  }
}); 
