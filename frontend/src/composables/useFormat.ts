export function useFormat() {
  function clp(n: number) {
    return n.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    })
  }

  return { clp }
}
