<script>
export default {
  data() {
    return {
      discoveredLetters: [],
      text: "vive le démenagement".split(""),
      alphabet: "abcdefghijklmnopqrstuvwxyz".split("").reverse()
    }
  },
  methods: {
    go() {
      var alphabet_tmp = [...this.alphabet];
      this.discoveredLetters.push(alphabet_tmp.shift())
      const interval = setInterval( () => { 
      this.discoveredLetters.push(alphabet_tmp.shift())
        
        if (alphabet_tmp.length == 0) {
          clearInterval(interval)
        }
      }, 1000)
    },
    discovered(char) {
      // Remove accents from char
      const escaped_char = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return this.discoveredLetters.includes(escaped_char) 
    }
  }
}
</script>

<template>
  <span v-for="c in alphabet" :key="c" class="text-transition" :class="{'text-color-transparent': discovered(c) }">
   {{c}}
  </span>
  <br>
  <!--
  <span v-for="char in text" class="text-transition text-color-transparent" :class="{'text-color-base':  discovered(char) }">
  {{char}}
  </span>
  -->
  <span v-for="char in text" :key="char">
   <span v-if="discovered(char)">{{char}}</span>
   <div v-else-if="char === ' '"></div>
      <span v-else>_ </span>
  </span>
  <br>
  <button @click="go">
    go
  </button>
</template>

<style>
  .text-color-transparent {
    color: transparent
  }
  .text-color-base {
    color: red
  }
.text-transition {
  transition: 0.5s color ease;
}
</style>