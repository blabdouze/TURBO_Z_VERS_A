<script>
export default {
  data() {
    return {
      // > CONFIG 
      // Time (ms) in which the letters will appear
      timeLetterAppearsMS: 1000,

      // > CLASS MEMBERS

      // Array that will contains all the already discovered letters
      discoveredLetters: [],
      // Base alphabet (z to a)
      alphabet: "abcdefghijklmnopqrstuvwxyz".split("").reverse(),
      // Word list
      wordList: [ 
        {
          theme: "ESPACE VROUM",
          words: "TURBO K SPACE HIPPY"
        }
      ],
      // Current text index from word list
      currentWordIndex: 0,
      // Interval ID (avoid to start twice the round loop)
      intervalID: 0,
      // True if loop is paused
      roundLoopPaused: false,
    }
  },

  // Computed properties
  computed: {

    // Get current text based on word list and current index
    currentText() {
      const cData = this.currentRoundData
      // if the index is invalid we return an empty string (should not happen)
      if (cData == undefined)
        return ""
      
      return cData.words.split("")
    },

    // Get current theme
    currentTheme() {
      const cData = this.currentRoundData
      // if the index is invalid we return an empty string (should not happen)
      if (cData == undefined)
        return ""
      
      return cData.theme
    },

    // Helper function to get current round data
    currentRoundData() {
      if (this.currentWordIndex >= this.wordList.length)
        return undefined;

      return this.wordList[this.currentWordIndex]
    },

    // Return true if a loop is in progress
    isRoundLoopRunning() {
      return this.intervalID != 0
    },

    // Numer of words
    wordCount() {
      return this.wordList.length
    },

    // Retrun true if a new set of word is available
    hasNextWord() {
       return this.currentWordIndex + 1 < this.wordList.length
    }
  },

  methods: {
    // Start round loop
    startRoundLoop() {
      // If a loop is running we don't do anything
      if (this.isRoundLoopRunning)
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
        // Don't do anything if round loop is paused
        if (this.roundLoopPaused)
          return
          
         discoverNextLetter()
        
        if (alphabetTmp.length == 0) {
          this.stopRoundLoop()
        }
      }, this.timeLetterAppearsMS)
    },

    // Pause round loop if running, resume it otherwise
    // Do not do anything unless a loop is started
    switchRoundLoopState() {
        this.roundLoopPaused = !this.roundLoopPaused
    }, 

    // Force stop round loop
    stopRoundLoop() {
        clearInterval(this.intervalID)
        this.intervalID = 0
    },

    // Restart round state back to its original value
    resetRoundState() {
      this.stopRoundLoop()
      // use splice to update vue.js bidnings
      this.discoveredLetters.splice(0,this.discoveredLetters.length)
    },

    // Reset the round state and display the new word 
    nextWord() {
      this.resetRoundState()
      this.currentWordIndex++
    },

    // Return true if char has been discovered ; false otherwise
    //
    // /!\ Note : the function will get rid of any accent before checking and is case insentive.
    //            (e.g isCharDiscovered('è') will return true if e have been discovered)
    isCharDiscovered(char) {
      // Remove accents from char
      const escapedChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      return this.discoveredLetters.includes(escapedChar) 
    },
    
    // Load text file from input
    loadTextFile(ev) {
        const reader = new FileReader();
        const file = ev.target.files[0];
        reader.onload = (e) => {
          this.resetRoundState();
          this.wordList = JSON.parse(e.target.result)
        }
        reader.readAsText(file)
    },

    // Handle global key press
    handleGlobalKeyPress(keyPressCode) {
      // When space pressed
      if (keyPressCode.code == "Space" ) {
        const pauseBtn = this.$refs.pauseBtn
        // Check if btn exist and click on it
        if (pauseBtn)
          pauseBtn.$emit('click')
      } else if (keyPressCode.code == "KeyO") {
        this.$refs.textInput.click()
      }
    }
  }
}
</script>

<template>
 <v-app>
  <keyboard-events @keydown="handleGlobalKeyPress"/>

 <v-main>
  <span>
      Theme : {{currentTheme}}
    </span>
    <br>
    <br>
    <span v-for="c in alphabet" :key="c" class="text-transition" :class="{'text-color-transparent': isCharDiscovered(c) }">
    {{c}}
    </span>
    <br>

    <!--We use index as a key to prevent refresh issues-->
    <span v-for="(char,index) in currentText" :key="index">
    <span v-if="isCharDiscovered(char)">{{char}}</span>
    <div v-else-if="char === ' '"></div>
        <span v-else>_ </span>
    </span>
    <br>
    <v-btn @click="startRoundLoop" v-if="!isRoundLoopRunning">
      Start
    </v-btn>
    <v-btn v-if="isRoundLoopRunning" @click="switchRoundLoopState()" ref="pauseBtn">
      <span v-if="roundLoopPaused">Resume</span>
      <span v-else>Pause</span>
    </v-btn>
    <v-btn @click="nextWord()" v-if="hasNextWord">next</v-btn>

    <p>
      Words count : {{currentWordIndex+1}} / {{wordCount}}
    </p>

    <input type="file" ref="textInput" accept=".json" style="display: none;" @change="loadTextFile"/>
  </v-main>
  </v-app>
</template>

<style scoped>
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