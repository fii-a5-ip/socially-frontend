import { API_URL } from './config';

/**
 * Tipul pentru Group
 * @typedef {Object} Group
 * @property {number} id
 * @property {string} name
 * @property {string | null} imgLink
 * @property {string | null} desc
 * @property {number} creatorUserId
 * @property {number[]} memberIds
 */

/**
 * Obține lista de grupuri ale utilizatorului autentificat
 * @returns {Promise<Group[]>}
 */
export async function getMyGroups() {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Nu ești autentificat');
  }

  const response = await fetch(`${API_URL}/api/groups`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nu s-au putut încărca grupurile');
  }

  return response.json();
}

/**
 * Obține detaliile unui grup după ID
 * @param {number} id - ID-ul grupului
 * @returns {Promise<Group>}
 */
export async function getGroupById(id) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/api/groups/${id}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Nu s-au putut încărca detaliile grupului');
  }

  return response.json();
}
