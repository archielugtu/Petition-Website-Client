<template>
  <div>
    <section class="hero is-link is-fullheight header-image">
      <div class="hero-body">
        <div class="container">


          <h1 id="splash-text" class="has-text-centered title splash-text">Petition Website</h1>
          <h3 class="has-text-centered subtitle splash-subtitle">Make a <strong>Change!</strong></h3>
          <a>
            <router-link
              to="/home"
              class="button is-primary is-large">
              <strong>Start Here</strong>
            </router-link>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
    export default {
        name: "WelcomePage"
    }
</script>

<style scoped>


.header-image {
  /*background-image: url("/splash.webp");*/
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: black;
  background-image: url("https://images.unsplash.com/photo-1588466290073-ddd47dcfb980?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
}

.splash-text {
  font-family: "Pacifico", serif;
  text-shadow: 2px 1px #543c2c;
  font-size: calc(58px + (78 - 58) * ((100vw - 300px) / (1600 - 300)));
}

.splash-subtitle {
  font-family: "Montserrat", serif;
  text-shadow: 2px 1px #543c2c;
  font-size: calc(29px + (39 - 29) * ((100vw - 300px) / (1600 - 300)));
}

</style>
