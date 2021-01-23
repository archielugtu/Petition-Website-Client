<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-one-third">
            <div class="box">
              <b-notification type="is-info" aria-close-label="Close notification">
                Note: You cannot remove the petition closing date, if it already exists...
              </b-notification>
              <h1 class="title">Edit Petition</h1>
              <b-field
                label="Title"
                :type="{ 'is-danger': $v.title.$error }">
                <b-input placeholder="Your petition title!" v-model="$v.title.$model"></b-input>
              </b-field>

              <b-field label="Description" :type="{ 'is-danger': $v.description.$error }">
                <b-input maxlength="200" type="textarea" placeholder="What is your petition about?" v-model="$v.description.$model"></b-input>
              </b-field>

              <b-field v-if="!isOpenSetDate" label="Set Petition Closing Date">
                <button  class="button is-primary" @click="openDateTimePicker">
                  Create Date
                </button>
              </b-field>

              <div v-if="isOpenSetDate" id="date-range" class="field">
                <b-field label="Select a closing date">
                  <b-datetimepicker
                    v-model="closingDate"
                    :date-formatter="dateFormatter"
                    placeholder="Click to select..."
                    icon="calendar-today"
                    trap-focus
                    :min-datetime="minDate"
                    horizontal-time-picker
                  ></b-datetimepicker>
                </b-field>
              </div>


              <b-field label="Category">
                <b-dropdown
                  scrollable="true"
                  max-height="10"
                  v-model="categoryDropDown"
                  aria-role="list"
                >
                  <button class="button" type="button" slot="trigger">
                    <template>
                      <span>{{ categoryDropDown.name }}</span>
                    </template>
                    <b-icon icon="menu-down"></b-icon>
                  </button>
                  <b-dropdown-item
                    v-for="(category, index) in categories"
                    :key="index"
                    :value="category" aria-role="list_item">
                    <div class="media">
                      <div class="media-content">
                        <h3>{{ category.name }}</h3>
                      </div>
                    </div>
                  </b-dropdown-item>
                </b-dropdown>
              </b-field>

              <b-field label="Select your petition image!" >
                  <b-upload>
                    <a class="button is-primary">
                      <b-icon icon="upload"></b-icon>
                      <span>Click to upload</span>
                      <input type="file" @change="onFileSelected" size="300" accept="image/gif, image/jpeg, image/jpg, image/png" />
                    </a>
                  </b-upload>
              </b-field>

              <div v-if="this.file === null">
                <div class="help is-danger">Petition image is required</div>
              </div>

              <div class="section">
                <div class="image is is-4by4">
                  <img v-if="selectedFile.exists === undefined" :src="selectedFile" style="" alt="Must provide an image">
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
                  <button class="button is-link" @click="submit">Submit</button>
                </div>
                <div class="control">
                  <button class="button is-link is-light" @click="cancelEditPetition">Cancel</button>
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

  import Api from "../../Api";
  import {required} from "vuelidate/lib/validators";

  export default {
    name: "UserPetitions",
    data() {
      const now = new Date(); // current day and time
      return {
        petition: [],
        petitionId: -1,
        title: '',
        description: '',
        categoryId: -1,
        closingDate: new Date(),
        dateToday: now,
        categoryDropDown: { },
        categories: [],
        selectedFile: `http://localhost:4941/api/v1/petitions/${this.$route.params.petitionId}/photo`,
        file: null,
        minDate: new Date(),
        err: {},
        showErrMsg: false,
        isOpenSetDate: false,
        uploadBtnHasClicked: false
      }
    },
    validations: {
      title: { required },
      description: { required },
      categoryDropDown: { required },
    },
    computed: {

    },
    mounted() {
      this.init()
    },
    methods: {
      init() {



        Api.getSinglePetition(this.$route.params.petitionId)
          .then((response) => {

            this.petition = response.data;

            if ((this.petition.authorId.toString() !== this.$route.params.userId) ||
              (this.$route.params.userId !== sessionStorage.getItem('userId').toString()))
            {
              this.$router.push({name: 'home'})
            }

            this.title = this.petition.title
            this.description = this.petition.description
            this.categoryDropDown.name = this.petition.category;


            if (this.petition.closingDate !== null) {
              this.isOpenSetDate = true;
              this.closingDate = new Date(this.petition.closingDate);
              let now = this.dateFormatter(new Date());
              if (this.closingDate < new Date() ) {
                this.$buefy.toast.open({
                  duration: 4000,
                  message: "This petition has ended! You cannot edit this petition anymore...",
                  type: "is-danger"
                });
                this.$router.push({ name: 'petition', params:{ petitionId: this.$route.params.petitionId } })
              }
            }
            return Api.getAllCategories()
          })
          .then((response) => {
            const index = response.data.findIndex(c => c.name === this.categoryDropDown.name)
            this.categories = response.data;
            this.categoryDropDown = this.categories[index];
          })
          .catch((error) => {
            console.log(error);
          });

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

        let payload = {
          title: this.title,
          description: this.description,
          categoryId: this.categoryDropDown.categoryId,
        }
        console.log(payload)
        if (this.isOpenSetDate) {
          let today = this.dateFormatter(new Date())
          let closingDate = this.dateFormatter(new Date(this.closingDate))
          console.log(today)
          console.log(closingDate)
          console.log(closingDate < today)
          if (closingDate < today) {
            this.$v.$touch();
            this.$buefy.toast.open({
              duration: 2000,
              message: "Closing date cannot be in the past",
              type: "is-danger"
            });
            return;
          }
          payload.closingDate = closingDate
          console.log(payload.closingDate);
        }

        Api.editUserPetition(this.$route.params.petitionId, payload)
        .then(() => {
          if (this.uploadBtnHasClicked) return Api.postPetitionPhoto(this.$route.params.petitionId, this.file, this.file.type)
        })
          .then(() => {
            this.$buefy.toast.open({
              duration: 3000,
              message: "Profile changed successfully!",
              type: "is-success"
            })
            this.$router.push({ name: 'petition', params: { petitionId: this.$route.params.petitionId } })
          })
        .catch((err) => {
          console.log(err.response.statusText);
          if (err.response.statusText.includes('Bad Request: cannot edit a petition that has closed')) {
            this.$buefy.toast.open({
              duration: 4000,
              message: "Sorry the petition has closed! You cannot edit the petition anymore...",
              type: "is-danger"
            })
          }
          this.$router.push({ name: 'petition', params: { petitionId: this.$route.params.petitionId } })
          console.log(err);
        })

      },
      cancelEditPetition() {
        this.$router.go(-1);
      },
      dateFormatter(current_datetime) {
        return current_datetime.getFullYear() + "-" +
          (current_datetime.getMonth() + 1) + "-" +
          current_datetime.getDate() + " " +
          current_datetime.getHours() + ":" +
          current_datetime.getMinutes() + ":" +
          current_datetime.getSeconds() + "." +
          current_datetime.getMilliseconds();
      },
      onFileSelected(event) {
        this.file = event.target.files[0];
        if (this.file !== null)  this.selectedFile = URL.createObjectURL(this.file);
        this.uploadBtnHasClicked = true;
        console.log(this.file.name);
        console.log(this.selectedFile);
      },
      openDateTimePicker() {
        this.isOpenSetDate = true;
        const dateToday = new Date();
        this.minDate.setHours(dateToday.getHours()+1);
        this.closingDate = new Date(this.minDate);
        console.log(this.closingDate);


      }
    }

  }
</script>

<style scoped>

</style>
