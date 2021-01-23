<template>
  <div>
    <div class="hero">
      <div class="hero-body">
        <div class="container" style="width: 500px">
          <div>
            <div class="box">
              <div class="card-image">
                <figure class="image is-1by1">
                  <img class="is-rounded"
                       :src="getImage"
                       onerror="this.src='https://www.computerhope.com/jargon/g/guest-user.jpg'"
                       alt="No Image Found">
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-left">

                  </div>
                  <div class="media-content is-centered">

                  </div>
                  <div class="media-right">
                  </div>
                </div>

                <div class="content">
                  <p class="title is-2">{{ userData.name }}</p>
                  <p><strong>Email:</strong> <span class="subtitle is-6">{{ userData.email }}</span></p>
                  <p><strong>Country:</strong> <span v-if="userData.country" class="subtitle is-6">{{ userData.country }}</span></p>
                  <p><strong>City:</strong> <span v-if="userData.city" class="subtitle is-6">{{ userData.city }}</span></p>
                  <b-dropdown
                    scrollable="true"
                    max-height="120"
                    v-model="petitionDropTrigger"
                    aria-role="list">
                    <button class="button is-warning is-rounded" type="button" slot="trigger">
                      <template>
                        <span>{{ petitionDropTrigger.title }}</span>
                      </template>
                      <b-icon icon="menu-down"></b-icon>
                    </button>

                    <b-dropdown-item
                      v-for="(petition, index) in myPetitions"
                      :key="index"
                      @click="goToPetition(petition.petitionId)"
                      :value="petition" aria-role="list_item">
                      <div class="media">
                        <div class="media-content">
                          <h5>{{ petition.title }}</h5>
                        </div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown>

                  <hr class="style-one">
                </div>
              </div>
              <button @click="editProfile" class="button btn is-primary ">Edit Profile</button>
              <button @click="createPetition" class="button btn is-success ">Create Petition</button>
              <button @click="viewPetitions" class="button btn is-info ">View My Petitions</button>

            </div>
          </div>
        </div>
      </div>
    </div>





  </div>
</template>

<script>

  import Api from "../Api";
  import CreatePetitionModal from "../components/HomePage/CreatePetitionModal";

    export default {
      name: "Profile",
      components: {
        CreatePetitionModal
      },
      data() {
        return {
          petitionDropTrigger: {title: 'Edit My Petitions'},
          userData: {
            name: "",
            email: "",
            password: "",
            city: "",
            country: ""
          },
          myPetitions: [],
          userPicture: null
        }
      },
      computed: {
        getImage() {
          return `http://localhost:4941/api/v1/users/${this.$store.state.userId}/photo`
        }
      },
      mounted() {
        this.init();
      },
      methods: {
        init: function() {
          console.log('sessionStorage: ' + sessionStorage.getItem('userId'))
          console.log('store: ' + this.$store.state.userId)
          console.log('route: ' + this.$route.params.userId.toString())
          console.log('token: ' + sessionStorage.getItem('token'))


          if (sessionStorage.getItem('userId') !== this.$route.params.userId.toString()) this.$router.push({ name: 'home' })

          this.getUserProfile();
        },
        getUserProfile() {
          console.log('Welcome')

          Api.getProfileById(this.$store.state.userId)
          .then((res) => {
            this.userData = res.data
            this.userData.userId = this.$store.state.userId

          })
            .then(() => {

              const searchParams = {
                authorId: this.$store.state.userId
              }

              Api.getMyPetitions(searchParams)
              .then((res) => {
                this.myPetitions = res.data;
              })

            })
            .catch((err) => {
              this.userData.userId = -1;
              console.log(err);
            })
        },
        editProfile() {
          if (sessionStorage.getItem('userId').toString() === this.$route.params.userId) {
            this.$router.push({ name: 'editProfile', params: {userId: this.$store.state.userId} })
          }
        },
        createPetition() {
          console.log(sessionStorage.getItem('userId'));

          if (sessionStorage.getItem('token') !== null) {
            // console.log(localStorage.getItem('token'));
            this.$buefy.modal.open({
              parent: this,
              component: CreatePetitionModal,
              hasModalCard: true,
              customClass: 'custom-class custom-class2',
              trapFocus: true
            })

            // const payload = {
            //   title: "Close Hawkins Lab",
            //   description: "They seem pretty suspicious.",
            //   categoryId: 7,
            //   closingDate: "2022-03-27 23:45:43.511"
            // }
            // Api.createAPetition(payload)
            // .then()
            // .catch((error) => {
            //   console.log(error);
            // })

          } else {
            this.$buefy.dialog.alert({
              title: 'Error',
              message: 'You first need to <strong>log in</strong> to create a petition!',
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
              ariaRole: 'alertdialog',
              ariaModal: true,

            })
          }
        },
        viewPetitions() {
          this.$router.push({ name: 'viewMyPetitions', params: { userId: this.$route.params.userId } })
        },
        getUserImage(id) {
          return `http://localhost:4941/api/v1/users/${id}/photo`;
        },
        goToPetition(petitionId) {
          // sessionStorage.setItem('userId', this.$route.params.userId);
          this.$router.push({ name: 'petition', params: { petitionId: petitionId } })
        }
      }
    }
</script>

<style scoped>
  hr.style-one {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
  }
  .hero {
    /*background-color: #cccccc;*/
  }
</style>
