/**
 * Sanitiza um nome de arquivo ou pasta para remover caracteres inseguros.
 * Remove '..' para previnir path traversal e substitui caracteres inválidos em sistemas de arquivos.
 * @param name O nome a ser sanitizado.
 * @returns O nome sanitizado.
 */
export const sanitizeName = (name: string): string => {
  if (!name) return '';
  // Remove tentativas de path traversal e caracteres inválidos para nomes de arquivo/pasta
  return name.replace(/\.\./g, '').replace(/[\\/\?%\*:|\"<>]/g, '-');
};

