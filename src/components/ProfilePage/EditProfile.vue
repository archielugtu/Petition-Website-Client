<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-gapless is-centered">
          <div class="column is-one-third">
            <div class="signup">
              <div class="box">
                <b-notification type="is-info" aria-close-label="Close notification">
                  Note: You cannot remove City or Country, if it already exists...
                </b-notification>
                <div class="title is-3">Edit Profile</div>
                <div class="subtitle is-6">What changes would you like?</div>
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

                <b-field label="Current Password"
                         :type="{ 'is-danger': $v.password.$error }"
                         :message="[
                             { 'Password is required': $v.password.$error }
                             ]">
                  <b-input v-model="$v.password.$model" icon="lock" type="password" maxlength="30" placeholder="Password"></b-input>
                </b-field>
                <b-field label="New Password"
                         :type="{ 'is-danger': $v.newPassword.$error }"
                         :message="[
                             { 'Password is required': $v.newPassword.$error }
                             ]">
                  <b-input v-model="$v.newPassword.$model" icon="lock" type="password" maxlength="30" placeholder="New Password"></b-input>
                </b-field>
                <b-field label="Confirm Password"
                         :type="{ 'is-danger': $v.confirmNewPassword.$error || $v.newPassword.$model !== $v.confirmNewPassword.$model }"
                         :message="[
                             { 'Password is required': $v.confirmNewPassword.$error },
                             { 'Password does not match': $v.newPassword.$model !== $v.confirmNewPassword.$model }
                             ]">
                  <b-input v-model="$v.confirmNewPassword.$model" icon="lock" type="password" maxlength="30" placeholder="Confirm Password"></b-input>
                </b-field>



                <div class="field is-grouped">
                  <b-field class="file">
                    <!--                    <b-field label="Your profile picture!">-->
                    <b-upload>
                      <a class="button is-primary ">
                        <b-icon icon="upload"></b-icon>
                        Click to upload
                        <input class="file-input" accept="image/png, image/jpeg, image/jpg, image/gif" type="file" ref="profile_photo" @change="submitPhoto()">
                      </a>
                    </b-upload>
                  </b-field>

                  <a class="button is-danger" @click="clearFileSelected">
                    <b-icon icon="delete"></b-icon>
                    <b-field>Clear photo</b-field>
                  </a>
                </div>




                <div class="box has-text-centered" :style=" { height: selectedFile.height }">
                  <div class="image is-1by1 ">
                    <img v-if="selectedFile.image === undefined"
                         :src="selectedFile" style=""
                         onerror="this.src='https://www.computerhope.com/jargon/g/guest-user.jpg'"
                         alt="No image provided">
                  </div>
                </div>

                <div v-if="showErrMsg" class="field">
                  <div class="field-label">
                    <!-- Left empty for spacing -->
                  </div>
                  <div class="notification is-danger">{{ err.msg }}</div>
                </div>

                <div class="field is-grouped">
                  <div class="level">
                    <div class="level-left">
                      <div class="control">
                        <button
                          @click="submit"
                          id="submit"
                          class="button is-medium is-primary"
                        >Save</button>
                      </div>
                    </div>
                    <div class="level-right">
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

  import { required, requiredIf, email } from "vuelidate/lib/validators";
  import Api from "../../Api";
  import {mapActions} from "vuex";


  export default {
    name: "EditProfile",
    data() {
      return {
        file: null,
        selectedFile: `http://localhost:4941/api/v1/users/${this.$store.state.userId}/photo`,
        userData: {},
        name: "",
        email: "",
        password: "",
        newPassword: "",
        confirmNewPassword: "",
        city: "",
        country: "",
        notMatching: false,
        hasError: true,
        err: {},
        showErrMsg: false,
        hasClickUploadBtn: false,
        hasClickedClearBtn: false,
        photoDoesExist: false
      }
    },
    validations: {
      name: { required },
      email: { required, email },
      password: {
        required: requiredIf(function () {
          return this.newPassword !== '';
        })
      },
      newPassword: {
        required: requiredIf(function () {
          return this.confirmNewPassword !== '';
        })
      },
      confirmNewPassword: {
        required: requiredIf(function () {
          return this.newPassword !== '';
        })
      }
    },
    created() {
      this.init();
    },
    methods: {
      ...mapActions(["setLoggedIn", "setUserId"]),
      init() {
        if (this.$route.params.userId !== this.$store.state.userId) this.$router.push({name: 'home'})

        Api.getProfileById(this.$store.state.userId)
        .then((res) => {
          this.userData = res.data;

          this.name = this.userData.name;
          this.email = this.userData.email;
          if (this.userData.country !== null) this.country = this.userData.country;
          if (this.userData.city !== null) this.city = this.userData.city;
        })
        .catch((err) => {
          console.log(err);
        })


        Api.getUserPicture(this.$route.params.userId)
        .then(() => {
          this.photoDoesExist = true
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.photoDoesExist = false
          }
          console.log(err);
        })

      },
      submit() {
        this.showErrMsg = false
        if (this.$v.$invalid) {
          this.$v.$touch();
          this.$buefy.toast.open({
            duration: 1000,
            message: "Please fill in all the mandatory fields",
            type: "is-danger"
          });
          return;
        }

        if (this.newPassword !== this.confirmNewPassword) {
          this.notMatching = true;
          this.$buefy.toast.open({
            duration: 2000,
            message: "New password does not match confirm password",
            type: "is-danger"
          });
          return;
        }

        const payload = {
          name: this.name,
          email: this.email,
        };
        if (this.city !== '') payload.city = this.city;
        if (this.country !== '') payload.country = this.country;
        if (this.newPassword !== '' && this.currentPassword !== '') {
          payload.password = this.newPassword;
          payload.currentPassword = this.password;
        }



        Api.editUserProfile(this.$route.params.userId, payload)
        .then(() => {
          console.log("EYOOOO")
          console.log(this.hasClickUploadBtn)
          console.log(this.file)
          console.log(this.hasClickedClearBtn)
          if (this.hasClickedClearBtn) {
            return Api.deleteUserPicture(this.$store.state.userId)
          }
          if (this.hasClickUploadBtn) {
            return Api.postUserPicture(this.$store.state.userId, this.file, this.file.type)
          }

        })
          .then(() => {
            this.$buefy.toast.open({
              duration: 3000,
              message: "Profile changed successfully!",
              type: "is-success"
            })
            this.$router.push({ name: 'profile', params: { userId: this.$route.params.userId } })
          })
          .catch((err) => {

            // if (err.response.status === 400)
            if ([400, 401, 403, 500].includes(err.response.status)) {
              this.showErrMsg = true;
              this.err.msg = err.response.statusText;
            }
            console.log(err);
          });



      },
      cancelButton() {
        this.$router.go(-1);
      },
      clearFileSelected() {
        console.log(this.photoDoesExist);
        if (!this.photoDoesExist) {
          return;
        }
        this.selectedFile = 'https://www.computerhope.com/jargon/g/guest-user.jpg';
        this.hasClickedClearBtn = true;
        this.hasClickUploadBtn = false;
        this.photoDoesExist = false;
        this.showErrMsg = false;

      },
      submitPhoto() {

        this.file = this.$refs.profile_photo.files[0];
        console.log('after')
        console.log(this.file)
        if (this.file !== undefined && this.file !== null) {
          console.log("in the if statement")
          console.log(this.file)
          if (['image/gif', 'image/png', 'image/jpg', 'image/jpeg'].includes(this.file.type)) {
            console.log("MADE ITT")
            this.selectedFile = URL.createObjectURL(this.file);
            this.hasClickUploadBtn = true;
            this.hasClickedClearBtn = false;
            this.photoDoesExist = true;
            this.showErrMsg = false
          } else {
            this.file = null;
            this.showErrMsg = true;
            this.err.msg = 'Photo must be jpg, png, or gif'
          }

        }

        console.log("did not make it")
        console.log(this.file);
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
