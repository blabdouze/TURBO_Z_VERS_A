<script>
export default {
  data() {
    return {
      // > CONFIG 
      // Name of the word list file (path relative to App.vue)
      wordListFile: 'wordList.txt',
      // Time (ms) in which the letters will appear
      timeLetterAppearsMS: 1000,

      // > CLASS MEMBERS

      // Array that will contains all the already discovered letters
      discoveredLetters: [],
      // Base alphabet (z to a)
      alphabet: "abcdefghijklmnopqrstuvwxyz".split("").reverse(),
      // Word list
      wordList: [],
      // Current text index from word list
      currentTextIndex: 0,
      // Interval ID (avoid to start twice the game loop)
      intervalID: 0,
      // True if loop is paused
      gameLoopPaused: false,
    }
  },

  // action when data is loaded but dom not yet loaded
  beforeMount() {
    // Load word list
    // https://stackoverflow.com/questions/54697757/read-file-inside-current-directory-using-vue
    const wordListFileContents = require('./'+ this.wordListFile).default;
    
    // Don't load if content of file is empty
    if (wordListFileContents != "")
      this.wordList = wordListFileContents.split(/\r?\n/)

    // It is a bit sad to have no words, so we add one by default
    if (this.wordList.length == 0) {
      this.wordList.push("TURBO K SPACE HIPPY");
    }
  },

  // Computed properties
  computed: {
    // Get current text based on word list and current index
    currentText() {
      // if the index is invalid we return an empty string (should not happen)
      if (this.currentTextIndex >= this.wordList.length)
        return "";
      
      return this.wordList[this.currentTextIndex].split("")
    }
  },

  methods: {
    // Start game loop
    startGameLoop() {
      // If a loop is running we don't do anything
      if (this.isGameLoopRunning())
        return
      
      // Copy alphabet so we don't override our base list
      var alphabetTmp = [...this.alphabet];
      // Set the function 
      const discoverNextLetter = () => { 
        this.discoveredLetters.push(alphabetTmp.shift()) 
      }
      
      // Discover next letter right away
      discoverNextLetter()

      // then do it every X seconds and stop when there is no letter left to discover
      this.intervalID = setInterval( () => { 
        // Don't do anything if game loop is paused
        if (this.gameLoopPaused)
          return
          
        
         discoverNextLetter()
        
        if (alphabetTmp.length == 0) {
          this.stopGameLoop()
        }
      }, this.timeLetterAppearsMS)
    },

    // Return true if a loop is in progress
    isGameLoopRunning() {
      return this.intervalID != 0
    },

    // Pause game loop if running, resume it otherwise
    // Do not do anything unless a loop is started
    switchGameLoopState() {
        this.gameLoopPaused = !this.gameLoopPaused
    }, 

    // Force stop game loop
    stopGameLoop() {
        clearInterval(this.intervalID)
        this.intervalID = 0
    },

    // Next word
    nextWord() {
      this.stopGameLoop()
      // use splice to update vue.js bidnings
      this.discoveredLetters.splice(0,this.discoveredLetters.length)

      this.currentTextIndex++
    },

    // Return true if char has been discovered ; false otherwise
    //
    // /!\ Note : the function will get rid of any accent before checking.
    //            (e.g isCharDiscovered('è') will return true if e have been discovered)
    isCharDiscovered(char) {
      // Remove accents from char
      const escapedChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      return this.discoveredLetters.includes(escapedChar) 
    },
    
    // Handle global key press
    handleGlobalKeyPress(keyPressCode) {
      // When space pressed
      if (keyPressCode.which == 32 ) {
        const pauseBtn = this.$refs.pauseBtn
        // Check if btn exist and click on it
        if (pauseBtn)
          pauseBtn.click()
      }
    }
  }
}
</script>

<template>
  <keyboard-events @keydown="handleGlobalKeyPress"/>

  <span v-for="c in alphabet" :key="c" class="text-transition" :class="{'text-color-transparent': isCharDiscovered(c) }">
   {{c}}
  </span>
  <br>
  <!--
  <span v-for="char in text" class="text-transition text-color-transparent" :class="{'text-color-base':  discovered(char) }">
  {{char}}
  </span>
  -->
  <span v-for="char in currentText" :key="char">
   <span v-if="isCharDiscovered(char)">{{char}}</span>
   <div v-else-if="char === ' '"></div>
      <span v-else>_ </span>
  </span>
  <br>
  <button @click="startGameLoop">
    Start
  </button>
  <button v-if="isGameLoopRunning()" @click="switchGameLoopState()" ref="pauseBtn">
    <span v-if="gameLoopPaused">Resume</span>
    <span v-else>Pause</span>
  </button>
  <button @click="nextWord()">
    next
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