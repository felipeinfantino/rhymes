import { Component, OnInit } from '@angular/core';
import {spanishWords } from './spanishWords';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  allWords = spanishWords.filter((wordObj) => wordObj.word.length > 2);
  foundWords: object[];
  selectedTermination = '';
  rimasConsonantes = true;
  allPermutations = new Set();
  vocales = ['a', 'e', 'i', 'o', 'u'];
  vocalesForAsonant = new Array(4);

  ngOnInit() {
  }

  toggle(){
    this.rimasConsonantes = !this.rimasConsonantes; 
    this.foundWords = []; 
    this.vocalesForAsonant = new Array(4);
    this.selectedTermination = '';
  }

  vocalChanged(letter, number){
    letter = letter.toLowerCase();
    if(letter === ''){
      this.vocalesForAsonant[Number(number)] = undefined;
      this.checkAndChangeAsonantRhymes();
      return;
    }
    if(this.vocales.indexOf(letter) > -1){
      this.vocalesForAsonant[Number(number)] = letter;
      this.checkAndChangeAsonantRhymes();
    }else{
      (document.getElementById(number) as HTMLInputElement).value = '';
    }
  }

  checkAndChangeAsonantRhymes(){
    if(this.vocalesForAsonant[0] && this.vocalesForAsonant[1]){
      if(this.vocalesForAsonant[2] && !this.vocalesForAsonant[3]){
        this.foundWords = this.findAsonantRhymes(this.vocalesForAsonant[0], this.vocalesForAsonant[1], this.vocalesForAsonant[2]);
        return;
      }
      if(this.vocalesForAsonant[2] && this.vocalesForAsonant[2]){
        this.foundWords = this.findAsonantRhymes(this.vocalesForAsonant[0], this.vocalesForAsonant[1], this.vocalesForAsonant[2], this.vocalesForAsonant[3]);
        return;
      }
      this.foundWords = this.findAsonantRhymes(this.vocalesForAsonant[0], this.vocalesForAsonant[1]);
    }
  }

  termination(terminacion){
    if(terminacion.length > 1){
      this.foundWords = this.findConsonantRhymes(terminacion);
    }
  }

  findConsonantRhymes(terminacion : string){
   terminacion = terminacion.toLowerCase();
   return this.allWords.filter((wordObj) => {
     const isSmaller = wordObj.word.length >= terminacion.length;
     if(isSmaller){
       const startingIndex = wordObj.word.length - terminacion.length;
       // for accents , tilde , etc
       const normalizedTerminacion = terminacion.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
       const normalizedWord =  wordObj.word.substr(startingIndex);
       const terminatesSame = normalizedWord === normalizedTerminacion;
        return terminatesSame;
     }else{
        return false;
     }
    });
  }

  findAsonantRhymes(vocal1, vocal2, vocal3? , vocal4?){
    return this.allWords.filter((wordObj) => {
        const vocalesFromWord = this.getVocales(wordObj.word);
        if(vocal3 && !vocal4){
          return vocalesFromWord[vocalesFromWord.length - 3] === vocal1 
              && vocalesFromWord[vocalesFromWord.length - 2] === vocal2
              && vocalesFromWord[vocalesFromWord.length - 1] === vocal3;
            }
        if(vocal4){
          return vocalesFromWord[vocalesFromWord.length - 4] === vocal1 
              && vocalesFromWord[vocalesFromWord.length - 3] === vocal2 
              && vocalesFromWord[vocalesFromWord.length - 2] === vocal3
              && vocalesFromWord[vocalesFromWord.length - 1] === vocal4;
        }
        return vocalesFromWord[vocalesFromWord.length - 2] === vocal1 && vocalesFromWord[vocalesFromWord.length - 1] === vocal2;
    });
  }

  getVocales(word : string): string[]{
    const vocales = [];
    for(let letter of word.split("")){
      const normalizedLetter = letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if(this.vocales.indexOf(normalizedLetter) > -1){
        vocales.push(normalizedLetter);
      }
    }
    return vocales;
  }

}
