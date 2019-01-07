import Vue from "vue";
import Router from "vue-router";
import { isEmpty } from "lodash";
import SkynetHome from "../view/Home";
import SkynetNotFoundPage from "@/view/NotFoundPage";
import SkynetForbiddenPage from "@/view/ForbiddenPage";
// import store from "@/store/store";
import SkynetContentContainer from "@/view/ContentContainer";
import SkynetSampleInspection from "@/view/data-monitor/SampleInspection";
import SkynetFullInspection from "@/view/data-monitor/FullInspection";
Vue.use(Router);

const RiskRoutes = [
  {
    path: "/risk",
    name: "risk-home",
    component: SkynetContentContainer,
    children: [
      {
        path: "entrance",
        name: "risk-entrance",
        component: () => import("../view/risk/RiskEntrance.vue")
      },
      {
        path: "offline",
        name: "risk-offline",
        component: () => import("../view/risk/RiskOffline.vue")
      }
    ]
  }
];
const dataRoutes = [
  {
    path: "/data",
    name: "data-home",
    component: SkynetContentContainer,
    children: [
      {
        path: "entrance",
        name: "data-entrance",
        component: () => import("../view/data-monitor/DataEntrance.vue"),
        children: [
          {
            path: "sample-inspection",
            name: "data-sample-inspection",
            component: SkynetSampleInspection
          },
          {
            path: "full-inspection",
            name: "data-full-inspection",
            component: SkynetFullInspection
          }
        ]
      },
      {
        path: "offline",
        name: "data-offline",
        component: () => import("../view/data-monitor/DataOffline.vue")
      }
    ]
  }
];
const powerRoutes = [
  {
    path: "/power",
    name: "power-setting",
    redirect: { name: "power-role-home" }
  },
  {
    path: "/power/role",
    name: "power-role-home",
    component: () => import("../view/power-setting/RoleAndLevel.vue"),
    props: true,
    children: [
      {
        path: ":hierarchyId",
        name: "power-role",
        component: () => import("../view/power-setting/RoleAndLevel.vue"),
        props: true,
        params: {
          hierarchyId: 1
        }
      }
    ]
  },
  {
    path: "/power/organization",
    name: "power-organization-home",
    component: () => import("../view/power-setting/Organization.vue"),
    props: true,
    children: [
      {
        path: ":organizationId",
        name: "power-organization",
        component: () => import("../view/power-setting/Organization.vue"),
        props: true,
        params: {
          organizationId: 1
        }
      }
    ]
  }
];
const topLevelRoutes = [...RiskRoutes, ...dataRoutes, ...powerRoutes];
const homeRouter = {
  path: "/",
  name: "home",
  component: SkynetHome,
  children: topLevelRoutes
};
const notFoundRoute = {
  path: "/404",
  name: "not-found",
  component: SkynetNotFoundPage
};
const forbiddenRoute = {
  path: "/forbidden",
  name: "forbidden",
  component: SkynetForbiddenPage
};
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [homeRouter, notFoundRoute, forbiddenRoute]
});

const collectAuthoritiesOfRoute = (route, authoritiesOfRoute) => {
  if (!isEmpty(route.children)) {
    route.children.forEach(subRoute =>
      collectAllRoutes(subRoute, authoritiesOfRoute)
    );
  } else {
    authoritiesOfRoute.push(route.authority);
  }
};
const collectAllRoutes = (route, allRoutes) => {
  route.authorities = [];
  collectAuthoritiesOfRoute(route, route.authorities);
  allRoutes.push(route);
  if (!isEmpty(route.children)) {
    route.children.forEach(subRoute => collectAllRoutes(subRoute, allRoutes));
  }
};

const allRoutes = [];
collectAllRoutes(homeRouter, allRoutes);

// router.beforeEach((to, from, next) => {
//   /* eslint-disable */
//   if (!history.pushState && location.toString().indexOf('#') === -1) {
//     return next(location.pathname + location.search);
//   }
//   /* eslint-enable */

//   // const publicPages = [loginRoute.path, notFoundRoute.path, forbiddenRoute.path];
//   // const isPublicPage = publicPages.includes(to.path);

//   // if (isPublicPage) {
//   //   return next();
//   // } else if (!getToken()) {
//   //   return redirectToSSOLogin(to.path);
//   // }

//   const routeTo = allRoutes.find(i => i.name === to.name);
//   if (!routeTo) {
//     return next(notFoundRoute);
//   }

//   if (isEmpty(routeTo.children) && !store.getters.userHasAuthority(routeTo.authority)) {
//     return next(forbiddenRoute);
//   }

//   if (!isEmpty(routeTo.children)) {
//     const firstPermittedSubRoute = routeTo.children.find(subRoute =>
//       store.getters.userHasAuthoritiesIn(subRoute.authorities));
//     return next(firstPermittedSubRoute || forbiddenRoute);
//   }

//   // store.commit(HIDE_SUMB_MENU, { hideSubMenu: !!routeTo.hideSubMenu });
//   return next();
// });

export default router;
