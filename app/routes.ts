import { type RouteConfig } from '@react-router/dev/routes'
import { flatRoutes } from '@react-router/fs-routes'
import { ejectBlogTree } from '../db.up'

const routes = await flatRoutes()

// Eject the route map
ejectBlogTree(routes)

export default routes satisfies RouteConfig
