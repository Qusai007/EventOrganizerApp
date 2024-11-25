export const validateInput = (inputs) => {
    for (const key in inputs) {
      if (!inputs[key]) {
        return `${key} is required.`;
      }
    }
    return null;
  };
  