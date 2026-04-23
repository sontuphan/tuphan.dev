import { type RouteConfig } from '@react-router/dev/routes'
import { flatRoutes } from '@react-router/fs-routes'
import { ejectBlogTree } from './db'

const routes = await flatRoutes()

// Inject map builder
ejectBlogTree(routes)

export default routes satisfies RouteConfig
