import { Ranking } from "@/types";

export function getUserRank(rank: number) {
  if (rank > 0 && rank <= 7) {
    return Ranking[7];
  } else if (rank > 7 && rank <= 15) {
    return Ranking[15];
  } else if (rank > 15 && rank <= 35) {
    return Ranking[35];
  } else if (rank > 35 && rank <= 60) {
    return Ranking[60];
  } else if (rank > 60 && rank <= 120) {
    return Ranking[120];
  } else {
    return 0.5;
  }
}
