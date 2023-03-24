export interface statistic {
  section: string;
  correct: number;
  incorrect: number;
}

export class Results {
  userId: string;
  statistics: statistic[];
}
