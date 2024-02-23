const {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
  addDoc,
} = require("firebase/firestore/lite");
const { db } = require("../firebase");
const { storage } = require("../firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

async function leerDeFirestore(coleccion, docId = null) {
  if (docId) {
    const docRef = doc(db, coleccion, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } else {
    const coleccionRef = collection(db, coleccion);
    const snapshot = await getDocs(coleccionRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

async function escribirEnFirestore(coleccion, datos, docId = null) {
  try {
    if (docId) {
      // Actualización de un documento existente
      const docRef = doc(db, coleccion, docId);
      await updateDoc(docRef, datos);
    } else {
      // Creación de un nuevo documento
      const coleccionRef = collection(db, coleccion);
      await addDoc(coleccionRef, datos);
    }
  } catch (error) {
    console.error("Error al escribir en Firestore:", error);
  }
}



async function leerConFiltroFirestore(coleccion, filtro = null) {
  try {
    let consulta = collection(db, coleccion);
    if (filtro) {
      consulta = query(consulta, where(...filtro));
    }
    const snapshot = await getDocs(consulta);
    const documentos = snapshot.docs.map((doc) => ({
      id: doc.id,
      datos: doc.data(),
    }));

    // Si necesitas manipular los datos (por ejemplo, fechas), puedes hacerlo aquí
    documentos.forEach((doc) => {
      if (doc.datos.fecha) {
        doc.datos.fecha = new Date(doc.datos.fecha).toLocaleString("es-ES");
      }
    });
    

    return documentos;
  } catch (error) {
    console.error(`Error al cargar ${coleccion}:`, error);
    throw new Error(`Error al cargar ${coleccion}`);
  }
}

async function obtenerUsuarioPorCitaId(citaId) {
  const cita = await leerDeFirestore("Citas", citaId);
  const userId = cita.id_usuario;
  const usuario = await leerDeFirestore("usuario", userId);
  if (usuario.length) {
    return undefined;
  }
  return usuario;
}

async function obtenerUsuarioPorId(userId) {
  const usuario = await leerDeFirestore("usuario", userId);
  if (usuario.length) {
    return undefined;
  }
  return usuario;
}

async function subirFotoAFirebaseStorage(
  archivo,
  nombreArchivo,
  carpeta,
  tipoMime
) {
  try {
    const archivoRef = ref(storage, `${carpeta}/${nombreArchivo}`);

    const metadatos = {
      contentType: tipoMime,
    };

    const snapshot = await uploadBytes(archivoRef, archivo, metadatos);
    
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error al subir archivo a Firebase Storage:", error);
    return null;
  }
}

module.exports = {
  leerDeFirestore,
  escribirEnFirestore,
  leerConFiltroFirestore,
  obtenerUsuarioPorCitaId,
  subirFotoAFirebaseStorage,
  obtenerUsuarioPorId,
};
