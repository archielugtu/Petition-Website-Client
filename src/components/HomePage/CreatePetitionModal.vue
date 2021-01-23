<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Start your petition now!</p>
    </header>
    <section class="modal-card-body">

      <b-field
        label="Title"
        :type="{ 'is-danger': $v.title.$error }">
        <b-input placeholder="Your petition title!" v-model="$v.title.$model"></b-input>
      </b-field>

      <b-field label="Description" :type="{ 'is-danger': $v.description.$error }">
        <b-input maxlength="200" type="textarea" placeholder="What is your petition about?" v-model="$v.description.$model"></b-input>
      </b-field>

      <b-field label="Time Range">
        <b-switch
          id="time-range-switch"
          v-model="timeRange"
          true-value="Duration"
          false-value="Continuous"
          @input="resetDate"
        >{{ timeRange }}</b-switch>
      </b-field>

      <div v-if="timeRange === 'Duration'" id="date-range" class="field">


        <b-field label="Select a closing date">
          <b-datetimepicker
            v-model="$v.closingDate.$model"
            placeholder="Click to select..."
            icon="calendar-today"
            trap-focus
            horizontal-time-picker
            :min-datetime="minDate"
          ></b-datetimepicker>
        </b-field>
      </div>

      <b-field label="Categories">
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

      <b-field label="Select your petition image!">
        <b-field class="file">
          <b-upload>
            <a class="button is-primary">
              <b-icon icon="upload"></b-icon>
              <span>Click to upload</span>
              <input type="file" @change="onFileSelected" size="300" accept="image/gif, image/jpeg, image/jpg, image/png" />
            </a>
          </b-upload>
        </b-field>
      </b-field>

      <div v-if="showErrMsg" class="field">
        <div class="field-label">
          <!-- Left empty for spacing -->
        </div>
        <div class="notification is-danger">{{ err.msg }}</div>
      </div>

      <div v-if="this.file === null">
        <div class="help is-danger">Petition image is required</div>
      </div>

      <!--      <b-field class="button is-primary" type="" @change="onFileSelected">Click to upload</b-field>-->
        <div class="box has-text-centered" :style=" {height: selectedFile.height } " >
          <div class="image is is-4by4">
            <img v-if="selectedFile.exists === undefined" :src="selectedFile" style="" alt="Must provide an image">
          </div>
        </div>

    </section>
    <footer class="modal-card-foot">
      <button class="button is-primary" @click="createThePetition">Create</button>
      <button class="button is-danger" @click="$parent.close()">Close</button>
    </footer>
  </div>

</template>

<script>

  import {minValue, required, requiredIf} from "vuelidate/lib/validators";

  import Api from "../../Api";

  export default {
      name: "CreatePetition",
      data() {
        const now = new Date(); // current day and time
        return {
          petitionId: -1,
          title: '',
          description: '',
          categoryId: -1,
          closingDate: now,
          timeRange: "Continuous",
          dateToday: now,
          categoryDropDown: { },
          categories: [],
          selectedFile: {
            height: 200,
            exists: null
          },
          file: null,
          minDate: new Date(),
          err: {},
          showErrMsg: false
        }
      },
      computed: {
        isContinuous() {
          return this.timeRange === "Continuous"
        }
      },
      validations: {
        title: { required },
        description: { required },
        categoryDropDown: { required },
        closingDate: {
          required: requiredIf(function () {
            return !this.isContinuous;
          }),
          minDate: minValue(new Date())
        }
      },
      mounted() {
        this.init()
      },
      methods: {
        init() {

          Api.getAllCategories()
            .then((response) => {
              this.categories = response.data;
              this.categoryDropDown = this.categories[0]

            })
            .catch((error) => {
              console.log(error);
            });
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
          console.log(this.file.name);
          console.log(this.selectedFile);
        },
        createThePetition() {
          if (this.$v.$invalid || this.file === null) {
            this.$v.$touch();
            this.$buefy.toast.open({
              duration: 1000,
              message: "Please fill in all the mandatory fields",
              type: "is-danger"
            });
            return;
          }

          const payload = {
            title: this.title,
            description: this.description,
            categoryId: this.categoryDropDown.categoryId,
          }

          if (this.timeRange === "Duration") {
            let today = new Date();
            if (new Date(this.closingDate) < today) {
              this.$buefy.toast.open({
                duration: 3000,
                message: "Petition closing date cannot be in the past!",
                type: "is-danger"
              });
              return;
            }

            payload.closingDate = this.dateFormatter(this.closingDate);
          }

          console.log(payload.closingDate)

          Api.createAPetition(payload)
          .then((res) => {
            console.log("I WENT HERE");
            console.log(res.data);
            this.petitionId = res.data.petitionId;
            return Api.postPetitionPhoto(this.petitionId, this.file, this.file.type)
          })
          .then(() => {
            return Api.signPetition(this.petitionId);
          })
          .then(() => {
            this.$parent.close()
            this.$router.push({ name: 'petition', params: { petitionId: this.petitionId } })
          })
          .catch((err) => {
            console.log("yo i went here")

            if ([400, 401, 500].includes(err.response.status)) {
              this.err.msg = err.response.statusText;
              this.showErrMsg = true
            }

            console.log(err);
          })
        },
        resetDate() {
          console.log("I went here");
          console.log(this.timeRange);
          if (this.timeRange === "Continuous") {
            this.dateToday = new Date();
            this.closingDate = new Date(this.dateToday);
            this.closingDate.setHours(23);
            this.closingDate.setMinutes(59);
            this.closingDate.setSeconds(59);
          }
          this.dateToday = new Date();
          // this.minDate.setHours(this.dateToday.getHours()+1);
          this.closingDate = new Date(this.minDate);
          console.log(this.closingDate);

        }

      }
    }
</script>

<style scoped>

  .modal-card {
    height: 800px;
  }

  input {
    height: 20px;
  }

</style>
