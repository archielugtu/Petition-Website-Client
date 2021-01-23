<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-two-thirds">
            <div class="box petition-body">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img :src="image"
                         onerror="this.src='https://www.computerhope.com/jargon/g/guest-user.jpg'"
                         alt="No Image Found">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                        <figure class="image is-128x128">
                          <img :src="getUserImage(this.petition.authorId)"
                               onerror="this.src='https://www.computerhope.com/jargon/g/guest-user.jpg'"
                               alt="No Image Found">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-3">{{ petition.title }}</p>
                        <p class="subtitle is-5">@{{ petition.authorName }}</p>
                        <div class="level">
                          <div class="level-item has-text-centered">
                            <p>Signature Count: {{ petition.signatureCount }}</p>
                          </div>
                          <div class="level-item has-text-centered">
                            <p v-if="petition.authorCountry !== ''">Country: {{ petition.authorCountry }}</p>
                          </div>
                          <div class="level-item has-text-centered">
                            <p v-if="petition.authorCity !== ''">City: {{ petition.authorCity }}</p>
                          </div>
                        </div>
                    </div>
                    <div class="media-right">

                    </div>
                  </div>

                  <div class="content">
                    {{ petition.description }}
                    <a>@{{ petition.category }}</a>.
                    <br>
                    <hr class="style-one">
                    <div class="columns">
                      <div class="column">
                        <strong>Start Date:</strong>
                        <time datetime="2016-1-1">{{ petition.createdDate }}</time>
                      </div>
                      <div class="column">
                        <strong>End Date:</strong>
                        <time v-if="petition.closingDate === null">Open</time>
                        <time v-else datetime="2016-1-1">{{ petition.closingDate }}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br>
              <div v-if=" secondTime && !isExpired && (petition.authorId.toString() === this.authorId) " class="title is-5">
                You are the author!
              </div>
              <button v-if=" secondTime && !isExpired && (petition.authorId.toString() === this.authorId) "
                      class="button is-primary"
                      @click="editPetition"
              >
                <strong>Edit Petition</strong>
              </button>
              <button v-if="secondTime && petition.authorId.toString() === this.authorId"
                      class="button is-danger"
                      @click="deletePetition"
              >
                <strong>Delete Petition</strong>
              </button>
            </div>
            <button v-if="!hasSigned && secondTime && (petition.authorId.toString() !== this.authorId) && !checkPetitionExpiry(petition.closingDate)"
                    class="button is-success"
                    @click="confirmSignPetition"
            >
              <strong>Sign Petition</strong>
            </button>
            <button v-if="hasSigned && secondTime && petition.authorId.toString() !== this.authorId && !checkPetitionExpiry(petition.closingDate)"
                    class="button is-danger"
                    @click="confirmDeleteSignature"
            >
              <strong>Delete Signature</strong>
            </button>
          </div>

          <div class="column is-one-third">
            <div class="title">Signatories: {{ petition.signatureCount }}</div>
            <div class="box signatures" v-for="signature in signatories">
              <article class="media">
                <figure class="media-left">
                  <figure class="image is-128x128">
                    <img :src="getUserImage(signature.signatoryId)"
                         onerror="this.src='https://www.computerhope.com/jargon/g/guest-user.jpg'"
                         alt="No Image Found">
                  </figure>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <span>
                      <strong>{{ signature.name }}</strong>
                      <br>
                      Date Signed:
                      {{ signature.signedDate }}
                      <br>
                    </span>
                    <span>
                      Country: {{ signature.country }}
                      <br>
                      City: {{ signature.city }}
                    </span>
                  </div>
                </div>
                <div class="media-right">

                </div>
              </article>
            </div>

          </div>

        </div>
      </div>
    </div>

  </section>


</template>

<script>

    import Api from "../Api";

    export default {
      name: "PetitionDetails",
      props: ["petitionId"],
      data() {
        return {
          today: new Date(),
          petition: [],
          image: 'https://bulma.io/images/placeholders/128x128.png',
          signatories: [],
          authorId: sessionStorage.getItem('userId'),
          secondTime: false,
          isExpired: false,
          hasSigned: false,
          dateIsOpen: false,
        }
      },
      mounted() {
        this.init();
      },
      methods: {
        init() {
          this.$http.get(`http://localhost:4941/api/v1/petitions/${this.$route.params.petitionId}`)
          .then((response) => {
            this.petition = response.data;
            this.petition.createdDate = this.dateFormatter(new Date(this.petition.createdDate));

            // idk for some reason it renders the page first, before it calls init
            this.secondTime = true

            // Checks if closing date has expired
            if (this.petition.closingDate !== null) {
              let today = this.dateFormatter(new Date());
              let endDate = this.dateFormatter(new Date(this.petition.closingDate));
              this.isExpired = new Date(this.petition.closingDate) < new Date()
              this.petition.closingDate = endDate;
              this.dateIsOpen = false
            }
            console.log(this.petition.closingDate)
            console.log(this.petition.createdDate)
            this.dateIsOpen = true
            return Api.getSinglePetitionPhoto((this.$route.params.petitionId))
          })
            .then(() => {
              this.image = `http://localhost:4941/api/v1/petitions/${this.$route.params.petitionId}/photo`;
              return this.$http.get(`http://localhost:4941/api/v1/petitions/${this.$route.params.petitionId}/signatures`)
            })
            .then((response) => {
              this.signatories = response.data;
              for (let i = 0; i < this.signatories.length; i++) {
                if (this.signatories[i].signatoryId.toString() === sessionStorage.getItem('userId')) {
                  this.hasSigned = true
                }
                this.signatories[i].signedDate = new Date(this.signatories[i].signedDate).toLocaleString()
              }

            })
            .catch((error) => {
              console.log(error);
            })

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
        getUserImage(id) {
          return `http://localhost:4941/api/v1/users/${id}/photo`;
        },
        getPetitionImage(id) {
          return `http://localhost:4941/api/v1/petitions/${id}/photo`
        },
        checkIfAuthor() {
          console.log( this.$store.state.userId === sessionStorage.getItem('userId'))
          return this.$store.state.userId === sessionStorage.getItem('userId')
        },
        editPetition() {

          let invalid = false;
          console.log('double yo')
          console.log(this.petition.closingDate);
          if (this.dateIsOpen || this.petition.closingDate !== null) {
            invalid = this.checkPetitionExpiry(this.petition.closingDate)
          }

          if (invalid) {
            this.$buefy.toast.open({
              duration: 3000,
              message: "Cannot edit a petition that is ended...",
              type: "is-danger"
            });
            return;
          }

          const userId = sessionStorage.getItem('userId')
          this.$router.push({ name: 'userPetition', params: { userId: userId, petitionId: this.$route.params.petitionId } })
        },
        deletePetition() {

          this.$buefy.dialog.confirm({
            title: 'Deleting petition',
            message: 'Are you sure you want to <b>delete</b> your petition? This action cannot be undone.',
            confirmText: 'Delete',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.removePetition()
          })
        },
        removePetition() {
          Api.deleteAPetition(this.$route.params.petitionId)
            .then(() => {

              this.$router.push({ name: 'home' })

              this.$buefy.toast.open({
                duration: 3000,
                message: "Successfully deleted the petition!",
                type: "is-success"
              });
            })
            .catch((err) => {
              console.log(err);
            })
        },
        confirmSignPetition() {
          if (sessionStorage.getItem('token') === null) {
            this.$buefy.dialog.alert({
              title: 'Error',
              message: "You need to <strong>log in</strong> to sign a petition!",
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
              ariaRole: 'alertdialog',
              ariaModal: true,

            })
          } else {
            this.$buefy.dialog.confirm({
              message: 'Do you want to sign in this petition?',
              onConfirm: () => this.signThePetition(this.$route.params.petitionId)
            })
          }
        },
        signThePetition() {
          Api.signAPetition(this.$route.params.petitionId)
            .then(() => {
              this.$buefy.toast.open({
                duration: 2000,
                message: "Successfully signed the petition!",
                type: "is-success"
              });

              return Api.getAllSignaturesPetition(this.$route.params.petitionId)

            })
            .then((res) => {
              this.hasSigned = true;
              this.signatories = res.data
            })

            .catch((err) => {
              if (err.response.statusText.includes('Forbidden: cannot sign a petition more than once')) {
                this.$buefy.toast.open({
                  duration: 3000,
                  message: "You cannot sign a petition <b>more than once</b>!",
                  type: "is-danger"
                });
              }
              if (err.response.statusText.includes('Forbidden: cannot sign a petition that has closed')) {
                this.$buefy.toast.open({
                  duration: 3000,
                  message: "Sorry this petition has <b>closed</b>! Cannot sign this petition...",
                  type: "is-danger"
                });
              }
              console.log(err);
            })
        },
        confirmDeleteSignature() {
          if (sessionStorage.getItem('token') === null) {
            this.$buefy.dialog.alert({
              title: 'Error',
              message: "You need to <strong>log in</strong> to sign a petition!",
              type: 'is-danger',
              hasIcon: true,
              icon: 'times-circle',
              iconPack: 'fa',
              ariaRole: 'alertdialog',
              ariaModal: true,

            })
          } else {
            this.$buefy.dialog.confirm({
              message: 'Do you want delete your signature for this petition?',
              onConfirm: () => this.deleteSignature(this.$route.params.petitionId)
            })
          }
        },
        deleteSignature() {
          Api.deleteSignaturePetition(this.$route.params.petitionId)
          .then(() => {
            this.hasSigned = false;
            this.$buefy.toast.open({
              duration: 2000,
              message: "Successfully deleted your signature!",
              type: "is-success"
            });

            return Api.getAllSignaturesPetition(this.$route.params.petitionId)

          })
            .then((res) => {
              this.signatories = res.data
            })
            .catch((err) => {

              if (err.response.statusText === 'Forbidden: cannot sign a petition that has closed') {
                this.$buefy.toast.open({
                  duration: 3000,
                  message: "Cannot delete signature from a petition that has ended! ",
                  type: "is-danger"
                });
              }

              console.log(err);
            })
        },
        checkPetitionExpiry(closingDate) {
          // let today = this.dateFormatter(new Date());
          console.log(this.dateIsOpen)
          if (this.dateIsOpen) {
            return false
          }
          this.today = this.dateFormatter(new Date(this.today))
          console.log(this.today);
          console.log(closingDate);
          return closingDate < this.today;
        }
      }
    }
</script>

<style scoped>

  .container {
    /*max-width: 1000px;*/
  }
  .petition-body {
    background-color: lavender;
    /*background-color: mediumpurple;*/

  }

  hr.style-one {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
  }

  .signatures {
    border: 2px solid lavenderblush;

  }

</style>
