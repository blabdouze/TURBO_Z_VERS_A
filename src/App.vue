<script>
export default {
  data() {
    return {
      // > CONFIG 
      // Time (ms) in which the letters will appear
      timeLetterAppearsMS: 500,

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
    // Capitalize givent string
    capitalize(str) {
      return str.toUpperCase();
    },

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
        this.roundLoopPaused = false
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
        // Take a btn and click on it if it exits
        // Return true if btn exists, false otherwise
        const clickIfExists = (btn) => {
          if (btn) {
            btn.$emit('click')
            return true;
          } 

          return false;
        };

        // If the pause btn is available we click on it
        const pauseBtnExists = clickIfExists(this.$refs.pauseBtn)
        // Otherwise we click on the start btn
        if (!pauseBtnExists)
          clickIfExists(this.$refs.startBtn)

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
    <v-container style="padding-bottom:100px;">
      <v-row justify="center">
        <v-sheet width="900" elevation="5" class="text-center">
          <span>{{currentTheme}}</span>
        </v-sheet>
      </v-row>
    </v-container>

    <v-container>
      <v-row justify="center">
        <v-sheet width="1300" elevation="5" class="text-center">
            <span v-for="c in alphabet" :key="c" style="padding-left:10px;">
              <Transition name="text-size">
                <span v-if="!isCharDiscovered(c)">{{c}}</span>
              </Transition>
            </span>
        </v-sheet>
      </v-row>
    </v-container>

    <br>

   <v-container>
     <v-row justify="center">
        <span v-for="(char,index) in currentText" :key="index" style="padding-left:15px; padding-bottom:15px;">
          <v-sheet v-if="char !== ' '" elevation="5" height="100" width="80" class="text-center">
            <Transition name="text-size">
              <p v-if="isCharDiscovered(char)">{{capitalize(char)}}</p>
            </Transition>
          </v-sheet>
          <span v-else style="padding-left:30px;"/>
        </span>
      </v-row>
    </v-container>

    <br>
    
    <v-container>
     <v-row justify="center">
        <v-btn @click="startRoundLoop" v-if="!isRoundLoopRunning" color="indigo" @keydown.prevent ref="startBtn"><v-icon>mdi-play</v-icon></v-btn>
        <v-btn v-if="isRoundLoopRunning" @click="switchRoundLoopState()" @keydown.prevent ref="pauseBtn" color="indigo">
           <v-icon v-if="roundLoopPaused">mdi-play</v-icon>
           <v-icon v-else>mdi-pause</v-icon>
        </v-btn>
        <v-btn @click="nextWord()" v-if="hasNextWord" @keydown.prevent><v-icon>mdi-arrow-right</v-icon></v-btn>
      </v-row>
    </v-container>

    <v-container>
      <v-row justify="center">
        {{currentWordIndex+1}} / {{wordCount}}
      </v-row>
    </v-container>

    <input type="file" ref="textInput" accept=".json" style="display: none;" @change="loadTextFile"/>
  </v-main>
  </v-app>
</template>

<style scoped>
.text-size-enter-active,
.text-size-leave-active {
  transition: 0.5s font-size ease;
}

.text-size-enter-from,
.text-size-leave-to {
  font-size: 0;
}
span {
  font-size: 54pt;
}
</style>