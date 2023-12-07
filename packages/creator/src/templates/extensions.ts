export default (tailwind: boolean, prettier: boolean) => {
  if (!tailwind && !prettier) return null;

  const recommendations: string[] = [];

  if (tailwind) {
    recommendations.push("bradlc.vscode-tailwindcss");
  }

  if (prettier) {
    recommendations.push("esbenp.prettier-vscode");
  }

  return JSON.stringify(
    {
      recommendations,
    },
    null,
    2,
  );
};
