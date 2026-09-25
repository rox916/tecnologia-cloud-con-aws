import { supabase } from '../lib/supabase';
import type { AccionAuditoria } from '../types/cloud';

const capturarGPS = (): Promise<{ latitud: number; longitud: number; precision_metros: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          precision_metros: pos.coords.accuracy,
        });
      },
      () => resolve(null), // Si se deniega el permiso, sigue sin lanzar error
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
};

export const registrarAuditoria = async (
  nombreUsuario: string,
  accion: AccionAuditoria,
  modulo: string,
  descripcion: string
) => {
  const coords = await capturarGPS();

  const datosGeoPayload = coords
    ? {
      proveedor: 'GPS_HTML5',
      coordenadas: coords,
      dispositivo: navigator.userAgent,
    }
    : { dispositivo: navigator.userAgent, estado: 'GPS_NO_DISPONIBLE' };

  await supabase.from('registro_auditoria').insert([
    {
      nombre_usuario: nombreUsuario,
      accion: accion,
      modulo: modulo,
      descripcion: descripcion,
      direccion_ip: '190.235.12.88',
      datos_geo: datosGeoPayload,
    },
  ]);
};