
import { coreOptions, technicalOptions, leadershipOptions } from "src/constants/competency";
import { formsOptions } from "src/constants/form";
// competency
export function buildCompetenciesPayload(selectedValues) {
  const allOptions = [...coreOptions, ...technicalOptions, ...leadershipOptions];
  const result = {};

  allOptions.forEach((option) => {
    result[option.backendKey] = selectedValues.includes(option.value);
  });

  return result;
}

// forms payload 
export function buildFormsPayload() {
  return {
    form: formsOptions.map((option) => ({
      form_name: option.label,
    })),
  };
}