export function setupRouteGuard(router) {
  router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)
    const user = localStorage.getItem('user')

    if (authRequired && !user) {
      next('/login')
    } else {
      next()
    }
  })
} 