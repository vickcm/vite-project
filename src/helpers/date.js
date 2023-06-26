/**
 * Transforma un objeto Date a un string de fecha con formato: dd-MM-AAAA HH:mm:ss
 *
 * @param {Date} date
 * @return {string}
 */
export function dateToString(date) {

    if(date == null) return 'Fecha no disponible';
  
    const formattedDate = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(date);

    return `${formattedDate} ${formattedTime}`;
}

export function timestampToDate(timestamp) {
    if (!timestamp || !timestamp.seconds) return null;
  
    const seconds = timestamp.seconds * 1000;
    const nanoseconds = timestamp.nanoseconds / 1000000;
  
    const date = new Date(seconds + nanoseconds);
  
    return dateToString(date);
  }