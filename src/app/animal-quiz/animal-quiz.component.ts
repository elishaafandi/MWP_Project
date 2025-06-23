import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Question {
  question: string;
  options: { answer: string, value: string }[];
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animal-quiz.component.html',
  styleUrls: ['./animal-quiz.component.css']
})
export class QuizComponent {
  quizStarted = false;
  currentQuestionIndex = 0;
  answers: string[] = [];
  showResult = false;
  result: { animal: string, image: string, description: string } | null = null;

  questions: Question[] = [
    {
      question: "What's your ideal way to relax?",
      options: [
        { answer: "Playing fetch or going outside", value: "dog" },
        { answer: "Lounging in a sunbeam", value: "cat" },
        { answer: "Roaming free in the wild", value: "wolf" },
        { answer: "Exercising or doing something bold", value: "tiger" },
        { answer: "Being in charge of a group", value: "lion" },
        { answer: "Sleeping in eucalyptus trees", value: "koala" },
        { answer: "Chilling with friends by a river", value: "capybara" }
      ]
    },
    {
      question: "How would your friends describe you?",
      options: [
        { answer: "Loyal and friendly", value: "dog" },
        { answer: "Independent and clever", value: "cat" },
        { answer: "Strong and silent", value: "wolf" },
        { answer: "Brave and energetic", value: "tiger" },
        { answer: "Leader and charismatic", value: "lion" },
        { answer: "Cute and sleepy", value: "koala" },
        { answer: "Relaxed and social", value: "capybara" }
      ]
    },
    {
      question: "What's your favorite time of day?",
      options: [
        { answer: "Morning", value: "dog" },
        { answer: "Night", value: "cat" },
        { answer: "Twilight", value: "wolf" },
        { answer: "Afternoon", value: "tiger" },
        { answer: "Noon", value: "lion" },
        { answer: "Mid-morning", value: "koala" },
        { answer: "Evening chill", value: "capybara" }
      ]
    },
    {
      question: "Choose a vacation:",
      options: [
        { answer: "Dog park road trip", value: "dog" },
        { answer: "Quiet cabin retreat", value: "cat" },
        { answer: "Hiking in the mountains", value: "wolf" },
        { answer: "Jungle adventure", value: "tiger" },
        { answer: "Safari luxury resort", value: "lion" },
        { answer: "Treehouse stay", value: "koala" },
        { answer: "Hot springs with friends", value: "capybara" }
      ]
    },
    {
      question: "What's your favorite food?",
      options: [
        { answer: "Anything with meat", value: "dog" },
        { answer: "Tuna or chicken", value: "cat" },
        { answer: "Wild game", value: "wolf" },
        { answer: "Spicy protein-rich meals", value: "tiger" },
        { answer: "Hearty feasts", value: "lion" },
        { answer: "Leaves and greens", value: "koala" },
        { answer: "Anything shared with others", value: "capybara" }
      ]
    },
    {
      question: "How do you spend weekends?",
      options: [
        { answer: "With family or friends", value: "dog" },
        { answer: "Alone doing your thing", value: "cat" },
        { answer: "Exploring nature", value: "wolf" },
        { answer: "Trying something new", value: "tiger" },
        { answer: "Organizing fun plans", value: "lion" },
        { answer: "Sleeping and snacking", value: "koala" },
        { answer: "Hanging out at a chill spot", value: "capybara" }
      ]
    },
    {
      question: "Pick a motto:",
      options: [
        { answer: "Man’s best friend", value: "dog" },
        { answer: "Curiosity is key", value: "cat" },
        { answer: "Run with your pack", value: "wolf" },
        { answer: "Live fierce", value: "tiger" },
        { answer: "Lead with strength", value: "lion" },
        { answer: "Nap often, worry less", value: "koala" },
        { answer: "Go with the flow", value: "capybara" }
      ]
    }
  ];

  animalTraits: any = {
  dog: {
    animal: "Dog",
    image: "https://i.ibb.co/5xB29tFB/image-2025-06-24-041939023.png",
    description: "Loyal, energetic, and always down for a good time."
  },
  cat: {
    animal: "Cat",
    image: "https://i.ibb.co/RTHxQ2kG/image-2025-06-24-042302357.png",
    description: "Independent and mysterious, you value your personal space."
  },
  wolf: {
    animal: "Wolf",
    image: "https://i.ibb.co/KcWBPRZs/image-2025-06-24-042406714.png",
    description: "Strong and instinctive, you trust your gut and your pack."
  },
  tiger: {
    animal: "Tiger",
    image: "https://i.ibb.co/7dst2xMk/image-2025-06-24-042454363.png",
    description: "Bold and powerful, you take on challenges with confidence."
  },
  lion: {
    animal: "Lion",
    image: "https://i.ibb.co/8gDDq9yH/image-2025-06-24-042556046.png",
    description: "A natural leader with courage and pride."
  },
  koala: {
    animal: "Koala",
    image: "https://i.ibb.co/7t24D6mf/image-2025-06-24-042629997.png",
    description: "Chill, adorable, and all about the naps."
  },
  capybara: {
    animal: "Capybara",
    image: "https://i.ibb.co/35gvWcKj/image-2025-06-24-042725688.png",
    description: "Super chill and friendly — everyone’s favorite buddy."
  }
};


  startQuiz() {
    this.quizStarted = true;
  }

  selectAnswer(value: string) {
    this.answers.push(value);
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.calculateResult();
    }
  }

  calculateResult() {
    const frequency: { [key: string]: number } = {};
    this.answers.forEach(ans => {
      frequency[ans] = (frequency[ans] || 0) + 1;
    });
    const top = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];
    this.result = this.animalTraits[top];
    this.showResult = true;
  }

  restartQuiz() {
    this.quizStarted = false;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.showResult = false;
    this.result = null;
  }
}
