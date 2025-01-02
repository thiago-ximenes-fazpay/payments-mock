export function generateRandomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function generateRandomCode(): string {
  // Formato do código de barras:
  // BBBMC.CCCCC CCCCC.CCCCCC CCCCC.CCCCCC C VVVVVVVVVVVV
  // B = Banco (3)
  // M = Moeda (1)
  // C = Campos livres (20)
  // V = Valor (12)

  const banco = "341"; // Itaú
  const moeda = "9";
  const camposLivres = generateRandomDigits(20);
  const valor = generateRandomDigits(10);
  const dv = generateRandomDigits(1);

  const codigo = `${banco}${moeda}${camposLivres}${dv}${valor}`;

  // Formata para melhor visualização
  return codigo.replace(
    /^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{8})$/,
    "$1.$2 $3.$4 $5.$6 $7 $8"
  );
}
