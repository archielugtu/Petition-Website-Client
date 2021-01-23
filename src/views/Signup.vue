<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-gapless is-centered">
          <div class="column is-one-third">
            <div class="signup">
              <div class="box">
                <div class="title is-3">Sign up</div>
                <div class="subtitle is-6">We just need a few details about you!</div>
                <hr class="style-one">

                  <b-field label="Name"
                           :message="[{'Name is required': $v.name.$error}]"
                           :type="{ 'is-danger': $v.name.$error }">
                    <b-input v-model="$v.name.$model" placeholder="Your name"></b-input>
                  </b-field>

                  <b-field label="Email"
                           :type="{ 'is-danger': $v.email.$error }"
                           :message="[
                             { 'Email is invalid': $v.email.$error }
                             ]">
                    <b-input type="email" v-model="$v.email.$model" placeholder="Your email" maxlength="30"></b-input>
                  </b-field>

                  <div class="columns">
                    <div class="column">
                      <b-field label="Country">
                        <b-input v-model="country" icon="flag" placeholder="Country"></b-input>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field label="City">
                        <b-input v-model="city" icon="city" placeholder="City"></b-input>
                      </b-field>
                    </div>
                  </div>

                  <b-field label="Password"
                           :type="{ 'is-danger': $v.password.$error }"
                           :message="[
                             { 'Password is required': $v.password.$error }
                             ]">
                    <b-input v-model="$v.password.$model" icon="lock" type="password" maxlength="30" placeholder="Password"></b-input>
                  </b-field>

                <div class="field is-grouped">
                  <b-field class="file">
<!--                    <b-field label="Your profile picture!">-->
                      <b-upload>
                        <a class="button is-primary ">
                          <b-icon icon="upload"></b-icon>
                          Click to upload
                          <input class="file-input" type="file" ref="profile_photo" @change="getPhotoFile()">
                        </a>
                      </b-upload>
<!--                    </b-field>-->
                  </b-field>
<!--           ########     TO BE IMPLEMENTED ##################-->
<!--                  <b-field>-->
<!--                    <b-button class="is-danger" @click="clearFileSelected" size="300" icon-left="delete">-->
<!--                      Clear-->
<!--                    </b-button>-->
<!--                  </b-field>-->
                </div>

                <div class="box has-text-centered" :style=" {height: selectedFile.height }">
                  <div class="image is is-2by2">
                    <img v-if="selectedFile.exists === undefined" :src="selectedFile" style="" alt="No image provided">
                  </div>
                </div>

                <div v-if="showErrMsg" class="field">
                  <div class="field-label">
                    <!-- Left empty for spacing -->
                  </div>
                  <div class="notification is-danger">{{ err.msg }}</div>
                </div>

                <div class="field is-grouped">
                  <div class="control">
                    <button
                      @click="submit"
                      id="submit"
                      class="button is-medium is-primary"
                    >Submit</button>
                  </div>
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
  </section>
</template>

<script>

  import { required, email } from "vuelidate/lib/validators";
  import Api from "../Api";
  import {mapActions} from "vuex";


  export default {
      name: "Signup",
      data() {
          return {
            file: null,
            selectedFile: {
              height: 200,
              exists: null
            },
            name: "",
            email: "",
            password: "",
            city: "",
            country: "",
            hasError: true,
            err: {},
            showErrMsg: false

          }
      },
      validations: {
        name: { required },
        email: { required, email },
        password: { required }
      },
      created() {
        this.init();
      },
    computed: {
        getImage() {
          return `http://localhost:4941/api/v1/users/${this.$store.state.userId}/photo`
        }
    },
    methods: {
        ...mapActions(["setLoggedIn", "setUserId"]),
        init() {
          if (this.$store.state.isLoggedIn) this.$router.push({name: 'home'})
          // this.name = "Rchi";
          // this.email = "hi@hi.com";
          // this.password = "password";
          // this.country = "NZ";
          // this.city = "CHCH"

        },
        submit() {
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
            name: this.name,
            email: this.email,
            password: this.password
          };
          if (this.country !== '') payload.country = this.country;
          if (this.city !== '') payload.city = this.city;

          Api.signup(payload)
            .then(() => {
              return Api.login({ email: this.email, password: this.password })
            })
            .then((response) => {

                console.log(response.data.userId);
                Api.saveToken()
                this.setLoggedIn(true);
                this.setUserId(response.data.userId);
                sessionStorage.setItem("userId", response.data.userId);
                sessionStorage.setItem("token", response.data.token);

                if (this.file !== null) {
                  console.log(this.file.type);
                  return Api.postUserPicture(this.$store.state.userId, this.file, this.file.type)
                }

            })
            .then(() => {
              this.$router.push({ name: 'profile', params: {userId: this.$store.state.userId }});

            })
            .catch(error => {
              if (!error.response) {
                return;
              }
              if (error.response.status === 400) {
                this.err.msg = 'Email is already registered'
                this.showErrMsg = true
              }
              console.log(error);
            })
        },
        cancelButton() {
          this.$router.push({ name: "home" })
        },
        clearFileSelected() {
          if (this.selectedFile.exists === undefined) {
            this.selectedFile = { exists: null, height: 200 }
            this.file = null
            this.$refs.profile_photo = null;
          }
        },
      getPhotoFile() {
          this.file = this.$refs.profile_photo.files[0] || this.file;
          if (this.file !== null) this.selectedFile = URL.createObjectURL(this.file);
        },
      }
    }
</script>

<style scoped>
.box {
  max-width: 500px;
}
hr.style-one {
  border: 0;
  height: 1px;
  background: #333;
  background-image: linear-gradient(to right, #ccc, #333, #ccc);
}

</style>
