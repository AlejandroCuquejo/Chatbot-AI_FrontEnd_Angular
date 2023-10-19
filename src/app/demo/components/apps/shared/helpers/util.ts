export const headers = { "Content-Type": "application/json;charset=utf-8" };

export function formatDate(data: string) {
    if (data == null) return "";
    let dft = data.split("T");
    let df = dft[0].split("-");
    return toDate(df);
}

export function toDate(df: string[]) {
    return new Date(Number(df[0]), Number(df[1]), Number(df[2]));
}

//Recibe dd/mm/aaaa y devuelve tipo date
export function formatearFecha(fecha: string) {
	if (!fecha) return fecha;
	const [dia, mes, anio] = fecha.split("/");
	return new Date(`${anio}-${mes}-${dia} 00:00:00`);
}

export function formatearFechaHora(date: string) {
	if (!date) return date;
	const [fecha, horas] = date.split(' ');
	const [dia, mes, anio] = fecha.split('/');
	const [hora, min, seg] = horas.split(':');
	return new Date(`${anio}-${mes}-${dia} ${hora}:${min}:${seg}`);
}
