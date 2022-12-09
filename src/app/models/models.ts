export interface UserI {
  nombre: string;
  apellido: string;
  email: string;
  uid: string;
  password: string;
  password2: string;
  celular: string;
  direccion: string;
  photoURL: string;
  vehiculo: {
    patente: string;
    marca: string;
    modelo: string;
    color: string;
    capacidad: number;
  };
  perfil: 'Pasajero';
}

export interface ConductorI {
  nombre: string;
  apellido: string;
  email: string;
  uid: string;
  password: string;
  password2: string;
  celular: string;
  perfil: 'Conductor';
}

export interface VehiculoI {
  uid: string;
  patente: string;
  marca: string;
  modelo: string;
  color: string;
  capacidad: number;
}

export interface ViajeI {
  uid: string;
  estado: string;
  destino: string;
  duracionViaje: string;
  fechaViaje: string;
  hora: string;
  precio: string;
  capacidad: number;
  conductor: {
    nombre: string;
    apellido: string;
    email: string;
    celular: string;
    photoURL: string;
    uid: string;
    vehiculo: {
      patente: string;
      marca: string;
      modelo: string;
      color: string;
    }
  };
  pasajeros: [
    {
      nombre: string;
      apellido: string;
      email: string;
      celular: string;
      photoURL: string;
      uid: string;
    }
  ]
}

