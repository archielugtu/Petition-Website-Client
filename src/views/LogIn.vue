<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-gapless is-centered">
          <div class="column is-one-third">
            <div class="login">
              <div class="box">
                <div class="title is-3">Log In</div>
<!--                <div class="subtitle is-6">We just need a few details about you!</div>-->
                <hr class="style-one">

                <b-field label="Email"
                         :type="{ 'is-danger': $v.email.$error }"
                         :message="[
                             { 'Email is invalid': $v.email.$error }
                             ]">
                  <b-input type="email" v-model="$v.email.$model" icon="account" placeholder="Your email" maxlength="30"></b-input>
                </b-field>

                <b-field label="Password"
                         :type="{ 'is-danger': $v.password.$error }"
                         :message="[
                             { 'Password is required': $v.password.$error },
                             ]">
                  <b-input v-model="$v.password.$model" icon="lock" type="password" maxlength="30" placeholder="Password"></b-input>
                </b-field>

                <div v-if="showErrMsg" class="field">
                  <div class="field-label">
                    <!-- Left empty for spacing -->
                  </div>
                  <div class="notification is-danger">{{ err.msg }}</div>
                </div>

                <div class="field is-grouped">
                  <div class="columns is-mobile is-centered">
                    <div class="column">
                      <div class="control">
                        <button
                          @click="login"
                          id="submit"
                          class="button is-medium is-primary"
                        >Submit</button>
                      </div>
                    </div>
                    <div class="column">
                      <div class="control">
                        <button @click="cancelButton" class="button is-danger is-medium">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script>

  import { required, email } from "vuelidate/lib/validators";
  import { mapActions } from "vuex";
  import Api from "../Api";

  export default {
      name: "LogIn",
      data() {
        return {
          email: "",
          password: "",
          showErrMsg: false,
          err: {}
        }
      },
      validations: {
        email: { required, email },
        password: { required }
      },
      created() {
        this.init();
      },
      methods: {
        ...mapActions(["setLoggedIn", "setUserId"]),
        init: function() {

          if (this.$store.state.isLoggedIn) {
            this.$router.push({name: 'profile', params: { userId: sessionStorage.getItem('userId').toString() } })
          }

          // this.email = 'hi@hi.com';
          // this.password = 'password';
        },
        login() {
          if (this.$v.$invalid) {
            this.$v.$touch();
            this.$buefy.toast.open({
              duration: 1000,
              message: "Please fill in all the mandatory fields",
              type: "is-danger"
            });
            return;
          }

          const payload = {
            email: this.email,
            password: this.password
          }

          Api.login(payload)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data.userId);
              Api.saveToken()
              // this.$http.defaults.common["Authorization"] = response.data.token
              this.setLoggedIn(true);
              this.setUserId(response.data.userId);
              sessionStorage.setItem("userId", response.data.userId);
              sessionStorage.setItem("token", response.data.token);
              this.$router.push({ name: 'profile', params: {userId: response.data.userId.toString()} });
            }

          })
          .catch((error) => {
            if (!error.response) {
              return;
            }
            if (error.response.status === 400) {
              this.showInvalidEmailOrPassword();
            }
          });

        },
        cancelButton() {
          this.$router.push({ name: "home" })
        },
        showInvalidEmailOrPassword: function() {
          this.err.msg = "Invalid email or password";
          this.showErrMsg = true;
        }

      }
    }
</script>

<style scoped>

</style>
