<template>
  <section class="hero">
    <div class="hero-head">
      <div class="box is-petition-title">
        <h1 class="title is-2">
          Petitions I Created
        </h1>
        <p class="subtitle">
          You are making a <strong>Change</strong>!
        </p>
        <div @click="cancelButton" class="button is-primary goBack">
          Back to Profile Page
        </div>
      </div>
    </div>
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-one-third">
            <div class="columns">
              <div class="column">
                <div class="box">
                  <b-field label="Search..." class="is-2">
                    <b-input placeholder="Search for a petition!" type="search" v-model="searchField"></b-input>
                  </b-field>
                  <div class="levels">
                    <div class="level">
                      <div class="level-left">
                        <div class="field">

                          <b-dropdown
                            scrollable="true"
                            max-height="120"
                            hoverable
                            v-model="categoryDropDown"
                            aria-role="list">
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
                          <label class="help"><strong>Categories</strong></label>
                        </div>
                      </div>

                      <div class="level-right">
                        <div class="field">
                          <b-dropdown
                            scrollable="true"
                            max-height="120"
                            hoverable
                            v-model="sortByCurrentDrop"
                            aria-role="list"
                          >
                            <button class="button" type="button" slot="trigger">
                              <template>
                                <!--                                <b-icon pack="fas" :icon="sortByCurrentDrop.icon"></b-icon>-->
                                <span>{{ sortByCurrentDrop.name }}</span>
                              </template>
                              <b-icon icon="menu-down"></b-icon>
                            </button>

                            <b-dropdown-item
                              v-for="(sort, index) in sortByDropDown"
                              :key="index"
                              :value="sort" aria-role="listitem">
                              <div class="media">
                                <!--                                <b-icon pack="fas" :icon="sort.icon"></b-icon>-->
                                <div class="media-content">
                                  <h3>{{ sort.name }}</h3>
                                </div>
                              </div>
                            </b-dropdown-item>
                          </b-dropdown>
                          <label class="help"><strong>Sort By</strong></label>
                        </div>
                      </div>
                    </div>
                    <div class="control" >
                      <button class="button is-primary" @click="searchPetition">
                        Submit
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="column is-two-thirds">
            <div v-if="noPetitionResult" class="box">
              <strong>No Petitions Found</strong>
            </div>
            <div class="box" v-for="petition in petitions.slice(per_page*(current-1), per_page*(current))">
              <article class="media">
                <figure class="media-left">
                  <a @click="getPetitionDetails(petition.petitionId)">
                    <p class="image is-128x128">
                      <img :src="getPetitionImage(petition.petitionId)"
                           onerror="this.src='https://www.computerhope.com/jargon/g/guest-user.jpg'"
                           alt="No Image Found">
                    </p>
                  </a>
                </figure>

                <div class="media-content">
                  <div class="content">
                    <p>
                      <a @click="getPetitionDetails(petition.petitionId)">
                        <strong>{{ petition.title }}</strong>
                      </a>
                      <small>@{{ petition.authorName }}</small> <small></small>
                      <br>
                      Category: {{ petition.category }} <br>
                      Signatures: {{ petition.signatureCount }}
                    </p>
                  </div>
                  <nav class="level is-mobile">
                    <div class="level-left">
                      <a class="level-item">
                          <span @click="getPetitionDetails(petition.petitionId)" class="icon is-small">
                            <i class="fas fa-eye"></i>
                          </span>
                      </a>
                      <a class="level-item" :href="`https://twitter.com/intent/tweet?text=Check out this Petition:&hashtags=petition,makeachange&url=http://localhost:8080/petitions/${petition.petitionId}`" target="_blank">
                        <span class="icon is-small"><i class="fab fa-twitter"></i></span>
                      </a>
                      <a class="level-item" :href="`https://www.facebook.com/sharer/sharer.php?u=https://canterbury.ac.nz/petitions/${petition.petitionId}&quote=Check out this Petition! #makeachange #petition`" target="_blank">
                        <span class="icon is-small"><i class="fab fa-facebook"></i></span>
                      </a>
                      <a class="level-item" :href="`mailto:?body=I found a Petition that I am really interested in. Please check it out: http://localhost:8080/petitions/${petition.petitionId}&subject=Check out this Petition!`" target="_blank">
                        <span class="icon is-small"><i class="fas fa-envelope"></i></span>
                      </a>
                    </div>
                  </nav>
                </div>
                <div class="media-right">
                  <!--                    <button class="delete"></button>-->
                </div>
              </article>
            </div>


            <b-pagination
              :total="total"
              :current.sync="current"
              range-before="3"
              range-after="1"
              :per-page="per_page"
              icon-prev="chevron-left"
              icon-next="chevron-right"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page">
            </b-pagination>

          </div>
        </div>


      </div>
    </div>
    <div class="hero-foot">

    </div>
  </section>

</template>

<script>
    import {mapState} from "vuex";
    import Api from "../../Api";

    export default {
        name: "ViewMyPetitions",
      data() {
        return {
          noPetitionResult: false,
          categoryDropDown: {name: 'All Categories'},
          categories: [],
          petitions: [],
          petitionImages: [],
          searchField: "",

          total: 0,
          current: 1,
          per_page: 10,

          sortByCurrentDrop: {name: "Signatures Desc", val: 'SIGNATURES_DESC' },
          sortByDropDown: [
            { name: 'Signatures Desc', val: 'SIGNATURES_DESC' },
            { name: 'Signatures Asc', val: 'SIGNATURES_ASC' },
            { name: 'Alphabetical Desc', val: 'ALPHABETICAL_DESC' },
            { name: 'Alphabetical Asc', val: 'ALPHABETICAL_ASC' }
          ]
        }
      },
      computed: {
        ...mapState(["isLoggedIn", "userId"])
      },
      mounted() {
        this.init()
      },
      methods: {
        init() {
          Api.getMyPetitions({authorId: this.$route.params.userId})
            .then((response) => {
              this.petitions = response.data;
              this.total = this.petitions.length;
              this.noPetitionResult = this.total === 0;
              return Api.getAllCategories()
            })
            .then((response) => {
              this.categories = response.data;
              this.categories.push({ name: "All Categories" })
            })
            .catch((error) => {
              console.log(error);
            });
        },
        searchPetition() {
          let anyChanges = false;
          let searchURL = 'http://localhost:4941/api/v1/petitions'
          let q = '';
          let categoryId = '';
          let authorId = this.$route.params.userId;
          let sortBy = '';
          let count = ''
          let startIndex = '';

          if (this.searchField !== '' ) {
            q = 'q=' + this.searchField;
            anyChanges = true;
          }

          if (this.categoryDropDown.name !== 'All Categories') {
            categoryId = 'categoryId=' + this.categoryDropDown.categoryId;
            anyChanges = true
          }

          if (authorId !== '') {
            authorId = 'authorId=' + this.$route.params.userId
          }

          if (this.sortByCurrentDrop.name !== 'Signature Desc') {
            sortBy = 'sortBy=' + this.sortByCurrentDrop.val;
            anyChanges = true;
          }



          if (anyChanges) {
            searchURL = this.buildQueryString(q, categoryId, authorId, sortBy, count, startIndex);
          }


          this.$http.get(searchURL)
            .then((response) => {
              this.petitions = response.data;
              this.total = this.petitions.length;
              this.noPetitionResult = this.total === 0;
            })
            .catch((error) => {
              console.log(error);
            });

        },
        buildQueryString(q, categoryId, authorId, sortBy, count, startIndex) {
          let baseURL = `http://localhost:4941/api/v1/petitions?`;
          let originalURL = baseURL;
          if (q !== '') {
            baseURL += q;
          }
          if (categoryId !== '') {
            if (baseURL === originalURL) {
              baseURL += categoryId;
            } else {
              baseURL += '&' + categoryId;
            }
          }

          if (sortBy !== '') {
            if (baseURL === originalURL) {
              baseURL += sortBy;
            } else {
              baseURL += '&' + sortBy;
            }
          }

          if (authorId !== '') {
            if (baseURL === originalURL) {
              baseURL += authorId;
            } else {
              baseURL += '&' + authorId;
            }
          }

          return baseURL;
        },
        getPetitionDetails(petitionId) {
          this.$router.push({
            name: "petition",
            params: { petitionId: petitionId }
          })
        },
        getPetitionImage(id) {
          return `http://localhost:4941/api/v1/petitions/${id}/photo`
        },
        confirmSignPetition(petitionId) {
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
              onConfirm: () => this.signThePetition(petitionId)
            })
          }
        },
        signThePetition(petitionId) {
          Api.signAPetition(petitionId)
            .then(() => {

              this.$router.push({name: 'petition', params: {petitionId: petitionId}})
              this.$buefy.toast.open({
                duration: 3000,
                message: "Successfully signed the petition!",
                type: "is-success"
              });
            })
            .catch((err) => {
              if (err.response.statusText.includes('Forbidden: cannot sign a petition more than once')) {
                this.$buefy.toast.open({
                  duration: 4000,
                  message: "You cannot sign a petition <b>more than once</b>!",
                  type: "is-danger"
                });
              }
              if (err.response.statusText.includes('Forbidden: cannot sign a petition that has closed')) {
                this.$buefy.toast.open({
                  duration: 4000,
                  message: "Sorry this petition has <b>closed</b>! Cannot sign this petition...",
                  type: "is-danger"
                });
              }
              console.log(err);
            })
        },
        cancelButton() {
          this.$router.go(-1);
        }
      }
    }
</script>

<style scoped>
.goBack {
  margin-bottoms: 5px;
}
</style>
