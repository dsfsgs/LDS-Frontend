
import { coreOptions, technicalOptions, leadershipOptions } from "src/constants/competency";

export function buildCompetenciesPayload(selectedValues) {
  const allOptions = [...coreOptions, ...technicalOptions, ...leadershipOptions];
  const result = {};

  allOptions.forEach((option) => {
    result[option.backendKey] = selectedValues.includes(option.value);
  });

  return result;
}

