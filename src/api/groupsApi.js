import { API_URL } from './config';

export const GROUPS_API_URL = import.meta.env.VITE_GROUPS_API_URL || API_URL;

/**
 * @typedef {"ADMIN" | "MEMBER" | string} GroupRole
 *
 * @typedef {Object} GroupUser
 * @property {number | null | undefined} groupId
 * @property {number} userId
 * @property {GroupRole | null | undefined} role
 *
 * @typedef {Object} Group
 * @property {number} id
 * @property {string} name
 * @property {string | null | undefined} imgLink
 * @property {string | null | undefined} desc
 * @property {number} creatorUserId
 * @property {GroupUser[] | null | undefined} members
 */

function getToken() {
  return localStorage.getItem('token');
}

async function readError(response, fallbackMessage) {
  const text = await response.text().catch(() => '');
  if (!text) return fallbackMessage;

  try {
    const json = JSON.parse(text);
    return json.message || json.error || fallbackMessage;
  } catch {
    return text;
  }
}

async function requestGroups(path, options = {}) {
  const response = await fetch(`${GROUPS_API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(await readError(response, 'Cererea pentru grupuri a esuat'));
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getMyGroups() {
  const token = getToken();

  if (!token) {
    throw new Error('Nu esti autentificat');
  }

  return requestGroups('/api/groups', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function searchGroups(query) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  if (normalizedQuery.length > 150) {
    throw new Error('Cautarea poate avea maximum 150 de caractere');
  }

  return requestGroups(`/api/groups/search?query=${encodeURIComponent(normalizedQuery)}`);
}

export async function getGroupById(id) {
  if (!id) {
    throw new Error('Lipseste ID-ul grupului');
  }

  return requestGroups(`/api/groups/${encodeURIComponent(id)}`);
}

export async function createGroup(groupData) {
  const token = getToken();

  if (!token) {
    throw new Error('Nu esti autentificat');
  }

  return requestGroups('/api/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(groupData),
  });
}
