<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item" style="font-weight: bold">
        Petition Site
      </router-link>

      <a role="button"
         :class="{ 'is-active': isOpen }"
         class="navbar-burger burger"
         aria-label="menu"
         aria-expanded="false"
         data-target="navbarPetitionMenu"
         @click="toggleActiveNavbar"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarPetitionMenu" class="navbar-menu" v-bind:class="{ 'is-active': isOpen } ">
      <div class="navbar-start">
        <router-link to="/home" class="navbar-item" @click.native="isOpen = false">
          Home
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <div class="buttons" v-if="!isLoggedIn" >
              <router-link
                id="signup"
                class="button is-primary is-rounded"
                @click.native="isOpen = false"
                to="/signup">
                <strong>Sign up</strong>
              </router-link>

              <router-link
                @click.native="isOpen = false"
                id="login"
                class="button is-light is-rounded"
                to="/login">
                Log in
              </router-link>
            </div>
            <div v-else>
              <div class="buttons">
                  <a class="button is-primary is-rounded" @click="goToProfile">
                    <strong>Profile</strong>
                  </a>
                <a class="button is-light is-rounded" @click="logout">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import Api from "../Api";

  export default {
      name: "Navbar",
      data() {
        return {
          isOpen: false,
        }
      },
      computed: {
        ...mapState(["isLoggedIn"])
      },
      methods: {
        ...mapActions(["setLoggedIn", "setUserId"]),
        toggleActiveNavbar: function() {
          this.isOpen = !this.isOpen;
        },
        logout: function () {
          Api.logout()
          .then((response) => {
            console.log(response.status);
            this.$buefy.toast.open({
              duration: 2000,
              message: "Successfully logged out! :)",
              type: "is-success"
            });
          })
          .catch((error) => {
            console.log(error);
          })
          this.setLoggedIn(false);
          this.setUserId(-1);
          console.log(sessionStorage.getItem('token'));
          sessionStorage.clear();
          this.isOpen = false;
          if (this.$router.currentRoute.path !== '/home') this.$router.push('/home')

        },
        goToProfile: function () {
          // prevents user from going to profile twice
          if (this.$router.currentRoute.path !== `/profile/${this.$store.state.userId}`) {
            this.$router.push({ name: 'profile', params: {userId: this.$store.state.userId} })
          }
        }
      }
    }
</script>

<style scoped>
.navbar {
  height: 70px;
}
</style>
