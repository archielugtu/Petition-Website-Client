import VueRouter from 'vue-router'
import WelcomePage from "./views/WelcomePage";
import Home from "./views/Home";
import PetitionDetails from "./views/PetitionDetails";
import Signup from "./views/Signup";
import LogIn from "./views/LogIn";
import Profile from "./views/Profile";
import EditProfile from "./components/ProfilePage/EditProfile";
import UserPetitions from "./components/ProfilePage/UserPetitions";
import ViewMyPetitions from "./components/ProfilePage/ViewMyPetitions";
import store from './store/store';


const routes = [
  {
    path: "/",
    name: 'WelcomePage',
    component: WelcomePage // HomePage.Vue
  },
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    name: "petition",
    path: "/petition/:petitionId",
    component: PetitionDetails
  },
  {
    name: "signup",
    path: "/signup",
    component: Signup
  },
  {
    name: "login",
    path: "/login",
    component: LogIn
  },
  {
    name: 'profile',
    path: '/profile/:userId',
    component: Profile
  },
  {
    name: 'editProfile',
    path: '/profile/edit/:userId',
    component: EditProfile
  },
  {
    name: 'userPetition',
    path: '/profile/:userId/petitions/:petitionId',
    component: UserPetitions
  },
  {
    name: 'viewMyPetitions',
    path: '/profile/:userId/petitions',
    component: ViewMyPetitions
  }
];

// const router defined below, will be used in the Vue instance down below, as router: router <-- this is the const
const router = new VueRouter({
  routes: routes,
  mode: 'history' // sets the mode of 'routes' (above) to be history
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router;
