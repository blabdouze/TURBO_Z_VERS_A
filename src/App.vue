<script>
export default {
  data() {
    return {
      // > CONFIG 

      // Text to guess (TODO : load from file)
      text: "vive le démenagement".split(""),
      // Time (ms) in which the letters will appear
      timeLetterAppearsMS: 1000,

      // > CLASS MEMBERS

      // Array that will contains all the already discovered letters
      discoveredLetters: [],
      // Base alphabet (z to a)
      alphabet: "abcdefghijklmnopqrstuvwxyz".split("").reverse(),
      // Interval ID (avoid to start twice the game loop)
      intervalID: 0
    }
  },


  methods: {
    // Start game loop
    startGameLoop() {
      // If a loop is running we don't do anything
      if (this.isLoopRunning())
        return
      
      // Copy alphabet so we don't override our base list
      var alphabet_tmp = [...this.alphabet];
      // Set the function 
      const discover_next_letter = () => { 
        this.discoveredLetters.push(alphabet_tmp.shift()) 
      }
      
      // Discover next letter right away
      discover_next_letter()

      // then do it every X seconds and stop when there is no letter left to discover
      this.intervalID = setInterval( () => { 
         discover_next_letter()
        
        if (alphabet_tmp.length == 0) {
          this.stopGameLoop()
        }
      }, this.timeLetterAppearsMS)
    },

    // Return true if a loop is in progress
    isLoopRunning() {
      return this.intervalID != 0
    },

    // Force stop game loop
    stopGameLoop() {
        clearInterval(this.intervalID)
        this.intervalID = 0
    },

    // Return true if char has been discovered ; false otherwise
    //
    // /!\ Note : the function will get rid of any accent before checking.
    //            (e.g isCharDiscovered('è') will return true if e have been discovered)
    isCharDiscovered(char) {
      // Remove accents from char
      const escaped_char = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return this.discoveredLetters.includes(escaped_char) 
    }
  }
}
</script>

<template>
  <span v-for="c in alphabet" :key="c" class="text-transition" :class="{'text-color-transparent': isCharDiscovered(c) }">
   {{c}}
  </span>
  <br>
  <!--
  <span v-for="char in text" class="text-transition text-color-transparent" :class="{'text-color-base':  discovered(char) }">
  {{char}}
  </span>
  -->
  <span v-for="char in text" :key="char">
   <span v-if="isCharDiscovered(char)">{{char}}</span>
   <div v-else-if="char === ' '"></div>
      <span v-else>_ </span>
  </span>
  <br>
  <button @click="startGameLoop">
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