<template>

  <div class="columns">
    <div class="column">
      <div class="box">
        <b-field label="Search..." label-position="on-border">
          <b-input placeholder="Search for a petition!" type="search" v-model="searchField"></b-input>
        </b-field>
        <div class="levels">
          <div class="level">
            <div class="level-left">
              <div class="field">
                <b-dropdown
                  scrollable="true"
                  max-height="120"
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
                <label class="help"><strong>Categories</strong></label>
              </div>
            </div>

            <div class="level-right">
              <div class="field">
                <b-dropdown
                  scrollable="true"
                  max-height="120"
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
</template>

<script>
    export default {
        name: "SearchPetitions"
    }
</script>

<style scoped>

</style>
